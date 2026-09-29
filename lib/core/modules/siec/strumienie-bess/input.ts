/**
 * 🔎 TD23 (`dlug-techniczny.md`): kWh and gain per kWh of every stream are user entries; system
 * services are information only; only the capacity charge ✅ comes from the data file.
 *
 * M14 — F7 „Magazyn (BESS) — strumienie korzyści” (echo M4/E23), Wzorzec D + G.
 * `03_M14_Dom_i_Firma_Siec.md` §7, opracowanie §8.5: five streams — self-consumption, price
 * arbitrage, contracted-power charge reduction (✏️ K13: real only in C2x and with exceedances, 🔎B),
 * system services (practically unavailable without an aggregator, 🔎B — information only) and the
 * capacity charge (0,2194 zł/kWh ✅, data file). Storage prices are never in the code (material's
 * 1 400–2 500 zł/kWh is 🔎B) — the cost of one stored kWh comes from M4/E23 with the user's price.
 */
export type GrupaMocy = "C1x" | "C2x"

export type StrumienieBessInput = {
  dataRozliczenia: string
  grupa: GrupaMocy
  /** Cost of 1 kWh passed through the storage (M4/E23: price / (capacity × cycles × η)) [zł/kWh]. null = unknown. */
  kosztCykluZlKwh: number | null
  /** Storage price (M4/E23) [zł] — only for simple payback. null = unknown. */
  cenaMagazynuZl: number | null
  /** Self-consumption: PV surplus stored and used later [kWh/year] and the gain per kWh
   *  (purchase price − export value, without the capacity charge) [zł/kWh]. */
  autokonsumpcjaKwhRok: number
  autokonsumpcjaZyskZlKwh: number | null
  /** Arbitrage: grid energy charged cheap and used at peak [kWh/year] and the price spread [zł/kWh]. */
  arbitrazKwhRok: number
  arbitrazZyskZlKwh: number | null
  /** Discharged energy that falls on working days 7:00–22:00 [kWh/year] (subset of the two above). */
  mocowaKwhRok: number
  /** Contracted-power / exceedance charge saved [zł/year] — user entry from the F4 calculator. null = not counted. */
  mocUmownaZlRok: number | null
}
