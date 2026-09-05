import type { CalcResult } from "@/lib/core/calc-result"
import type { DopasowanieTablicyFalownikaInput } from "./input"
import { validateInput } from "./validation"
import { obliczNapiecieStringuZimowego } from "../stress-test-mppt/calculator"
import {
  napiecieZimoweZaWysokie,
  napiecieZimoweOk,
  ponizejOknaMppt,
  powyzejOknaMppt,
  wOknieMppt,
  pradPrzekroczony,
  pradOk,
  przewymiarowanieZaMale,
  przewymiarowanieZaDuze,
  przewymiarowanieOk,
} from "./warnings"
import { DC_AC_RATIO_ZALECANE_MIN, DC_AC_RATIO_ZALECANE_MAX } from "./constants"

// 🔎 TD11 (dlug-techniczny.md): sprawdza tylko 4 z 6 kryteriów źródła (napięcie zimowe, okno MPPT,
// prąd, przewymiarowanie DC/AC). Kryterium napięcia startowego w upale NIE zbudowane — wymaga
// współczynnika temperaturowego Vmp nieobecnego w źródle jako wzór.
export const CALCULATOR_VERSION = "1.0.0"

export type DopasowanieTablicyFalownikaResult = {
  vStringColdV: number
  vStringStcV: number
  iStringA: number
  mocPvW: number
  dcAcRatio: number
}

const FORMULA =
  "V_{string,zima} = V_{oc} \\times (1+\\beta(T_{min}-25)) \\times n \\;\\;;\\;\\; " +
  "V_{string,STC} = V_{mp} \\times n \\;\\;;\\;\\; I_{string} = I_{mp} \\;\\;;\\;\\; " +
  "\\frac{P_{PV}}{P_{falownika,AC}} = \\frac{V_{mp} \\times I_{mp} \\times n}{P_{AC}}"

/**
 * Ekran 14, Moduł 3 "Instalacja PV" — "Dopasowanie tablicy PV do falownika" (scala dawne 2.24,
 * 2.25, 2.26, 2.27, 2.37, 2.42, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md). Sprawdza JEDNOCZEŚNIE
 * cztery z sześciu kryteriów źródła, każde z jawnie podanym wzorem/zakresem:
 *  1. Napięcie zimowe vs limit falownika (wzorzec echo z Ekranu 5: `obliczNapiecieStringuZimowego`).
 *  2. Napięcie robocze (STC) vs okno MPPT falownika.
 *  3. Prąd roboczy stringu vs maksymalny prąd MPPT.
 *  5+6. Współczynnik przewymiarowania DC/AC (zalecany zakres 1,1-1,3 dla off-gridu, 1:1 ze
 *     źródła) — kryterium 6 ("ryzyko skrajności") to interpretacja tej samej liczby, nie osobny
 *     wzór, więc scalone z kryterium 5.
 *
 * Kryterium 4 źródła (napięcie startowe w upale, `V_min_start_falownika`) NIE jest tu liczone —
 * wymagałoby współczynnika temperaturowego Vmp (nie tego samego co β dla Voc), którego źródło
 * nie podaje jako wzoru ani zakresu w tym ekranie (przykład źródła "Vmp 35V → 31V w upał" jest
 * tylko ilustracją, nie definiuje współczynnika). Zgodnie z Dyrektywą #1
 * (`02_Dyrektywy_AI_Projektu.md`) nie wymyślamy tego współczynnika — kryterium pominięte,
 * udokumentowane jako świadomie niedomknięte.
 */
export function calculateDopasowanieTablicyFalownika(
  input: DopasowanieTablicyFalownikaInput,
): CalcResult<DopasowanieTablicyFalownikaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: DopasowanieTablicyFalownikaResult = {
    vStringColdV: 0,
    vStringStcV: 0,
    iStringA: 0,
    mocPvW: 0,
    dcAcRatio: 0,
  }
  const inputs = {
    vocStcV: input.vocStcV,
    vmpStcV: input.vmpStcV,
    impA: input.impA,
    betaPctNaC: input.betaPctNaC,
    tminC: input.tminC ?? 0,
    liczbaPaneliWStringu: input.liczbaPaneliWStringu,
    vMaxFalownikaV: input.vMaxFalownikaV,
    mpptMinV: input.mpptMinV,
    mpptMaxV: input.mpptMaxV,
    iMaxMpptA: input.iMaxMpptA,
    mocFalownikaAcW: input.mocFalownikaAcW,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.vocStcV === 0 ||
    input.vmpStcV === 0 ||
    input.impA === 0 ||
    input.betaPctNaC === 0 ||
    input.tminC === null ||
    input.liczbaPaneliWStringu === 0 ||
    input.vMaxFalownikaV === 0 ||
    input.mpptMinV === 0 ||
    input.mpptMaxV === 0 ||
    input.iMaxMpptA === 0 ||
    input.mocFalownikaAcW === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const tminC: number = input.tminC ?? 0
  const vStringColdV = obliczNapiecieStringuZimowego(
    input.vocStcV,
    input.betaPctNaC,
    tminC,
    input.liczbaPaneliWStringu,
  )
  const vStringStcV = input.vmpStcV * input.liczbaPaneliWStringu
  const iStringA = input.impA
  const mocPvW = input.vmpStcV * input.impA * input.liczbaPaneliWStringu
  const dcAcRatio = mocPvW / input.mocFalownikaAcW

  const warnings = [
    vStringColdV > input.vMaxFalownikaV
      ? napiecieZimoweZaWysokie(vStringColdV, input.vMaxFalownikaV)
      : napiecieZimoweOk(vStringColdV, input.vMaxFalownikaV),
    vStringStcV < input.mpptMinV
      ? ponizejOknaMppt(vStringStcV, input.mpptMinV)
      : vStringStcV > input.mpptMaxV
        ? powyzejOknaMppt(vStringStcV, input.mpptMaxV)
        : wOknieMppt(vStringStcV, input.mpptMinV, input.mpptMaxV),
    iStringA > input.iMaxMpptA ? pradPrzekroczony(iStringA, input.iMaxMpptA) : pradOk(iStringA, input.iMaxMpptA),
    dcAcRatio < DC_AC_RATIO_ZALECANE_MIN
      ? przewymiarowanieZaMale(dcAcRatio, DC_AC_RATIO_ZALECANE_MIN)
      : dcAcRatio > DC_AC_RATIO_ZALECANE_MAX
        ? przewymiarowanieZaDuze(dcAcRatio, DC_AC_RATIO_ZALECANE_MAX)
        : przewymiarowanieOk(dcAcRatio),
  ]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { vStringColdV, vStringStcV, iStringA, mocPvW, dcAcRatio },
    unit: "V",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Zakłada JEDEN string (bez wielu stringów równoległych) — zgodnie z parametrami Sekcji A źródła.",
      "Moc PV (do współczynnika DC/AC) liczona jako Vmp × Imp × liczba paneli (P=V×I w warunkach STC), nie wpisywana osobno.",
      "Kryterium 4 źródła (napięcie startowe falownika w upale) NIE jest tu sprawdzane — wymaga współczynnika temperaturowego Vmp, którego źródło nie podaje jako wzoru w tym ekranie (patrz komentarz w kodzie kalkulatora).",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
