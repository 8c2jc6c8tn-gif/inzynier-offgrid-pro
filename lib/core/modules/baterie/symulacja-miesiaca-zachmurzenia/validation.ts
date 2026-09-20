import type { Warning } from "@/lib/core/calc-result"
import { zapotrzebowanieNiedodatnie } from "@/lib/core/modules/baterie/dobor-pojemnosci/warnings"
import { pojemnoscNiedodatnia, socPozaZakresem } from "@/lib/core/modules/baterie/symulacja-ladowania-rozladowania/warnings"
import type { SymulacjaZachmurzeniaInput } from "./input"
import {
  liczbaDniScenariuszaNiedodatnia,
  poziomZachmurzeniaPozaZakresem,
  produkcjaNominalnaNiedodatnia,
} from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SymulacjaZachmurzeniaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.pojemnoscUzytecznaKwh < 0) errors.push(pojemnoscNiedodatnia(input.pojemnoscUzytecznaKwh))
  if (input.socStartPct < 0 || input.socStartPct > 100) {
    errors.push(socPozaZakresem("socStartPct", input.socStartPct))
  }
  if (input.zapotrzebowanieDoboweKwh < 0) errors.push(zapotrzebowanieNiedodatnie(input.zapotrzebowanieDoboweKwh))
  if (input.produkcjaNominalnaDobowaKwh < 0) {
    errors.push(produkcjaNominalnaNiedodatnia(input.produkcjaNominalnaDobowaKwh))
  }
  if (input.poziomZachmurzeniaPct < 0 || input.poziomZachmurzeniaPct > 100) {
    errors.push(poziomZachmurzeniaPozaZakresem(input.poziomZachmurzeniaPct))
  }
  if (input.liczbaDniScenariusza < 0) errors.push(liczbaDniScenariuszaNiedodatnia(input.liczbaDniScenariusza))

  return { errors }
}
