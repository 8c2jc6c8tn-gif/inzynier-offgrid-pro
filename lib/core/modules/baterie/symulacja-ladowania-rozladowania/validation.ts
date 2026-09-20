import type { Warning } from "@/lib/core/calc-result"
import type { SymulacjaLadowaniaInput } from "./input"
import {
  dlugoscDniaPozaZakresem,
  mocLadowaniaUjemna,
  mocRozladowaniaNiedodatnia,
  pojemnoscNiedodatnia,
  socPozaZakresem,
} from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SymulacjaLadowaniaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.pojemnoscUzytecznaKwh < 0) errors.push(pojemnoscNiedodatnia(input.pojemnoscUzytecznaKwh))
  if (input.socStartPct < 0 || input.socStartPct > 100) {
    errors.push(socPozaZakresem("socStartPct", input.socStartPct))
  }
  if (input.mocLadowaniaKw < 0) errors.push(mocLadowaniaUjemna(input.mocLadowaniaKw))
  if (input.mocRozladowaniaKw < 0) errors.push(mocRozladowaniaNiedodatnia(input.mocRozladowaniaKw))
  if (input.dlugoscDniaGodz < 0 || input.dlugoscDniaGodz > 24) {
    errors.push(dlugoscDniaPozaZakresem(input.dlugoscDniaGodz))
  }
  if (input.socProgPct < 0 || input.socProgPct > 100) {
    errors.push(socPozaZakresem("socProgPct", input.socProgPct))
  }

  return { errors }
}
