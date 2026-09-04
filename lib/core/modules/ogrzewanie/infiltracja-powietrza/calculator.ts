import type { CalcResult } from "@/lib/core/calc-result"
import type { InfiltracjaPowietrzaInput } from "./input"
import { validateInput } from "./validation"
import { strataInfo } from "./warnings"
import { GESTOSC_POWIETRZA_KG_M3, CIEPLO_WLASCIWE_POWIETRZA_J_KG_K } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type InfiltracjaPowietrzaResult = {
  strataCieplnaKw: number
}

const FORMULA = "\\dot{Q} = \\frac{n \\times V \\times \\rho \\times c_p \\times \\Delta T}{3600}"

/**
 * Ekran 12, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Infiltracja powietrza (test
 * szczelności)" (dawne 5.12, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Sekcja B). Strata
 * ciepła przez wymianę powietrza (n wymian/h) — fizyka bez wolnego parametru poza gęstością i
 * ciepłem właściwym powietrza (stałe fizyczne, nie dane specyficzne dla źródła), analogicznie do
 * `bojler-cwu` (ciepło właściwe wody). Współczynnik ρ×c_p/3600 ≈ 0,335 Wh/(m³·K) odpowiada
 * powszechnie cytowanej w budownictwie stałej ~0,33-0,34 Wh/(m³·K) dla powietrza.
 *
 * Źródło NIE podaje kubatury budynku ani ΔT dla swojego przykładu ("0,8 wymiany/h" bez
 * towarzyszących liczb) — nie da się więc dokładnie odtworzyć jego konkretnego wyniku liczbowego;
 * wzór sam w sobie jest jednak uniwersalną fizyką (nie wymyślonym współczynnikiem), zweryfikowaną
 * niezależnie w Pythonie. Poprawa 8% po uszczelnieniu (Sekcja C źródła) NIE jest tu liczona —
 * to pojedynczy przykład, nie ogólny współczynnik.
 */
export function calculateInfiltracjaPowietrza(
  input: InfiltracjaPowietrzaInput,
): CalcResult<InfiltracjaPowietrzaResult> {
  const { errors, warnings: walidacyjneOstrzezenia } = validateInput(input)
  const pustyWynik: InfiltracjaPowietrzaResult = { strataCieplnaKw: 0 }
  const inputs = {
    wymianyPowietrzaNaH: input.wymianyPowietrzaNaH,
    kubaturaBudynkuM3: input.kubaturaBudynkuM3,
    deltaTK: input.deltaTK ?? 0,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kW",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.wymianyPowietrzaNaH === 0 || input.kubaturaBudynkuM3 === 0 || input.deltaTK === null

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kW",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const deltaTK: number = input.deltaTK ?? 0
  const strataCieplnaW =
    (input.wymianyPowietrzaNaH *
      input.kubaturaBudynkuM3 *
      GESTOSC_POWIETRZA_KG_M3 *
      CIEPLO_WLASCIWE_POWIETRZA_J_KG_K *
      deltaTK) /
    3600
  const strataCieplnaKw = strataCieplnaW / 1000

  const warnings = [...walidacyjneOstrzezenia, strataInfo(strataCieplnaKw)]
  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { strataCieplnaKw },
    unit: "kW",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Gęstość i ciepło właściwe powietrza jako stałe fizyczne (1,2 kg/m³, 1005 J/(kg·K)) — nie dane specyficzne dla źródła.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
