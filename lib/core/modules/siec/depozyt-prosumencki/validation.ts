import type { Warning } from "@/lib/core/calc-result"
import type { DepozytInput } from "./input"
import { wartoscUjemna } from "../rachunek-za-prad/warnings"

export function validateInput(input: DepozytInput): Warning[] {
  const errors: Warning[] = []
  if (input.energiaOddanaKwh < 0) errors.push(wartoscUjemna("energiaOddanaKwh", input.energiaOddanaKwh))
  // A negative RCE hour counts as 0 (art. 4b ust. 2 pkt 2) — an average below 0 is impossible.
  if (input.cenaRynkowaZlMwh < 0) errors.push(wartoscUjemna("cenaRynkowaZlMwh", input.cenaRynkowaZlMwh))
  if (input.wykorzystanoZl !== null && input.wykorzystanoZl < 0) errors.push(wartoscUjemna("wykorzystanoZl", input.wykorzystanoZl))
  if (input.pelnyKosztKwhBruttoZl !== null && input.pelnyKosztKwhBruttoZl < 0) {
    errors.push(wartoscUjemna("pelnyKosztKwhBruttoZl", input.pelnyKosztKwhBruttoZl))
  }
  return errors
}
