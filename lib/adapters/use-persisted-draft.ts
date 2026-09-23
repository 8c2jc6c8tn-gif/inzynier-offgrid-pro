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

const PREFIX = "offgrid.draft."
const DEBOUNCE_MS = 500

type Aktualizator<T> = T | ((poprzedni: T) => T)

export function usePersistedDraft<T>(kluczEkranu: string, poczatkowy: T): [T, (aktualizator: Aktualizator<T>) => void] {
  const key = PREFIX + kluczEkranu
  const [stan, setStanWewn] = useState<T>(poczatkowy)
  const wczytanoRef = useRef(false)

  useEffect(() => {
    let aktywny = true
    wczytanoRef.current = false
    indexedDbStorageAdapter
      .getItem<T>(key)
      .then((zapisany) => {
        if (!aktywny) return
        if (zapisany !== null) setStanWewn(zapisany)
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
        if (aktywny) wczytanoRef.current = true
      })
    return () => {
      aktywny = false
    }
  }, [key])

  useEffect(() => {
    if (!wczytanoRef.current) return
    const handle = setTimeout(() => {
      indexedDbStorageAdapter.setItem(key, stan).catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się zapisać wpisanych danych — mogą nie przetrwać przeładowania strony.",
          technicalDetails: `IndexedDbStorageAdapter.setItem(${key}) nie powiódł się`,
          source: "lib/adapters/use-persisted-draft",
          cause: err,
        })
      })
    }, DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [key, stan])

  function setStan(aktualizator: Aktualizator<T>) {
    setStanWewn((prev) => (typeof aktualizator === "function" ? (aktualizator as (p: T) => T)(prev) : aktualizator))
  }

  return [stan, setStan]
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
