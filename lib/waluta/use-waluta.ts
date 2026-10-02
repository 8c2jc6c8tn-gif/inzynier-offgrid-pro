"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { formatujKwote, kursEfektywny, przeliczZPln, type DenominacjaKwot } from "./przelicz"
import { getServerSnapshot, getSnapshot, kursyPrzeterminowane, odswiezKursy, subscribe } from "./storage"
import { WALUTA_BAZOWA, type KodWaluty } from "./waluty"

export function useWaluta() {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { kod, narzutProc, reczne } = stan.preferencja
  const potrzebujeKursu = kod !== WALUTA_BAZOWA && reczne[kod] === undefined
  const przeterminowane = kursyPrzeterminowane(stan.kursy)

  useEffect(() => {
    if (potrzebujeKursu && przeterminowane && navigator.onLine) void odswiezKursy()
  }, [potrzebujeKursu, przeterminowane])

  const kurs = kursEfektywny(kod, stan.kursy?.kursy ?? {}, reczne, narzutProc)
  // No rate known → keep showing PLN rather than a wrong number in the chosen currency.
  const wyswietlanaWaluta: KodWaluty = kurs === null ? WALUTA_BAZOWA : kod
  return { stan, kurs, wyswietlanaWaluta, brakKursu: kurs === null && kod !== WALUTA_BAZOWA }
}

/** `zl(amountPln, digits)` — formats a PLN amount in the chosen currency and the UI language. */
export function useZl() {
  const jezyk = useLanguage()
  const { kurs, wyswietlanaWaluta } = useWaluta()
  return useCallback(
    (kwotaPln: number, cyfry = 0) =>
      formatujKwote(przeliczZPln(kwotaPln, wyswietlanaWaluta === WALUTA_BAZOWA ? 1 : (kurs ?? 1)), wyswietlanaWaluta, jezyk, cyfry),
    [jezyk, kurs, wyswietlanaWaluta],
  )
}

/** Effective denomination of amounts the user types now (PLN when the chosen currency has no known rate). */
export function useDenominacja(): DenominacjaKwot {
  const { stan, kurs, wyswietlanaWaluta } = useWaluta()
  const { narzutProc, reczne } = stan.preferencja
  if (wyswietlanaWaluta === WALUTA_BAZOWA) return { kod: WALUTA_BAZOWA, kurs: 1, dataEcb: null, reczny: false, narzutProc: 0 }
  const reczny = reczne[wyswietlanaWaluta] !== undefined
  return { kod: wyswietlanaWaluta, kurs: kurs ?? 1, dataEcb: reczny ? null : (stan.kursy?.dataEcb ?? null), reczny, narzutProc }
}
