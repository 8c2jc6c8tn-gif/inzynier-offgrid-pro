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

export function strataPonizejCelu(strataPct: number, celPct: number): Warning {
  return {
    code: "STRATA-PONIZEJ-CELU",
    level: "info",
    message: `Strata ${strataPct.toFixed(1)}% mieści się w celu źródła (poniżej ${celPct}%).`,
    technicalMessage: `strataPct=${strataPct}, celPct=${celPct}`,
  }
}

export function strataPowyzejCelu(strataPct: number, celPct: number): Warning {
  return {
    code: "STRATA-POWYZEJ-CELU",
    level: "warning",
    message: `Strata ${strataPct.toFixed(1)}% przekracza cel źródła (poniżej ${celPct}%) — rozważ grubszy przekrój kabla.`,
    technicalMessage: `strataPct=${strataPct}, celPct=${celPct}`,
  }
}
