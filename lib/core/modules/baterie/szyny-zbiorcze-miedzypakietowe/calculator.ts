import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { SzynyZbiorczeMiedzypakietoweInput } from "./input"
import { validateInput } from "./validation"
import { rozkladInfo } from "./warnings"
import {
  REZYSTYWNOSC_ALUMINIUM_OHM_MM2_NA_M,
  REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M,
  type Material,
} from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"

export const CALCULATOR_VERSION = "1.0.0"

export type GalazResult = {
  id: string
  rezystancjaOhm: number
  pradA: number
  udzialPct: number
}

export type SzynyZbiorczeMiedzypakietoweResult = {
  galezie: GalazResult[]
  maxOdchylenieOdSredniejPct: number
}

const FORMULA = "I_i = I_{calkowity} \\times \\frac{1/R_i}{\\sum_j 1/R_j} \\;\\; ; \\;\\; R_i = \\rho \\times 2L_i / A_i"

function rezystywnosc(material: Material): number {
  return material === "Cu" ? REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M : REZYSTYWNOSC_ALUMINIUM_OHM_MM2_NA_M
}

function pusty(): SzynyZbiorczeMiedzypakietoweResult {
  return { galezie: [], maxOdchylenieOdSredniejPct: 0 }
}

/**
 * Ekran 25, Moduł 4 "Magazyn energii / baterie" — "Szyny zbiorcze i połączenia
 * międzypakietowe" (scala dawne 3.28, 3.38, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md).
 *
 * Reguła podziału prądu dla gałęzi równoległych do wspólnego węzła (prawo Ohma, nie wymyślona):
 * prąd dzieli się odwrotnie proporcjonalnie do rezystancji każdej gałęzi. Rezystancja gałęzi
 * liczona tym samym wzorem co `dobor-przekroju-kabla` (M5/Ekran 1): R=ρ×2L/A (droga tam i z
 * powrotem). Zakres ograniczony do topologii gwiazda — patrz `input.ts` po pełne wyjaśnienie,
 * czego ten model NIE obejmuje (kaskada, asymetria punktu zasilania wzdłuż jednej szyny).
 *
 * Źródło nie podaje progu %, od którego rozpływ jest "niebezpieczny" — oba przykłady Sekcji C
 * są ilustracyjne. Wynik pokazuje policzone odchylenie wprost, bez wymyślonego progu krytyczności.
 */
export function calculateSzynyZbiorczeMiedzypakietowe(
  input: SzynyZbiorczeMiedzypakietoweInput,
): CalcResult<SzynyZbiorczeMiedzypakietoweResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pradCalkowityA: input.pradCalkowityA,
    liczbaGalezi: input.galezie.length,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.pradCalkowityA === 0 ||
    input.galezie.length < 2 ||
    input.galezie.some((g) => g.dlugoscM === 0 || g.przekrojMm2 === 0)

  if (niekompletne) {
    return {
      value: pusty(),
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const rho = rezystywnosc(input.material)
  const rezystancje = input.galezie.map((g) => ({
    id: g.id,
    rezystancjaOhm: (rho * 2 * g.dlugoscM) / g.przekrojMm2,
  }))
  const przewodnosci = rezystancje.map((r) => 1 / r.rezystancjaOhm)
  const sumaPrzewodnosci = przewodnosci.reduce((a, b) => a + b, 0)

  const galezie: GalazResult[] = rezystancje.map((r, i) => {
    const udzial = przewodnosci[i] / sumaPrzewodnosci
    return {
      id: r.id,
      rezystancjaOhm: r.rezystancjaOhm,
      pradA: input.pradCalkowityA * udzial,
      udzialPct: udzial * 100,
    }
  })

  const sredniUdzialPct = 100 / galezie.length
  const maxOdchylenieOdSredniejPct = Math.max(...galezie.map((g) => Math.abs(g.udzialPct - sredniUdzialPct)))

  return {
    value: { galezie, maxOdchylenieOdSredniejPct },
    unit: "A",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      { kod: "MODEL-TOPOLOGIA-GWIAZDA" },
      { kod: "REZYSTANCJA-WZOR-M5E1" },
    ] satisfies Assumption[],
    warnings: [rozkladInfo(maxOdchylenieOdSredniejPct)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
