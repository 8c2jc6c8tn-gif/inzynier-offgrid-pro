import type { Warning } from "@/lib/core/calc-result"
import type { CzasBalansowaniaInput } from "./input"
import { oknoPozaZakresem, rozjazdPozaZakresem, wartoscUjemna } from "./warnings"

export function walidujWejscie(input: CzasBalansowaniaInput): Warning[] {
  const bledy: Warning[] = []
  if (input.pojemnoscAh < 0) bledy.push(wartoscUjemna("pojemnoscAh", input.pojemnoscAh))
  if (input.pradBalanseraA < 0) bledy.push(wartoscUjemna("pradBalanseraA", input.pradBalanseraA))
  if (input.rozjazdProc < 0) bledy.push(wartoscUjemna("rozjazdProc", input.rozjazdProc))
  else if (input.rozjazdProc > 100) bledy.push(rozjazdPozaZakresem(input.rozjazdProc))
  if (input.oknoGodzinDobe < 0) bledy.push(wartoscUjemna("oknoGodzinDobe", input.oknoGodzinDobe))
  else if (input.oknoGodzinDobe > 24) bledy.push(oknoPozaZakresem(input.oknoGodzinDobe))
  return bledy
}
