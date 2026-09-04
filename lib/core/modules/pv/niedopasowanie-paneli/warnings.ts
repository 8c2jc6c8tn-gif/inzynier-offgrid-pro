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

export function duzaRoznicaMocy(roznicaPct: number): Warning {
  return {
    code: "DUZA-ROZNICA-MOCY",
    level: "critical",
    message: `Różnica mocy paneli (${roznicaPct.toFixed(1)}%) przekracza 15% — rozdziel je na osobne MPPT albo połącz równolegle, jeśli mają zbliżone Vmp.`,
    technicalMessage: `roznicaPct=${roznicaPct} > 15`,
  }
}

export function umiarkowanaRoznicaMocy(roznicaPct: number): Warning {
  return {
    code: "UMIARKOWANA-ROZNICA-MOCY",
    level: "warning",
    message: `Różnica mocy paneli (${roznicaPct.toFixed(1)}%) jest zauważalna (10-15%) — rozważ osobne MPPT.`,
    technicalMessage: `10 < roznicaPct=${roznicaPct} <= 15`,
  }
}

export function malaRoznicaMocy(roznicaPct: number): Warning {
  return {
    code: "MALA-ROZNICA-MOCY",
    level: "info",
    message: `Różnica mocy paneli (${roznicaPct.toFixed(1)}%) jest niewielka (poniżej 10%) — bezpiecznie w jednym stringu.`,
    technicalMessage: `roznicaPct=${roznicaPct} <= 10`,
  }
}
