import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { OGNIWA_NA_12V, PROG_ODCIECIA_12V } from "./constants"
import type { OchronaPrzedRozladowaniemInput } from "./input"
import { brakDozownikaOlowiowy, progKwasowyNieznany } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "U_{odc} = U_{odc,12V} \\times \\dfrac{U_n}{12}"

export type OchronaPrzedRozladowaniemResult = {
  /** Próg odcięcia dozownika dla całego akumulatora [V]. null = źródło nie podaje progu dla tej chemii. */
  progOdcieciaV: number | null
  /** Ten sam próg na jedno ogniwo [V]. null jak wyżej. */
  progNaOgniwoV: number | null
  /** Liczba ogniw w szeregu dla wybranego napięcia. */
  liczbaOgniw: number
}

const PUSTY_WYNIK: OchronaPrzedRozladowaniemResult = { progOdcieciaV: null, progNaOgniwoV: null, liczbaOgniw: 0 }

/**
 * Ekran 9, Moduł 12 — "Ochrona przed rozładowaniem akumulatora" (dawne 8.11,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md). Progi 12 V 1:1 ze źródła; dla 24/48 V ten sam
 * próg na ogniwo × liczba ogniw w szeregu (akumulator 24 V to dwa „dwunastki” w szeregu — fizyka
 * połączenia szeregowego, nie nowy współczynnik). LiFePO4 11,0 V = 2,75 V/ogniwo — ten sam punkt
 * co w M4/E31 (80% DoD), więc oba ekrany są spójne.
 *
 * Twardy stop 🔴 ze źródła: akumulator kwasowy/AGM bez dozownika, zasilający odbiornik bez własnego
 * zabezpieczenia — ryzyko trwałego uszkodzenia przez głębokie rozładowanie.
 */
export function calculateOchronaPrzedRozladowaniem(
  input: OchronaPrzedRozladowaniemInput,
): CalcResult<OchronaPrzedRozladowaniemResult> {
  const inputs = {
    napiecieZnamionoweV: input.napiecieZnamionoweV,
    maDozownik: input.maDozownik ? 1 : 0,
    odbiornikMaWlasneZabezpieczenie: input.odbiornikMaWlasneZabezpieczenie ? 1 : 0,
  }

  if (input.chemia === null || input.napiecieZnamionoweV === 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const krotnosc = input.napiecieZnamionoweV / 12
  const liczbaOgniw = OGNIWA_NA_12V[input.chemia] * krotnosc
  const prog12V = PROG_ODCIECIA_12V[input.chemia]
  const progOdcieciaV = prog12V === null ? null : prog12V * krotnosc
  const progNaOgniwoV = progOdcieciaV === null ? null : progOdcieciaV / liczbaOgniw

  const warnings: Warning[] = []
  const olowiowy = input.chemia === "AGM" || input.chemia === "kwasowy"
  if (olowiowy && !input.maDozownik && !input.odbiornikMaWlasneZabezpieczenie) {
    warnings.push(brakDozownikaOlowiowy(input.chemia))
  }
  if (prog12V === null) warnings.push(progKwasowyNieznany())

  const assumptions: Assumption[] = []
  if (krotnosc !== 1) assumptions.push({ kod: "LVD-ZALOZENIE-SKALOWANIE-SZEREGOWE", params: { krotnosc } })
  if (input.chemia === "LiFePO4") assumptions.push({ kod: "LVD-ZALOZENIE-SPOJNE-Z-M4-E31" })

  const maKrytyczne = warnings.some((w) => w.level === "critical")

  return {
    value: { progOdcieciaV, progNaOgniwoV, liczbaOgniw },
    unit: "V",
    status: maKrytyczne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
