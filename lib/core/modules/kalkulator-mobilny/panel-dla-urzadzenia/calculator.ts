import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { PanelDlaUrzadzeniaInput } from "./input"
import { validateInput } from "./validation"
import { panelZaMaly, pochmurneDni } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E = P \\times h, \\quad P_{panel} = \\dfrac{E}{h_{sł} \\times u}"

export type PanelDlaUrzadzeniaResult = {
  /** Zużycie urządzenia na dobę [Wh]. */
  zuzycieWh: number
  /** Minimalna moc panelu [W]. */
  minimalnaMocPaneluW: number
  /** Produkcja posiadanego panelu na dobę [Wh]; 0 = nie podano panelu. */
  produkcjaPosiadanegoWh: number
}

const PUSTY_WYNIK: PanelDlaUrzadzeniaResult = { zuzycieWh: 0, minimalnaMocPaneluW: 0, produkcjaPosiadanegoWh: 0 }

/**
 * Ekran 6, Moduł 12 — "Szybki dobór paneli PV dla pojedynczego urządzenia" (dawne 8.6, Biblia §12.6).
 * Zużycie E = P × h; panel = E / (godziny słońca × uzysk). Przykład Biblii: lodówka 50 W × 8 h = 400 Wh,
 * „panel 150 W wystarczy” — przy uzysku 70% z przykładu źródła to 400 / (150 × 0,7) ≈ 3,8 h słońca.
 * Bilans dobowy bez magazynowania: urządzenie pracujące nocą potrzebuje akumulatora (E4/E1).
 */
export function calculatePanelDlaUrzadzenia(input: PanelDlaUrzadzeniaInput): CalcResult<PanelDlaUrzadzeniaResult> {
  const { errors } = validateInput(input)
  const inputs = { ...input }
  const baza = { unit: "W", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (input.mocUrzadzeniaW === 0 || input.godzinPracy === 0 || input.godzinSlonca === 0 || input.uzyskPct === 0) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const uzysk = input.uzyskPct / 100
  const zuzycieWh = input.mocUrzadzeniaW * input.godzinPracy
  const minimalnaMocPaneluW = zuzycieWh / (input.godzinSlonca * uzysk)
  const produkcjaPosiadanegoWh = input.posiadanyPanelW * input.godzinSlonca * uzysk

  const warnings: Warning[] = []
  if (input.posiadanyPanelW > 0 && input.posiadanyPanelW < minimalnaMocPaneluW) {
    warnings.push(panelZaMaly(input.posiadanyPanelW, minimalnaMocPaneluW))
  }
  warnings.push(pochmurneDni())
  const assumptions: Assumption[] = [{ kod: "PU-ZALOZENIE-BILANS-DOBOWY" }]
  return {
    ...baza,
    value: { zuzycieWh, minimalnaMocPaneluW, produkcjaPosiadanegoWh },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
