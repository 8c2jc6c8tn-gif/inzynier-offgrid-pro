import type { CalcResult } from "@/lib/core/calc-result"
import type { NapiecieSystemoweInput } from "./input"
import { validateInput } from "./validation"
import { rekomendacjaNapiecia } from "./warnings"
import { PROG_12V_MAX_W, PROG_48V_MIN_W } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type NapiecieSystemoweResult = {
  napiecieRekomendowaneV: 12 | 24 | 48
  pradPrzy12VA: number
  pradPrzy24VA: number
  pradPrzy48VA: number
}

const FORMULA = "I = P / V \\;\\; ; \\;\\; P>3000W \\to 48V \\;\\; P<1000W \\to 12V \\;\\; inaczej \\to 24V"

/**
 * Ekran 2, Moduł 4 "Magazyn energii / baterie" — "Sugestia napięcia systemowego (12/24/48V)"
 * (dawne 3.2, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła
 * (>3000W→48V, <1000W→12V); pasmo 1000-3000W → 24V dopowiedziane logicznie z 3-poziomowej
 * struktury nagłówka ekranu (12/24/48V), bo źródło nie zostawia luki między dwoma progami bez
 * trzeciej opcji — udokumentowane jawnie jako uzupełnienie, nie ukryte założenie.
 *
 * Porównanie przekrojów kabli (Sekcja C: "kabel 95mm²"/"25mm²") świadomie NIE zbudowane —
 * wymaga tabeli obciążalności prądowej (PN-IEC 60364-5-52), tej samej brakującej normy co
 * Moduł 5, Ekran 1 (blocked). Zbudowany tylko prąd I=P/V (czyste prawo Ohma/moc), zweryfikowany
 * dokładnie z przykładem źródła (4800W → 400A@12V, 100A@48V).
 */
export function calculateNapiecieSystemowe(
  input: NapiecieSystemoweInput,
): CalcResult<NapiecieSystemoweResult> {
  const { errors } = validateInput(input)
  const pustyWynik: NapiecieSystemoweResult = {
    napiecieRekomendowaneV: 24,
    pradPrzy12VA: 0,
    pradPrzy24VA: 0,
    pradPrzy48VA: 0,
  }
  const inputs = { mocSzczytowaW: input.mocSzczytowaW }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.mocSzczytowaW === 0) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const napiecieRekomendowaneV: 12 | 24 | 48 =
    input.mocSzczytowaW > PROG_48V_MIN_W ? 48 : input.mocSzczytowaW < PROG_12V_MAX_W ? 12 : 24

  const pradPrzy12VA = input.mocSzczytowaW / 12
  const pradPrzy24VA = input.mocSzczytowaW / 24
  const pradPrzy48VA = input.mocSzczytowaW / 48

  return {
    value: { napiecieRekomendowaneV, pradPrzy12VA, pradPrzy24VA, pradPrzy48VA },
    unit: "V",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Pasmo 1000-3000W → 24V dopowiedziane logicznie ze struktury 12/24/48V (źródło podaje wprost tylko progi <1000W i >3000W).",
      "Porównanie wymaganych przekrojów kabli NIE policzone — brakuje tabeli obciążalności prądowej (PN-IEC 60364-5-52).",
    ],
    warnings: [rekomendacjaNapiecia(napiecieRekomendowaneV)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
