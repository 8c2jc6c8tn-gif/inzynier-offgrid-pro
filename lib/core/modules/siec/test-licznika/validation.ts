import type { Warning } from "@/lib/core/calc-result"
import type { TestLicznikaInput } from "./input"
import { wartoscUjemna } from "../rachunek-za-prad/warnings"

export function validateInput(input: TestLicznikaInput): Warning[] {
  const errors: Warning[] = []
  if (input.liczbaImpulsow < 0) errors.push(wartoscUjemna("liczbaImpulsow", input.liczbaImpulsow))
  if (input.czasS < 0) errors.push(wartoscUjemna("czasS", input.czasS))
  if (input.stalaImpKwh < 0) errors.push(wartoscUjemna("stalaImpKwh", input.stalaImpKwh))
  if (input.mocOdbiornikaW !== null && input.mocOdbiornikaW < 0) errors.push(wartoscUjemna("mocOdbiornikaW", input.mocOdbiornikaW))
  return errors
}
