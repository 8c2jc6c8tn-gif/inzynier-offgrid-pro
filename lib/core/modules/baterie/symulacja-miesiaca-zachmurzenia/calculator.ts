import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { SymulacjaZachmurzeniaInput } from "./input"
import { validateInput } from "./validation"
import { systemNiePrzetrwaScenariusza } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type SymulacjaZachmurzeniaResult = {
  dobowyDeficytKwh: number
  przetrwaCalyScenariusz: boolean
  dzienPadnieSystem: number | null
  godzinaPadnieSystemW24H: number | null
  energiaBrakujacaKwh: number
}

const FORMULA =
  "\\Delta E_{doba} = E_{zapotrzebowanie} - E_{produkcja,nom} \\times \\dfrac{zachmurzenie\\%}{100}; \\quad " +
  "dzien_{blackout} = \\left\\lfloor \\dfrac{E_{poczatkowa}}{\\Delta E_{doba}} \\right\\rfloor + 1"

const PUSTY_WYNIK: SymulacjaZachmurzeniaResult = {
  dobowyDeficytKwh: 0,
  przetrwaCalyScenariusz: false,
  dzienPadnieSystem: null,
  godzinaPadnieSystemW24H: null,
  energiaBrakujacaKwh: 0,
}

/**
 * Ekran 33, Moduł 4 — "Symulacja miesiąca zachmurzenia (No-Sun Scenario)" (dawne 3.37, Sekcja B).
 * Źródło opisuje narrację (produkcja PV na poziomie 5-10% nominalnej przez zadaną liczbę dni,
 * codzienny ubytek energii z baterii, sprawdzenie kiedy nastąpi "śmierć systemu"), bez jawnego
 * wzoru — wzór wyżej to bilans energii dzień po dniu, udokumentowany jako decyzja projektowa
 * (ten sam wzorzec co Ekran 3). Godzina blackoutu w danym dniu zakłada, jak w Ekranie 3, stałą
 * średnią moc deficytu w ciągu doby, nie pełny profil godzinowy.
 *
 * `liczbaDniScenariusza` ma jedyną jawnie podaną w źródle wartość domyślną (10) — patrz
 * constants.ts. `poziomZachmurzeniaPct` NIE ma jednej kanonicznej wartości (źródło podaje zakres
 * 5-10%) — pole ręczne, bez ukrytego domyślnego wypełnienia (8.6).
 */
function symuluj(input: SymulacjaZachmurzeniaInput): SymulacjaZachmurzeniaResult {
  const produkcjaWScenariuszuKwh = input.produkcjaNominalnaDobowaKwh * (input.poziomZachmurzeniaPct / 100)
  const dobowyDeficytKwh = input.zapotrzebowanieDoboweKwh - produkcjaWScenariuszuKwh
  const energiaPoczatkowaKwh = input.pojemnoscUzytecznaKwh * (input.socStartPct / 100)

  if (dobowyDeficytKwh <= 0) {
    return { ...PUSTY_WYNIK, dobowyDeficytKwh, przetrwaCalyScenariusz: true }
  }

  const energiaCalkowitePotrzebnaKwh = dobowyDeficytKwh * input.liczbaDniScenariusza

  if (energiaPoczatkowaKwh >= energiaCalkowitePotrzebnaKwh) {
    return { ...PUSTY_WYNIK, dobowyDeficytKwh, przetrwaCalyScenariusz: true }
  }

  const dniPelne = Math.floor(energiaPoczatkowaKwh / dobowyDeficytKwh)
  const dzienPadnieSystem = dniPelne + 1
  const resztaEnergiiKwh = energiaPoczatkowaKwh - dobowyDeficytKwh * dniPelne
  const godzinaPadnieSystemW24H = (resztaEnergiiKwh / dobowyDeficytKwh) * 24
  const energiaBrakujacaKwh = energiaCalkowitePotrzebnaKwh - energiaPoczatkowaKwh

  return {
    dobowyDeficytKwh,
    przetrwaCalyScenariusz: false,
    dzienPadnieSystem,
    godzinaPadnieSystemW24H,
    energiaBrakujacaKwh,
  }
}

export function calculateSymulacjaZachmurzenia(
  input: SymulacjaZachmurzeniaInput,
): CalcResult<SymulacjaZachmurzeniaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
    socStartPct: input.socStartPct,
    zapotrzebowanieDoboweKwh: input.zapotrzebowanieDoboweKwh,
    produkcjaNominalnaDobowaKwh: input.produkcjaNominalnaDobowaKwh,
    poziomZachmurzeniaPct: input.poziomZachmurzeniaPct,
    liczbaDniScenariusza: input.liczbaDniScenariusza,
  }

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
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
    input.pojemnoscUzytecznaKwh === 0 ||
    input.zapotrzebowanieDoboweKwh === 0 ||
    input.produkcjaNominalnaDobowaKwh === 0 ||
    input.liczbaDniScenariusza === 0

  if (niekompletne) {
    return {
      value: PUSTY_WYNIK,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const value = symuluj(input)
  const assumptions: Assumption[] = [{ kod: "SYMULACJA-SREDNIA-MOC-NIE-PROFIL-GODZINOWY" }]
  const warnings =
    !value.przetrwaCalyScenariusz && value.dzienPadnieSystem !== null
      ? [systemNiePrzetrwaScenariusza(value.dzienPadnieSystem, value.energiaBrakujacaKwh)]
      : []

  return {
    value,
    unit: "kWh",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
