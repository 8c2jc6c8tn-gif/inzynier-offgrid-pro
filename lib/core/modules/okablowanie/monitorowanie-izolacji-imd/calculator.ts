import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { MonitorowanieIzolacjiImdInput } from "./input"
import { validateInput } from "./validation"
import { imdZainstalowanyPoprawnie, ukladItBezImd, ukladNieItImdNiepotrzebny } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type MonitorowanieIzolacjiImdResult = {
  wymagany: boolean
}

function pusty(): MonitorowanieIzolacjiImdResult {
  return { wymagany: false }
}

/**
 * Ekran 18, Moduł 5 "Okablowanie i zabezpieczenia" — "Monitorowanie izolacji (IMD)" (dawne 4.17,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). W układzie IT pierwsze doziemienie nie wyłącza
 * bezpiecznika (brak bezpośredniego uziemienia punktu neutralnego) — IMD wyłapuje problem, zanim
 * stanie się groźny. W układach TN/TT (ukladIt=false) IMD nie jest wymagany — 1:1 ze źródła.
 */
export function calculateMonitorowanieIzolacjiImd(
  input: MonitorowanieIzolacjiImdInput,
): CalcResult<MonitorowanieIzolacjiImdResult> {
  const { errors } = validateInput(input)
  const inputs = { progAlarmuKOm: input.progAlarmuKOm }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "kΩ",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (!input.ukladIt) {
    return {
      value: { wymagany: false },
      unit: "kΩ",
      status: "VALID",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [ukladNieItImdNiepotrzebny()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (!input.maZainstalowanyImd) {
    return {
      value: { wymagany: true },
      unit: "kΩ",
      status: "VALID_WITH_WARNINGS",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [ukladItBezImd()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.progAlarmuKOm === 0) {
    return {
      value: { wymagany: true },
      unit: "kΩ",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings: Warning[] = [imdZainstalowanyPoprawnie(input.progAlarmuKOm)]

  return {
    value: { wymagany: true },
    unit: "kΩ",
    status: "VALID",
    formula: "",
    inputs,
    assumptions: [{ kod: "IMD-PROG-ALARMU-PRZYKLADOWA-WARTOSC-ZRODLA" }],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
