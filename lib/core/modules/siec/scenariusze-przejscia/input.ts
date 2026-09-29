/**
 * M14 — D7 „Porównanie scenariuszy A–D” (dom) / F8 (firma, z RF1), Wzorzec G.
 * `03_M14_Dom_i_Firma_Siec.md` §4, opracowanie §4.2–4.4:
 *
 *   TCO_s(N) = I_s − D_s + Σ_{t=1..N} [K_sieć,s(t) + K_paliwo,s(t) + K_serwis,s(t)] / (1+r)^t
 *              + Σ I_wym,s / (1+r)^t_wym − R_s(N) / (1+r)^N
 *
 * Echo only — no new physics: energy balance `siec/bilans-miesieczny`, price path
 * `siec/sciezka-cen-energii` (D40–D43), generator hours and fuel M2/E17. Prices of equipment, fuel
 * and service are always user entries — the app never guesses them.
 */
import type { TrybSciezki } from "../sciezka-cen-energii/input"
import type { Segment } from "../rachunek-za-prad/input"

export type IdScenariusza = "A" | "B" | "C" | "D"

export type ParametryScenariusza = {
  /** Investment I_s [zł]; null = scenario not considered. */
  inwestycjaZl: number | null
  /** Subsidy D_s [zł]; 0 = none. */
  dotacjaZl: number
  mocPvKwp: number
  /** Usable storage capacity [kWh] (A: always 0). */
  pojemnoscMagazynuKwh: number
  /** Part of I_s that is storage [zł] — replaced after its life, residual value at N. 0 = not counted. */
  kosztMagazynuZl: number
  /** Running service of the whole installation (PV, storage, generator) [zł/year] — user entry. 0 = none. */
  serwisRokZl: number
}

export type SiecScenariuszy = {
  /** „Cena trzymania sieci” K_stałe,rok brutto [zł/year] (D1/F1). null = not entered. */
  kosztStalyRokBruttoZl: number | null
  /** Variable cost of 1 kWh drawn, brutto [zł/kWh] (D1/F1). null = not entered. */
  cenaZmiennaKwhBruttoZl: number | null
  /** Value of 1 kWh exported (net-billing: RCE × 1.23 on the deposit; D8) [zł/kWh]. 0 is legal; null = not entered. */
  wartoscNadwyzkiKwhZl: number | null
}

export type AgregatScenariusza = {
  /** Generator rated power [kW]; 0 = no generator in scenario D. */
  mocKw: number
  zuzycieLH: number | null
  cenaPaliwaZlL: number | null
}

export type KontrolaScenariuszy = {
  /** R4: someone depends on powered medical equipment. null = not answered. */
  osobyZalezneOdZasilania: boolean | null
  /** R4: redundant reserve (second independent source) exists. */
  zapasRedundantny: boolean
  /** User's threshold of generator hours per month above which D is „ryzykowne”. null = none. */
  progGodzinAgregatuMies: number | null
  /** RF1 (firma): acceptable time without power [h]. null = not answered. */
  dopuszczalnyCzasBezZasilaniaH: number | null
}

export type ScenariuszePrzejsciaInput = {
  segment: Segment
  rokBazowy: number
  horyzontLat: number
  tryb: TrybSciezki
  /** Discount rate r [%/year]; 0 = simple mode (D40). */
  stopaDyskontowaProcent: number
  zuzycieMiesieczneKwh: number[]
  uzyskMiesiecznyKwhNaKwp: number[]
  autokonsumpcjaBezposrednia: number | null
  sprawnoscMagazynu: number | null
  /** Storage life [years] (M4) — replacements and residual value. null = not entered. */
  zywotnoscMagazynuLat: number | null
  siec: SiecScenariuszy
  agregat: AgregatScenariusza
  scenariusze: Record<IdScenariusza, ParametryScenariusza>
  kontrola: KontrolaScenariuszy
}
