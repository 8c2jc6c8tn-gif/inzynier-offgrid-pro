import type { Warning } from "@/lib/core/calc-result"
import type { BilansZapotrzebowaniaInput } from "./input"
import { ujemnaWartosc, ujemnyBufor, zlaLiczbaMiesiecy } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: BilansZapotrzebowaniaInput): ValidationResult {
  const errors: Warning[] = []
  for (const p of input.pozycje) {
    if (p.kwhDobaTypowa !== null && p.kwhDobaTypowa < 0) errors.push(ujemnaWartosc(p.zrodlo, p.kwhDobaTypowa))
    if (p.kwhDobaMiesiace !== null) {
      if (p.kwhDobaMiesiace.length !== 12) errors.push(zlaLiczbaMiesiecy(p.zrodlo, p.kwhDobaMiesiace.length))
      else {
        const ujemna = p.kwhDobaMiesiace.find((x) => x < 0)
        if (ujemna !== undefined) errors.push(ujemnaWartosc(p.zrodlo, ujemna))
      }
    }
  }
  if (input.buforPct !== null && input.buforPct < 0) errors.push(ujemnyBufor(input.buforPct))
  return { errors }
}
