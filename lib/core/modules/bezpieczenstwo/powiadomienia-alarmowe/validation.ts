import type { Warning } from "@/lib/core/calc-result"
import type { PowiadomieniaAlarmoweInput } from "./input"
import { liczbaKontaktowNiepoprawna } from "./warnings"

export function validateInput(input: PowiadomieniaAlarmoweInput): { errors: Warning[] } {
  const n = input.liczbaKontaktow
  return { errors: n !== null && (!Number.isInteger(n) || n < 0) ? [liczbaKontaktowNiepoprawna(n)] : [] }
}
