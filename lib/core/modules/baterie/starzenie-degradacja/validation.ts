import type { Warning } from "@/lib/core/calc-result"
import type { StarzenieDegradacjaInput } from "./input"
import { calkowitaDegradacja, degradacjaPozaZakresem, pojemnoscNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: StarzenieDegradacjaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.pojemnoscUzytecznaDzisKwh < 0) errors.push(pojemnoscNiedodatnia(input.pojemnoscUzytecznaDzisKwh))
  if (input.degradacjaRocznaPct < 0 || input.degradacjaRocznaPct > 100) {
    errors.push(degradacjaPozaZakresem(input.degradacjaRocznaPct))
  }
  if (input.degradacjaRocznaPct > 0 && input.degradacjaRocznaPct * input.horyzontLata >= 100) {
    errors.push(calkowitaDegradacja(input.degradacjaRocznaPct, input.horyzontLata))
  }

  return { errors }
}
