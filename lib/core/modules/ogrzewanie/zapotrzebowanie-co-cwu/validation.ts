import type { Warning } from "@/lib/core/calc-result"
import { LITROW_NA_OSOBE_SANITY_MAX, OSOB_SANITY_MAX } from "./constants"
import type { ZapotrzebowanieCoCwuInput } from "./input"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: ZapotrzebowanieCoCwuInput): Warning[] {
  const e: Warning[] = []
  const osoby = input.liczbaOsob
  if (osoby !== null && (!Number.isInteger(osoby) || osoby < 1 || osoby > OSOB_SANITY_MAX)) {
    e.push(wartoscPozaZakresem("liczbaOsob", "Liczba osób", osoby, 1, OSOB_SANITY_MAX))
  }
  const l = input.cwuLitrowNaOsobeDoba
  if (l !== null && (l <= 0 || l > LITROW_NA_OSOBE_SANITY_MAX)) {
    e.push(wartoscPozaZakresem("cwuLitrowNaOsobeDoba", "C.W.U. na osobę", l, 0, LITROW_NA_OSOBE_SANITY_MAX))
  }
  input.cieploCoMiesiaceKwh.forEach((q, i) => {
    if (q !== null && q < 0) e.push(wartoscUjemna(`cieploCoMiesiaceKwh.${i}`, `Ciepło C.O. (miesiąc ${i + 1})`, q))
  })
  if (input.copCo !== null && input.copCo <= 0) e.push(wartoscNiedodatnia("copCo", "COP ogrzewania", input.copCo))
  if (input.copCwu !== null && input.copCwu <= 0) e.push(wartoscNiedodatnia("copCwu", "COP podgrzewania wody", input.copCwu))
  return e
}
