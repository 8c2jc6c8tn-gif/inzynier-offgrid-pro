"use client"

/**
 * Autozapis Seed formularza kalkulatora (docs/standards/05-baza-danych-offline.md, 5.1 — zapisujemy
 * Seed, nigdy Wynik) do `StorageAdapter`, żeby przeładowanie strony (np. przeglądarka mobilna
 * odświeżająca kartę w tle — zgłoszenie użytkownika, 15.09.2026) nie zgadywało wpisanych danych
 * od nowa. Zamiennik `useState` o identycznym kształcie `[stan, setStan]` — reszta komponentu
 * (JSX, handlery) nie musi wiedzieć, że stan jest teraz persystowany.
 *
 * Zapis debounce'owany (500ms), żeby nie pisać do IndexedDB przy każdym wciśniętym znaku.
 * Odczyt jest asynchroniczny (IndexedDB) — pierwszy render zawsze pokazuje `poczatkowy` (SSR-safe),
 * wpisane wcześniej dane doładowują się chwilę później na kliencie.
 *
 * Projects (owner decision 23.11.2026, `lib/projekt/`): the draft belongs to the active project — its storage key is in the
 * project's namespace, and switching the project reloads the form. With `projekt` (field → project quantity) the field is
 * filled from the project and follows it until the user types their own value (`lib/projekt/powiazania.ts`); own values are
 * offered for saving by the quiet bar in the layout. A pending save is written at once when the screen closes or the page is
 * hidden (audit 3.1: the debounce used to drop the last change when the user left the screen within 0.5 s).
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { indexedDbStorageAdapter } from "./indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { wspolczynnikPrzeliczenia, type DenominacjaKwot, przeliczPola } from "@/lib/waluta/przelicz"
import { useDenominacja } from "@/lib/waluta/use-waluta"
import { WALUTA_BAZOWA } from "@/lib/waluta/waluty"
import { kluczProjektu } from "@/lib/projekt/projekty"
import { useAktywnyProjektId, useWartosciProjektu } from "@/lib/projekt/use-projekt"
import { zapiszWartosci } from "@/lib/projekt/magazyn-wartosci"
import { kandydaciZPol, poEdycji, statusPola, synchronizuj, type MapaPol, type StatusPola, type Znaczniki } from "@/lib/projekt/powiazania"
import { ustawWpisPaska } from "@/lib/projekt/pasek"
import { WIELKOSCI, type WartosciProjektu, type WielkoscId } from "@/lib/projekt/wielkosci"

const DEBOUNCE_MS = 500
const DENOMINACJA_PLN: DenominacjaKwot = { kod: WALUTA_BAZOWA, kurs: 1, dataEcb: null, reczny: false, narzutProc: 0 }

/** What the user is told after the amounts of this screen were converted. */
export interface InfoPrzeliczenia {
  z: DenominacjaKwot
  na: DenominacjaKwot
}

function czyDenominacja(v: unknown): v is DenominacjaKwot {
  return zwyklyObiekt(v) && typeof v.kod === "string" && typeof v.kurs === "number" && v.kurs > 0
}

type Aktualizator<T> = T | ((poprzedni: T) => T)

function zwyklyObiekt(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/**
 * Standard 5.5 (29.09.2026): szkic zapisany, zanim ekran dostał nowe pole, nie ma jego klucza —
 * zastąpienie całego stanu dawałoby temu polu `undefined`. Szkic nakładamy więc na stan
 * początkowy (płytko), żeby nowe pole dostało wartość domyślną. Tablice i wartości proste —
 * bez scalania, bierzemy zapisany szkic.
 */
export function scalSzkic<T>(poczatkowy: T, zapisany: T): T {
  return zwyklyObiekt(poczatkowy) && zwyklyObiekt(zapisany) ? ({ ...poczatkowy, ...zapisany } as T) : zapisany
}

function czyZnaczniki(v: unknown): v is Znaczniki {
  return zwyklyObiekt(v) && Object.values(v).every((x) => x === "projekt" || x === "wlasna")
}

/** Storage keys of one screen's draft in a project. */
export function kluczeDraftu(projektId: string, kluczEkranu: string) {
  return {
    draft: kluczProjektu(projektId, `draft.${kluczEkranu}`),
    waluta: kluczProjektu(projektId, `draftwaluta.${kluczEkranu}`),
    znaczniki: kluczProjektu(projektId, `draftprojekt.${kluczEkranu}`),
  }
}

/** Link of one form field to the project, for `Pole`/`PoleSelect` (`projekt={projekt.pole("napiecieV")}`). */
export type StanPolaProjektu = {
  status: StatusPola
  jednostka: string
  /** Puts the project value back into the field (↺). */
  przywroc: () => void
}

export interface ProjektEkranu<T> {
  /** `undefined` when the field is not linked to the project. */
  pole: (pole: Extract<keyof T, string>) => StanPolaProjektu | undefined
}

export type OpcjeDraftu<T> = {
  /**
   * The money fields of the form: when the display currency changes, the typed amounts (and the PLN defaults of a fresh form)
   * are converted at the effective rate (ECB via Frankfurter, own rate, markup) — the third tuple element then says how, so the
   * screen can show it. The currency the draft is denominated in is stored next to the draft and written together with it; a
   * screen that is not open during the change converts on its next visit.
   */
  konwersjaKwot?: (stan: T, wspolczynnik: number) => T
  /** Fields that mean exactly a project quantity (`lib/projekt/wielkosci.ts`). */
  projekt?: MapaPol<T>
}

type Para<T> = { stan: T; zn: Znaczniki }
type Oczekujacy = { klucze: ReturnType<typeof kluczeDraftu>; para: Para<unknown>; waluta: DenominacjaKwot | null }

function zapiszOczekujacy(o: Oczekujacy) {
  Promise.all([
    indexedDbStorageAdapter.setItem(o.klucze.draft, o.para.stan),
    Object.keys(o.para.zn).length > 0 ? indexedDbStorageAdapter.setItem(o.klucze.znaczniki, o.para.zn) : Promise.resolve(),
    o.waluta ? indexedDbStorageAdapter.setItem(o.klucze.waluta, o.waluta) : Promise.resolve(),
  ]).catch((err) => {
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać wpisanych danych — mogą nie przetrwać przeładowania strony.",
      technicalDetails: `IndexedDbStorageAdapter.setItem(${o.klucze.draft}) nie powiódł się`,
      source: "lib/adapters/use-persisted-draft",
      cause: err,
    })
  })
}

/** Third argument: the money-field converter alone (older call sites) or the options object. */
export function usePersistedDraft<T>(
  kluczEkranu: string,
  poczatkowy: T,
  opcjeLubKonwersja?: OpcjeDraftu<T> | ((stan: T, wspolczynnik: number) => T),
): [T, (aktualizator: Aktualizator<T>) => void, InfoPrzeliczenia | null, boolean, ProjektEkranu<T>] {
  const opcje: OpcjeDraftu<T> = typeof opcjeLubKonwersja === "function" ? { konwersjaKwot: opcjeLubKonwersja } : (opcjeLubKonwersja ?? {})
  const projektId = useAktywnyProjektId()
  const klucze = useMemo(() => (projektId ? kluczeDraftu(projektId, kluczEkranu) : null), [projektId, kluczEkranu])
  const [para, setPara] = useState<Para<T>>({ stan: poczatkowy, zn: {} })
  const [wczytanoKlucz, setWczytanoKlucz] = useState<string | null>(null)
  const wczytano = klucze !== null && wczytanoKlucz === klucze.draft
  const [info, setInfo] = useState<InfoPrzeliczenia | null>(null)
  const poczatkowyRef = useRef(poczatkowy)
  const wczytanoRef = useRef(false)
  const konwersjaRef = useRef(opcje.konwersjaKwot)
  const mapaKlucz = opcje.projekt ? JSON.stringify(opcje.projekt) : ""
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the map is compared by content: call sites pass a fresh literal
  const mapa = useMemo(() => opcje.projekt, [mapaKlucz])
  const denominacjaStanuRef = useRef<DenominacjaKwot>(DENOMINACJA_PLN)
  const oczekujacyRef = useRef<Oczekujacy | null>(null)
  const teraz = useDenominacja()
  const wartosci = useWartosciProjektu(mapa ? projektId : null)
  const wartosciRef = useRef<WartosciProjektu | null>(wartosci)
  const paraRef = useRef(para)
  useEffect(() => {
    wartosciRef.current = wartosci
    paraRef.current = para
  }, [wartosci, para])

  const zapiszTeraz = useCallback(() => {
    const o = oczekujacyRef.current
    oczekujacyRef.current = null
    if (o) zapiszOczekujacy(o)
  }, [])

  useEffect(() => {
    if (!klucze) return
    let aktywny = true
    wczytanoRef.current = false
    Promise.all([
      indexedDbStorageAdapter.getItem<T>(klucze.draft),
      indexedDbStorageAdapter.getItem<unknown>(klucze.waluta),
      indexedDbStorageAdapter.getItem<unknown>(klucze.znaczniki),
    ])
      .then(([zapisany, zapisanaWaluta, znaczniki]) => {
        if (!aktywny) return
        // Another project may have been open a moment ago: a project without this draft starts from the initial state.
        setPara({
          stan: zapisany !== null ? scalSzkic(poczatkowyRef.current, zapisany) : poczatkowyRef.current,
          zn: czyZnaczniki(znaczniki) ? znaczniki : {},
        })
        denominacjaStanuRef.current = czyDenominacja(zapisanaWaluta) ? zapisanaWaluta : DENOMINACJA_PLN
      })
      .catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać wcześniej wpisanych danych — zaczynasz od czystego formularza.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${klucze.draft}) nie powiódł się`,
          source: "lib/adapters/use-persisted-draft",
          cause: err,
        })
      })
      .finally(() => {
        if (!aktywny) return
        wczytanoRef.current = true
        setWczytanoKlucz(klucze.draft)
      })
    return () => {
      aktywny = false
    }
  }, [klucze])

  // Leaving the screen (or switching the project): write what is still waiting for the debounce, to the OLD keys.
  useEffect(() => () => zapiszTeraz(), [klucze, zapiszTeraz])
  useEffect(() => {
    const ukryto = () => {
      if (document.visibilityState === "hidden") zapiszTeraz()
    }
    window.addEventListener("pagehide", zapiszTeraz)
    document.addEventListener("visibilitychange", ukryto)
    return () => {
      window.removeEventListener("pagehide", zapiszTeraz)
      document.removeEventListener("visibilitychange", ukryto)
    }
  }, [zapiszTeraz])

  // Display currency changed (or a screen opened after a change): convert the money fields once.
  useEffect(() => {
    const konwersja = konwersjaRef.current
    const z = denominacjaStanuRef.current
    if (!wczytano || !konwersja || z.kod === teraz.kod) return
    const wspolczynnik = wspolczynnikPrzeliczenia(z, teraz)
    setPara((prev) => ({ ...prev, stan: konwersja(prev.stan, wspolczynnik) }))
    denominacjaStanuRef.current = teraz
    setInfo({ z, na: teraz })
  }, [wczytano, teraz])

  // Fill linked fields from the project — after loading and whenever a project value changes (saved on another screen too).
  useEffect(() => {
    if (!wczytano || !mapa || wartosci === null) return
    setPara((prev) => {
      const s = synchronizuj(prev.stan, poczatkowyRef.current, prev.zn, mapa, wartosci)
      return s.stan === prev.stan && s.znaczniki === prev.zn ? prev : { stan: s.stan, zn: s.znaczniki }
    })
  }, [wczytano, wartosci, mapa])

  useEffect(() => {
    if (!wczytanoRef.current || !klucze) return
    oczekujacyRef.current = { klucze, para, waluta: konwersjaRef.current ? denominacjaStanuRef.current : null }
    const handle = setTimeout(zapiszTeraz, DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [klucze, para, info, zapiszTeraz])

  const setStan = useCallback(
    (aktualizator: Aktualizator<T>) => {
      setPara((prev) => {
        const stan = typeof aktualizator === "function" ? (aktualizator as (p: T) => T)(prev.stan) : aktualizator
        return { stan, zn: mapa ? poEdycji(prev.stan, stan, prev.zn, mapa, wartosciRef.current) : prev.zn }
      })
    },
    [mapa],
  )

  // The quiet bar: own values of this screen that differ from the project.
  const idPaska = useId()
  const zapiszDoProjektu = useCallback(async () => {
    if (!mapa || !projektId) return
    const kandydaci = kandydaciZPol(paraRef.current.stan, paraRef.current.zn, mapa, wartosciRef.current ?? {})
    if (kandydaci.length === 0) return
    await zapiszWartosci(projektId, Object.fromEntries(kandydaci.map((k) => [k.wielkosc, k.wartosc])), kluczEkranu)
    setPara((prev) => {
      const zn = { ...prev.zn }
      for (const k of kandydaci) if (k.pole) zn[k.pole] = "projekt"
      return { ...prev, zn }
    })
  }, [projektId, kluczEkranu, mapa])
  useEffect(() => {
    if (!mapa || !wczytano || wartosci === null) return
    ustawWpisPaska(idPaska, { ekran: kluczEkranu, kandydaci: kandydaciZPol(para.stan, para.zn, mapa, wartosci), zapisz: zapiszDoProjektu })
  }, [idPaska, kluczEkranu, para, wartosci, wczytano, zapiszDoProjektu, mapa])
  useEffect(() => () => ustawWpisPaska(idPaska, null), [idPaska])

  const projekt = useMemo<ProjektEkranu<T>>(
    () => ({
      pole: (pole) => {
        const id: WielkoscId | undefined = mapa?.[pole]
        if (!id || !wczytano || wartosci === null) return undefined
        const wp = wartosci[id]
        return {
          status: statusPola((para.stan as Record<string, unknown>)[pole], para.zn[pole], wp),
          jednostka: WIELKOSCI[id].jednostka,
          przywroc: () => {
            if (!wp) return
            setPara((prev) => {
              const p = (poczatkowyRef.current as Record<string, unknown>)[pole]
              return { stan: { ...prev.stan, [pole]: typeof p === "number" ? Number(wp.v) : wp.v }, zn: { ...prev.zn, [pole]: "projekt" } }
            })
          },
        }
      },
    }),
    [para, wartosci, wczytano, mapa],
  )

  // The fourth element tells whether the saved draft was already read: an edit made before that would be overwritten by the load.
  return [para.stan, setStan, info, wczytano, projekt]
}

export type OpcjeOdczytu = {
  /**
   * Money fields of the other screen's draft (audit 3.2). They are converted from the currency that draft was saved in to
   * `waluta`: "pln" for Polish-market screens whose amounts are PLN by law, "wyswietlana" for the rest.
   */
  kwoty?: readonly string[]
  waluta?: "pln" | "wyswietlana"
}

/**
 * Odczyt (tylko odczyt) draftu INNEGO ekranu — Moduł 1: Ekrany 3 i 4 czytają model działki
 * zapisany przez Ekran 2, nigdy go nie nadpisują (jeden właściciel zapisu). `null` — ekran
 * źródłowy jeszcze nic nie zapisał; `wczytano` odróżnia to od "jeszcze nie odczytano".
 * The draft is read from the active project.
 */
export function useOdczytDraftu<T>(kluczEkranu: string, opcje?: OpcjeOdczytu): { dane: T | null; wczytano: boolean } {
  const projektId = useAktywnyProjektId()
  const [stan, setStan] = useState<{ dane: T | null; waluta: DenominacjaKwot; klucz: string | null }>({ dane: null, waluta: DENOMINACJA_PLN, klucz: null })
  const klucze = useMemo(() => (projektId ? kluczeDraftu(projektId, kluczEkranu) : null), [projektId, kluczEkranu])
  const teraz = useDenominacja()
  const kwotyKlucz = opcje?.kwoty?.join(",") ?? ""
  const { kod: kodTeraz, kurs: kursTeraz } = teraz
  const docelowaPln = opcje?.waluta === "pln"

  useEffect(() => {
    if (!klucze) return
    let aktywny = true
    Promise.all([indexedDbStorageAdapter.getItem<T>(klucze.draft), indexedDbStorageAdapter.getItem<unknown>(klucze.waluta)])
      .then(([dane, waluta]) => {
        if (aktywny) setStan({ dane, waluta: czyDenominacja(waluta) ? waluta : DENOMINACJA_PLN, klucz: klucze.draft })
      })
      .catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać danych z poprzedniego ekranu.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${klucze.draft}) nie powiódł się`,
          source: "lib/adapters/use-persisted-draft",
          cause: err,
        })
        if (aktywny) setStan({ dane: null, waluta: DENOMINACJA_PLN, klucz: klucze.draft })
      })
    return () => {
      aktywny = false
    }
  }, [klucze])

  const wczytano = klucze !== null && stan.klucz === klucze.draft
  const dane = useMemo(() => {
    const kwoty = kwotyKlucz === "" ? [] : kwotyKlucz.split(",")
    if (!wczytano || stan.dane === null || kwoty.length === 0) return wczytano ? stan.dane : null
    const cel = docelowaPln ? DENOMINACJA_PLN : { kurs: kursTeraz, kod: kodTeraz }
    if (stan.waluta.kod === cel.kod) return stan.dane
    return przeliczPola<T>(...(kwoty as (keyof T)[]))(stan.dane, wspolczynnikPrzeliczenia(stan.waluta, cel))
  }, [wczytano, stan, kwotyKlucz, docelowaPln, kodTeraz, kursTeraz])
  return { dane, wczytano }
}
