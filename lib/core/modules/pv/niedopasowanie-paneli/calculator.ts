import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { NiedopasowaniePaneliInput } from "./input"
import { validateInput } from "./validation"
import { duzaRoznicaMocy, malaRoznicaMocy, umiarkowanaRoznicaMocy } from "./warnings"
import { ROZNICA_MOCY_KRYTYCZNA_PCT, ROZNICA_MOCY_OSTRZEZENIE_PCT } from "./constants"

// 🔎 TD5 (dlug-techniczny.md): druga liczba źródła (Sekcja C, "strata może sięgać nawet 18%") nie
// zaimplementowana jako osobne obliczenie — źródło nie podaje wzoru na tę nieliniowość.
export const CALCULATOR_VERSION = "1.0.0"

export type NiedopasowaniePaneliResult = {
  mocTeoretycznaW: number
  mocRzeczywistaW: number
  strataPct: number
  roznicaMocyPct: number
}

const FORMULA =
  "P_{teoretyczna} = P_1 + P_2 \\;\\; ; \\;\\; P_{rzeczywista} = 2 \\times \\min(I_1, I_2) \\times V_{wspólne}"

/**
 * Ekran 17, Moduł 3 "Instalacja PV" — "Niedopasowanie mocy paneli (mismatch)" (scala dawne 2.32,
 * 2.41, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B/C). W stringu szeregowym prąd całego
 * stringu ogranicza najsłabszy panel. Przykład źródła (400W/11A + 330W/9A, Vmp=40V → 720W
 * zamiast 730W, strata 1,4%) odtworzony dokładnie, zweryfikowany niezależnie w Pythonie przed
 * implementacją. Próg twardego stopu (różnica mocy paneli >10-15% 🔴) 1:1 ze źródła — zakres
 * źródła użyty jako trójstopniowe kubełkowanie (<10% bezpiecznie, 10-15% uwaga, >15% zabronione),
 * nie interpolowany ani nie zawężony do jednej wymyślonej liczby.
 */
export function calculateNiedopasowaniePaneli(
  input: NiedopasowaniePaneliInput,
): CalcResult<NiedopasowaniePaneliResult> {
  const { errors } = validateInput(input)
  const pustyWynik: NiedopasowaniePaneliResult = {
    mocTeoretycznaW: 0,
    mocRzeczywistaW: 0,
    strataPct: 0,
    roznicaMocyPct: 0,
  }
  const inputs = {
    mocPanel1W: input.mocPanel1W,
    impPanel1A: input.impPanel1A,
    mocPanel2W: input.mocPanel2W,
    impPanel2A: input.impPanel2A,
    napiecieWspolneV: input.napiecieWspolneV,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.mocPanel1W === 0 ||
    input.impPanel1A === 0 ||
    input.mocPanel2W === 0 ||
    input.impPanel2A === 0 ||
    input.napiecieWspolneV === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const mocTeoretycznaW = input.mocPanel1W + input.mocPanel2W
  const pradMinA = Math.min(input.impPanel1A, input.impPanel2A)
  const mocRzeczywistaW = 2 * pradMinA * input.napiecieWspolneV
  const strataPct = ((mocTeoretycznaW - mocRzeczywistaW) / mocTeoretycznaW) * 100

  const mocWieksza = Math.max(input.mocPanel1W, input.mocPanel2W)
  const roznicaMocyPct = (Math.abs(input.mocPanel1W - input.mocPanel2W) / mocWieksza) * 100

  const warnings =
    roznicaMocyPct > ROZNICA_MOCY_KRYTYCZNA_PCT
      ? [duzaRoznicaMocy(roznicaMocyPct)]
      : roznicaMocyPct > ROZNICA_MOCY_OSTRZEZENIE_PCT
        ? [umiarkowanaRoznicaMocy(roznicaMocyPct)]
        : [malaRoznicaMocy(roznicaMocyPct)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { mocTeoretycznaW, mocRzeczywistaW, strataPct, roznicaMocyPct },
    unit: "W",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "NAPIECIE-WSPOLNE-RECZNIE" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
