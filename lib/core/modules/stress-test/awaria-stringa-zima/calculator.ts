import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { obliczDniAutonomiiZPojemnosci } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import type { AwariaStringaZimaInput } from "./input"
import { deficytPoAwarii, dniNaBaterii, kaskadaNieliczona, procentPozaZakresem, stringWiekszyNizCalosc, wartoscUjemna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "D = E - (P_{cal} - P_{str}),\\quad d = \\frac{C \\cdot \\eta \\cdot DoD}{D}"

export type AwariaStringaZimaResult = {
  /** Produkcja po awarii stringu [kWh/dobę]. */
  produkcjaPoAwariiKwhDoba: number | null
  /** Deficyt dobowy po awarii [kWh/dobę]; ≤ 0 = produkcja wystarcza. */
  deficytDobowyKwh: number | null
  /** Dni do rozładowania baterii przy tym deficycie. null = brak deficytu lub danych baterii. */
  dniNaBaterii: number | null
}

const PUSTY: AwariaStringaZimaResult = { produkcjaPoAwariiKwhDoba: null, deficytDobowyKwh: null, dniNaBaterii: null }

/**
 * Ekran 26, Moduł 7 — "Awaria jednego stringa PV w zimie" (dawne 6.40). Bilans po awarii: deficyt = zapotrzebowanie −
 * (produkcja − produkcja stringu); 🟡 przy deficycie (przykład C: „deficyt 8 kWh/dobę, system nie przetrwa bez
 * agregatu”). Dni na baterii — echo M4/E1 (`obliczDniAutonomiiZPojemnosci`). Kaskadowe przeciążenie pozostałych
 * stringów — źródło bez wzoru, tylko info.
 */
export function calculateAwariaStringaZima(input: AwariaStringaZimaInput): CalcResult<AwariaStringaZimaResult> {
  const inputs: Record<string, number> = {
    produkcjaCalkowitaKwhDoba: input.produkcjaCalkowitaKwhDoba ?? 0,
    produkcjaStringuKwhDoba: input.produkcjaStringuKwhDoba ?? 0,
    zapotrzebowanieKwhDoba: input.zapotrzebowanieKwhDoba ?? 0,
    pojemnoscBateriiKwh: input.pojemnoscBateriiKwh ?? 0,
    dodPct: input.dodPct ?? 0,
    sprawnoscFalownikaPct: input.sprawnoscFalownikaPct ?? 0,
  }
  const wynik = (status: Status, value: AwariaStringaZimaResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<AwariaStringaZimaResult> => ({
    value,
    unit: "kWh/dobę",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const ETYKIETY = {
    produkcjaCalkowitaKwhDoba: "Produkcja instalacji",
    produkcjaStringuKwhDoba: "Produkcja stringu",
    zapotrzebowanieKwhDoba: "Zapotrzebowanie",
    pojemnoscBateriiKwh: "Pojemność baterii",
  } as const
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  for (const pole of ["dodPct", "sprawnoscFalownikaPct"] as const) {
    const v = input[pole]
    if (v !== null && (v <= 0 || v > 100)) errors.push(procentPozaZakresem(pole, v))
  }
  const { produkcjaCalkowitaKwhDoba: Pc, produkcjaStringuKwhDoba: Ps, zapotrzebowanieKwhDoba: E } = input
  if (errors.length === 0 && Pc !== null && Ps !== null && Ps > Pc) errors.push(stringWiekszyNizCalosc(Ps, Pc))
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)
  if (Pc === null || Ps === null || E === null || E <= 0) return wynik("INCOMPLETE", PUSTY, [])

  const produkcjaPoAwariiKwhDoba = Pc - Ps
  const deficytDobowyKwh = E - produkcjaPoAwariiKwhDoba
  const value: AwariaStringaZimaResult = { produkcjaPoAwariiKwhDoba, deficytDobowyKwh, dniNaBaterii: null }
  const warnings: Warning[] = []

  if (deficytDobowyKwh > 0) {
    warnings.push(deficytPoAwarii(deficytDobowyKwh))
    const { pojemnoscBateriiKwh: C, dodPct, sprawnoscFalownikaPct: eta } = input
    if (C !== null && C > 0 && dodPct !== null && eta !== null) {
      value.dniNaBaterii = obliczDniAutonomiiZPojemnosci(C, deficytDobowyKwh, eta, dodPct)
      warnings.push(dniNaBaterii(value.dniNaBaterii))
    }
  }
  warnings.push(kaskadaNieliczona())

  return wynik(warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID", value, warnings, [
    { kod: "STRING-ZALOZENIE-NAJGORSZY-MIESIAC" },
  ])
}
