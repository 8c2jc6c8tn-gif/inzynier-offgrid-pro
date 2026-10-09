/**
 * Orientacyjny cennik osprzętu instalacji PV (BOS) — zakresy zaakceptowane przez właściciela 09.10.2026. Źródło wartości i lista
 * ofert: `docs/zrodla/cennik-bos-orientacyjny-2026-10-09.md` (sklepy PL, odczyt 09.10.2026). Ceny netto w zł, pokazywane jako zakres
 * min–max z flagą „orientacyjny — zweryfikuj w ofercie”; użytkownik może każdą cenę nadpisać. Pozycja bez wiarygodnego źródła
 * nie dostaje ceny „z głowy”.
 */
export type BosId = "kabel-pv" | "mc4" | "bezpiecznik-dc" | "rozlacznik-dc" | "spd-dc" | "rozdzielnia-dc" | "konstrukcja"

export type PozycjaCennikaBos = {
  id: BosId
  jednostka: "m" | "para" | "zestaw" | "szt" | "panel"
  /** Zakres ceny jednostkowej netto [zł]. */
  nettoMinZl: number
  nettoMaxZl: number
  /** `bardzo-orientacyjna` = jedno stare albo niepełne źródło (konstrukcja: artykuł z 2023 r., VAT nieznany). */
  pewnosc: "orientacyjna" | "bardzo-orientacyjna"
}

export const DATA_CENNIKA_BOS = "2026-10-09"
export const ZRODLO_CENNIKA_BOS = "docs/zrodla/cennik-bos-orientacyjny-2026-10-09.md"

/** Stawka VAT sklepowych cen osprzętu (strona źródłowa podaje brutto i netto przy 23%). */
export const VAT_OSPRZETU = 0.23

export const CENNIK_BOS: readonly PozycjaCennikaBos[] = [
  { id: "kabel-pv", jednostka: "m", nettoMinZl: 3.89, nettoMaxZl: 4.6, pewnosc: "orientacyjna" },
  { id: "mc4", jednostka: "para", nettoMinZl: 2.93, nettoMaxZl: 2.93, pewnosc: "orientacyjna" },
  { id: "bezpiecznik-dc", jednostka: "zestaw", nettoMinZl: 23.58, nettoMaxZl: 23.58, pewnosc: "orientacyjna" },
  { id: "rozlacznik-dc", jednostka: "szt", nettoMinZl: 31.71, nettoMaxZl: 216, pewnosc: "orientacyjna" },
  { id: "spd-dc", jednostka: "szt", nettoMinZl: 43.9, nettoMaxZl: 43.9, pewnosc: "orientacyjna" },
  { id: "rozdzielnia-dc", jednostka: "szt", nettoMinZl: 77.24, nettoMaxZl: 227.63, pewnosc: "orientacyjna" },
  { id: "konstrukcja", jednostka: "panel", nettoMinZl: 167, nettoMaxZl: 225, pewnosc: "bardzo-orientacyjna" },
]

export const znajdzPozycjeBos = (id: BosId): PozycjaCennikaBos => CENNIK_BOS.find((p) => p.id === id)!
