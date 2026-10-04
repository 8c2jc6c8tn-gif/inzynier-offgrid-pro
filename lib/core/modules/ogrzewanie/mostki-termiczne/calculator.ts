import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { Mostek, MostkiTermiczneInput } from "./input"
import { pozycjaKatalogu, type SystemWymiarow } from "./katalog-psi"
import { validateInput } from "./validation"
import { nadprozeBezIzolacji, psiOdUzytkownika, psiZTablicyA2, temperaturaWewnetrznaNieWyzsza } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

export type StrataMostka = {
  nazwa: string
  /** Ψ used [W/(m·K)] — typed by the user or from Tablica A.2. */
  psiWmK: number
  /** Tablica A.2 detail code when Ψ comes from the table. */
  kodKatalogu: string | null
  /** Ψ after the fix used [W/(m·K)]; `null` when none. */
  psiPoPoprawieWmK: number | null
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
    formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-MOSTKI-TERMICZNE",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { temperaturaWewnetrznaC: ti, temperaturaZewnetrznaC: te, obciazenieBezMostkowW: e1 } = input
  const system = input.systemWymiarow ?? null
  const psi = input.mostki.map((m) => ({
    przed: psiMostka(m.kodKatalogu, m.psiWmK, system),
    po: psiMostka(m.kodKataloguPoPoprawie, m.psiPoPoprawieWmK, system),
  }))
  // A bridge without length or Ψ (also: table code without the dimension system) would silently lower the result.
  const kompletne = input.mostki.every(
    (m, i) => m.dlugoscM !== null && psi[i]!.przed !== null && (psi[i]!.po !== null || !maKod(m.kodKataloguPoPoprawie)),
  )
  if (ti === null || te === null || input.mostki.length === 0 || !kompletne) return wynik("INCOMPLETE", null, [])
  if (ti <= te) return wynik("INVALID_INPUT", null, [temperaturaWewnetrznaNieWyzsza(ti, te)])

  const dT = ti - te
  const mostki: StrataMostka[] = input.mostki.map((m, i) => {
    const { przed, po } = psi[i]!
    const hWK = przed! * m.dlugoscM!
    return {
      nazwa: m.nazwa || `Mostek ${i + 1}`,
      psiWmK: przed!,
      kodKatalogu: maKod(m.kodKatalogu) ? m.kodKatalogu! : null,
      psiPoPoprawieWmK: po,
      hWK,
      strataW: hWK * dT,
      strataPoPoprawieW: po === null ? null : po * m.dlugoscM! * dT,
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

  const zTablicy = input.mostki.some((m) => maKod(m.kodKatalogu) || maKod(m.kodKataloguPoPoprawie))
  const odUzytkownika = input.mostki.some((m) => !maKod(m.kodKatalogu) || (!maKod(m.kodKataloguPoPoprawie) && m.psiPoPoprawieWmK !== null))
  const warnings: Warning[] = []
  if (odUzytkownika) warnings.push(psiOdUzytkownika())
  if (zTablicy) warnings.push(psiZTablicyA2())
  input.mostki.forEach((m, i) => {
    if (m.nadprozeBezIzolacji) warnings.push(nadprozeBezIzolacji(mostki[i]!.nazwa))
  })
  const assumptions: Assumption[] = [
    { kod: "MT-ZALOZENIE-TEMPERATURY", params: { ti, te } },
    { kod: "MT-ZALOZENIE-WYMIARY" },
  ]
  if (zTablicy && system !== null) assumptions.push({ kod: `MT-ZALOZENIE-SYSTEM-${system.toUpperCase()}` })

  return wynik(
    // Info-level notes never raise the status (Dyrektywa AI #6).
    warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
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

const maKod = (kod: Mostek["kodKatalogu"]): boolean => kod != null && kod !== ""

/** Ψ from Tablica A.2 when a detail code is given (needs the dimension system), else the value typed by the user. */
function psiMostka(kod: Mostek["kodKatalogu"], wpisane: number | null, system: SystemWymiarow | null): number | null {
  if (!maKod(kod)) return wpisane
  if (system === null) return null
  return pozycjaKatalogu(kod!)!.psi[system]
}
