import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { PROG_SZRONIENIA_GORNY_C } from "./constants"
import type { CykleOdszranianiaInput } from "./input"
import { validateInput } from "./validation"
import { ponizejMinPracy, powyzejZakresuSzronienia } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_h = P_{def} \\cdot \\dfrac{t_{def}}{T},\\quad narzut = \\dfrac{P_{def}\\, t_{def}}{P_{baz}\\, T},\\quad E_{doba} = E_h \\cdot h_{szron},\\quad COP_{ef} = \\dfrac{COP_{kat}}{1 + narzut}"

export type CykleOdszranianiaResult = {
  /** Share of time spent defrosting [%] = t_def / T. */
  udzialCzasuPct: number
  /** Extra electricity per hour of frosting conditions [kWh/h]. */
  energiaNaGodzineKwh: number
  /** Extra electricity relative to normal heating [%]. */
  narzutPct: number
  /** Extra electricity per day [kWh/day]; null = no frosting hours entered. */
  energiaDobaKwh: number | null
  /** COP including defrost; null = no catalogue COP entered. */
  copEfektywny: number | null
}

const PUSTY: CykleOdszranianiaResult = {
  udzialCzasuPct: 0,
  energiaNaGodzineKwh: 0,
  narzutPct: 0,
  energiaDobaKwh: null,
  copEfektywny: null,
}

/** Extra electricity per hour of frosting conditions [kWh/h] = P_def · t_def / T (shared with the seasonal 2B section). */
export function energiaDefrostuNaGodzineKwh(mocDefrostuKw: number, czasDefrostuMin: number, odstepMin: number): number {
  return (mocDefrostuKw * czasDefrostuMin) / odstepMin
}

/**
 * Ekran 6, Moduł 6 — "Cykle odszraniania (defrost)" (dawne 5.6 + 1.14 + 6.8). The source gives no frosting model
 * (temperature/humidity → defrost frequency), only examples, so the cycle (interval T, duration t_def, power during
 * defrost P_def) comes from the datasheet or observation, and the screen computes its cost: every defrost adds
 * P_def·t_def on top of normal heating (Biblia §2.14: „dolicza stały dodatkowy pobór”) — the pump has to make up the
 * heat it did not deliver, so the base consumption over the interval is unchanged (✅🤖; the heat taken from the
 * building to melt the frost is not counted). Overhead = P_def·t_def / (P_baz·T); effective COP = COP_kat / (1 +
 * overhead) — the same heat for more electricity (Biblia §7.8).
 *
 * Examples: §7.8 „COP 2,8 → realnie 2,2, zużycie +27%” — 2.8 / 2.2 = 1.273, consistent (test). §2.14 „+2 kW przez
 * 5 min co godzinę” = 0.167 kWh per hour of frosting; „0,8 kWh/dobę” then means 4.8 h of frosting conditions a day
 * (test). Inconsistency (Directive #5): Ekran 6 „co ok. 45 min, 5 min → dodatkowe ok. 8%” — 5/45 = 11.1% of time;
 * 8% only if the defrost draws 0.72 × the normal power (test shows both). 🟡 §7.8 „pompa nie pracuje poniżej
 * –20 °C” — the limit comes from the datasheet (user). ℹ️ above the source's 5–7 °C frosting range (upper end 7 °C).
 */
export function calculateCykleOdszraniania(input: CykleOdszranianiaInput): CalcResult<CykleOdszranianiaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    odstepMin: input.odstepMin,
    czasDefrostuMin: input.czasDefrostuMin,
    mocDefrostuKw: input.mocDefrostuKw,
    mocBazowaKw: input.mocBazowaKw,
    godzinySzronieniaH: input.godzinySzronieniaH,
    copKatalogowy: input.copKatalogowy,
  }
  const baza = { unit: "%", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    input.tZewnC === null ||
    input.odstepMin === 0 ||
    input.czasDefrostuMin === 0 ||
    input.mocDefrostuKw === 0 ||
    input.mocBazowaKw === 0
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const udzial = input.czasDefrostuMin / input.odstepMin
  const energiaNaGodzineKwh = energiaDefrostuNaGodzineKwh(input.mocDefrostuKw, input.czasDefrostuMin, input.odstepMin)
  const narzut = (input.mocDefrostuKw * input.czasDefrostuMin) / (input.mocBazowaKw * input.odstepMin)
  const value: CykleOdszranianiaResult = {
    udzialCzasuPct: udzial * 100,
    energiaNaGodzineKwh,
    narzutPct: narzut * 100,
    energiaDobaKwh: input.godzinySzronieniaH > 0 ? energiaNaGodzineKwh * input.godzinySzronieniaH : null,
    copEfektywny: input.copKatalogowy > 0 ? input.copKatalogowy / (1 + narzut) : null,
  }

  const warnings: Warning[] = []
  if (input.tMinPracyC !== null && input.tZewnC < input.tMinPracyC) warnings.push(ponizejMinPracy(input.tZewnC, input.tMinPracyC))
  if (input.tZewnC > PROG_SZRONIENIA_GORNY_C) warnings.push(powyzejZakresuSzronienia(input.tZewnC, PROG_SZRONIENIA_GORNY_C))

  const assumptions: Assumption[] = [{ kod: "CYK-ZALOZENIE-DOLICZONY" }]
  return {
    ...baza,
    value,
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
