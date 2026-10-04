import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { obliczKosztZaKwh } from "@/lib/core/modules/baterie/oplacalnosc-magazynu/calculator"
import type { VehicleToHomeInput } from "./input"
import { validateInput } from "./validation"
import { tylkoV2l } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type VehicleToHomeResult = {
  pojemnoscRealnaKwh: number
  kosztZaKwh: number
}

const FORMULA =
  "C_{realna} = (C_{EV} - rezerwa) \\times \\eta \\;\\; ; \\;\\; koszt_{kWh} = cena_{wymiany} / (C_{EV} \\times cykle \\times \\eta)"

/**
 * Ekran 19, Moduł 4 "Magazyn energii / baterie" — "Vehicle-to-Home (V2H)" (dawne 3.21,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Koszt za kWh — **wzorzec "echo"**:
 * reużywa `obliczKosztZaKwh` wyekstrahowanego z `oplacalnosc-magazynu/calculator.ts` (Ekran 23) —
 * identyczna struktura wzoru (cena / (pojemność × cykle × sprawność)), tylko inne pola wejścia
 * (bateria trakcyjna EV zamiast baterii domowej).
 */
export function calculateVehicleToHome(input: VehicleToHomeInput): CalcResult<VehicleToHomeResult> {
  const { errors } = validateInput(input)
  const pustyWynik: VehicleToHomeResult = { pojemnoscRealnaKwh: 0, kosztZaKwh: 0 }
  const inputs = {
    pojemnoscBaterEvKwh: input.pojemnoscBaterEvKwh,
    rezerwaNaDojazdKwh: input.rezerwaNaDojazdKwh,
    sprawnoscEfektywnaPct: input.sprawnoscEfektywnaPct,
    kosztWymianyBateriiZl: input.kosztWymianyBateriiZl,
    liczbaCykli: input.liczbaCykli,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-VEHICLE-TO-HOME",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.pojemnoscBaterEvKwh === 0 ||
    input.sprawnoscEfektywnaPct === 0 ||
    input.kosztWymianyBateriiZl === 0 ||
    input.liczbaCykli === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-VEHICLE-TO-HOME",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const sprawnosc = input.sprawnoscEfektywnaPct / 100
  const pojemnoscRealnaKwh = (input.pojemnoscBaterEvKwh - input.rezerwaNaDojazdKwh) * sprawnosc
  const { kosztZaKwh } = obliczKosztZaKwh(
    input.kosztWymianyBateriiZl,
    input.pojemnoscBaterEvKwh,
    input.liczbaCykli,
    input.sprawnoscEfektywnaPct,
  )

  const warnings = input.wspieraV2h ? [] : [tylkoV2l()]

  return {
    value: { pojemnoscRealnaKwh, kosztZaKwh },
    unit: "kWh",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-VEHICLE-TO-HOME",
    inputs,
    assumptions: [{ kod: "REZERWA-DEGRADACJA-MODEL-UPROSZCZONY" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
