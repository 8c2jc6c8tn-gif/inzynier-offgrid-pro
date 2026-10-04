import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import type { PrzepustPowietrzaInput } from "./input"
import { validateInput } from "./validation"
import { szczelinaBezpieczna, szczelinaKrytyczna, szczelinaPosrednia } from "./warnings"
import {
  PROG_BEZPIECZNY_CM,
  PROG_KRYTYCZNY_CM,
  TEMPERATURA_ODNIESIENIA_C,
  TEMPERATURA_PRZY_SZCZELINIE_KRYTYCZNEJ_C,
  WSPOLCZYNNIK_STRATY_PCT_PER_C,
} from "./constants"

export const CALCULATOR_VERSION = "1.0.1"

export type PrzepustPowietrzaResult = {
  klasyfikacja: "krytyczna" | "posrednia" | "bezpieczna"
  /** Szacowana strata mocy [%] — tylko dla klasyfikacji "krytyczna" (jedyny punkt danych ze źródła). */
  strataOrientacyjnaPct: number | null
}

const FORMULA = `strata_{\\%} = (T_{panelu} - T_{STC}) \\times ${latexLiczba(WSPOLCZYNNIK_STRATY_PCT_PER_C)}\\%/°C`

function pusty(): PrzepustPowietrzaResult {
  return { klasyfikacja: "bezpieczna", strataOrientacyjnaPct: null }
}

/**
 * Ekran 8, Moduł 5 "Okablowanie i zabezpieczenia" — "Przepust powietrza pod panelami"
 * (dawne 4.4, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Źródło daje tylko dwa punkty
 * odniesienia (szczelina <5cm → ~70°C → ~18% straty; szczelina ≥15cm → rekomendowana, bez straty),
 * bez ciągłego wzoru wiążącego dowolną szczelinę z temperaturą panelu — zakres pośredni (5–15cm)
 * NIE jest interpolowany (nie wymyślamy zależności, której źródło nie podaje), tylko oznaczony
 * jako "brak danych, zalecane min. 15cm dla pewności".
 */
export function calculatePrzepustPowietrza(input: PrzepustPowietrzaInput): CalcResult<PrzepustPowietrzaResult> {
  const { errors } = validateInput(input)
  const inputs = { szczelinaCm: input.szczelinaCm ?? 0 }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "%",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-OKABLOWANIE-PRZEPUST-POWIETRZA", formulaParams: { p1: latexLiczba(WSPOLCZYNNIK_STRATY_PCT_PER_C) },
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.szczelinaCm === null) {
    return {
      value: pusty(),
      unit: "%",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-OKABLOWANIE-PRZEPUST-POWIETRZA", formulaParams: { p1: latexLiczba(WSPOLCZYNNIK_STRATY_PCT_PER_C) },
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings: Warning[] = []
  const assumptions: Assumption[] = []
  let klasyfikacja: PrzepustPowietrzaResult["klasyfikacja"]
  let strataOrientacyjnaPct: number | null = null

  if (input.szczelinaCm < PROG_KRYTYCZNY_CM) {
    klasyfikacja = "krytyczna"
    strataOrientacyjnaPct = (TEMPERATURA_PRZY_SZCZELINIE_KRYTYCZNEJ_C - TEMPERATURA_ODNIESIENIA_C) * WSPOLCZYNNIK_STRATY_PCT_PER_C
    warnings.push(szczelinaKrytyczna(input.szczelinaCm, strataOrientacyjnaPct))
    assumptions.push({ kod: "TEMPERATURA-70C-PRZYKLAD-ZRODLA-NIE-POMIAR" })
  } else if (input.szczelinaCm < PROG_BEZPIECZNY_CM) {
    klasyfikacja = "posrednia"
    warnings.push(szczelinaPosrednia(input.szczelinaCm))
  } else {
    klasyfikacja = "bezpieczna"
    warnings.push(szczelinaBezpieczna())
  }

  const maNieinformacyjne = warnings.some((w) => w.level !== "info")

  return {
    value: { klasyfikacja, strataOrientacyjnaPct },
    unit: "%",
    status: maNieinformacyjne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-OKABLOWANIE-PRZEPUST-POWIETRZA", formulaParams: { p1: latexLiczba(WSPOLCZYNNIK_STRATY_PCT_PER_C) },
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
