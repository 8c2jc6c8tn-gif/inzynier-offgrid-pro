"use client"

/**
 * Dane PVGIS TMY dla Ekranu 4: odczyt lokalnego zapisu (IndexedDB) i pobranie przez własne proxy
 * `/api/pvgis/tmy` (D22 — przeglądarka nie woła PVGIS bezpośrednio). Jeden zapis — ostatnio
 * pobrana lokalizacja; `zapisPasuje` decyduje, czy nadaje się do bieżącej.
 */
import { useCallback, useEffect, useState } from "react"
import { useTranslate } from "@/lib/i18n/language-context"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { KLUCZ_BLEDU_PVGIS, KLUCZ_TMY, KOMUNIKAT_PVGIS, odczytajOdpowiedzProxy, type ZapisTmy } from "./dane-tmy"

export function useDaneTmy() {
  const t = useTranslate()
  const [zapis, setZapis] = useState<ZapisTmy | null>(null)
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

  return { zapis, wczytano, pobiera, blad: kluczBledu ? t(kluczBledu) : null, pobierz }
}
