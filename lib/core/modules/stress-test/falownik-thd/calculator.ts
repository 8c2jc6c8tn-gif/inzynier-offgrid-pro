import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { FalownikThdInput } from "./input"
import { validateInput } from "./validation"
import { obciazeniePrzekraczaDostepna, thdPozaTabela } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

/** Numerical tolerance for „load above the available power” (floating point noise must not raise a verdict). */
const EPS = 1e-9

export type FalownikThdResult = {
  /** Derating coefficient k read from the table at the given THD (linear interpolation), 0..1. */
  wspolczynnik: number
  /** Active power the inverter can deliver at this THD: P_nom · k [kW]. */
  dostepnaKw: number
  /** Available power minus the load [kW] (negative = the load is too big). */
  zapasKw: number
  /** The margin as a share of the available power [%]; null when the available power is 0. */
  zapasPct: number | null
  przekroczone: boolean
}

const PUSTY: FalownikThdResult = { wspolczynnik: 0, dostepnaKw: 0, zapasKw: 0, zapasPct: null, przekroczone: false }

const FORMULA = "k = k_i + \\frac{THD - THD_i}{THD_{i+1} - THD_i}(k_{i+1} - k_i);\\ P_{av} = P_{nom} \\cdot k;\\ \\Delta P = P_{av} - P_{load}"

/**
 * Module 7 — Screen 24 „Falownik przy odkształconych obciążeniach (THD)” (dawne 6.38→7.36).
 *
 * The coefficient k comes ONLY from the user's table (the inverter's datasheet): the source states no formula and
 * its illustration (25% → 4.1 kW of 5 kW) is not reproduced by any physical law that could be assumed here. Between
 * two table points k is interpolated linearly; outside the table there is no extrapolation (OUT_OF_SCOPE).
 * Verdict: 🔴 when the load is above P_nom·k, otherwise 🟢 — no 🟡 threshold (the source gives none); the margin in
 * kW and % is reported instead.
 */
export function calculateFalownikThd(input: FalownikThdInput): CalcResult<FalownikThdResult> {
  const { errors } = validateInput(input)
  const inputs = {
    mocZnamionowaKw: input.mocZnamionowaKw,
    mocObciazeniaKw: input.mocObciazeniaKw,
    ...(input.thdPct !== null ? { thdPct: input.thdPct } : {}),
    punktowTabeli: input.tabela.length,
  }
  const baza = { unit: "kW", formula: FORMULA, formulaKey: "UI-FORMULA-STRESS-TEST-FALOWNIK-THD", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.mocZnamionowaKw === 0 || input.mocObciazeniaKw === 0 || input.thdPct === null || input.tabela.length < 2) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const thd = input.thdPct
  const tabela = input.tabela
  const min = tabela[0]!.thdPct
  const max = tabela[tabela.length - 1]!.thdPct
  if (thd < min || thd > max) {
    return { ...baza, value: PUSTY, status: "OUT_OF_SCOPE", assumptions: [], warnings: [thdPozaTabela(thd, min, max)] }
  }

  let k = tabela[tabela.length - 1]!.wspolczynnik
  for (let i = 0; i < tabela.length - 1; i++) {
    const a = tabela[i]!
    const b = tabela[i + 1]!
    if (thd >= a.thdPct && thd <= b.thdPct) {
      k = a.wspolczynnik + ((thd - a.thdPct) / (b.thdPct - a.thdPct)) * (b.wspolczynnik - a.wspolczynnik)
      break
    }
  }

  const dostepna = input.mocZnamionowaKw * k
  const zapas = dostepna - input.mocObciazeniaKw
  const przekroczone = input.mocObciazeniaKw > dostepna + EPS
  const warnings: Warning[] = przekroczone ? [obciazeniePrzekraczaDostepna(input.mocObciazeniaKw, dostepna)] : []
  const assumptions: Assumption[] = [{ kod: "FTHD-ZALOZENIE-TABELA-PRODUCENTA" }, { kod: "FTHD-ZALOZENIE-INTERPOLACJA-LINIOWA" }]

  return {
    ...baza,
    value: { wspolczynnik: k, dostepnaKw: dostepna, zapasKw: zapas, zapasPct: dostepna > 0 ? (zapas / dostepna) * 100 : null, przekroczone },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
