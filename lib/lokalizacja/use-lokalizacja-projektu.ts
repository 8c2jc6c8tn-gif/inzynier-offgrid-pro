"use client"

/**
 * Lokalizacja projektu + dane PVGIS TMY dla ekranów liczących nasłonecznienie (Moduł 1 Ekran 4,
 * Moduł 3 Ekrany 1, 4, 9, 20). Wydzielone z Ekranu 4 M1 (wzorzec echo, D12), żeby każdy ekran nie
 * odtwarzał tej samej reguły "skąd współrzędne": model działki (Ekran 2 M1) ma pierwszeństwo przed
 * współrzędnymi wpisanymi na Ekranie 1 M1.
 */
import { useMemo } from "react"
import { useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import { zapisPasuje, type ZapisTmy } from "./dane-tmy"
import { KLUCZ_MODELU_DZIALKI, liczba, MODEL_PUSTY, wejscieSkanera, type ModelDzialki } from "./model-dzialki"
import { useDaneTmy } from "./use-dane-tmy"

/** Draft Ekranu 1 M1 — źródło współrzędnych, gdy nie ma jeszcze modelu działki. */
type DraftEkranu1 = { szerokosc: string; dlugosc: string }

export type LokalizacjaProjektu = { szerokosc: number; dlugosc: number; zrodlo: string }

export function useLokalizacjaProjektu() {
  const model = useOdczytDraftu<ModelDzialki>(KLUCZ_MODELU_DZIALKI)
  const ekran1 = useOdczytDraftu<DraftEkranu1>("lokalizacja-i-klimat")
  const tmy = useDaneTmy()

  const skaner = useMemo(() => calculateSkanerDzialki(wejscieSkanera(model.dane ?? MODEL_PUSTY)), [model.dane])
  const odn = skaner.value.odniesienie
  const lat1 = liczba(ekran1.dane?.szerokosc ?? "")
  const lon1 = liczba(ekran1.dane?.dlugosc ?? "")
  const lokalizacja: LokalizacjaProjektu | null = odn
    ? { szerokosc: odn.szerokosc, dlugosc: odn.dlugosc, zrodlo: "model działki (Ekran 2)" }
    : lat1 !== undefined && lon1 !== undefined
      ? { szerokosc: lat1, dlugosc: lon1, zrodlo: "Ekran 1 (Lokalizacja i dane klimatyczne)" }
      : null
  const dane: ZapisTmy | null =
    lokalizacja && zapisPasuje(tmy.zapis, lokalizacja.szerokosc, lokalizacja.dlugosc) ? tmy.zapis : null

  return {
    model,
    skaner,
    lokalizacja,
    dane,
    tmy,
    wczytano: model.wczytano && ekran1.wczytano && tmy.wczytano,
  }
}
