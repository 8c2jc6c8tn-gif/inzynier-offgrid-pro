import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { KociolElektrycznyInput } from "./input"
import { validateInput } from "./validation"
import { oszczednoscInfo } from "./warnings"
import { COP_KOTLA_ELEKTRYCZNEGO } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type KociolElektrycznyResult = {
  energiaPompyKwh: number
  energiaKotlaKwh: number
  kosztPompyZl: number
  kosztKotlaZl: number
  oszczednoscZl: number
  mnoznikZuzycia: number
}

const FORMULA =
  "E_{elektryczna} = Q_{cieplna} / COP \\;\\; ; \\;\\; koszt = E_{elektryczna} \\times cena_{kWh}"

/**
 * Ekran dodatkowy, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Kocioł elektryczny —
 * porównanie kosztu z pompą ciepła" (dawne 5.33, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md,
 * Część 2A). Wzorzec echo Ekranu 5 (COP): `E_elektryczna = Q_cieplna / COP`, tu zastosowany
 * dwukrotnie — raz dla pompy ciepła (COP wpisany ręcznie, tak jak w Ekranie 5), raz dla kotła
 * elektrycznego (COP=1, sprawność 99% podana wprost przez źródło — zaokrąglona do 1, różnica
 * 1% pomijalna wobec 3-4-krotnej różnicy zużycia). Źródło: "kocioł elektryczny zużywa 3-4× więcej
 * prądu na kWh ciepła niż pompa (COP=1 vs COP=3-4)" — przy wpisaniu copPompy=3 lub 4 mnożnik
 * zużycia wychodzi dokładnie 3× lub 4×, zgodnie ze źródłem.
 */
export function calculateKociolElektryczny(input: KociolElektrycznyInput): CalcResult<KociolElektrycznyResult> {
  const { errors } = validateInput(input)
  const pustyWynik: KociolElektrycznyResult = {
    energiaPompyKwh: 0,
    energiaKotlaKwh: 0,
    kosztPompyZl: 0,
    kosztKotlaZl: 0,
    oszczednoscZl: 0,
    mnoznikZuzycia: 0,
  }
  const inputs = {
    zapotrzebowanieCieplneKwh: input.zapotrzebowanieCieplneKwh,
    copPompy: input.copPompy,
    cenaZaKwhZl: input.cenaZaKwhZl,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "zł",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-KOCIOL-ELEKTRYCZNY",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.zapotrzebowanieCieplneKwh === 0 || input.copPompy === 0 || input.cenaZaKwhZl === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "zł",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-KOCIOL-ELEKTRYCZNY",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaPompyKwh = input.zapotrzebowanieCieplneKwh / input.copPompy
  const energiaKotlaKwh = input.zapotrzebowanieCieplneKwh / COP_KOTLA_ELEKTRYCZNEGO
  const kosztPompyZl = energiaPompyKwh * input.cenaZaKwhZl
  const kosztKotlaZl = energiaKotlaKwh * input.cenaZaKwhZl
  const oszczednoscZl = kosztKotlaZl - kosztPompyZl
  const mnoznikZuzycia = energiaKotlaKwh / energiaPompyKwh

  const warnings = [oszczednoscInfo(oszczednoscZl, mnoznikZuzycia)]

  return {
    value: { energiaPompyKwh, energiaKotlaKwh, kosztPompyZl, kosztKotlaZl, oszczednoscZl, mnoznikZuzycia },
    unit: "zł",
    status: "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-KOCIOL-ELEKTRYCZNY",
    inputs,
    assumptions: [
      { kod: "KOCIOL-SPRAWNOSC-COP1" },
      { kod: "TA-SAMA-CENA-ENERGII-OBA-ZRODLA" },
    ] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
