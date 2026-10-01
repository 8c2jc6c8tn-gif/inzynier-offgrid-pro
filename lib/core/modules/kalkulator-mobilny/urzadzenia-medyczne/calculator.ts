import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { MINIMUM_DOB_MEDYCZNE } from "./constants"
import type { UrzadzeniaMedyczneInput } from "./input"
import { validateInput } from "./validation"
import { brakZapasowegoZrodla, ponizejMinimumDob, rozwazZasilanieDc, sprawdzZasilanieZProducentem } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_d = P \\times h, \\quad C_{min} = \\dfrac{E_d \\times d_{min}}{U \\times u \\times \\eta_f}, \\quad d = \\dfrac{C \\times U \\times u \\times \\eta_f}{E_d}"

export type UrzadzeniaMedyczneResult = {
  zuzycieDobaWh: number
  /** Minimalny akumulator na MINIMUM_DOB_MEDYCZNE dób [Ah]. */
  minimalnyAh: number
  /** Ile dób podtrzyma posiadany akumulator; 0 = nie podano. */
  dobyPosiadany: number
}

const PUSTY_WYNIK: UrzadzeniaMedyczneResult = { zuzycieDobaWh: 0, minimalnyAh: 0, dobyPosiadany: 0 }

/**
 * Ekran 26, Moduł 12 — "Zasilanie urządzeń medycznych" (dawne 8.51, Biblia §12.39). Akumulator na minimum
 * 2 doby pracy urządzenia (Biblia §12.39); poniżej → 🟡 (decyzja właściciela 30.09.2026 zamiast 🔴 z Treści),
 * brak drugiego niezależnego źródła → 🟡 zawsze. Przykład Biblii "CPAP 60 W × 8 h = 0,48 kWh; LiFePO4 100 Ah
 * (1,2 kWh) wystarczy na 2 noce" — przy pełnej pojemności 1200 / 480 = 2,5 doby, więc "2 noce" mieści się
 * dopiero z częścią użyteczną 80% (odtworzone w teście). Przeliczenie dla systemów krytycznych domu — M2/E1.
 */
export function calculateUrzadzeniaMedyczne(input: UrzadzeniaMedyczneInput): CalcResult<UrzadzeniaMedyczneResult> {
  const { errors } = validateInput(input)
  const inputs = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  const baza = { unit: "Ah", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    input.mocW === 0 ||
    input.godzinNaDobe === 0 ||
    input.napiecieV === 0 ||
    input.uzytecznaPct === 0 ||
    input.przezFalownik === null ||
    (input.przezFalownik && input.sprawnoscFalownikaPct === 0)
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zuzycieDobaWh = input.mocW * input.godzinNaDobe
  const etaF = input.przezFalownik ? input.sprawnoscFalownikaPct / 100 : 1
  const whNaAh = input.napiecieV * (input.uzytecznaPct / 100) * etaF
  const minimalnyAh = (zuzycieDobaWh * MINIMUM_DOB_MEDYCZNE) / whNaAh
  const dobyPosiadany = input.posiadanyAh > 0 ? (input.posiadanyAh * whNaAh) / zuzycieDobaWh : 0

  const warnings: Warning[] = []
  if (input.posiadanyAh > 0 && dobyPosiadany < MINIMUM_DOB_MEDYCZNE) {
    warnings.push(ponizejMinimumDob(dobyPosiadany, minimalnyAh, MINIMUM_DOB_MEDYCZNE))
  }
  if (input.maZapasoweZrodlo !== true) warnings.push(brakZapasowegoZrodla())
  if (input.przezFalownik) warnings.push(rozwazZasilanieDc())
  warnings.push(sprawdzZasilanieZProducentem())

  return {
    ...baza,
    value: { zuzycieDobaWh, minimalnyAh, dobyPosiadany },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "MED-ZALOZENIE-BEZ-LADOWANIA", params: { doby: MINIMUM_DOB_MEDYCZNE } }],
    warnings,
  }
}
