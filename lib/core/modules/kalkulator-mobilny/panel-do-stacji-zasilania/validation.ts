import type { Warning } from "@/lib/core/calc-result"
import type { PanelDoStacjiZasilaniaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PanelDoStacjiZasilaniaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.vocStcV < 0) errors.push(wartoscUjemna("vocStcV", "Voc panelu", input.vocStcV))
  if (input.liczbaSzeregowo < 0) errors.push(wartoscUjemna("liczbaSzeregowo", "Liczba paneli szeregowo", input.liczbaSzeregowo))
  if (input.maxNapiecieWejsciaV < 0) {
    errors.push(wartoscUjemna("maxNapiecieWejsciaV", "Max napięcie wejścia stacji", input.maxNapiecieWejsciaV))
  }
  if (input.iscA < 0) errors.push(wartoscUjemna("iscA", "Prąd zwarciowy Isc", input.iscA))
  if (input.liczbaRownolegle < 0) errors.push(wartoscUjemna("liczbaRownolegle", "Liczba gałęzi równoległych", input.liczbaRownolegle))
  if (input.maxPradWejsciaA < 0) errors.push(wartoscUjemna("maxPradWejsciaA", "Max prąd wejścia stacji", input.maxPradWejsciaA))
  return { errors }
}
