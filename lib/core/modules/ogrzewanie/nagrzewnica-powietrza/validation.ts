import type { Warning } from "@/lib/core/calc-result"
import type { NagrzewnicaPowietrzaInput } from "./input"
import { wartoscUjemnaNp } from "./warnings"

export function validateInput(input: NagrzewnicaPowietrzaInput): Warning[] {
  const errors: Warning[] = []
  for (const [pole, v] of Object.entries(input)) {
    if (!Number.isFinite(v) || v < 0) errors.push(wartoscUjemnaNp(pole, v))
  }
  return errors
}
