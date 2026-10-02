import type { Warning } from "@/lib/core/calc-result"
import type { PanelDoStacjiZasilaniaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PanelDoStacjiZasilaniaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.vocStcV < 0) errors.push(wartoscUjemna("vocStcV", "POLE-VOC-PANELU", input.vocStcV))
  if (input.liczbaSzeregowo < 0) errors.push(wartoscUjemna("liczbaSzeregowo", "POLE-LICZBA-PANELI-SZEREGOWO", input.liczbaSzeregowo))
  if (input.maxNapiecieWejsciaV < 0) {
    errors.push(wartoscUjemna("maxNapiecieWejsciaV", "POLE-MAX-NAPIECIE-WEJSCIA-STACJI", input.maxNapiecieWejsciaV))
  }
  if (input.iscA < 0) errors.push(wartoscUjemna("iscA", "POLE-PRAD-ZWARCIOWY-ISC", input.iscA))
  if (input.liczbaRownolegle < 0) errors.push(wartoscUjemna("liczbaRownolegle", "POLE-LICZBA-GALEZI-ROWNOLEGLYCH", input.liczbaRownolegle))
  if (input.maxPradWejsciaA < 0) errors.push(wartoscUjemna("maxPradWejsciaA", "POLE-MAX-PRAD-WEJSCIA-STACJI", input.maxPradWejsciaA))
  return { errors }
}
