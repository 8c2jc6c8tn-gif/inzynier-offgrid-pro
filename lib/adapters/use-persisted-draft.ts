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
 */
import { useEffect, useRef, useState } from "react"
import { indexedDbStorageAdapter } from "./indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { wspolczynnikPrzeliczenia, type DenominacjaKwot } from "@/lib/waluta/przelicz"
import { useDenominacja } from "@/lib/waluta/use-waluta"
import { WALUTA_BAZOWA } from "@/lib/waluta/waluty"

const PREFIX = "offgrid.draft."
const PREFIX_WALUTY = "offgrid.draftwaluta."
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

/**
 * `konwersjaKwot` (optional) lists the money fields of the form: when the display currency changes,
 * the typed amounts (and the PLN defaults of a fresh form) are converted at the effective rate
 * (ECB via Frankfurter, own rate, markup) — the third tuple element then says how, so the screen
 * can show it. The currency the draft is denominated in is stored next to the draft and written
 * together with it; a screen that is not open during the change converts on its next visit.
 */
export function usePersistedDraft<T>(
  kluczEkranu: string,
  poczatkowy: T,
  konwersjaKwot?: (stan: T, wspolczynnik: number) => T,
): [T, (aktualizator: Aktualizator<T>) => void, InfoPrzeliczenia | null] {
  const key = PREFIX + kluczEkranu
  const keyWaluty = PREFIX_WALUTY + kluczEkranu
  const [stan, setStanWewn] = useState<T>(poczatkowy)
  const [wczytano, setWczytano] = useState(false)
  const [info, setInfo] = useState<InfoPrzeliczenia | null>(null)
  const poczatkowyRef = useRef(poczatkowy)
  const wczytanoRef = useRef(false)
  const konwersjaRef = useRef(konwersjaKwot)
  const denominacjaStanuRef = useRef<DenominacjaKwot>(DENOMINACJA_PLN)
  const teraz = useDenominacja()

  useEffect(() => {
    let aktywny = true
    wczytanoRef.current = false
    setWczytano(false)
    Promise.all([indexedDbStorageAdapter.getItem<T>(key), indexedDbStorageAdapter.getItem<unknown>(keyWaluty)])
      .then(([zapisany, zapisanaWaluta]) => {
        if (!aktywny) return
        if (zapisany !== null) setStanWewn(scalSzkic(poczatkowyRef.current, zapisany))
        denominacjaStanuRef.current = czyDenominacja(zapisanaWaluta) ? zapisanaWaluta : DENOMINACJA_PLN
      })
      .catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać wcześniej wpisanych danych — zaczynasz od czystego formularza.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${key}) nie powiódł się`,
          source: "lib/adapters/use-persisted-draft",
          cause: err,
        })
      })
      .finally(() => {
        if (!aktywny) return
        wczytanoRef.current = true
        setWczytano(true)
      })
    return () => {
      aktywny = false
    }
  }, [key, keyWaluty])

  // Display currency changed (or a screen opened after a change): convert the money fields once.
  useEffect(() => {
    const konwersja = konwersjaRef.current
    const z = denominacjaStanuRef.current
    if (!wczytano || !konwersja || z.kod === teraz.kod) return
    const wspolczynnik = wspolczynnikPrzeliczenia(z, teraz)
    setStanWewn((prev) => konwersja(prev, wspolczynnik))
    denominacjaStanuRef.current = teraz
    setInfo({ z, na: teraz })
  }, [wczytano, teraz])

  useEffect(() => {
    if (!wczytanoRef.current) return
    const handle = setTimeout(() => {
      Promise.all([
        indexedDbStorageAdapter.setItem(key, stan),
        konwersjaRef.current ? indexedDbStorageAdapter.setItem(keyWaluty, denominacjaStanuRef.current) : Promise.resolve(),
      ]).catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się zapisać wpisanych danych — mogą nie przetrwać przeładowania strony.",
          technicalDetails: `IndexedDbStorageAdapter.setItem(${key}) nie powiódł się`,
          source: "lib/adapters/use-persisted-draft",
          cause: err,
        })
      })
    }, DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [key, keyWaluty, stan, info])

  function setStan(aktualizator: Aktualizator<T>) {
    setStanWewn((prev) => (typeof aktualizator === "function" ? (aktualizator as (p: T) => T)(prev) : aktualizator))
  }

  return [stan, setStan, info]
}

/**
 * Odczyt (tylko odczyt) draftu INNEGO ekranu — Moduł 1: Ekrany 3 i 4 czytają model działki
 * zapisany przez Ekran 2, nigdy go nie nadpisują (jeden właściciel zapisu). `null` — ekran
 * źródłowy jeszcze nic nie zapisał; `wczytano` odróżnia to od "jeszcze nie odczytano".
 */
export function useOdczytDraftu<T>(kluczEkranu: string): { dane: T | null; wczytano: boolean } {
  const key = PREFIX + kluczEkranu
  const [stan, setStan] = useState<{ dane: T | null; wczytano: boolean }>({ dane: null, wczytano: false })

  useEffect(() => {
    let aktywny = true
    indexedDbStorageAdapter
      .getItem<T>(key)
      .then((dane) => {
        if (aktywny) setStan({ dane, wczytano: true })
      })
      .catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać danych z poprzedniego ekranu.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${key}) nie powiódł się`,
          source: "lib/adapters/use-persisted-draft",
          cause: err,
        })
        if (aktywny) setStan({ dane: null, wczytano: true })
      })
    return () => {
      aktywny = false
    }
  }, [key])

  return stan
}
