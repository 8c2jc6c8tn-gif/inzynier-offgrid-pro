import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function tolerancjaPozaZakresem(value: number): Warning {
  return {
    code: "TOLERANCJA-POZA-ZAKRESEM",
    level: "critical",
    message: "Tolerancja fabryczna musi być z przedziału 0–100%.",
    technicalMessage: `tolerancjaPct = ${value}, oczekiwano [0, 100]`,
    field: "tolerancjaPct",
  }
}

export function pojemnoscOgraniczonaNajslabszym(utrataPct: number): Warning {
  return {
    code: "POJEMNOSC-OGRANICZONA-NAJSLABSZYM",
    level: "info",
    message: `To jak pociągnięcie za hamulec w całym pociągu, bo jeden wagon się zepsuł — najsłabsze ogniwo ogranicza cały pakiet o ${utrataPct.toFixed(1)}%.`,
    technicalMessage: `utrataPct = ${utrataPct}`,
  }
}
