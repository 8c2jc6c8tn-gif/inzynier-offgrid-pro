import type { Warning } from "@/lib/core/calc-result"
import type { ZuzyciePerUrzadzenieInput } from "./input"
import { godzinPonadDobe, wartoscUjemna, wspolczynnikPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ZuzyciePerUrzadzenieInput): ValidationResult {
  const errors: Warning[] = []
  input.urzadzenia.forEach((u, i) => {
    if (u.mocW < 0) errors.push(wartoscUjemna(`urzadzenia.${i}.mocW`, "POLE-MOC-URZADZENIA", u.mocW))
    if (u.godzinNaDobe < 0 || u.godzinNaDobe > 24) errors.push(godzinPonadDobe(`urzadzenia.${i}.godzinNaDobe`, u.godzinNaDobe))
    if (u.wspolczynnikPracyPct < 0 || u.wspolczynnikPracyPct > 100) {
      errors.push(wspolczynnikPozaZakresem(`urzadzenia.${i}.wspolczynnikPracyPct`, u.wspolczynnikPracyPct))
    }
  })
  return { errors }
}
