import type { Warning } from "@/lib/core/calc-result"
import type { PoborWlasnyBmsInput } from "./input"
import { poborUjemny } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PoborWlasnyBmsInput): ValidationResult {
  const errors: Warning[] = []
  if (input.poborCiagleW < 0) errors.push(poborUjemny("poborCiagleW", input.poborCiagleW))
  if (input.poborUspienieW < 0) errors.push(poborUjemny("poborUspienieW", input.poborUspienieW))
  return { errors }
}
