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
    message: "Łączenie stringów bezpośrednio na wolnym powietrzu bez skrzynki IP66 jest zabronione.",
    technicalMessage: "maSkrzynkeIp66 = false",
    field: "maSkrzynkeIp66",
  }
}

export function zaMaloWejsc(liczbaWejsc: number, liczbaStringow: number): Warning {
  return {
    code: "ZA-MALO-WEJSC-SKRZYNKI",
    level: "warning",
    message: `Skrzynka ma ${liczbaWejsc} wejść, a stringów jest ${liczbaStringow} — dobierz skrzynkę z odpowiednią liczbą wejść.`,
    technicalMessage: `liczbaWejscSkrzynki=${liczbaWejsc} < liczbaStringow=${liczbaStringow}`,
    field: "liczbaWejscSkrzynki",
  }
}

export function bezpiecznikPozaZakresem(bezpiecznikA: number): Warning {
  return {
    code: "BEZPIECZNIK-STRINGOWY-POZA-ZAKRESEM",
    level: "warning",
    message: `Bezpiecznik stringowy (${bezpiecznikA} A) jest poza zalecanym zakresem ${BEZPIECZNIK_STRINGOWY_MIN_A}-${BEZPIECZNIK_STRINGOWY_MAX_A} A/string.`,
    technicalMessage: `bezpiecznikStringowyA=${bezpiecznikA}, zakres=[${BEZPIECZNIK_STRINGOWY_MIN_A}, ${BEZPIECZNIK_STRINGOWY_MAX_A}]`,
    field: "bezpiecznikStringowyA",
  }
}
