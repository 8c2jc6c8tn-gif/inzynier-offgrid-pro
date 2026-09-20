import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { NapiecieOdcieciaInput } from "./input"
import {
  KALIBRACJA_CYKLE_PRZY_DOD_80,
  KALIBRACJA_CYKLE_PRZY_DOD_100,
  KALIBRACJA_DOD_PRZY_NAPIECIU_MAX_PCT,
  KALIBRACJA_DOD_PRZY_NAPIECIU_MIN_PCT,
  KALIBRACJA_NAPIECIE_OGNIWO_MAX_V,
  KALIBRACJA_NAPIECIE_OGNIWO_MIN_V,
} from "./constants"
import { validateInput } from "./validation"
import { ekstrapolacjaPozaKalibracje } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type NapiecieOdcieciaResult = {
  napiecieOgniwaV: number
  dodPct: number
  cykleZycia: number
  wewnatrzKalibracji: boolean
}

const FORMULA =
  "DoD(V_{ogniwo}) = DoD_1 + \\dfrac{DoD_2-DoD_1}{V_2-V_1}(V_{ogniwo}-V_1); \\quad " +
  "N_{cykli}(DoD) = N_1 + \\dfrac{N_2-N_1}{DoD_2-DoD_1}(DoD-DoD_1)"

const PUSTY_WYNIK: NapiecieOdcieciaResult = {
  napiecieOgniwaV: 0,
  dodPct: 0,
  cykleZycia: 0,
  wewnatrzKalibracji: true,
}

function interpolacjaLiniowa(x: number, x1: number, y1: number, x2: number, y2: number): number {
  return y1 + ((y2 - y1) / (x2 - x1)) * (x - x1)
}

/**
 * Ekran 31, Moduł 4 — "Napięcie odcięcia vs żywotność" (dawne 3.35, Sekcja B/C). Model to
 * interpolacja liniowa między dwoma punktami danych podanymi wprost w źródle (42,0V/16S => 100%
 * DoD => 2000 cykli; 44,0V/16S => 80% DoD => 5000 cykli, patrz constants.ts) — zaokrąglone do
 * napięcia per ogniwo, żeby generalizować na dowolną liczbę ogniw szeregowo, nie tylko 16S/48V.
 * Poza tym zakresem napięcia ogniwa (2,625–2,750V) wynik jest ekstrapolacją modelu kalibrowanego
 * tylko na dwóch punktach — ostrzeżenie EKSTRAPOLACJA-POZA-KALIBRACJA, nie twardy błąd (napięcie
 * odcięcia poza tym zakresem jest fizycznie możliwe, tylko model traci tu pewność).
 */
function symuluj(input: NapiecieOdcieciaInput): NapiecieOdcieciaResult {
  const napiecieOgniwaV = input.napiecieOdcieciaV / input.liczbaOgniwSzeregowo

  const dodPctRaw = interpolacjaLiniowa(
    napiecieOgniwaV,
    KALIBRACJA_NAPIECIE_OGNIWO_MIN_V,
    KALIBRACJA_DOD_PRZY_NAPIECIU_MIN_PCT,
    KALIBRACJA_NAPIECIE_OGNIWO_MAX_V,
    KALIBRACJA_DOD_PRZY_NAPIECIU_MAX_PCT,
  )
  const dodPct = Math.min(100, Math.max(0, dodPctRaw))

  const cykleZyciaRaw = interpolacjaLiniowa(
    dodPct,
    KALIBRACJA_DOD_PRZY_NAPIECIU_MIN_PCT,
    KALIBRACJA_CYKLE_PRZY_DOD_100,
    KALIBRACJA_DOD_PRZY_NAPIECIU_MAX_PCT,
    KALIBRACJA_CYKLE_PRZY_DOD_80,
  )
  const cykleZycia = Math.max(0, Math.round(cykleZyciaRaw))

  const wewnatrzKalibracji =
    napiecieOgniwaV >= KALIBRACJA_NAPIECIE_OGNIWO_MIN_V && napiecieOgniwaV <= KALIBRACJA_NAPIECIE_OGNIWO_MAX_V

  return { napiecieOgniwaV, dodPct, cykleZycia, wewnatrzKalibracji }
}

export function calculateNapiecieOdciecia(input: NapiecieOdcieciaInput): CalcResult<NapiecieOdcieciaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    napiecieOdcieciaV: input.napiecieOdcieciaV,
    liczbaOgniwSzeregowo: input.liczbaOgniwSzeregowo,
  }

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "cykli",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.napiecieOdcieciaV === 0 || input.liczbaOgniwSzeregowo === 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "cykli",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const value = symuluj(input)
  const assumptions: Assumption[] = [{ kod: "MODEL-LIFEPO4-DWA-PUNKTY-KALIBRACJI" }]
  const warnings = value.wewnatrzKalibracji ? [] : [ekstrapolacjaPozaKalibracje(value.napiecieOgniwaV)]

  return {
    value,
    unit: "cykli",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
