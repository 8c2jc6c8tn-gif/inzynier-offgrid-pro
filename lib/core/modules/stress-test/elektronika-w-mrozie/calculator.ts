import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { ElektronikaWMrozieInput, TypElektroniki } from "./input"
import { bmsPonizejMin, brakMinTemp, przetwornicaPonizejMin, urzadzeniePonizejMin } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

const FORMULA = "T_{min,miejsca} \\ge T_{min,pracy}"

export type OcenaUrzadzenia = {
  id: string
  nazwa: string
  typ: TypElektroniki
  /** T miejsca − T min pracy [K]; null = brak danych z karty. Ujemny = poniżej zakresu pracy. */
  zapasK: number | null
}

export type ElektronikaWMrozieResult = {
  oceny: OcenaUrzadzenia[]
  liczbaPonizejMin: number
}

/**
 * Ekran 19, Moduł 7 — "Wpływ niskich temperatur na elektronikę" (dawne 6.29→7.27). Porównanie
 * temperatury miejsca z minimalną temperaturą pracy z karty każdego urządzenia. Twardy stop 🔴 1:1
 * ze źródła: krytyczna elektronika (BMS) poniżej minimalnej temperatury pracy. Inne urządzenia
 * poniżej zakresu — 🟡 ze skutkiem z sekcji B źródła (źródło podaje jako 🔴 tylko BMS). Od 1.1.0
 * także przetwornica/falownik 🔴 (decyzja właściciela D31, `constants.ts`), regulator ładowania 🟡.
 */
export function calculateElektronikaWMrozie(input: ElektronikaWMrozieInput): CalcResult<ElektronikaWMrozieResult> {
  const inputs = { temperaturaMiejscaC: input.temperaturaMiejscaC ?? 0, liczbaUrzadzen: input.urzadzenia.length }

  if (input.temperaturaMiejscaC === null || input.urzadzenia.length === 0) {
    return {
      value: { oceny: [], liczbaPonizejMin: 0 },
      unit: "K",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const t = input.temperaturaMiejscaC
  const warnings: Warning[] = []
  const oceny: OcenaUrzadzenia[] = input.urzadzenia.map((u, i) => {
    const nazwa = u.nazwa.trim() === "" ? `urządzenie ${i + 1}` : u.nazwa.trim()
    if (u.minTempPracyC === null) {
      warnings.push(brakMinTemp(nazwa))
      return { id: u.id, nazwa, typ: u.typ, zapasK: null }
    }
    const zapasK = t - u.minTempPracyC
    if (zapasK < 0) {
      warnings.push(
        u.typ === "BMS"
          ? bmsPonizejMin(nazwa, t, u.minTempPracyC)
          : u.typ === "przetwornica"
            ? przetwornicaPonizejMin(nazwa, t, u.minTempPracyC)
            : urzadzeniePonizejMin(u.typ, nazwa, t, u.minTempPracyC),
      )
    }
    return { id: u.id, nazwa, typ: u.typ, zapasK }
  })

  const assumptions: Assumption[] = [{ kod: "ELEKTRONIKA-ZALOZENIE-TEMP-MIEJSCA" }]
  const podnosi = warnings.some((w) => w.level !== "info")

  return {
    value: { oceny, liczbaPonizejMin: oceny.filter((o) => o.zapasK !== null && o.zapasK < 0).length },
    unit: "K",
    status: podnosi ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
