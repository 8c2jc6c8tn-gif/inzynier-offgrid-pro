import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function brakZabezpieczenPrzy3Stringach(liczbaStringow: number): Warning {
  return {
    code: "BRAK-ZABEZPIECZEN-PRZY-3-STRINGACH",
    level: "critical",
    message: `Brak bezpieczników/diod blokujących przy ${liczbaStringow} stringach równoległych grozi pożarem przy zwarciu jednego stringa — prąd z pozostałych popłynie wstecz przez uszkodzony.`,
    technicalMessage: `liczbaStringowRownoleglych=${liczbaStringow} >= 3, maZabezpieczeniaPerString=false`,
  }
}

export function bezpiecznikDobrany(bezpiecznikA: number): Warning {
  return {
    code: "BEZPIECZNIK-DOBRANY",
    level: "info",
    message: `Każdy string powinien mieć bezpiecznik ${bezpiecznikA.toFixed(1)} A DC.`,
    technicalMessage: `bezpiecznikA=${bezpiecznikA}`,
  }
}
