import type { Warning } from "@/lib/core/calc-result"
import type { DeficytyMiesieczneInput } from "./input"
import { wartoscUjemnaDef, zlaLiczbaMiesiecy } from "./warnings"

export function validateInput(input: DeficytyMiesieczneInput): { errors: Warning[] } {
  const errors: Warning[] = []
  if (input.deficytyKwh.length !== 12) errors.push(zlaLiczbaMiesiecy(input.deficytyKwh.length))
  input.deficytyKwh.forEach((d, i) => {
    if (d < 0) errors.push(wartoscUjemnaDef(`deficytyKwh[${i}]`, d))
  })
  const pola = {
    mocAgregatuKw: input.mocAgregatuKw,
    zuzyciePaliwaLH: input.zuzyciePaliwaLH,
    cenaPaliwaZlL: input.cenaPaliwaZlL,
    kosztSerwisuZlH: input.kosztSerwisuZlH,
    zapasPaliwaL: input.zapasPaliwaL,
  }
  for (const [pole, v] of Object.entries(pola)) if (v < 0) errors.push(wartoscUjemnaDef(pole, v))
  return { errors }
}
