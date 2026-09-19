import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { StratyZlaczkiMc4Input } from "./input"
import { validateInput } from "./validation"
import { dobryStyk, podwyzszonaRezystancja, zlyStyk } from "./warnings"
import {
  REZYSTANCJA_DOBRY_STAN_MAX_MOHM,
  MNOZNIK_ZLY_STYK,
} from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type StratyZlaczkiMc4Result = {
  strataNaZlaczkeW: number
  strataCalkowitaW: number
}

const FORMULA = "P_{złączka} = I^2 \\times R \\;\\; ; \\;\\; P_{całkowita} = n \\times P_{złączka}"

/**
 * Ekran 26, Moduł 3 "Instalacja PV" — "Straty na złączkach MC4 w praktyce" (dawne 2.46,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md). Prawo Joule'a — fizyka bez wolnego parametru poza
 * rezystancją, którą źródło podaje jako zakres (0,5-2 mΩ dobry stan), więc pole ręcznego wpisu
 * (D16, `rejestr-decyzji.md`), nie ukryty domyślny.
 *
 * Przykład źródła (20 złączek, 10A, dobry styk → 2W) odtworzony DOKŁADNIE przy R=1mΩ (w środku
 * zakresu 0,5-2 mΩ), zweryfikowane niezależnie w Pythonie. Przykład "zły styk → nawet 25W"
 * (10× górna granica dobrego stanu, czyli R=20mΩ) daje 40W — źródło samo używa słowa "nawet" dla
 * obu liczb (mnożnika i wyniku), więc to nie rozbieżność wzoru, tylko przybliżony charakter
 * przykładu źródła (górna granica "do X", nie pojedyncza wartość) — analogicznie do napór-wiatru
 * i niedopasowanie-paneli, wzór wdrożony dokładnie jak podany, nie naciągnięty do przykładu.
 */
export function calculateStratyZlaczkiMc4(input: StratyZlaczkiMc4Input): CalcResult<StratyZlaczkiMc4Result> {
  const { errors } = validateInput(input)
  const pustyWynik: StratyZlaczkiMc4Result = { strataNaZlaczkeW: 0, strataCalkowitaW: 0 }
  const inputs = {
    rezystancjaZlaczkiMOhm: input.rezystancjaZlaczkiMOhm,
    liczbaZlaczek: input.liczbaZlaczek,
    pradA: input.pradA,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.rezystancjaZlaczkiMOhm === 0 || input.liczbaZlaczek === 0 || input.pradA === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const rezystancjaOhm = input.rezystancjaZlaczkiMOhm / 1000
  const strataNaZlaczkeW = input.pradA * input.pradA * rezystancjaOhm
  const strataCalkowitaW = input.liczbaZlaczek * strataNaZlaczkeW

  const progZlyStykMOhm = REZYSTANCJA_DOBRY_STAN_MAX_MOHM * MNOZNIK_ZLY_STYK
  const warnings =
    input.rezystancjaZlaczkiMOhm <= REZYSTANCJA_DOBRY_STAN_MAX_MOHM
      ? [dobryStyk(input.rezystancjaZlaczkiMOhm, strataCalkowitaW)]
      : input.rezystancjaZlaczkiMOhm <= progZlyStykMOhm
        ? [podwyzszonaRezystancja(input.rezystancjaZlaczkiMOhm, strataCalkowitaW)]
        : [zlyStyk(input.rezystancjaZlaczkiMOhm, strataCalkowitaW)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { strataNaZlaczkeW, strataCalkowitaW },
    unit: "W",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      { kod: "REZYSTANCJA-ZLACZKI-RECZNIE" },
      { kod: "PRAD-SZEREGOWY-PRZEZ-WSZYSTKIE-ZLACZKI" },
    ] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
