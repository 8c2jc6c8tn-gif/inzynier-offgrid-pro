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
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { indexedDbStorageAdapter } from "./indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { kursEfektywny, type DenominacjaKwot } from "@/lib/waluta/przelicz"
import { getServerSnapshot as walutaSerwer, getSnapshot as walutaSnapshot, kursyPrzeterminowane, odswiezKursy, subscribe as walutaSubscribe } from "@/lib/waluta/storage"
import { czyKodWaluty, WALUTA_BAZOWA, WALUTY, type KodWaluty } from "@/lib/waluta/waluty"
import {
  przeliczMiedzyWalutami,
  rozbiciePoWalutach,
  sciezkiKonkretne,
  stanWWalucie,
  walutyPoZmianie,
  walutyZeStaregoSzkicu,
  wartoscSciezki,
  liczbaKwoty,
  type KursOd,
  type WalutyPol,
} from "@/lib/waluta/kwoty-pol"
import { kluczProjektu } from "@/lib/projekt/projekty"
import { useAktywnyProjektId, useKrajProjektu, useWartosciProjektu } from "@/lib/projekt/use-projekt"
import { zapiszWartosci } from "@/lib/projekt/magazyn-wartosci"
import { kandydaciZPol, poEdycji, statusPola, synchronizuj, wartoscDlaPola, wielkoscPowiazania, type MapaPol, type StatusPola, type Znaczniki } from "@/lib/projekt/powiazania"
import { ustawWpisPaska } from "@/lib/projekt/pasek"
import { WIELKOSCI, type WartosciProjektu, type WielkoscId } from "@/lib/projekt/wielkosci"

const DEBOUNCE_MS = 500

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

function czyWalutyPol(v: unknown): v is WalutyPol {
  return zwyklyObiekt(v) && Object.values(v).every((x) => typeof x === "string" && czyKodWaluty(x))
}

/**
 * Working currency (Settings) and the effective rate of any currency (NBP table A, own rate, markup) — `null` when unknown.
 * Without a known rate for the chosen currency the working currency falls back to PLN (never a wrong number).
 */
function useKursyWalut() {
  const stan = useSyncExternalStore(walutaSubscribe, walutaSnapshot, walutaSerwer)
  return useMemo(() => {
    const { kod, narzutProc, reczne } = stan.preferencja
    const pobrane = stan.kursy?.kursy ?? {}
    const kurs: KursOd = (k) => kursEfektywny(k, pobrane, reczne, narzutProc)
    return { stan, kurs, robocza: (kurs(kod) === null ? WALUTA_BAZOWA : kod) as KodWaluty }
  }, [stan])
}

/** Currency of one money field (`Pole`/`PoleSelect` prop `waluta=`): its code, the conversion to the working currency. */
export type StanWalutyPola = {
  kod: KodWaluty
  robocza: KodWaluty
  /** The typed amount in the working currency; `null` when empty, already in the working currency or the rate is unknown. */
  wRoboczej: number | null
  brakKursu: boolean
  /** The conversion uses a rate typed by the user in Settings (not NBP). */
  reczny: boolean
  /** The currency is fixed by the project's country (official amount) — no choice is offered. */
  stala: boolean
  ustaw: (kod: KodWaluty) => void
}

export interface WalutyEkranu<T> {
  /** The currency every result and sum is in (Settings). */
  robocza: KodWaluty
  /** Date of the NBP table the automatic rates come from. */
  dataKursow: string | null
  /** The state with every declared amount converted for the calculator (working currency, or PLN with `obliczeniaWPln`). */
  stanRoboczy: T
  /** Typed amounts summed per currency (the „1 200 € + 3 400 zł” breakdown). */
  rozbicie: Partial<Record<KodWaluty, number>>
  /** `sciezka`: a declared flat field or a concrete list path `list.<row id>.field`. */
  pole: (sciezka: string) => StanWalutyPola
}

/** Every currency the user can choose for an amount. */
export const KODY_WALUT: readonly KodWaluty[] = WALUTY.map((w) => w.kod)

function czyZnaczniki(v: unknown): v is Znaczniki {
  return zwyklyObiekt(v) && Object.values(v).every((x) => x === "projekt" || x === "wlasna")
}

/** Storage keys of one screen's draft in a project. */
export function kluczeDraftu(projektId: string, kluczEkranu: string) {
  return {
    draft: kluczProjektu(projektId, `draft.${kluczEkranu}`),
    waluta: kluczProjektu(projektId, `draftwaluta.${kluczEkranu}`),
    znaczniki: kluczProjektu(projektId, `draftprojekt.${kluczEkranu}`),
    waluty: kluczProjektu(projektId, `draftwaluty.${kluczEkranu}`),
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
   * Money fields (owner decisions 24.11.2026, `lib/waluta/kwoty-pol.ts`): flat field names and list fields as `list.*.field`.
   * Each amount keeps its own currency (by default the working currency from Settings); `waluty.stanRoboczy` gives the state
   * converted for the calculator.
   */
  kwoty?: readonly string[]
  /** The calculator works in PLN (Polish-market screens: tariffs and fees are PLN by law); otherwise in the working currency. */
  obliczeniaWPln?: boolean
  /**
   * Official amounts (grid tariffs, fees, bill prices, subsidies — owner decision 25.11.2026): always in the currency of the
   * project's country (`lib/projekt/kraje.ts`), no currency choice; shown converted like any other amount.
   */
  kwotyKraju?: readonly string[]
  /** Fields that mean exactly a project quantity (`lib/projekt/wielkosci.ts`). */
  projekt?: MapaPol<T>
}

type Para<T> = { stan: T; zn: Znaczniki; wal: WalutyPol }
type Oczekujacy = { klucze: ReturnType<typeof kluczeDraftu>; para: Para<unknown>; kwoty: boolean }

function zapiszOczekujacy(o: Oczekujacy) {
  Promise.all([
    indexedDbStorageAdapter.setItem(o.klucze.draft, o.para.stan),
    Object.keys(o.para.zn).length > 0 ? indexedDbStorageAdapter.setItem(o.klucze.znaczniki, o.para.zn) : Promise.resolve(),
    o.kwoty ? indexedDbStorageAdapter.setItem(o.klucze.waluty, o.para.wal) : Promise.resolve(),
  ]).catch((err) => {
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać wpisanych danych — mogą nie przetrwać przeładowania strony.",
      technicalDetails: `IndexedDbStorageAdapter.setItem(${o.klucze.draft}) nie powiódł się`,
      source: "lib/adapters/use-persisted-draft",
      cause: err,
    })
  })
}

export function usePersistedDraft<T>(
  kluczEkranu: string,
  poczatkowy: T,
  opcje: OpcjeDraftu<T> = {},
): [T, (aktualizator: Aktualizator<T>) => void, WalutyEkranu<T>, boolean, ProjektEkranu<T>] {
  const projektId = useAktywnyProjektId()
  const klucze = useMemo(() => (projektId ? kluczeDraftu(projektId, kluczEkranu) : null), [projektId, kluczEkranu])
  const [para, setPara] = useState<Para<T>>({ stan: poczatkowy, zn: {}, wal: {} })
  const [wczytanoKlucz, setWczytanoKlucz] = useState<string | null>(null)
  const wczytano = klucze !== null && wczytanoKlucz === klucze.draft
  const poczatkowyRef = useRef(poczatkowy)
  const wczytanoRef = useRef(false)
  const kwotyKlucz = opcje.kwoty?.join(",") ?? ""
  // eslint-disable-next-line react-hooks/exhaustive-deps -- compared by content: call sites pass a fresh literal
  const kwoty = useMemo(() => opcje.kwoty ?? [], [kwotyKlucz])
  const kursy = useKursyWalut()
  const kursyRef = useRef(kursy)
  const mapaKlucz = opcje.projekt ? JSON.stringify(opcje.projekt) : ""
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the map is compared by content: call sites pass a fresh literal
  const mapa = useMemo(() => opcje.projekt, [mapaKlucz])
  const oczekujacyRef = useRef<Oczekujacy | null>(null)
  const wartosci = useWartosciProjektu(mapa ? projektId : null)
  const wartosciRef = useRef<WartosciProjektu | null>(wartosci)
  const paraRef = useRef(para)
  useEffect(() => {
    wartosciRef.current = wartosci
    paraRef.current = para
    kursyRef.current = kursy
  }, [wartosci, para, kursy])

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
      indexedDbStorageAdapter.getItem<unknown>(klucze.waluty),
    ])
      .then(([zapisany, zapisanaWaluta, znaczniki, waluty]) => {
        if (!aktywny) return
        // Another project may have been open a moment ago: a project without this draft starts from the initial state.
        const stan = zapisany !== null ? scalSzkic(poczatkowyRef.current, zapisany) : poczatkowyRef.current
        // A draft saved before 3.55.0 has no per-field currencies: its amounts are in the old denomination of the whole draft.
        const wal = czyWalutyPol(waluty)
          ? waluty
          : walutyZeStaregoSzkicu(stan, kwoty, czyDenominacja(zapisanaWaluta) && czyKodWaluty(zapisanaWaluta.kod) ? zapisanaWaluta.kod : WALUTA_BAZOWA)
        setPara({ stan, zn: czyZnaczniki(znaczniki) ? znaczniki : {}, wal })
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
  }, [klucze, kwoty])

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

  // Rates for every currency used by an amount on this screen (not only the working one).
  const potrzebneKursy = [...new Set(Object.values(para.wal))].filter((k): k is KodWaluty => !!k && k !== WALUTA_BAZOWA).join(",")
  useEffect(() => {
    if (potrzebneKursy && kursyPrzeterminowane(kursy.stan.kursy) && navigator.onLine) void odswiezKursy()
  }, [potrzebneKursy, kursy.stan.kursy])

  // Fill linked fields from the project — after loading and whenever a project value changes (saved on another screen too).
  useEffect(() => {
    if (!wczytano || !mapa || wartosci === null) return
    setPara((prev) => {
      const s = synchronizuj(prev.stan, poczatkowyRef.current, prev.zn, mapa, wartosci)
      return s.stan === prev.stan && s.znaczniki === prev.zn ? prev : { ...prev, stan: s.stan, zn: s.znaczniki }
    })
  }, [wczytano, wartosci, mapa])

  useEffect(() => {
    if (!wczytanoRef.current || !klucze) return
    oczekujacyRef.current = { klucze, para, kwoty: kwoty.length > 0 }
    const handle = setTimeout(zapiszTeraz, DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [klucze, para, kwoty, zapiszTeraz])

  const setStan = useCallback(
    (aktualizator: Aktualizator<T>) => {
      setPara((prev) => {
        const stan = typeof aktualizator === "function" ? (aktualizator as (p: T) => T)(prev.stan) : aktualizator
        return {
          stan,
          zn: mapa ? poEdycji(prev.stan, stan, prev.zn, mapa, wartosciRef.current) : prev.zn,
          wal: kwoty.length > 0 ? walutyPoZmianie(stan, kwoty, prev.wal, kursyRef.current.robocza) : prev.wal,
        }
      })
    },
    [mapa, kwoty],
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
        const pw = mapa?.[pole]
        if (!pw || !wczytano || wartosci === null) return undefined
        const id = wielkoscPowiazania(pw)
        const wp = wartoscDlaPola(pw, wartosci)
        return {
          status: statusPola((para.stan as Record<string, unknown>)[pole], para.zn[pole], wp),
          jednostka: WIELKOSCI[id].jednostka,
          przywroc: () => {
            if (!wp) return
            setPara((prev) => {
              const p = (poczatkowyRef.current as Record<string, unknown>)[pole]
              return { ...prev, stan: { ...prev.stan, [pole]: typeof p === "number" ? Number(wp.v) : wp.v }, zn: { ...prev.zn, [pole]: "projekt" } }
            })
          },
        }
      },
    }),
    [para, wartosci, wczytano, mapa],
  )

  const obliczeniaWPln = opcje.obliczeniaWPln === true
  const kwotyKrajuKlucz = opcje.kwotyKraju?.join(",") ?? ""
  const { waluta: walutaKraju } = useKrajProjektu()
  const waluty = useMemo<WalutyEkranu<T>>(() => {
    const cel = obliczeniaWPln ? WALUTA_BAZOWA : kursy.robocza
    // Official amounts: every non-empty one is in the country's currency, whatever the per-field map says.
    const sciezkiKraju = kwotyKrajuKlucz === "" ? [] : kwotyKrajuKlucz.split(",")
    const stale = new Set(sciezkiKonkretne(para.stan, sciezkiKraju))
    const wal: WalutyPol = { ...para.wal }
    for (const s of stale) if (liczbaKwoty(wartoscSciezki(para.stan, s)) !== null) wal[s] = walutaKraju
    const wszystkie = [...kwoty, ...sciezkiKraju]
    return {
      robocza: kursy.robocza,
      dataKursow: kursy.stan.kursy?.dataEcb || null,
      stanRoboczy: wszystkie.length > 0 ? stanWWalucie(para.stan, wszystkie, wal, cel, kursy.kurs) : para.stan,
      rozbicie: rozbiciePoWalutach(para.stan, wszystkie, wal),
      pole: (sciezka) => {
        const stala = stale.has(sciezka)
        const kod = stala ? walutaKraju : (para.wal[sciezka] ?? kursy.robocza)
        const x = liczbaKwoty(wartoscSciezki(para.stan, sciezka))
        return {
          kod,
          robocza: kursy.robocza,
          wRoboczej: x === null || kod === kursy.robocza ? null : przeliczMiedzyWalutami(x, kod, kursy.robocza, kursy.kurs),
          brakKursu: x !== null && kod !== kursy.robocza && przeliczMiedzyWalutami(x, kod, kursy.robocza, kursy.kurs) === null,
          reczny: kursy.stan.preferencja.reczne[kod] !== undefined || kursy.stan.preferencja.reczne[kursy.robocza] !== undefined,
          stala,
          ustaw: (nowy) => {
            if (!stala) setPara((prev) => ({ ...prev, wal: { ...prev.wal, [sciezka]: nowy } }))
          },
        }
      },
    }
  }, [para, kwoty, kursy, obliczeniaWPln, kwotyKrajuKlucz, walutaKraju])
  // A project abroad: the official amounts need the rate of the country's currency too.
  useEffect(() => {
    if (kwotyKrajuKlucz && walutaKraju !== WALUTA_BAZOWA && kursyPrzeterminowane(kursy.stan.kursy) && navigator.onLine) void odswiezKursy()
  }, [kwotyKrajuKlucz, walutaKraju, kursy.stan.kursy])

  // The fourth element tells whether the saved draft was already read: an edit made before that would be overwritten by the load.
  return [para.stan, setStan, waluty, wczytano, projekt]
}

export type OpcjeOdczytu = {
  /**
   * Money fields of the other screen's draft (audit 3.2), as that screen declares them (`kwoty`). Each is converted from the
   * currency it was typed in to `waluta`: "pln" for Polish-market screens whose amounts are PLN by law, "robocza" (the working
   * currency from Settings) for the rest.
   */
  kwoty?: readonly string[]
  /** Official amounts of that draft (the owner screen's `kwotyKraju`): in the project country's currency. */
  kwotyKraju?: readonly string[]
  waluta?: "pln" | "robocza"
  /**
   * The owner screen's field → quantity map and initial state: the read then sees what the owner screen would show — linked
   * fields filled from the project — even when the owner screen was never opened since the project value was saved.
   */
  projekt?: { mapa: MapaPol<Record<string, unknown>>; poczatkowy: Record<string, unknown> }
}

/**
 * Odczyt (tylko odczyt) draftu INNEGO ekranu — Moduł 1: Ekrany 3 i 4 czytają model działki
 * zapisany przez Ekran 2, nigdy go nie nadpisują (jeden właściciel zapisu). `null` — ekran
 * źródłowy jeszcze nic nie zapisał; `wczytano` odróżnia to od "jeszcze nie odczytano".
 * The draft is read from the active project.
 */
export function useOdczytDraftu<T>(kluczEkranu: string, opcje?: OpcjeOdczytu): { dane: T | null; wczytano: boolean } {
  const projektId = useAktywnyProjektId()
  const [stan, setStan] = useState<{ dane: T | null; zn: Znaczniki; wal: WalutyPol | null; stara: KodWaluty; klucz: string | null }>({
    dane: null,
    zn: {},
    wal: null,
    stara: WALUTA_BAZOWA,
    klucz: null,
  })
  const klucze = useMemo(() => (projektId ? kluczeDraftu(projektId, kluczEkranu) : null), [projektId, kluczEkranu])
  const powiazanie = opcje?.projekt
  const wartosci = useWartosciProjektu(powiazanie ? projektId : null)
  const kursy = useKursyWalut()
  const kwotyKlucz = opcje?.kwoty?.join(",") ?? ""
  const kwotyKrajuOdczytKlucz = opcje?.kwotyKraju?.join(",") ?? ""
  const { waluta: walutaKrajuOdczytu } = useKrajProjektu()
  const docelowaPln = opcje?.waluta === "pln"

  useEffect(() => {
    if (!klucze) return
    let aktywny = true
    Promise.all([
      indexedDbStorageAdapter.getItem<T>(klucze.draft),
      indexedDbStorageAdapter.getItem<unknown>(klucze.waluta),
      indexedDbStorageAdapter.getItem<unknown>(klucze.znaczniki),
      indexedDbStorageAdapter.getItem<unknown>(klucze.waluty),
    ])
      .then(([dane, waluta, zn, wal]) => {
        if (!aktywny) return
        const stara = czyDenominacja(waluta) && czyKodWaluty(waluta.kod) ? waluta.kod : WALUTA_BAZOWA
        setStan({ dane, zn: czyZnaczniki(zn) ? zn : {}, wal: czyWalutyPol(wal) ? wal : null, stara, klucz: klucze.draft })
      })
      .catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać danych z poprzedniego ekranu.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${klucze.draft}) nie powiódł się`,
          source: "lib/adapters/use-persisted-draft",
          cause: err,
        })
        if (aktywny) setStan({ dane: null, zn: {}, wal: null, stara: WALUTA_BAZOWA, klucz: klucze.draft })
      })
    return () => {
      aktywny = false
    }
  }, [klucze])

  const czekaNaProjekt = powiazanie !== undefined && wartosci === null
  const wczytano = klucze !== null && stan.klucz === klucze.draft && !czekaNaProjekt
  // The map and initial state are compared by content: call sites pass literals.
  const powiazanieKlucz = powiazanie ? JSON.stringify(powiazanie) : ""
  const zProjektem = useMemo(() => {
    if (!wczytano || !powiazanieKlucz || wartosci === null) return stan.dane
    const { mapa, poczatkowy } = JSON.parse(powiazanieKlucz) as NonNullable<OpcjeOdczytu["projekt"]>
    const baza = (stan.dane ?? poczatkowy) as Record<string, unknown>
    const s = synchronizuj(scalSzkic(poczatkowy, baza), poczatkowy, stan.zn, mapa, wartosci).stan
    // Never filled and nothing from the project either: still „no data”.
    if (stan.dane === null && Object.keys(mapa).every((p) => s[p] === poczatkowy[p])) return null
    return s as T
  }, [wczytano, powiazanieKlucz, wartosci, stan])
  const dane = useMemo(() => {
    const kwoty = kwotyKlucz === "" ? [] : kwotyKlucz.split(",")
    const kraju = kwotyKrajuOdczytKlucz === "" ? [] : kwotyKrajuOdczytKlucz.split(",")
    if (!wczytano || zProjektem === null || kwoty.length + kraju.length === 0) return wczytano ? zProjektem : null
    const wal: WalutyPol = { ...(stan.wal ?? walutyZeStaregoSzkicu(zProjektem, kwoty, stan.stara)) }
    for (const s of sciezkiKonkretne(zProjektem, kraju)) if (liczbaKwoty(wartoscSciezki(zProjektem, s)) !== null) wal[s] = walutaKrajuOdczytu
    return stanWWalucie(zProjektem, [...kwoty, ...kraju], wal, docelowaPln ? WALUTA_BAZOWA : kursy.robocza, kursy.kurs)
  }, [wczytano, zProjektem, stan.wal, stan.stara, kwotyKlucz, kwotyKrajuOdczytKlucz, walutaKrajuOdczytu, docelowaPln, kursy])
  return { dane, wczytano }
}
