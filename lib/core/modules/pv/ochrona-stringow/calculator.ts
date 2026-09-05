import type { CalcResult } from "@/lib/core/calc-result"
import type { OchronaStringowInput } from "./input"
import { validateInput } from "./validation"
import { bezpiecznikDobrany, brakZabezpieczenPrzy3Stringach } from "./warnings"
import { PROG_LICZBY_STRINGOW_OBOWIAZKOWE, WSPOLCZYNNIK_BEZPIECZNIKA } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type OchronaStringowResult = {
  bezpiecznikA: number
  zabezpieczeniaObowiazkowe: boolean
}

const FORMULA = "I_{bezpiecznik} = 1{,}25 \\times I_{sc}"

/**
 * Wzór doboru bezpiecznika względem prądu odniesienia (1,25×) — kanoniczna implementacja.
 * Ekran 6, Moduł 5 (`dobor-bezpiecznika-rozlacznika`) re-używa tę funkcję zamiast duplikować
 * (wzorzec "echo", docs/standards/01-architektura.md, 1.3) — tam prądem odniesienia jest prąd
 * znamionowy obwodu, tu Isc stringu, ale wzór jest identyczny.
 */
export function obliczPradBezpiecznikaA(pradReferencyjnyA: number): number {
  return WSPOLCZYNNIK_BEZPIECZNIKA * pradReferencyjnyA
}

/**
 * Ekran 22, Moduł 3 "Instalacja PV" — "Ochrona stringów (bezpieczniki, diody blokujące)"
 * (dawne 2.38, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzór i próg 1:1 ze źródła —
 * przykład źródła (Isc→15A) odtworzony dokładnie. Twardy stop: przy ≥3 stringach równoległych
 * bez zabezpieczeń per string — 🔴, prąd wsteczny z pozostałych stringów przy zwarciu jednego.
 */
export function calculateOchronaStringow(input: OchronaStringowInput): CalcResult<OchronaStringowResult> {
  const { errors } = validateInput(input)
  const pustyWynik: OchronaStringowResult = { bezpiecznikA: 0, zabezpieczeniaObowiazkowe: false }
  const inputs = {
    iscA: input.iscA,
    liczbaStringowRownoleglych: input.liczbaStringowRownoleglych,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne = input.iscA === 0 || input.liczbaStringowRownoleglych === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const bezpiecznikA = obliczPradBezpiecznikaA(input.iscA)
  const zabezpieczeniaObowiazkowe = input.liczbaStringowRownoleglych >= PROG_LICZBY_STRINGOW_OBOWIAZKOWE

  const brakujeZabezpieczen = zabezpieczeniaObowiazkowe && !input.maZabezpieczeniaPerString

  const warnings = brakujeZabezpieczen
    ? [brakZabezpieczenPrzy3Stringach(input.liczbaStringowRownoleglych)]
    : [bezpiecznikDobrany(bezpiecznikA)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { bezpiecznikA, zabezpieczeniaObowiazkowe },
    unit: "A",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
