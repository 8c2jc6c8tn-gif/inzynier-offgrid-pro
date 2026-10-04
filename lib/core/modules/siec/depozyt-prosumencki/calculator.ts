import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import { DANE_ROZLICZEN, wartoscWDniu, type Rozliczenia } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { DepozytInput } from "./input"
import { validateInput } from "./validation"
import { decyzjaJednokierunkowa, poza123, utrataPrzyOdejsciu, wykorzystanoPonadDepozyt } from "./warnings"

export const CALCULATOR_VERSION = "1.0.1"

export type DepozytResult = {
  /** Value of the energy fed in: E × price [zł]. */
  wartoscEnergiiZl: number
  /** Deposit for the month: value × statutory coefficient (data file) [zł]. */
  depozytZl: number
  /** Maximum refund of the unused part: statutory share (RCEm / RCE, data file) of the energy value [zł]. */
  maksZwrotZl: number
  /** null when `wykorzystanoZl` is not given. */
  niewykorzystanoZl: number | null
  zwrotZl: number | null
  umorzenieZl: number | null
  /** RCE value of 1 kWh surplus ÷ full gross cost of 1 kWh drawn (✏️ K14); null without that cost. */
  wspolczynnikBilansowania: number | null
}

const FORMULA =
  "W = E \\cdot c_{RCE}; \\ D = W \\cdot k_{dep}; \\ zwrot = \\min(D - wyk,\\ p \\cdot W); \\ " +
  "umorzenie = D - wyk - zwrot; \\ w_{bil} = c_{RCE} / c_{kWh,brutto}"

/** k_dep and p are dated statutory rates from the data file — shown with the values for the month, never retyped. */
function formulaZeStawkami(wsp: number, zwrotStawka: number): string {
  return `${FORMULA}; \\ k_{dep} = ${latexLiczba(wsp.toFixed(2))},\\ p = ${Math.round(zwrotStawka * 100)}\\%`
}

export function calculateDepozyt(input: DepozytInput, dane: Rozliczenia = DANE_ROZLICZEN): CalcResult<DepozytResult> {
  const pusty: DepozytResult = {
    wartoscEnergiiZl: 0,
    depozytZl: 0,
    maksZwrotZl: 0,
    niewykorzystanoZl: null,
    zwrotZl: null,
    umorzenieZl: null,
    wspolczynnikBilansowania: null,
  }
  const inputs = { energiaOddanaKwh: input.energiaOddanaKwh, cenaRynkowaZlMwh: input.cenaRynkowaZlMwh }
  const base: Pick<CalcResult<DepozytResult>, "unit" | "formula" | "formulaKey" | "formulaParams" | "inputs" | "calculatorVersion"> = {
    unit: "zł",
    formula: FORMULA,
    formulaKey: "UI-FORMULA-SIEC-DEPOZYT-PROSUMENCKI",
    inputs,
    calculatorVersion: CALCULATOR_VERSION,
  }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const p = dane.prosument
  const wsp = wartoscWDniu(p.wspolczynnikDepozytu.okresy, input.dataMiesiaca)
  const zwrotStawka = wartoscWDniu(
    (input.systemCeny === "rcem" ? p.zwrotDepozytuMaksRcem : p.zwrotDepozytuMaksRce).okresy,
    input.dataMiesiaca,
  )
  if (wsp === null || zwrotStawka === null) {
    return { ...base, value: pusty, status: "OUT_OF_SCOPE", assumptions: [], warnings: [poza123(input.dataMiesiaca)] }
  }
  base.formula = formulaZeStawkami(wsp, zwrotStawka)
  base.formulaKey = "UI-FORMULA-SIEC-DEPOZYT-PROSUMENCKI-STAWKI"
  base.formulaParams = { kdep: latexLiczba(wsp.toFixed(2)), p: Math.round(zwrotStawka * 100) }
  if (input.energiaOddanaKwh === 0 || input.cenaRynkowaZlMwh === 0) {
    return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const cenaZlKwh = input.cenaRynkowaZlMwh / 1000
  const wartoscEnergiiZl = input.energiaOddanaKwh * cenaZlKwh
  const depozytZl = wartoscEnergiiZl * wsp
  const maksZwrotZl = wartoscEnergiiZl * zwrotStawka

  const warnings: Warning[] = []
  let niewykorzystanoZl: number | null = null
  let zwrotZl: number | null = null
  let umorzenieZl: number | null = null
  if (input.wykorzystanoZl !== null) {
    if (input.wykorzystanoZl > depozytZl) {
      return {
        ...base,
        value: pusty,
        status: "INVALID_INPUT",
        assumptions: [],
        warnings: [wykorzystanoPonadDepozyt(input.wykorzystanoZl, depozytZl)],
      }
    }
    niewykorzystanoZl = depozytZl - input.wykorzystanoZl
    zwrotZl = Math.min(niewykorzystanoZl, maksZwrotZl)
    umorzenieZl = niewykorzystanoZl - zwrotZl
  }
  warnings.push(utrataPrzyOdejsciu(), decyzjaJednokierunkowa())

  const assumptions: Assumption[] = [
    { kod: "SIEC-DEPOZYT-ZALOZENIE-PODSTAWA", params: { wsp: wsp.toFixed(2), zwrot: Math.round(zwrotStawka * 100) } },
    { kod: "SIEC-DEPOZYT-ZALOZENIE-UJEMNA-RCE" },
  ]

  return {
    ...base,
    value: {
      wartoscEnergiiZl,
      depozytZl,
      maksZwrotZl,
      niewykorzystanoZl,
      zwrotZl,
      umorzenieZl,
      wspolczynnikBilansowania:
        input.pelnyKosztKwhBruttoZl !== null && input.pelnyKosztKwhBruttoZl > 0 ? cenaZlKwh / input.pelnyKosztKwhBruttoZl : null,
    },
    status: "VALID_WITH_WARNINGS",
    assumptions,
    warnings,
  }
}
