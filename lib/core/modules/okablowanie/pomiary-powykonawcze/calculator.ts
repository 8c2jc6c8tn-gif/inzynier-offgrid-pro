import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PomiaryPowykonawczeInput } from "./input"
import { validateInput } from "./validation"
import { MAX_CZAS_ZADZIALANIA_RCD_S, MAX_REZYSTANCJA_UZIEMIENIA_OHM, MIN_REZYSTANCJA_IZOLACJI_MOHM } from "./constants"
import {
  ciagloscNiepotwierdzona,
  czasRcdNiezmierzony,
  czasRcdZaDlugi,
  rezystancjaIzolacjiZaNiska,
  rezystancjaUziemieniaNiezmierzona,
  rezystancjaUziemieniaZaWysoka,
  termowizjaNiepotwierdzona,
  testZwarciowyNiepotwierdzony,
  wszystkoOk,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type PomiaryPowykonawczeResult = {
  testowPrzeszlo: number
  testowLacznie: number
}

const TESTOW_LACZNIE = 6

function pusty(): PomiaryPowykonawczeResult {
  return { testowPrzeszlo: 0, testowLacznie: TESTOW_LACZNIE }
}

/**
 * Ekran 29, Moduł 5 "Okablowanie i zabezpieczenia" — "Pomiary i testy powykonawcze"
 * (dawne 4.40, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec E — 6 testów
 * niezależnych, każdy sprawdzany osobno wg progu ze źródła. Twardy stop 1:1 ze źródła:
 * "dowolny wynik poza progiem = brak formalnego odbioru instalacji" — dlatego każdy test
 * nieukończony lub poza progiem jest ostrzeżeniem `critical`, nie samym `warning`.
 */
export function calculatePomiaryPowykonawcze(
  input: PomiaryPowykonawczeInput,
): CalcResult<PomiaryPowykonawczeResult> {
  const { errors } = validateInput(input)
  const inputs = {
    rezystancjaIzolacjiMohm: input.rezystancjaIzolacjiMohm,
    rezystancjaUziemieniaOhm: input.rezystancjaUziemieniaOhm,
    czasZadzialaniaRcdS: input.czasZadzialaniaRcdS,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "testów",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const nicJeszczeNieWpisano =
    !input.ciagloscPotwierdzona &&
    input.rezystancjaIzolacjiMohm === 0 &&
    input.rezystancjaUziemieniaOhm === 0 &&
    input.czasZadzialaniaRcdS === 0 &&
    !input.testZwarciowyPotwierdzony &&
    !input.termowizjaPotwierdzona

  if (nicJeszczeNieWpisano) {
    return {
      value: pusty(),
      unit: "testów",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const progUziemieniaOhm = MAX_REZYSTANCJA_UZIEMIENIA_OHM[input.celUziemienia]

  const warnings: Warning[] = []

  if (!input.ciagloscPotwierdzona) {
    warnings.push(ciagloscNiepotwierdzona())
  }

  if (input.rezystancjaIzolacjiMohm <= MIN_REZYSTANCJA_IZOLACJI_MOHM) {
    warnings.push(rezystancjaIzolacjiZaNiska(input.rezystancjaIzolacjiMohm))
  }

  if (input.rezystancjaUziemieniaOhm === 0) {
    warnings.push(rezystancjaUziemieniaNiezmierzona())
  } else if (input.rezystancjaUziemieniaOhm >= progUziemieniaOhm) {
    warnings.push(rezystancjaUziemieniaZaWysoka(input.rezystancjaUziemieniaOhm, progUziemieniaOhm))
  }

  if (input.czasZadzialaniaRcdS === 0) {
    warnings.push(czasRcdNiezmierzony())
  } else if (input.czasZadzialaniaRcdS >= MAX_CZAS_ZADZIALANIA_RCD_S) {
    warnings.push(czasRcdZaDlugi(input.czasZadzialaniaRcdS))
  }

  if (!input.testZwarciowyPotwierdzony) {
    warnings.push(testZwarciowyNiepotwierdzony())
  }

  if (!input.termowizjaPotwierdzona) {
    warnings.push(termowizjaNiepotwierdzona())
  }

  const testowPrzeszlo = TESTOW_LACZNIE - warnings.length

  if (warnings.length === 0) {
    warnings.push(wszystkoOk())
  }

  const maKrytyczne = warnings.some((w) => w.level === "critical")

  return {
    value: { testowPrzeszlo, testowLacznie: TESTOW_LACZNIE },
    unit: "testów",
    status: maKrytyczne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
