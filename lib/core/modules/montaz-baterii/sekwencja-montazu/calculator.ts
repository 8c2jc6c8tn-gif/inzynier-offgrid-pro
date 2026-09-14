import type { CalcResult } from "@/lib/core/calc-result"
import type { SekwencjaMontazuInput } from "./input"
import { validateInput } from "./validation"
import { nieparzystaLiczbaOgniw, zaDuzoOgniw, zaMaloOgniw } from "./warnings"
import { MAX_OGNIW, MIN_OGNIW, PRESETY_LICZBY_OGNIW } from "./constants"
import { MAX_ZALECANE_NAPIECIE_OGNIWA_V } from "@/lib/core/modules/montaz-baterii/demontaz-pakietu/constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PolaczenieBusbar = {
  numer: number
  zOgniwa: number
  doOgniwa: number
  /** true = połączenie przechodzi między rzędami (dolny/górny), nie w obrębie jednego rzędu. */
  miedzyRzedami: boolean
}

export type PrzewodBms = {
  /** Numer przewodu balansującego, B0..B{liczbaOgniw}. */
  numer: number
  etykieta: string
  punkt: string
  napiecieNominalneV: number
}

export type SekwencjaMontazuResult = {
  polaczeniaBusbarow: PolaczenieBusbar[]
  okablowanieBms: PrzewodBms[]
  liczbaRzedow: 2
  ogniwWRzedzie: number
  napiecieCalkowiteNominalneV: number
}

/**
 * Generuje kolejność połączeń busbarów dla `liczbaOgniw` ogniw ułożonych w 2 rzędach (górny
 * 1..N/2 od lewej, dolny N/2+1..N od prawej — "wąż"/serpentyna), tak jak opisano dla 16S w
 * `docs/zrodla/Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (TOM 2 §3), uogólnione na dowolną
 * parzystą liczbę ogniw. Zawsze `liczbaOgniw - 1` połączeń (szereg).
 */
export function generujPolaczeniaBusbarow(liczbaOgniw: number): PolaczenieBusbar[] {
  const polOgniwa = liczbaOgniw / 2
  const polaczenia: PolaczenieBusbar[] = []
  for (let ogniwo = 1; ogniwo < liczbaOgniw; ogniwo++) {
    polaczenia.push({
      numer: ogniwo,
      zOgniwa: ogniwo,
      doOgniwa: ogniwo + 1,
      miedzyRzedami: ogniwo === polOgniwa,
    })
  }
  return polaczenia
}

/**
 * Generuje sekwencję przewodów balansujących BMS (B0..B{liczbaOgniw}) — B0 to minus pierwszego
 * ogniwa (ten sam punkt co B-), B{i} to plus i-tego ogniwa, B{liczbaOgniw} to jednocześnie B+
 * pakietu. 1:1 z logiką TOM 3 §2 źródła, uogólnione z 16S na dowolną liczbę ogniw.
 */
export function generujOkablowanieBms(liczbaOgniw: number): PrzewodBms[] {
  const przewody: PrzewodBms[] = [
    { numer: 0, etykieta: "B0 (czarny)", punkt: "Minus ogniwa 1 (ten sam punkt co B−)", napiecieNominalneV: 0 },
  ]
  for (let ogniwo = 1; ogniwo <= liczbaOgniw; ogniwo++) {
    przewody.push({
      numer: ogniwo,
      etykieta: `B${ogniwo}`,
      punkt: `Plus ogniwa ${ogniwo}${ogniwo === liczbaOgniw ? " (to jest B+ pakietu)" : ""}`,
      napiecieNominalneV: Math.round(MAX_ZALECANE_NAPIECIE_OGNIWA_V * ogniwo * 100) / 100,
    })
  }
  return przewody
}

function pusty(): SekwencjaMontazuResult {
  return {
    polaczeniaBusbarow: [],
    okablowanieBms: [],
    liczbaRzedow: 2,
    ogniwWRzedzie: 0,
    napiecieCalkowiteNominalneV: 0,
  }
}

/**
 * Ekran A3b/A4b, Moduł 11 — generator szczegółowej sekwencji montażu pakietu (połączenia
 * busbarów + okablowanie BMS), parametryzowany liczbą ogniw w szeregu (4S/8S/16S + dowolna
 * inna parzysta wartość w rozsądnym zakresie). Na wyraźną prośbę właściciela projektu
 * (2026-09-13): "żeby nasz poradnik dopasowywał się do 4S, 8S, 16S".
 *
 * Napięcie nominalne przewodów BMS reużywa `MAX_ZALECANE_NAPIECIE_OGNIWA_V` (3,2V, M11/A6
 * `demontaz-pakietu`) — ten sam fakt fizyczny (napięcie nominalne ogniwa LiFePO4), nie
 * przypadkowa zbieżność liczb (patrz `kontrakty-rdzenia.md` §4, pułapka "echo z przypadku").
 */
export function calculateSekwencjaMontazu(input: SekwencjaMontazuInput): CalcResult<SekwencjaMontazuResult> {
  const { errors } = validateInput(input)
  const inputs = { liczbaOgniw: input.liczbaOgniw }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "kroków",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.liczbaOgniw === 0) {
    return {
      value: pusty(),
      unit: "kroków",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.liczbaOgniw % 2 !== 0) {
    return {
      value: pusty(),
      unit: "kroków",
      status: "OUT_OF_SCOPE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [nieparzystaLiczbaOgniw(input.liczbaOgniw)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.liczbaOgniw < MIN_OGNIW) {
    return {
      value: pusty(),
      unit: "kroków",
      status: "OUT_OF_SCOPE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [zaMaloOgniw(input.liczbaOgniw)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.liczbaOgniw > MAX_OGNIW) {
    return {
      value: pusty(),
      unit: "kroków",
      status: "OUT_OF_SCOPE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [zaDuzoOgniw(input.liczbaOgniw)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const polaczeniaBusbarow = generujPolaczeniaBusbarow(input.liczbaOgniw)
  const okablowanieBms = generujOkablowanieBms(input.liczbaOgniw)
  const napiecieCalkowiteNominalneV =
    Math.round(MAX_ZALECANE_NAPIECIE_OGNIWA_V * input.liczbaOgniw * 100) / 100

  const isPreset = (PRESETY_LICZBY_OGNIW as readonly number[]).includes(input.liczbaOgniw)
  const assumptions = isPreset
    ? [
        `Układ 2 rzędów po ${input.liczbaOgniw / 2} ogniw (serpentyna) — 1:1 ze źródła dla tej liczby ogniw.`,
      ]
    : [
        `Układ 2 rzędów po ${input.liczbaOgniw / 2} ogniw (serpentyna) — źródło opisuje wprost tylko 4S/8S/16S; ` +
          `dla ${input.liczbaOgniw}S ten sam wzorzec geometryczny zastosowany logicznie (nie 1:1 ze źródła).`,
      ]

  return {
    value: {
      polaczeniaBusbarow,
      okablowanieBms,
      liczbaRzedow: 2,
      ogniwWRzedzie: input.liczbaOgniw / 2,
      napiecieCalkowiteNominalneV,
    },
    unit: "kroków",
    status: "VALID",
    formula: "",
    inputs,
    assumptions,
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
