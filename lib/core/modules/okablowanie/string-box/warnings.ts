import type { Warning } from "@/lib/core/calc-result"
import { BEZPIECZNIK_STRINGOWY_MAX_A, BEZPIECZNIK_STRINGOWY_MIN_A } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 * Treść 🔴 1:1 ze źródła (docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Ekran 22).
 */

export function brakSkrzynkiIp66(): Warning {
  return {
    code: "BRAK-SKRZYNKI-IP66",
    level: "critical",
    i18nKey: "BRAK-SKRZYNKI-IP66",
    technicalMessage: "maSkrzynkeIp66 = false",
    field: "maSkrzynkeIp66",
  }
}

export function zaMaloWejsc(liczbaWejsc: number, liczbaStringow: number): Warning {
  return {
    code: "ZA-MALO-WEJSC-SKRZYNKI",
    level: "warning",
    i18nKey: "ZA-MALO-WEJSC-SKRZYNKI",
    params: { wejscia: liczbaWejsc, stringi: liczbaStringow },
    technicalMessage: `liczbaWejscSkrzynki=${liczbaWejsc} < liczbaStringow=${liczbaStringow}`,
    field: "liczbaWejscSkrzynki",
  }
}

export function bezpiecznikPozaZakresem(bezpiecznikA: number): Warning {
  return {
    code: "BEZPIECZNIK-STRINGOWY-POZA-ZAKRESEM",
    level: "warning",
    i18nKey: "BEZPIECZNIK-STRINGOWY-POZA-ZAKRESEM",
    params: { bezpiecznik: bezpiecznikA, min: BEZPIECZNIK_STRINGOWY_MIN_A, max: BEZPIECZNIK_STRINGOWY_MAX_A },
    technicalMessage: `bezpiecznikStringowyA=${bezpiecznikA}, zakres=[${BEZPIECZNIK_STRINGOWY_MIN_A}, ${BEZPIECZNIK_STRINGOWY_MAX_A}]`,
    field: "bezpiecznikStringowyA",
  }
}

export function liczbaStringowUjemna(value: number): Warning {
  return {
    code: "LICZBA-STRINGOW-UJEMNA",
    level: "critical",
    i18nKey: "LICZBA-STRINGOW-UJEMNA",
    technicalMessage: `liczbaStringow = ${value}, oczekiwano >= 0`,
    field: "liczbaStringow",
  }
}

export function liczbaWejscUjemna(value: number): Warning {
  return {
    code: "LICZBA-WEJSC-UJEMNA",
    level: "critical",
    i18nKey: "LICZBA-WEJSC-UJEMNA",
    technicalMessage: `liczbaWejscSkrzynki = ${value}, oczekiwano >= 0`,
    field: "liczbaWejscSkrzynki",
  }
}

export function bezpiecznikStringowyUjemny(value: number): Warning {
  return {
    code: "BEZPIECZNIK-STRINGOWY-UJEMNY",
    level: "critical",
    i18nKey: "BEZPIECZNIK-STRINGOWY-UJEMNY",
    technicalMessage: `bezpiecznikStringowyA = ${value}, oczekiwano >= 0`,
    field: "bezpiecznikStringowyA",
  }
}
