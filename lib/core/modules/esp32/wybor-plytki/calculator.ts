import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { CECHA_ZASILANIA, PLYTKI_ESP32, POTRZEBY_PLYTKI, type CechaPlytki } from "./constants"
import type { WyborPlytkiInput } from "./input"
import { bezWymagan, brakJednejPlytki } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "rekomendacja = \\arg\\max_{p} |cechy(p) \\cap potrzeby|"

export type DopasowaniePlytki = { id: string; dopasowania: number }

export type WyborPlytkiResult = {
  /** Wszystkie warianty ze źródła z liczbą pokrytych potrzeb, w kolejności źródła. */
  plytki: DopasowaniePlytki[]
  /** Warianty z największą liczbą dopasowań (> 0); kilka przy remisie, puste bez potrzeb. */
  rekomendacja: string[]
  liczbaPotrzeb: number
}

/**
 * Ekran 1, Moduł 9 — dobór wariantu płytki po cechach opisanych w źródle (B). Przykład C ("do 10 czujników → DevKit V1",
 * "C3 — 3× mniejszy pobór") to ilustracja, nie reguła — ani próg 10 czujników, ani krotność poboru nie są tu liczone
 * (Dyrektywa #1). Biblia §9.1 wymienia też kanały ADC, UART/I2C/SPI, flash i pobór prądu — źródło nie podaje ich wartości
 * per płytka, więc ekran ich nie porównuje (sprawdź kartę katalogową).
 */
export function calculateWyborPlytki(input: WyborPlytkiInput): CalcResult<WyborPlytkiResult> {
  const potrzeby: CechaPlytki[] = POTRZEBY_PLYTKI.filter((p) => input[p])
  const cechaZasilania = input.zasilanie ? CECHA_ZASILANIA[input.zasilanie] : null
  if (cechaZasilania) potrzeby.push(cechaZasilania)

  const plytki = PLYTKI_ESP32.map((p) => ({ id: p.id, dopasowania: potrzeby.filter((c) => p.cechy.includes(c)).length }))
  const najlepsze = Math.max(...plytki.map((p) => p.dopasowania))
  const rekomendacja = najlepsze > 0 ? plytki.filter((p) => p.dopasowania === najlepsze).map((p) => p.id) : []
  const liczbaPotrzeb = potrzeby.length

  const warnings: Warning[] = []
  if (input.zasilanie && liczbaPotrzeb === 0) warnings.push(bezWymagan())
  else if (liczbaPotrzeb > 0 && najlepsze < liczbaPotrzeb) warnings.push(brakJednejPlytki(liczbaPotrzeb, najlepsze))

  return {
    value: { plytki, rekomendacja, liczbaPotrzeb },
    unit: "",
    // Info never raises the status (Directive #6).
    status: input.zasilanie === null ? "INCOMPLETE" : "VALID",
    formula: FORMULA,
    inputs: { liczbaPotrzeb, dopasowaniaMax: najlepsze },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
