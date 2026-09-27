import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { DoborPojemnosciInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type DoborPojemnosciResult = {
  pojemnoscUzytecznaKwh: number
}

const FORMULA =
  "C_{uzyteczna} = \\dfrac{E_{dobowe} \\times d_{autonomii}}{\\eta_{falownika} \\times DoD}"

/**
 * Ekran 1, Moduł 4 — "Dobór pojemności baterii" (dawne 3.1,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła.
 *
 * Bufor starzeniowy z Ekranu 5 ("np. +20% na 10 lat") świadomie NIE doliczony — ten ekran
 * jeszcze nie istnieje w kodzie, doliczenie go teraz wymagałoby wymyślenia jego logiki.
 *
 * Uwaga o przykładzie źródła (Sekcja C): "12 kWh/dobę, 3 dni autonomii → 45 kWh użytecznej"
 * odtwarza się dokładnie tylko przy sprawność=100% i DoD=80% — NIE przy sprawności 95%
 * wskazanej jako domyślna w Sekcji A tego samego ekranu. Zweryfikowane niezależnie (Python +
 * ręczne przeliczenie) przed implementacją — to rozbieżność w ilustracyjnym przykładzie źródła,
 * nie błąd tego wzoru; wzór wdrożony dokładnie jak podany w Sekcji B, rozbieżność udokumentowana
 * tutaj i w docs/memory.md zamiast cicho "poprawiona".
 */
export function obliczPojemnoscUzytecznaKwh(
  zapotrzebowanieDoboweKwh: number,
  dniAutonomii: number,
  sprawnoscFalownikaPct: number,
  dodPct: number,
): number {
  const sprawnosc = sprawnoscFalownikaPct / 100
  const dod = dodPct / 100
  return (zapotrzebowanieDoboweKwh * dniAutonomii) / (sprawnosc * dod)
}

/**
 * The same formula solved for days: `d = C × η × DoD / E_dobowe`. Echo for M12/E32 ("Ile dni
 * pracy bez słońca") — the question asked the other way round, for a battery the user already has.
 */
export function obliczDniAutonomiiZPojemnosci(
  pojemnoscKwh: number,
  zapotrzebowanieDoboweKwh: number,
  sprawnoscFalownikaPct: number,
  dodPct: number,
): number {
  const sprawnosc = sprawnoscFalownikaPct / 100
  const dod = dodPct / 100
  return (pojemnoscKwh * sprawnosc * dod) / zapotrzebowanieDoboweKwh
}

export function calculateDoborPojemnosci(input: DoborPojemnosciInput): CalcResult<DoborPojemnosciResult> {
  const { errors } = validateInput(input)
  const pustyWynik: DoborPojemnosciResult = { pojemnoscUzytecznaKwh: 0 }
  const inputs = {
    zapotrzebowanieDoboweKwh: input.zapotrzebowanieDoboweKwh,
    dniAutonomii: input.dniAutonomii,
    sprawnoscFalownikaPct: input.sprawnoscFalownikaPct,
    dodPct: input.dodPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.zapotrzebowanieDoboweKwh === 0 ||
    input.dniAutonomii === 0 ||
    input.sprawnoscFalownikaPct === 0 ||
    input.dodPct === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pojemnoscUzytecznaKwh = obliczPojemnoscUzytecznaKwh(
    input.zapotrzebowanieDoboweKwh,
    input.dniAutonomii,
    input.sprawnoscFalownikaPct,
    input.dodPct,
  )

  return {
    value: { pojemnoscUzytecznaKwh },
    unit: "kWh",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "BUFOR-STARZENIOWY-NIE-DOLICZONY" }] satisfies Assumption[],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
