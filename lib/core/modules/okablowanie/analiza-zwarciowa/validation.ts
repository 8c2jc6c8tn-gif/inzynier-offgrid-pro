import type { Warning } from "@/lib/core/calc-result"
import type { AnalizaZwarciowaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: AnalizaZwarciowaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieBateriiV < 0) errors.push(wartoscUjemna("napiecieBateriiV", input.napiecieBateriiV))
  if (input.rezystancjaWewnetrznaBateriiOhm < 0) {
    errors.push(wartoscUjemna("rezystancjaWewnetrznaBateriiOhm", input.rezystancjaWewnetrznaBateriiOhm))
  }
  if (input.iscPanelaA < 0) errors.push(wartoscUjemna("iscPanelaA", input.iscPanelaA))
  if (input.liczbaStringowRownoleglych < 0) {
    errors.push(wartoscUjemna("liczbaStringowRownoleglych", input.liczbaStringowRownoleglych))
  }
  if (input.aicZabezpieczeniaA < 0) errors.push(wartoscUjemna("aicZabezpieczeniaA", input.aicZabezpieczeniaA))
  return { errors }
}
