/**
 * Maksymalne obciążenie mechaniczne paneli katalogu (spec 32) — przepisane z kart (transkrypcje w `docs/zrodla/karta-katalogowa-*`, wiersz
 * „Maks. obciążenie statyczne/testowe przód / tył”). Klucz = początek identyfikatora wpisu (`prefiks + moc`). Wpisy z kart innej edycji/rynku
 * (`odpowiednik`) i karty bez tej liczby nie mają wpisu → `null` („karta nie podaje”), nigdy wartość „z serii”.
 * Rodzaj: karty JA Solar, Astronergy, Hyundai, Jinko, LONGi i Trina podają wartości do testu (IEC 61215); JAM54D40 LR podaje 3600/1600 Pa
 * „współczynnik bezpieczeństwa 1,5” — czyli już wartość obliczeniową (testowa 5400/2400 Pa).
 */
import type { ObciazeniePaneluKarta } from "@/lib/core/modules/pv/porownywarka-paneli/input"

const TEST_5400_2400: ObciazeniePaneluKarta = { przodPa: 5400, tylPa: 2400, rodzaj: "testowe" }

export const OBCIAZENIA_SERII: Readonly<Record<string, ObciazeniePaneluKarta>> = {
  "ja-solar-jam60d41-lb-": TEST_5400_2400,
  "ja-solar-jam60d40-lb-": TEST_5400_2400,
  "ja-solar-jam54d41-lb-": TEST_5400_2400,
  "ja-solar-jam54d40-lb-": TEST_5400_2400,
  "ja-solar-jam66d46-lb-": TEST_5400_2400,
  "ja-solar-jam72d40-mb-": TEST_5400_2400,
  "ja-solar-jam54d40-lr-": { przodPa: 3600, tylPa: 1600, rodzaj: "obliczeniowe" },
  "astronergy-n5-chsm72n-": TEST_5400_2400,
  "hyundai-hit-h5xxcf-bf-zb-": TEST_5400_2400,
  "jinko-tiger-neo-48hl4m-bdv-": { przodPa: 6000, tylPa: 4000, rodzaj: "testowe" },
  "jinko-tiger-neo-66hl4m-bdv-": TEST_5400_2400,
  "jinko-tiger-neo-72hl4-bdv-": TEST_5400_2400,
  "longi-himo-x10-lr7-54hvh-": TEST_5400_2400,
  "longi-himo-x10-lr7-60hvh-": TEST_5400_2400,
  // Okładka karty Trina: „wytrzymałość na śnieg (do 5400 Pa) i wiatr (do 4000 Pa)” — śnieg od przodu 5400, wiatr 4000 w obu kierunkach.
  "trina-vertex-s-plus-neg9r28-": { przodPa: 5400, tylPa: 4000, wiatrPrzodPa: 4000, rodzaj: "testowe" },
}

/** Obciążenie wpisu katalogu wg jego identyfikatora; `null` = karta nie podaje (albo wpis z karty odpowiednika). */
export function obciazenieWpisu(id: string, maOdpowiednik: boolean): ObciazeniePaneluKarta | null {
  if (maOdpowiednik) return null
  const prefiks = Object.keys(OBCIAZENIA_SERII).find((k) => id.startsWith(k))
  return prefiks === undefined ? null : OBCIAZENIA_SERII[prefiks]!
}
