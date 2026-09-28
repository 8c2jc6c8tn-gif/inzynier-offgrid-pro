import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { GrzalkiDachoweInput } from "./input"
import { validateInput } from "./validation"
import { brakZapasuMocy, sprawdzZapasMocy, wiekszeNizPompa } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "P = L \\cdot p_{m};\\; E = P \\cdot t / 1000"

export type GrzalkiDachoweResult = {
  /** Moc całkowita kabli grzewczych [W]. */
  mocW: number
  /** Zużycie energii na dobę pracy [kWh/doba]. */
  energiaKwhDoba: number
}

const PUSTY_WYNIK: GrzalkiDachoweResult = { mocW: 0, energiaKwhDoba: 0 }

/**
 * Ekran 11, Moduł 7 — "Obciążenie grzałek dachowych i rynnowych" (dawne 6.16). Wzór wprost z
 * przykładu źródła: 12 m × 30 W/m = 360 W; 6 h/dobę → 2,16 kWh/dobę. Moc na metr i czas pracy
 * wpisuje user (30 W/m i 6 h to przykład, nie reguła — Dyrektywa #1). 🟡 ze źródła: grzałki
 * mogą obciążyć system bardziej niż pompa ciepła — sprawdzane, gdy user poda moc pompy i/lub zapas
 * mocy. Identyfikacja stref zatorów lodowych (sekcja B) — bez modelu dachu z M1, tylko opis w UI.
 */
export function calculateGrzalkiDachowe(input: GrzalkiDachoweInput): CalcResult<GrzalkiDachoweResult> {
  const inputs: Record<string, number> = {
    dlugoscKablaM: input.dlugoscKablaM ?? 0,
    mocNaMetrW: input.mocNaMetrW ?? 0,
    godzinyPracyNaDobe: input.godzinyPracyNaDobe ?? 0,
    mocPompyCieplaW: input.mocPompyCieplaW ?? 0,
    zapasMocyW: input.zapasMocyW ?? 0,
  }
  const wynik = (status: CalcResult<unknown>["status"], warnings: Warning[]): CalcResult<GrzalkiDachoweResult> => ({
    value: PUSTY_WYNIK,
    unit: "W",
    status,
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", errors)
  const { dlugoscKablaM, mocNaMetrW, godzinyPracyNaDobe } = input
  if (!dlugoscKablaM || !mocNaMetrW || godzinyPracyNaDobe === null) return wynik("INCOMPLETE", [])

  const mocW = dlugoscKablaM * mocNaMetrW
  const energiaKwhDoba = (mocW * godzinyPracyNaDobe) / 1000

  const warnings: Warning[] = []
  if (input.mocPompyCieplaW !== null && input.mocPompyCieplaW > 0 && mocW > input.mocPompyCieplaW) {
    warnings.push(wiekszeNizPompa(mocW, input.mocPompyCieplaW))
  }
  if (input.zapasMocyW === null) warnings.push(sprawdzZapasMocy())
  else if (mocW > input.zapasMocyW) warnings.push(brakZapasuMocy(mocW, input.zapasMocyW))

  const assumptions: Assumption[] = [{ kod: "GRZALKI-ZALOZENIE-MOC-STALA" }, { kod: "GRZALKI-ZALOZENIE-DLUGOSC-USERA" }]

  return {
    value: { mocW, energiaKwhDoba },
    unit: "W",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
