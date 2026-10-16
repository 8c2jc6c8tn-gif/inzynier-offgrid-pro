"use client"

/**
 * Dane PVGIS TMY dla Ekranu 4: odczyt lokalnego zapisu (IndexedDB) i pobranie przez własne proxy
 * `/api/pvgis/tmy` (D22 — przeglądarka nie woła PVGIS bezpośrednio). Jeden zapis — ostatnio
 * pobrana lokalizacja; `zapisPasuje` decyduje, czy nadaje się do bieżącej.
 */
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslate } from "@/lib/i18n/language-context"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { KLUCZ_BLEDU_PVGIS, KLUCZ_TMY, KOMUNIKAT_PVGIS, odczytajOdpowiedzProxy, type ZapisTmy } from "./dane-tmy"
import { KLUCZ_NADPISANIA_NASLONECZNIENIA, nadpisaniePasuje, zastosujNadpisanie, type NadpisanieNasloneczenia } from "./nadpisanie-nasloneczenia"

export function useDaneTmy() {
  const t = useTranslate()
  const [zapisSurowy, setZapis] = useState<ZapisTmy | null>(null)
  const [nadpisanie, setNadpisanie] = useState<NadpisanieNasloneczenia | null>(null)
  const [nadpisanieWczytano, setNadpisanieWczytano] = useState(false)
  const [wczytano, setWczytano] = useState(false)
  const [pobiera, setPobiera] = useState(false)
  const [kluczBledu, setKluczBledu] = useState<string | null>(null)

  useEffect(() => {
    let aktywny = true
    indexedDbStorageAdapter
      .getItem<ZapisTmy>(KLUCZ_TMY)
      .then((z) => {
        if (aktywny) setZapis(z)
      })
      .catch((err) =>
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać zapisanych danych nasłonecznienia.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${KLUCZ_TMY}) nie powiódł się`,
          source: "lib/lokalizacja/use-dane-tmy",
          cause: err,
        }),
      )
      .finally(() => {
        if (aktywny) setWczytano(true)
      })
    return () => {
      aktywny = false
    }
  }, [])

  // The user's own monthly sums live under their own small key (the TMY record is ~1.3 MB — never rewritten on a keystroke).
  useEffect(() => {
    let aktywny = true
    indexedDbStorageAdapter
      .getItem<NadpisanieNasloneczenia>(KLUCZ_NADPISANIA_NASLONECZNIENIA)
      .then((n) => {
        if (aktywny) setNadpisanie((biezace) => biezace ?? n)
      })
      .catch((err) =>
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać własnych miesięcznych sum nasłonecznienia.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${KLUCZ_NADPISANIA_NASLONECZNIENIA}) nie powiódł się`,
          source: "lib/lokalizacja/use-dane-tmy",
          cause: err,
        }),
      )
      .finally(() => {
        if (aktywny) setNadpisanieWczytano(true)
      })
    return () => {
      aktywny = false
    }
  }, [])

  useEffect(() => {
    if (!nadpisanieWczytano || nadpisanie === null) return
    const uchwyt = setTimeout(() => {
      indexedDbStorageAdapter.setItem(KLUCZ_NADPISANIA_NASLONECZNIENIA, nadpisanie).catch((err) =>
        consoleReporter.reportError({
          userMessage: "Nie udało się zapisać własnych miesięcznych sum nasłonecznienia.",
          technicalDetails: `IndexedDbStorageAdapter.setItem(${KLUCZ_NADPISANIA_NASLONECZNIENIA}) nie powiódł się`,
          source: "lib/lokalizacja/use-dane-tmy",
          cause: err,
        }),
      )
    }, 500)
    return () => clearTimeout(uchwyt)
  }, [nadpisanie, nadpisanieWczytano])

  /** Sets the user's monthly sums [kWh/m²] for the downloaded location (`null` = no override of that month); keeps the typed temperatures. */
  const ustawNadpisanie = useCallback(
    (ghiKwhM2: (number | null)[]) => {
      if (!zapisSurowy) return
      setNadpisanie((biezace) => ({
        szerokosc: zapisSurowy.szerokosc,
        dlugosc: zapisSurowy.dlugosc,
        ghiKwhM2,
        ...(nadpisaniePasuje(biezace, zapisSurowy.szerokosc, zapisSurowy.dlugosc) && biezace.tempSrednieC ? { tempSrednieC: biezace.tempSrednieC } : {}),
      }))
    },
    [zapisSurowy],
  )

  /** Sets the user's monthly mean temperatures [°C] for the downloaded location (`null` = no override of that month); keeps the typed sums. */
  const ustawNadpisanieTemperatur = useCallback(
    (tempSrednieC: (number | null)[]) => {
      if (!zapisSurowy) return
      setNadpisanie((biezace) => ({
        szerokosc: zapisSurowy.szerokosc,
        dlugosc: zapisSurowy.dlugosc,
        ghiKwhM2: nadpisaniePasuje(biezace, zapisSurowy.szerokosc, zapisSurowy.dlugosc) ? biezace.ghiKwhM2 : Array(12).fill(null),
        tempSrednieC,
      }))
    },
    [zapisSurowy],
  )

  const zapis = useMemo(() => (zapisSurowy ? zastosujNadpisanie(zapisSurowy, nadpisanie) : null), [zapisSurowy, nadpisanie])

  const pobierz = useCallback(async (szerokosc: number, dlugosc: number) => {
    setPobiera(true)
    setKluczBledu(null)
    try {
      const odp = await fetch(`/api/pvgis/tmy?lat=${szerokosc}&lon=${dlugosc}`)
      const w = odczytajOdpowiedzProxy(await odp.json().catch(() => null))
      if (!w.ok) {
        setKluczBledu(KLUCZ_BLEDU_PVGIS[w.kod])
        return
      }
      const nowy: ZapisTmy = { szerokosc, dlugosc, pobrano: new Date().toISOString(), dane: w.dane }
      setZapis(nowy)
      await indexedDbStorageAdapter.setItem(KLUCZ_TMY, nowy).catch((err) =>
        consoleReporter.reportError({
          userMessage: "Dane pobrane, ale nie udało się ich zapisać — offline trzeba będzie pobrać je ponownie.",
          technicalDetails: `IndexedDbStorageAdapter.setItem(${KLUCZ_TMY}) nie powiódł się`,
          source: "lib/lokalizacja/use-dane-tmy",
          cause: err,
        }),
      )
    } catch (err) {
      consoleReporter.reportError({
        userMessage: KOMUNIKAT_PVGIS.SIEC,
        technicalDetails: "fetch /api/pvgis/tmy nie powiódł się",
        source: "lib/lokalizacja/use-dane-tmy",
        cause: err,
      })
      setKluczBledu(KLUCZ_BLEDU_PVGIS.SIEC)
    } finally {
      setPobiera(false)
    }
  }, [])

  return { zapis, wczytano, pobiera, blad: kluczBledu ? t(kluczBledu) : null, pobierz, nadpisanie, nadpisanieWczytano, ustawNadpisanie, ustawNadpisanieTemperatur }
}
