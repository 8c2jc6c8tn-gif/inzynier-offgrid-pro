import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { BojlerCwuInput } from "./input"
import { validateInput } from "./validation"
import { bojlerZaMaly } from "./warnings"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type BojlerCwuResult = {
  energiaDobowaKwh: number
  czasLadowaniaH: number
}

const FORMULA =
  "E_{doba} = V_{CWU} \\times \\Delta T \\times 0{,}001163 \\;\\; ; \\;\\; t_{ładowania} = E_{doba} / P_{grzałki}"

/**
 * Ekran 2, Moduł 2 "Zapotrzebowanie energetyczne" — "Inteligentny bojler C.W.U." (dawne 1.2,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja B). Wzór na energię z pojemności
 * cieplnej wody (Q = m·c·ΔT, c_wody=4186 J/(kg·K) — uniwersalna stała fizyczna, nie dana
 * specyficzna dla źródła) — analogicznie do wzoru Magnusa-Tetensa w Ekranie 10, Moduł 4:
 * fundamentalna fizyka niepodana wprost w źródle, ale nie wymagająca żadnego wymyślonego
 * współczynnika projektowego. ΔT (wzrost temperatury zimna→C.W.U.) NIE ma domyślnej wartości —
 * przykład źródła (Sekcja C, 200l/4 osoby → ok. 8 kWh) odpowiada ΔT≈35K, ale to nie jest jawnie
 * podana dana źródła (zweryfikowane niezależnie w Pythonie), więc pole wymaga ręcznego wpisania.
 */
export function calculateBojlerCwu(input: BojlerCwuInput): CalcResult<BojlerCwuResult> {
  const { errors } = validateInput(input)
  const pustyWynik: BojlerCwuResult = { energiaDobowaKwh: 0, czasLadowaniaH: 0 }
  const inputs = {
    wolumenCwuLDoba: input.wolumenCwuLDoba,
    deltaTK: input.deltaTK,
    mocGrzalkiKw: input.mocGrzalkiKw,
    pojemnoscBojleraL: input.pojemnoscBojleraL,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.wolumenCwuLDoba === 0 ||
    input.deltaTK === 0 ||
    input.mocGrzalkiKw === 0 ||
    input.pojemnoscBojleraL === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaDobowaKwh = input.wolumenCwuLDoba * input.deltaTK * WSPOLCZYNNIK_KWH_NA_L_K
  const czasLadowaniaH = energiaDobowaKwh / input.mocGrzalkiKw

  const warnings =
    input.pojemnoscBojleraL < input.wolumenCwuLDoba
      ? [bojlerZaMaly(input.pojemnoscBojleraL, input.wolumenCwuLDoba)]
      : []

  return {
    value: { energiaDobowaKwh, czasLadowaniaH },
    unit: "kWh/dobę",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "DELTA-T-RECZNIE" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
