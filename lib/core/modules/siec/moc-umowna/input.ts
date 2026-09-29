/**
 * M14 — F4 „Moc umowna — przekroczenia i optymalny poziom” (Wzorzec D). `03_M14_Dom_i_Firma_Siec.md`
 * §7; opracowanie §8.3 ✅ (✏️ K12; Tauron pkt 3.2.11, Energa pkt 4.2.11–4.2.12, Stoen pkt 3.2.11):
 * fee = fixed network rate [zł/kW/month] × sum of the 10 largest surpluses (15-min measurement), or
 * × 10 × the largest surplus when the metering cannot do the first — a question to the user, not
 * OSD data. Charged for each month with a surplus. Optimal P_u minimises fixed cost + surplus cost.
 */
import type { Grupa, OsdId } from "@/lib/core/dane/rozliczenia-pl-2026"

export type WariantPomiaru = "suma10" | "10xmax"

export type MiesiacMocy = {
  /** Largest 15-min power of the month [kW]; null = month not entered. */
  maksKw: number | null
  /** Optional 10 largest 15-min powers of the month [kW] (variant "suma10"). */
  dziesiecNajwiekszychKw: number[] | null
}

export type MocUmownaInput = {
  osd: OsdId
  grupa: Grupa
  dataRozliczenia: string
  mocUmownaKw: number
  /** Fixed network rate from the invoice [zł/kW/month]; undefined = ✅ data. */
  stalaZlKwMiesWlasna?: number
  wariantPomiaru: WariantPomiaru
  /** 12 months. */
  miesiace: MiesiacMocy[]
}
