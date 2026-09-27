import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { NAPIECIE_AKU_12V_MAX_V, NAPIECIE_AKU_12V_MIN_V } from "./constants"
import type { Urzadzenie12vBezposrednioInput } from "./input"
import { validateInput } from "./validation"
import { przepieciePrzyLadowaniu, przezStabilizatorInfo, zaNiskiePrzyRozladowaniu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

/** Float tolerance for range comparisons: 12,5 V × 1,16 = 14,4999… must count as 14,5 V, not as an overvoltage. */
const EPS_V = 1e-9

const FORMULA =
  "U_{urz} \\in [U_n (1 - t),\; U_n (1 + t)] \;\; ; \;\; U_{aku} \\in [11,\; 14{,}5] \\times \\dfrac{U_{sys}}{12}"

export type Urzadzenie12vBezposrednioResult = {
  urzadzenieMinV: number
  urzadzenieMaxV: number
  akuMinV: number
  akuMaxV: number
  /** true = cały zakres napięcia akumulatora mieści się w zakresie urządzenia. */
  zakresPokryty: boolean
}

const PUSTY_WYNIK: Urzadzenie12vBezposrednioResult = {
  urzadzenieMinV: 0,
  urzadzenieMaxV: 0,
  akuMinV: 0,
  akuMaxV: 0,
  zakresPokryty: false,
}

/**
 * Ekran 27, Moduł 12 — "Czy mogę podłączyć urządzenie 12V bezpośrednio?" (dawne 8.54,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md). Sekcja B: czy urządzenie wytrzyma górny zakres
 * napięcia akumulatora (do 14,5 V przy ładowaniu). 🔴 ze źródła: urządzenie o wąskiej tolerancji
 * wprost na akumulatorze (przykład: 12,0 V ±5% → max 12,6 V < 14,5 V). Dolna granica (11 V) tylko
 * jako info — źródło nie stawia tu stopu, urządzenie najwyżej przestanie działać. 24 V = zakres 12 V ×2
 * (dwa akumulatory w szeregu, jawne założenie).
 */
export function calculateUrzadzenie12vBezposrednio(
  input: Urzadzenie12vBezposrednioInput,
): CalcResult<Urzadzenie12vBezposrednioResult> {
  const { errors } = validateInput(input)
  const inputs = {
    napiecieSystemuV: input.napiecieSystemuV,
    napiecieUrzadzeniaV: input.napiecieUrzadzeniaV,
    tolerancjaPct: input.tolerancjaPct ?? 0,
    przezStabilizator: input.przezStabilizator ? 1 : 0,
  }

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.napiecieSystemuV === 0 || input.napiecieUrzadzeniaV === 0 || input.tolerancjaPct === null) {
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

  const krotnosc = input.napiecieSystemuV / 12
  const akuMinV = NAPIECIE_AKU_12V_MIN_V * krotnosc
  const akuMaxV = NAPIECIE_AKU_12V_MAX_V * krotnosc
  const t = input.tolerancjaPct / 100
  const urzadzenieMinV = input.napiecieUrzadzeniaV * (1 - t)
  const urzadzenieMaxV = input.napiecieUrzadzeniaV * (1 + t)
  const zakresPokryty = akuMinV >= urzadzenieMinV - EPS_V && akuMaxV <= urzadzenieMaxV + EPS_V

  const warnings: Warning[] = []
  if (input.przezStabilizator) {
    warnings.push(przezStabilizatorInfo(akuMinV, akuMaxV))
  } else {
    if (akuMaxV > urzadzenieMaxV + EPS_V) warnings.push(przepieciePrzyLadowaniu(akuMaxV, urzadzenieMaxV))
    if (akuMinV < urzadzenieMinV - EPS_V) warnings.push(zaNiskiePrzyRozladowaniu(akuMinV, urzadzenieMinV))
  }

  const assumptions: Assumption[] = [{ kod: "U12-ZALOZENIE-ZAKRES-AKU" }]
  if (krotnosc !== 1) assumptions.push({ kod: "U12-ZALOZENIE-24V-SZEREGOWO" })

  return {
    value: { urzadzenieMinV, urzadzenieMaxV, akuMinV, akuMaxV, zakresPokryty },
    unit: "V",
    status: warnings.some((w) => w.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
