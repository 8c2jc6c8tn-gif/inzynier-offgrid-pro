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

export function silaNaporu(silaN: number): Warning {
  return {
    code: "SILA-NAPORU",
    level: "info",
    message: `Panel działa trochę jak żagiel — przy tym wietrze na jeden panel działa siła ok. ${silaN.toFixed(0)} N. Zaplanuj mocowanie/balast odpowiedni do tej siły.`,
    technicalMessage: `silaN=${silaN}`,
  }
}
