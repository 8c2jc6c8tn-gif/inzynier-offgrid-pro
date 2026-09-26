import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { MostkiTermiczneInput } from "./input"
import { validateInput } from "./validation"
import { nadprozeBezIzolacji, psiOdUzytkownika, temperaturaWewnetrznaNieWyzsza } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type StrataMostka = {
  nazwa: string
  /** H = Ψ·l [W/K]. */
  hWK: number
  strataW: number
  /** Loss after the planned fix [W]; `null` when no Ψ after the fix was entered (then equals `strataW` in sums). */
  strataPoPoprawieW: number | null
}

export type MostkiTermiczneResult = {
  mostki: StrataMostka[]
  /** Σ Ψ·l [W/K]. */
  hMostkowWK: number
  strataMostkowW: number
  /** Ekran 1 load + bridges [W]; `null` without Ekran 1. */
  obciazenieZMostkamiW: number | null
  /** Bridges' share of the total heat loss [%]; `null` without Ekran 1. */
  udzialMostkowPct: number | null
  /** `null` when no bridge has Ψ after the fix. */
  strataMostkowPoPoprawieW: number | null
  udzialMostkowPoPoprawiePct: number | null
}

const FORMULA =
  "H_{tb} = \\sum_l \\Psi_l \\, l_l,\\quad \\Phi_{tb} = H_{tb} (\\theta_i - \\theta_e),\\quad " +
  "udział = \\frac{\\Phi_{tb}}{\\Phi_{E1} + \\Phi_{tb}}"

/**
 * Moduł 6, Ekran 7 "Mostki termiczne" (dawne 5.7). Heat flow through linear thermal bridges added to the
 * Ekran 1 heat loss (which has none — its warning OC-BEZ-PN-EN-12831). Source example (Sekcja C): "mostki
 * to 12% całkowitych strat ... izolacja ościeży zmniejszy je o 4%" — illustration, reproduced by the share
 * formula for matching inputs (test), not a value to assume.
 */
export function calculateMostkiTermiczne(input: MostkiTermiczneInput): CalcResult<MostkiTermiczneResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  input.mostki.forEach((m, i) => {
    if (m.dlugoscM !== null) inputs[`mostek${i + 1}DlugoscM`] = m.dlugoscM
    if (m.psiWmK !== null) inputs[`mostek${i + 1}Psi`] = m.psiWmK
    if (m.psiPoPoprawieWmK !== null) inputs[`mostek${i + 1}PsiPoPoprawie`] = m.psiPoPoprawieWmK
  })
  const wynik = (
    status: CalcResult<MostkiTermiczneResult | null>["status"],
    value: MostkiTermiczneResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<MostkiTermiczneResult | null> => ({
    value,
    unit: "W",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { temperaturaWewnetrznaC: ti, temperaturaZewnetrznaC: te, obciazenieBezMostkowW: e1 } = input
  // A bridge without length or Ψ would silently lower the result — wait for complete data.
  const kompletne = input.mostki.every((m) => m.dlugoscM !== null && m.psiWmK !== null)
  if (ti === null || te === null || input.mostki.length === 0 || !kompletne) return wynik("INCOMPLETE", null, [])
  if (ti <= te) return wynik("INVALID_INPUT", null, [temperaturaWewnetrznaNieWyzsza(ti, te)])

  const dT = ti - te
  const mostki: StrataMostka[] = input.mostki.map((m, i) => {
    const hWK = m.psiWmK! * m.dlugoscM!
    return {
      nazwa: m.nazwa || `Mostek ${i + 1}`,
      hWK,
      strataW: hWK * dT,
      strataPoPoprawieW: m.psiPoPoprawieWmK === null ? null : m.psiPoPoprawieWmK * m.dlugoscM! * dT,
    }
  })
  const hMostkowWK = mostki.reduce((a, m) => a + m.hWK, 0)
  const strataMostkowW = hMostkowWK * dT
  const jestPoprawa = mostki.some((m) => m.strataPoPoprawieW !== null)
  const strataMostkowPoPoprawieW = jestPoprawa ? mostki.reduce((a, m) => a + (m.strataPoPoprawieW ?? m.strataW), 0) : null
  const udzial = (strata: number) => {
    if (e1 === null) return null
    const calosc = e1 + strata
    return calosc > 0 ? (100 * strata) / calosc : null
  }

  const warnings: Warning[] = [psiOdUzytkownika()]
  input.mostki.forEach((m, i) => {
    if (m.nadprozeBezIzolacji) warnings.push(nadprozeBezIzolacji(mostki[i]!.nazwa))
  })
  const assumptions: Assumption[] = [
    { kod: "MT-ZALOZENIE-TEMPERATURY", params: { ti, te } },
    { kod: "MT-ZALOZENIE-WYMIARY" },
  ]

  return wynik(
    "VALID_WITH_WARNINGS",
    {
      mostki,
      hMostkowWK,
      strataMostkowW,
      obciazenieZMostkamiW: e1 === null ? null : e1 + strataMostkowW,
      udzialMostkowPct: udzial(strataMostkowW),
      strataMostkowPoPoprawieW,
      udzialMostkowPoPoprawiePct: strataMostkowPoPoprawieW === null ? null : udzial(strataMostkowPoPoprawieW),
    },
    warnings,
    assumptions,
  )
}
