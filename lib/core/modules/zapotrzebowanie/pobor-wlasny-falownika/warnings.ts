import type { Warning } from "@/lib/core/calc-result"

export function poborUjemny(value: number): Warning {
  return {
    code: "POBOR-UJEMNY",
    level: "critical",
    message: "Pobór jałowy nie może być ujemny.",
    technicalMessage: `poborJalowyW = ${value}, oczekiwano >= 0`,
    field: "poborJalowyW",
  }
}

export function stalyKosztBilansu(strataDobowaKwh: number): Warning {
  return {
    code: "STALY-KOSZT-BILANSU",
    level: "info",
    message: `Falownik sam w sobie coś zużywa, tylko żeby być gotowym do pracy — ${strataDobowaKwh.toFixed(2)} kWh/dobę doliczane do bilansu z priorytetem 1, zanim cokolwiek włączysz.`,
    technicalMessage: `strataDobowaKwh = ${strataDobowaKwh}`,
  }
}
