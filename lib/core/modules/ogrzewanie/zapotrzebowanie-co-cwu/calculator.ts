import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { CWU_L_NA_OSOBE_ZRODLO_M6, DNI_MIESIECY, WSPOLCZYNNIK_KWH_NA_L_K } from "./constants"
import type { ZapotrzebowanieCoCwuInput } from "./input"
import { validateInput } from "./validation"
import { brakMiesiecyCo, cwuBezStratZasobnika, cwuNieCieplejsza } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type MiesiacCoCwu = {
  /** 1–12. */
  miesiac: number
  /** Mean daily space-heating heat in the month: Q_m / d_m [kWh/day]. */
  coKwhDoba: number
  cwuKwhDoba: number
  razemKwhDoba: number
  coKwhMiesiac: number
  cwuKwhMiesiac: number
  /** Electricity per day for both, when the COP of that part is given; otherwise `null`. */
  pradKwhDoba: number | null
  /** C.W.U. share of the day's heat [%]. */
  udzialCwuPct: number
}

export type ZapotrzebowanieCoCwuResult = {
  cwuLitrowDoba: number
  /** ΔT = t_CWU − t_zimna [K]. */
  deltaTK: number
  /** Same every day of the year (source: "C.W.U. jest w miarę stałe cały rok"). */
  cwuKwhDoba: number
  cwuPradKwhDoba: number | null
  /** `null` when E1 has no monthly heat. */
  miesiace: MiesiacCoCwu[] | null
  coSumaKwh: number | null
  cwuSumaMiesiecyKwh: number | null
}

const FORMULA =
  "E_{CWU} = n \\cdot V_{os} \\cdot (\\theta_{CWU} - \\theta_{zimna}) \\cdot \\frac{c_w}{3{,}6\\cdot 10^6},\\quad " +
  "E_{CO,doba} = \\frac{Q_{m}}{d_m},\\quad E_{el} = \\frac{E_{CO}}{COP_{CO}} + \\frac{E_{CWU}}{COP_{CWU}}"

/**
 * Moduł 6, Ekran 2 "Zapotrzebowanie na C.O. i C.W.U." (dawne 5.2). C.O.: monthly heat of E1 turned into
 * a mean day of that month (echo of E1 — the "heating curve" dependency on outdoor temperature is already
 * inside E1's monthly figures). C.W.U.: Q = m·c·ΔT, echo of M2/E2 `bojler-cwu` (same water constant).
 *
 * Source example (Sekcja C): "C.O. (styczeń): 40 kWh/dobę, C.W.U.: 10 kWh/dobę" — illustration, not
 * reproducible without the house and ΔT; e.g. 4 people × 50 l × 43 K gives 10,0 kWh.
 */
export function calculateZapotrzebowanieCoCwu(input: ZapotrzebowanieCoCwuInput): CalcResult<ZapotrzebowanieCoCwuResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  input.cieploCoMiesiaceKwh.forEach((q, i) => {
    if (q !== null) inputs[`cieploCoMiesiac${i + 1}Kwh`] = q
  })
  const wynik = (
    status: CalcResult<ZapotrzebowanieCoCwuResult | null>["status"],
    value: ZapotrzebowanieCoCwuResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<ZapotrzebowanieCoCwuResult | null> => ({
    value,
    unit: "kWh/dobę",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { liczbaOsob, cwuLitrowNaOsobeDoba, temperaturaZimnejWodyC: tZimna, temperaturaCwuC: tCwu, copCo, copCwu } = input
  if (liczbaOsob === null || cwuLitrowNaOsobeDoba === null || tZimna === null || tCwu === null) {
    return wynik("INCOMPLETE", null, [])
  }
  if (tCwu <= tZimna) return wynik("INVALID_INPUT", null, [cwuNieCieplejsza(tCwu, tZimna)])

  const cwuLitrowDoba = liczbaOsob * cwuLitrowNaOsobeDoba
  const deltaTK = tCwu - tZimna
  const cwuKwhDoba = cwuLitrowDoba * deltaTK * WSPOLCZYNNIK_KWH_NA_L_K
  const cwuPradKwhDoba = copCwu === null ? null : cwuKwhDoba / copCwu

  const miesiace: MiesiacCoCwu[] = []
  input.cieploCoMiesiaceKwh.forEach((q, i) => {
    if (q === null || i >= DNI_MIESIECY.length) return
    const dni = DNI_MIESIECY[i]!
    const coKwhDoba = q / dni
    const razemKwhDoba = coKwhDoba + cwuKwhDoba
    miesiace.push({
      miesiac: i + 1,
      coKwhDoba,
      cwuKwhDoba,
      razemKwhDoba,
      coKwhMiesiac: q,
      cwuKwhMiesiac: cwuKwhDoba * dni,
      pradKwhDoba: copCo === null || cwuPradKwhDoba === null ? null : coKwhDoba / copCo + cwuPradKwhDoba,
      udzialCwuPct: razemKwhDoba > 0 ? (100 * cwuKwhDoba) / razemKwhDoba : 0,
    })
  })

  const warnings: Warning[] = [cwuBezStratZasobnika()]
  if (miesiace.length === 0) warnings.push(brakMiesiecyCo())
  const assumptions: Assumption[] = [
    { kod: "COCWU-ZALOZENIE-LITRY", params: { litry: cwuLitrowNaOsobeDoba, zrodlo: CWU_L_NA_OSOBE_ZRODLO_M6 } },
    { kod: "COCWU-ZALOZENIE-STALA-TEMP-WODY", params: { tZimna, tCwu } },
    { kod: "COCWU-ZALOZENIE-CO-Z-EKRANU-1" },
  ]
  if (copCo !== null) assumptions.push({ kod: "COCWU-ZALOZENIE-COP-CO", params: { cop: copCo } })
  if (copCwu !== null) assumptions.push({ kod: "COCWU-ZALOZENIE-COP-CWU", params: { cop: copCwu } })

  return wynik(
    "VALID_WITH_WARNINGS",
    {
      cwuLitrowDoba,
      deltaTK,
      cwuKwhDoba,
      cwuPradKwhDoba,
      miesiace: miesiace.length > 0 ? miesiace : null,
      coSumaKwh: miesiace.length > 0 ? miesiace.reduce((a, m) => a + m.coKwhMiesiac, 0) : null,
      cwuSumaMiesiecyKwh: miesiace.length > 0 ? miesiace.reduce((a, m) => a + m.cwuKwhMiesiac, 0) : null,
    },
    warnings,
    assumptions,
  )
}
