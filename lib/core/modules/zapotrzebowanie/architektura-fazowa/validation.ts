import type { Warning } from "@/lib/core/calc-result"
import type { ArchitekturaFazowaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ArchitekturaFazowaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocL1W < 0) errors.push(wartoscUjemna("mocL1W", "POLE-OBCIAZENIE-L1", input.mocL1W))
  if (input.mocL2W < 0) errors.push(wartoscUjemna("mocL2W", "POLE-OBCIAZENIE-L2", input.mocL2W))
  if (input.mocL3W < 0) errors.push(wartoscUjemna("mocL3W", "POLE-OBCIAZENIE-L3", input.mocL3W))
  return { errors }
}
