import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { KAT_SPLUKIWANIE_MAX } from "@/lib/core/modules/pv/czystosc-i-snieg/constants"
import type { OsadNaPvInput } from "./input"
import { validateInput } from "./validation"
import {
  lodBlokuje,
  mokryPrzykleja,
  nierownoStringi,
  sniegMozeZsunac,
  snieNieZsunie,
  szadzNieZsuwa,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_{strata} = E_{doba} \\cdot d \\cdot \\left(1 - \\dfrac{p}{100}\\right)"

export type OsadNaPvResult = {
  /** Production lost while the deposit stays [kWh]. */
  utrataKwh: number
  /** Production still made under the deposit [kWh]. */
  produkcjaPodOsademKwh: number
  /** Dry snow above the slide angle may slide off by itself; null = not applicable (other deposits / no tilt). */
  mozeZsunacSie: boolean | null
}

const PUSTY: OsadNaPvResult = { utrataKwh: 0, produkcjaPodOsademKwh: 0, mozeZsunacSie: null }

/**
 * Ekran 7 + Ekran 14, Moduł 7 — deposit on PV (dawne 6.7, 6.20, 6.18; Biblia §7.7, §7.18, §7.19). Energy lost =
 * daily production × days covered × (1 − production left under the deposit). The source has no duration or
 * transmission model — both are user inputs (examples: snow „po 24 h opadów produkcja spadnie do 0%” and „przy
 * −5 °C śnieg utrzyma się 3 dni”, rime „po 48 h produkcja spadnie do 5% nominalnej”). Qualitative rules 1:1 from
 * the source: dry snow slides off above 30° (the same 30° as M3 „Czystość i śnieg”, `KAT_SPLUKIWANIE_MAX`; at 30°
 * and below 🟡 „nie zsunie się sam”), wet snow sticks (🟡), glaze/frost blocks the light (🟡), rime does not slide
 * (🟡), uneven cover between strings → 🟡 mismatch (cross-ref M3/E17). The wind-driven snow distribution map
 * (§7.19, 3D roof model) is not built — the user marks uneven cover.
 */
export function calculateOsadNaPv(input: OsadNaPvInput): CalcResult<OsadNaPvResult> {
  const { errors } = validateInput(input)
  const inputs = {
    katDeg: input.katDeg ?? 0,
    produkcjaDobaKwh: input.produkcjaDobaKwh,
    dniZalegania: input.dniZalegania,
    pozostalaProdukcjaPct: input.pozostalaProdukcjaPct,
  }
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.rodzaj === null || input.produkcjaDobaKwh === 0 || input.dniZalegania === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const calosc = input.produkcjaDobaKwh * input.dniZalegania
  const produkcjaPodOsademKwh = (calosc * input.pozostalaProdukcjaPct) / 100
  const warnings: Warning[] = []
  let mozeZsunacSie: boolean | null = null
  if (input.rodzaj === "sypki" && input.katDeg !== null) {
    mozeZsunacSie = input.katDeg > KAT_SPLUKIWANIE_MAX
    warnings.push(
      mozeZsunacSie ? sniegMozeZsunac(input.katDeg, KAT_SPLUKIWANIE_MAX) : snieNieZsunie(input.katDeg, KAT_SPLUKIWANIE_MAX),
    )
  }
  if (input.rodzaj === "mokry") warnings.push(mokryPrzykleja())
  if (input.rodzaj === "lod") warnings.push(lodBlokuje())
  if (input.rodzaj === "szadz") warnings.push(szadzNieZsuwa())
  if (input.nierownoStringi) warnings.push(nierownoStringi())

  const assumptions: Assumption[] = [{ kod: "OSAD-ZALOZENIE-DNI-I-PROCENT" }]
  return {
    ...baza,
    value: { utrataKwh: calosc - produkcjaPodOsademKwh, produkcjaPodOsademKwh, mozeZsunacSie },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
