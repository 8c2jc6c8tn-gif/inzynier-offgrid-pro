import type { Warning } from "@/lib/core/calc-result"
import type { SprawnoscInwerteraInput } from "./input"
import { sprawnoscPozaZakresem, wartoscNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SprawnoscInwerteraInput): ValidationResult {
  const errors: Warning[] = []
  if (input.zapotrzebowanieW < 0) {
    errors.push(wartoscNiedodatnia("zapotrzebowanieW", "Zapotrzebowanie", input.zapotrzebowanieW))
  }
  if (input.mocFalownikaW < 0) {
    errors.push(wartoscNiedodatnia("mocFalownikaW", "Moc falownika", input.mocFalownikaW))
  }
  if (input.sprawnoscPct !== 0 && (input.sprawnoscPct <= 0 || input.sprawnoscPct > 100)) {
    errors.push(sprawnoscPozaZakresem(input.sprawnoscPct))
  }
  return { errors }
}
