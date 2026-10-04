import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { PaneleBifacjalneInput } from "./input"
import { validateInput } from "./validation"
import { trawaNiskiZysk, dobraPowierzchnia } from "./warnings"

// 🔎 TD12 (dlug-techniczny.md): współczynnik bifacjalności panelu (70-90%) świadomie NIE jest
// osobnym polem — źródło nie podaje wzoru łączącego go z już podanymi zakresami % uzysku.
export const CALCULATOR_VERSION = "1.0.0"

export type PaneleBifacjalneResult = {
  dodatkowyUzyskKwh: number
  calkowityUzyskKwh: number
}

const FORMULA =
  "E_{dodatkowa} = E_{bazowa} \\times \\frac{uzysk_{\\%}}{100} \\;\\; ; \\;\\; E_{całkowita} = E_{bazowa} + E_{dodatkowa}"

/**
 * Ekran 16, Moduł 3 "Instalacja PV" — "Panele bifacjalne" (dawne 2.31,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Wzorzec D). Dodatkowy uzysk z tylnej strony to
 * procent bazowego (przedniego) uzysku rocznego, w zakresie zależnym od albedo powierzchni pod
 * spodem (1:1 ze źródła). Procent jest polem ręcznego wpisu (D16) — źródło nie podaje jednej
 * liczby, tylko zakres per typ powierzchni; przykład źródła ("jasny beton → 12%") mieści się w
 * podanym zakresie (8-15%) i jest odtwarzalny dokładnie przy wpisaniu 12%.
 *
 * Współczynnik bifacjalności panelu (70-90%, "z bazy komponentów") NIE jest tu osobnym polem —
 * źródło nie podaje wzoru łączącego go z już podanymi zakresami % per powierzchnia (te zakresy
 * to bezpośrednio końcowy efekt, nie surowy współczynnik do dalszego przeliczenia). Wymyślanie
 * takiej formuły łączącej naruszałoby Dyrektywę #1.
 */
export function calculatePaneleBifacjalne(input: PaneleBifacjalneInput): CalcResult<PaneleBifacjalneResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PaneleBifacjalneResult = { dodatkowyUzyskKwh: 0, calkowityUzyskKwh: 0 }
  const inputs = {
    mocRocznaBazowaKwh: input.mocRocznaBazowaKwh,
    dodatkowyUzyskPct: input.dodatkowyUzyskPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-PV-PANELE-BIFACJALNE",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.mocRocznaBazowaKwh === 0 || input.typPowierzchni === null || input.dodatkowyUzyskPct === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-PV-PANELE-BIFACJALNE",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const dodatkowyUzyskKwh = input.mocRocznaBazowaKwh * (input.dodatkowyUzyskPct / 100)
  const calkowityUzyskKwh = input.mocRocznaBazowaKwh + dodatkowyUzyskKwh

  const warnings =
    input.typPowierzchni === "trawa" ? [trawaNiskiZysk()] : [dobraPowierzchnia(dodatkowyUzyskKwh)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { dodatkowyUzyskKwh, calkowityUzyskKwh },
    unit: "kWh",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-PV-PANELE-BIFACJALNE",
    inputs,
    assumptions: [{ kod: "PROCENT-UZYSKU-RECZNIE" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
