import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { LaczeniePaneliPrzenosnychInput } from "./input"
import { validateInput } from "./validation"
import { adapterSprawdz, powerbankNieLaczyc, roznePanele, sprawdzNapiecie, usbNieLaczyc, zlaczaNiezgodne } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "szeregowo: U = \\sum U_i,\\ I = \\min I_i; \\quad równolegle: U = \\min U_i,\\ I = \\sum I_i"

export type LaczeniePaneliPrzenosnychResult = {
  /** Czy wolno połączyć (brak 🔴). */
  moznaLaczyc: boolean
}

/**
 * Ekran 10, Moduł 12 — "Łączenie paneli przenośnych" (dawne 8.12, Biblia §12.12). Reguły ze źródła:
 * powerbanków solarnych (wbudowany regulator) nie łączy się z innymi panelami; niezgodne złącza bez
 * adaptera — 🔴 (Tresc E10). Wyjścia USB są za przetwornicą — nie do łączenia (ta sama zasada co
 * wbudowany regulator). Różne panele — 🟡 (szereg ograniczony najsłabszym prądem, równolegle —
 * najniższym napięciem). Napięcie/prąd wobec limitu wejścia: E39.
 */
export function calculateLaczeniePaneliPrzenosnych(
  input: LaczeniePaneliPrzenosnychInput,
): CalcResult<LaczeniePaneliPrzenosnychResult> {
  const { errors } = validateInput(input)
  const inputs = { liczbaPaneli: input.liczbaPaneli }
  const baza = { unit: "-", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: { moznaLaczyc: false }, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (input.typ === null || input.liczbaPaneli === 0 || input.zlaczePaneli === null || input.zlaczeWejscia === null) {
    return { ...baza, value: { moznaLaczyc: false }, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }
  const wiele = input.liczbaPaneli > 1
  if (wiele && input.takieSame === null) {
    return { ...baza, value: { moznaLaczyc: false }, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  if (wiele && input.typ === "powerbank-solarny") warnings.push(powerbankNieLaczyc())
  if (wiele && input.zlaczePaneli === "usb") warnings.push(usbNieLaczyc())
  if (input.zlaczePaneli !== input.zlaczeWejscia) warnings.push(input.maAdapter ? adapterSprawdz() : zlaczaNiezgodne())
  if (wiele && input.takieSame === false) warnings.push(roznePanele())
  warnings.push(sprawdzNapiecie())

  const moznaLaczyc = !warnings.some((w) => w.level === "critical")
  return {
    ...baza,
    value: { moznaLaczyc },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [],
    warnings,
  }
}
