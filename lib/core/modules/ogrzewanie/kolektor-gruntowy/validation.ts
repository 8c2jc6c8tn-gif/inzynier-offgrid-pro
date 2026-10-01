import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { KolektorGruntowyInput } from "./input"

export function validateInput(input: KolektorGruntowyInput): { errors: Warning[] } {
  return {
    errors: ujemneWartosci({
      mocPompyKw: input.mocPompyKw,
      m2Na10Kw: input.m2Na10Kw,
      glebokoscUlozeniaM: input.glebokoscUlozeniaM ?? 0,
      glebokoscPrzemarzaniaM: input.glebokoscPrzemarzaniaM ?? 0,
      wNaMetr: input.wNaMetr,
      glebokoscOdwiertuM: input.glebokoscOdwiertuM,
    }),
  }
}
