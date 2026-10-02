import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/constants"
import { PROG_SOC_BOJLER_PCT } from "./constants"
import type { OknoSloneczneInput } from "./input"
import { validateInput } from "./validation"
import { bojlerNiedogrzany, brakNadwyzki, oknoNiePokrywaZuzycia } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E = E_{okna} - E_{zuż};\\ E \\to \\text{grzałki BMS} \\to \\text{bateria do } 80\\% \\to Q_{boj} = V \\Delta T c \\to \\text{bateria do } 100\\% \\to \\text{nadwyżka}"

export type OknoSloneczneResult = {
  /** Energy left after the house's consumption in the window [kWh]. */
  energiaDoPodzialuKwh: number
  naGrzalkiBmsKwh: number
  naBaterieKwh: number
  naBojlerKwh: number
  /** Energy left for surplus loads (washing machine, dishwasher) [kWh]. */
  nadwyzkaKwh: number
  socKoniecPct: number
  /** Tank temperature after the window [°C]; null = no boiler. */
  bojlerTKoniecC: number | null
}

const PUSTY: OknoSloneczneResult = {
  energiaDoPodzialuKwh: 0,
  naGrzalkiBmsKwh: 0,
  naBaterieKwh: 0,
  naBojlerKwh: 0,
  nadwyzkaKwh: 0,
  socKoniecPct: 0,
  bojlerTKoniecC: null,
}

/**
 * Ekran 15, Moduł 7 — "Krótkie okno słoneczne" (dawne 6.22, Biblia §7.21). Sequential allocation of the window's
 * energy in the source's priority order: battery → hot water tank once the battery is above 80% → BMS heaters →
 * surplus loads. Two readings of the source made explicit (✅🤖, owner confirmation):
 *  - the source puts BMS heaters third, but describes them as „jeśli bateria wymaga ogrzania do ładowania” — and
 *    Biblia §2.15: „LiFePO4 nie można ładować poniżej 0 °C – przed ładowaniem BMS włącza grzałki”. A battery that
 *    needs heating cannot charge at all, so the heater energy is taken FIRST (Directive #5);
 *  - after the tank, the rest charges the battery from 80% to 100%, then the surplus loads.
 * The house's consumption during the window is supplied directly first (Module 2, optional). Charging losses and
 * tank losses are ignored (stored energy = allocated energy); tank heat Q = V·ΔT·c — the M2/E2 water constant.
 *
 * Inconsistency (Directive #5): the example „4,5 kWh → bateria do 65% i bojler do 50 °C” contradicts the source's
 * own rule (the tank gets energy only above 80%) — with the rule, a battery ending at 65% leaves nothing for the
 * tank. The engine follows the rule; the test shows the example's numbers under it.
 */
export function calculateOknoSloneczne(input: OknoSloneczneInput): CalcResult<OknoSloneczneResult> {
  const { errors } = validateInput(input)
  const inputs = {
    energiaOknaKwh: input.energiaOknaKwh,
    zuzycieWOknieKwh: input.zuzycieWOknieKwh,
    pojemnoscBateriiKwh: input.pojemnoscBateriiKwh,
    socStartPct: input.socStartPct ?? 0,
    grzalkiBmsKwh: input.grzalkiBmsKwh,
    bojlerL: input.bojlerL,
  }
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const zBojlerem = input.bojlerL > 0
  if (
    input.energiaOknaKwh === 0 ||
    input.pojemnoscBateriiKwh === 0 ||
    input.socStartPct === null ||
    (zBojlerem && (input.bojlerTStartC === null || input.bojlerTCelC === null))
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const doPodzialu = input.energiaOknaKwh - input.zuzycieWOknieKwh
  if (doPodzialu < 0) warnings.push(oknoNiePokrywaZuzycia(-doPodzialu))
  let reszta = Math.max(0, doPodzialu)
  const wez = (potrzeba: number) => {
    const e = Math.min(reszta, Math.max(0, potrzeba))
    reszta -= e
    return e
  }

  const C = input.pojemnoscBateriiKwh
  const soc0 = input.socStartPct
  const naGrzalkiBmsKwh = wez(input.grzalkiBmsKwh)
  const bmsGotowy = naGrzalkiBmsKwh >= input.grzalkiBmsKwh
  let naBaterieKwh = bmsGotowy ? wez((C * (PROG_SOC_BOJLER_PCT - soc0)) / 100) : 0
  const socPo1 = soc0 + (naBaterieKwh / C) * 100

  let naBojlerKwh = 0
  let bojlerTKoniecC: number | null = null
  if (zBojlerem) {
    const tStart = input.bojlerTStartC!
    const tCel = input.bojlerTCelC!
    const kwhNaK = input.bojlerL * WSPOLCZYNNIK_KWH_NA_L_K
    if (bmsGotowy && socPo1 >= PROG_SOC_BOJLER_PCT) naBojlerKwh = wez(kwhNaK * (tCel - tStart))
    bojlerTKoniecC = tStart + naBojlerKwh / kwhNaK
    if (bojlerTKoniecC < tCel) warnings.push(bojlerNiedogrzany(bojlerTKoniecC, tCel))
  }
  if (bmsGotowy) naBaterieKwh += wez((C * (100 - socPo1)) / 100)
  const nadwyzkaKwh = reszta < 1e-9 ? 0 : reszta
  if (nadwyzkaKwh === 0) warnings.push(brakNadwyzki())

  const assumptions: Assumption[] = [
    { kod: "OKNO-ZALOZENIE-KOLEJNOSC", params: { prog: PROG_SOC_BOJLER_PCT } },
    { kod: "OKNO-ZALOZENIE-BEZ-STRAT" },
  ]
  return {
    ...baza,
    value: {
      energiaDoPodzialuKwh: Math.max(0, doPodzialu),
      naGrzalkiBmsKwh,
      naBaterieKwh,
      naBojlerKwh,
      nadwyzkaKwh,
      socKoniecPct: soc0 + (naBaterieKwh / C) * 100,
      bojlerTKoniecC,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
