import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { nazwaElementu } from "@/lib/core/nazwa-elementu"
import type { ElektronikaWMrozieInput, TypElektroniki } from "./input"
import { bmsPonizejMin, brakMinTemp, przetwornicaPonizejMin, urzadzeniePonizejMin } from "./warnings"

export const CALCULATOR_VERSION = "1.1.1"

const FORMULA = "T_{min,miejsca} \\ge T_{min,pracy}"

export type OcenaUrzadzenia = {
  id: string
  /** User's name, trimmed; "" when left blank — the screen shows the numbered fallback in the UI language. */
  nazwa: string
  /** 1-based position on the list (fallback label „urządzenie {nr}”). */
  nr: number
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
    const nazwa = u.nazwa.trim()
    const nr = i + 1
    const etykieta = nazwaElementu("nazwa", nazwa, "NAZWA-URZADZENIE-NR", nr)
    if (u.minTempPracyC === null) {
      warnings.push(brakMinTemp(etykieta))
      return { id: u.id, nazwa, nr, typ: u.typ, zapasK: null }
    }
    const zapasK = t - u.minTempPracyC
    if (zapasK < 0) {
      warnings.push(
        u.typ === "BMS"
          ? bmsPonizejMin(etykieta, t, u.minTempPracyC)
          : u.typ === "przetwornica"
            ? przetwornicaPonizejMin(etykieta, t, u.minTempPracyC)
            : urzadzeniePonizejMin(u.typ, etykieta, t, u.minTempPracyC),
      )
    }
    return { id: u.id, nazwa, nr, typ: u.typ, zapasK }
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
