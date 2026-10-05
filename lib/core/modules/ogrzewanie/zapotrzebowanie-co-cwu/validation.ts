import type { Warning } from "@/lib/core/calc-result"
import { LITROW_NA_OSOBE_SANITY_MAX, OSOB_SANITY_MAX } from "./constants"
import type { ZapotrzebowanieCoCwuInput } from "./input"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: ZapotrzebowanieCoCwuInput): Warning[] {
  const e: Warning[] = []
  const osoby = input.liczbaOsob
  if (osoby !== null && (!Number.isInteger(osoby) || osoby < 1 || osoby > OSOB_SANITY_MAX)) {
    e.push(wartoscPozaZakresem("liczbaOsob", "POLE-LICZBA-OSOB", osoby, 1, OSOB_SANITY_MAX))
  }
  const l = input.cwuLitrowNaOsobeDoba
  if (l !== null && (l <= 0 || l > LITROW_NA_OSOBE_SANITY_MAX)) {
    e.push(wartoscPozaZakresem("cwuLitrowNaOsobeDoba", "POLE-CWU-NA-OSOBE", l, 0, LITROW_NA_OSOBE_SANITY_MAX))
  }
  input.cieploCoMiesiaceKwh.forEach((q, i) => {
    if (q !== null && q < 0) e.push(wartoscUjemna(`cieploCoMiesiaceKwh.${i}`, "POLE-CIEPLO-CO-MIESIAC", q, String(i + 1)))
  })
  if (input.copCo !== null && input.copCo <= 0) e.push(wartoscNiedodatnia("copCo", "POLE-COP-OGRZEWANIA", input.copCo))
  if (input.copCwu !== null && input.copCwu <= 0) e.push(wartoscNiedodatnia("copCwu", "POLE-COP-CWU", input.copCwu))
  return e
}
