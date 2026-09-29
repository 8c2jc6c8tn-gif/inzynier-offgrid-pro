import type { Warning } from "@/lib/core/calc-result"
import { wartoscUjemna } from "../rachunek-za-prad/warnings"
import type { KosztPowrotuInput } from "./input"

export function validateInput(input: KosztPowrotuInput): Warning[] {
  const errors: Warning[] = []
  if (input.stawkaZlKw !== null && input.stawkaZlKw < 0) errors.push(wartoscUjemna("stawkaZlKw", input.stawkaZlKw))
  if (input.mocPrzylaczeniowaKw < 0) errors.push(wartoscUjemna("mocPrzylaczeniowaKw", input.mocPrzylaczeniowaKw))
  return errors
}
