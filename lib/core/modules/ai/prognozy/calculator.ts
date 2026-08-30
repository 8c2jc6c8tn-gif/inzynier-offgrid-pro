import type { CalcResult } from "@/lib/core/calc-result"
import type { GodzinaPrognozy } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

export type PrognozyResult = {
  produkcjaLacznaKwh: number
  zuzycieLaczneKwh: number
  bilansKwh: number
  godzinaSzczytuZuzycia: number
}

/**
 * Ekran 1, Moduł 10 — "Prognozy" (docs/domena/Tresc_Modul_10_AI_Ekrany.md). To jest "pogoda"
 * Twojego systemu energetycznego — nie tylko atmosferyczna, ale cała: ile będziesz mieć prądu,
 * ile zużyjesz, i kiedy będzie ciasno.
 */
export function calculatePrognozy(punkty: GodzinaPrognozy[]): CalcResult<PrognozyResult> {
  if (punkty.length === 0) {
    return {
      value: { produkcjaLacznaKwh: 0, zuzycieLaczneKwh: 0, bilansKwh: 0, godzinaSzczytuZuzycia: 0 },
      unit: "kWh",
      status: "INCOMPLETE",
      formula: "",
      inputs: { liczbaPunktow: 0 },
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const produkcjaLacznaKwh = punkty.reduce((sum, p) => sum + p.produkcjaKw, 0)
  const zuzycieLaczneKwh = punkty.reduce((sum, p) => sum + p.zuzycieKw, 0)
  const szczyt = punkty.reduce((max, p) => (p.zuzycieKw > max.zuzycieKw ? p : max), punkty[0])

  return {
    value: {
      produkcjaLacznaKwh,
      zuzycieLaczneKwh,
      bilansKwh: produkcjaLacznaKwh - zuzycieLaczneKwh,
      godzinaSzczytuZuzycia: szczyt.godzina,
    },
    unit: "kWh",
    status: "VALID",
    formula: "",
    inputs: { liczbaPunktow: punkty.length },
    assumptions: [
      "Dane demonstracyjne — docelowo ekran czerpie z silnika symulacji rocznej i prognozy pogody live.",
      "Suma liczona po dostępnych punktach próbkowania (co 3h), nie pełnej krzywej godzinowej — orientacyjnie, nie jako projekt wykonawczy.",
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
