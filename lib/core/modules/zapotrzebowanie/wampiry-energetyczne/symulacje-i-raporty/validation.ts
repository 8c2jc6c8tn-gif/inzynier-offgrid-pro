import type { Warning } from "@/lib/core/calc-result"
import type { AutonomiaStandbyInput, KosztRocznyStandbyInput, WplywNaDoborInput } from "./input"
import {
  cenaEnergiiNiedodatnia,
  dodPozaZakresem,
  eliminacjaPozaZakresem,
  pojemnoscNiedodatnia,
  standbyNiedodatni,
} from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateAutonomia(input: AutonomiaStandbyInput): ValidationResult {
  const errors: Warning[] = []
  if (input.standbyW < 0) errors.push(standbyNiedodatni())
  if (input.standbyZredukowanyW < 0) errors.push(standbyNiedodatni())
  if (input.pojemnoscUzytecznaKwh < 0) errors.push(pojemnoscNiedodatnia())
  if (input.dodPct < 0 || input.dodPct > 100) errors.push(dodPozaZakresem())
  return { errors }
}

export function validateKosztRoczny(input: KosztRocznyStandbyInput): ValidationResult {
  const errors: Warning[] = []
  if (input.standbyW < 0) errors.push(standbyNiedodatni())
  if (input.cenaEnergiiZlZaKwh < 0) errors.push(cenaEnergiiNiedodatnia())
  return { errors }
}

export function validateWplywNaDobor(input: WplywNaDoborInput): ValidationResult {
  const errors: Warning[] = []
  if (input.standbyDobowaKwh < 0) errors.push(standbyNiedodatni())
  if (input.eliminacjaPct < 0 || input.eliminacjaPct > 100) errors.push(eliminacjaPozaZakresem())
  if (input.dniAutonomii < 0) errors.push(pojemnoscNiedodatnia())
  if (input.sprawnoscFalownikaPct < 0 || input.sprawnoscFalownikaPct > 100) errors.push(dodPozaZakresem())
  if (input.dodPct < 0 || input.dodPct > 100) errors.push(dodPozaZakresem())
  return { errors }
}
