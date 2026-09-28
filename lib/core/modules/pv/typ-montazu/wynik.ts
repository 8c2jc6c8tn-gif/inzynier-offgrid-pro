import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"

export const CALCULATOR_VERSION = "1.2.0"

/** D13: status podnoszą tylko ostrzeżenia `warning`/`critical`, `info` zostawia VALID. */
export function statusZOstrzezen(warnings: Warning[]): Status {
  return warnings.some((w) => w.level === "warning" || w.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID"
}

/** Wspólna fabryka CalcResult dla trybów Ekranu 2 — liczbowe pola wejścia trafiają do `inputs`. */
export function fabrykaWyniku<T>(input: object, formula: string, unit: string) {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  return (status: Status, value: T | null, warnings: Warning[] = [], assumptions: Assumption[] = []): CalcResult<T | null> => ({
    value,
    unit,
    status,
    formula,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
}
