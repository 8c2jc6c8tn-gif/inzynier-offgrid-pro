import type { Warning } from "@/lib/core/calc-result"
import type { MonitorowanieIzolacjiImdInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: MonitorowanieIzolacjiImdInput): ValidationResult {
  const errors: Warning[] = []
  if (input.progAlarmuKOm < 0) errors.push(wartoscUjemna("progAlarmuKOm", input.progAlarmuKOm))
  return { errors }
}
