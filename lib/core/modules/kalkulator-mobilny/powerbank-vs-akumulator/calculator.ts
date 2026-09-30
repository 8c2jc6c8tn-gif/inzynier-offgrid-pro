import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PowerbankVsAkumulatorInput } from "./input"
import { validateInput } from "./validation"
import { mocZestawuIKoszt, zaMalaMocPowerbanku } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "n_{pb} = \\dfrac{E_{pb} \\times \\eta}{E_{u}}, \\quad n_{ak} = \\dfrac{C_{Ah} \\times U \\times u \\times \\eta}{E_{u}}, \\quad P_{u} \\le P_{wyj,pb}"

export type PowerbankVsAkumulatorResult = {
  /** Energia dostarczona do urządzenia [Wh]. */
  energiaPowerbankuWh: number
  energiaAkumulatoraWh: number
  /** Ile pełnych użyć (naładowań / dób) z każdej opcji. */
  uzyciaPowerbank: number
  uzyciaAkumulator: number
  /** Czy powerbank uciągnie moc urządzenia. */
  powerbankMaMoc: boolean
}

const PUSTY_WYNIK: PowerbankVsAkumulatorResult = {
  energiaPowerbankuWh: 0,
  energiaAkumulatoraWh: 0,
  uzyciaPowerbank: 0,
  uzyciaAkumulator: 0,
  powerbankMaMoc: false,
}

/**
 * Ekran 7, Moduł 12 — "Powerbank solarny vs mały akumulator" (dawne 8.7, Biblia §12.7). Sprawdza moc
 * ciągłą powerbanku (Tresc E7: "powerbanki nie mają wystarczającej mocy ciągłej" do lodówki) i ile
 * razy każda opcja naładuje/zasili urządzenie. Przykład Biblii ("300 Wh ładuje laptopa 1,5 razy,
 * 100 Ah — 10 razy") jest wewnętrznie niespójny: 1200 Wh / 10 = 120 Wh na laptop, a wtedy 300 Wh to
 * 2,5 raza, nie 1,5 — test pokazuje wynik liczony, nie cytat.
 */
export function calculatePowerbankVsAkumulator(input: PowerbankVsAkumulatorInput): CalcResult<PowerbankVsAkumulatorResult> {
  const { errors } = validateInput(input)
  const inputs = { ...input }
  const baza = { unit: "-", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (Object.values(input).some((v) => v === 0)) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const eta = input.sprawnoscPct / 100
  const energiaPowerbankuWh = input.powerbankWh * eta
  const energiaAkumulatoraWh = input.akumulatorAh * input.akumulatorV * (input.akumulatorUzytecznaPct / 100) * eta
  const powerbankMaMoc = input.mocUrzadzeniaW <= input.powerbankMocWyjsciaW

  const warnings: Warning[] = []
  if (!powerbankMaMoc) warnings.push(zaMalaMocPowerbanku(input.mocUrzadzeniaW, input.powerbankMocWyjsciaW))
  warnings.push(mocZestawuIKoszt())

  return {
    ...baza,
    value: {
      energiaPowerbankuWh,
      energiaAkumulatoraWh,
      uzyciaPowerbank: energiaPowerbankuWh / input.energiaNaUzycieWh,
      uzyciaAkumulator: energiaAkumulatoraWh / input.energiaNaUzycieWh,
      powerbankMaMoc,
    },
    status: powerbankMaMoc ? "VALID" : "VALID_WITH_WARNINGS",
    assumptions: [{ kod: "PBA-ZALOZENIE-PELNE-NALADOWANIE" }],
    warnings,
  }
}
