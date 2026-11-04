// English texts of ./m13-podsumowanie.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m13-podsumowanie"

export const en: Record<keyof typeof pl, string> = {
  "UI-M13-POD-TYTUL": "Measurement summary and export",
  "UI-M13-POD-OPIS": "Min, max, mean and energy from power for each series in the selected range, plus export of the samples to a CSV file. Module 13.",
  "UI-M13-POD-BRAK-ZRODEL": "No data sources",
  "UI-M13-POD-BRAK-ZRODEL-OPIS": "First add a source on the “Telemetry data sources” screen and collect or import measurements.",
  "UI-M13-POD-ZAKRES-TYTUL": "Source and range",
  "UI-M13-POD-ZRODLO": "Data source",
  "UI-M13-POD-OKNO": "Range",
  "UI-M13-POD-OKNO-24": "Last 24 hours",
  "UI-M13-POD-OKNO-168": "Last 7 days",
  "UI-M13-POD-OKNO-720": "Last 30 days",
  "UI-M13-POD-MAX-PRZERWA": "Longest gap counted into energy",
  "UI-M13-POD-BRAK-PROBEK": "No samples in this range",
  "UI-M13-POD-BRAK-PROBEK-OPIS": "The source has no stored measurements in the selected range.",
  "UI-M13-POD-SERIE": "Measurement series",
  "UI-M13-POD-STATY": "Min {min}, max {max}, mean {srednia} {jednostka}",
  "UI-M13-POD-PROBKI": "Valid samples: {n}, skipped (missing, out of range): {pominiete}",
  "UI-M13-POD-ENERGIA": "Energy from power: {kwh} kWh",
  "UI-M13-POD-ENERGIA-LUKI": "Skipped gaps longer than the limit: {n}",
  "UI-M13-POD-ENERGIA-BEZ-LIMITU": "Enter the longest gap to compute energy — without it the app does not guess whether missing samples mean standstill or failure.",
  "UI-M13-POD-BRAK-WARTOSCI": "no valid samples",
  "UI-M13-POD-EKSPORT-TYTUL": "CSV export",
  "UI-M13-POD-EKSPORT-OPIS": "The file holds all samples of the range (ISO time, channel, quantity, value in the base unit, quality). Missing values are empty, never zero.",
  "UI-M13-POD-EKSPORT-PRZYCISK": "Download CSV",
}
