/**
 * M14 — D1 „Mój rachunek dziś” (dom, groups G) and F1 „Mój rachunek dziś (C)” (firma, groups C
 * on nN). One engine with a segment parameter (echo, D12/D20). `03_M14_Dom_i_Firma_Siec.md` §1–§2,
 * „Logika” pkt 1–2; opracowanie §2.1–§2.4a, §8.7.
 *
 * Every network/national rate is taken from the rates file `rozliczenia-pl-2026` (✅ only) unless
 * the user overrides it with the value from their invoice (D36, „moje dane z faktury”). Energy
 * sale prices and the trading fee always come from the user — the app has no ✅ default for them.
 */
import type { Grupa, OkresRozliczeniowy, OsdId, Strefa } from "@/lib/core/dane/rozliczenia-pl-2026"

export type Segment = "dom" | "firma"
export type Fazy = "jednofazowa" | "trojfazowa"

/** Values from the user's invoice; `undefined` = take the ✅ rate from the data file. Netto. */
export type StawkiWlasne = {
  /** Variable network fee per zone [zł/kWh]. */
  sieciowaZmienna?: Partial<Record<Strefa, number>>
  /** Fixed network fee: G [zł/month]; C [zł/kW/month]. */
  sieciowaStala?: number
  /** Subscription fee [zł/month]. */
  abonamentZlMies?: number
  jakosciowaZlKwh?: number
  ozeZlKwh?: number
  kogeneracyjnaZlKwh?: number
  /** Capacity fee, G flat rate [zł/month]. */
  mocowaGZlMies?: number
  /** Capacity fee, others (C) [zł/kWh in working days 7–22]. */
  mocowaCZlKwh?: number
}

export type RachunekInput = {
  segment: Segment
  osd: OsdId
  grupa: Grupa
  /** Settlement date (ISO) — selects the rate periods and the year. */
  dataRozliczenia: string
  /** G only. */
  fazy: Fazy
  /** C only [kW]. 0 = not entered. */
  mocUmownaKw: number
  okresRozliczeniowy: OkresRozliczeniowy
  /** Annual consumption per zone [kWh] (from invoices). */
  zuzycieStrefKwh: Partial<Record<Strefa, number>>
  /** Optional 12 monthly values [kWh] — only to weight rates that change within the year. */
  zuzycieMiesieczneKwh: number[] | null
  /** Energy sale price per zone [zł/kWh netto] — from the user. */
  cenaEnergiiZlKwh: Partial<Record<Strefa, number>>
  /** Seller's trading fee [zł/month netto]; 0 is legal, null = not entered. */
  oplataHandlowaZlMies: number | null
  /** C only: energy drawn on working days 7:00–22:00 [kWh/year]; null = not entered. */
  energiaMocowaKwh: number | null
  stawkiWlasne: StawkiWlasne
}
