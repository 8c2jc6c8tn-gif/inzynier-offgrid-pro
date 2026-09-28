import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { ZuzyciePerUrzadzenieInput } from "./input"
import { validateInput } from "./validation"
import { cykliczneRealnieMniej } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_{dobowe} = \\sum P \\times t \\times k_{pracy} \\;\\; (k_{pracy} = 1 \\text{ dla urządzeń niecyklicznych})"

export type WynikUrzadzenia = {
  id: string
  nazwa: string
  /** Zużycie realne [Wh/dobę]. */
  zuzycieWh: number
  /** Zużycie z samej mocy znamionowej × czasu [Wh/dobę] — do porównania dla cyklicznych. */
  zuzycieZnamionoweWh: number
}

export type ZuzyciePerUrzadzenieResult = {
  urzadzenia: WynikUrzadzenia[]
  sumaWh: number
}

/** Daily energy of one device: P × t × duty cycle (1 for non-cyclic devices). */
export function obliczZuzycieDoboweWh(mocW: number, godzinNaDobe: number, wspolczynnikPracyPct: number): number {
  return mocW * godzinNaDobe * (wspolczynnikPracyPct / 100)
}

/**
 * Ekran 11, Moduł 12 — "Kalkulator zużycia energii per urządzenie" (scala dawne 8.23–8.28 + 8.15).
 * Logika wspólna 1:1 ze źródła; przykład (lodówka turystyczna 45 W, 40% przy 25 °C → ok. 430 Wh, nie
 * 1080 Wh) odtworzony: 432 Wh. Współczynnik pracy wpisuje użytkownik (40% to przykład źródła dla jednej
 * lodówki w 25 °C, nie stała — Dyrektywa #1). „Baza urządzeń” ze źródła to tylko nazwy, bez mocy —
 * od 28.09.2026 (D33) przykładowe średnie moce w `przykladowe-urzadzenia.ts`, wyłącznie jako
 * podpowiedź na ekranie; kalkulator liczy zawsze z mocy wpisanej przez użytkownika.
 */
export function calculateZuzyciePerUrzadzenie(input: ZuzyciePerUrzadzenieInput): CalcResult<ZuzyciePerUrzadzenieResult> {
  const { errors } = validateInput(input)
  const pusty: ZuzyciePerUrzadzenieResult = { urzadzenia: [], sumaWh: 0 }
  const inputs = { liczbaUrzadzen: input.urzadzenia.length }

  if (errors.length > 0) {
    return {
      value: pusty,
      unit: "Wh",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const wypelnione = input.urzadzenia.filter((u) => u.mocW > 0 && u.godzinNaDobe > 0)
  const brakWspolczynnika = wypelnione.some((u) => u.cykliczne && u.wspolczynnikPracyPct === 0)
  if (wypelnione.length === 0 || brakWspolczynnika) {
    return {
      value: pusty,
      unit: "Wh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings: Warning[] = []
  const urzadzenia: WynikUrzadzenia[] = wypelnione.map((u) => {
    const zuzycieZnamionoweWh = obliczZuzycieDoboweWh(u.mocW, u.godzinNaDobe, 100)
    const zuzycieWh = u.cykliczne ? obliczZuzycieDoboweWh(u.mocW, u.godzinNaDobe, u.wspolczynnikPracyPct) : zuzycieZnamionoweWh
    if (u.cykliczne && zuzycieWh < zuzycieZnamionoweWh) {
      warnings.push(cykliczneRealnieMniej(u.nazwa, zuzycieWh, zuzycieZnamionoweWh))
    }
    return { id: u.id, nazwa: u.nazwa, zuzycieWh, zuzycieZnamionoweWh }
  })
  const sumaWh = urzadzenia.reduce((s, u) => s + u.zuzycieWh, 0)

  const assumptions: Assumption[] = []
  if (wypelnione.some((u) => u.cykliczne)) assumptions.push({ kod: "ZPU-ZALOZENIE-WSPOLCZYNNIK-ZALEZY-OD-TEMPERATURY" })

  return {
    value: { urzadzenia, sumaWh },
    unit: "Wh",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
