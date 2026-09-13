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

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyMaksymalnyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    message: `Zdolność wyłączania zabezpieczenia (${aicA} A) jest poniżej obliczonego maksymalnego prądu zwarciowego (${pradZwarciowyMaksymalnyA.toFixed(0)} A) — zabezpieczenie samo stanie się źródłem łuku elektrycznego.`,
    technicalMessage: `aicZabezpieczeniaA=${aicA} < pradZwarciowyMaksymalnyA=${pradZwarciowyMaksymalnyA}`,
  }
}

export function aicWystarczajace(aicA: number): Warning {
  return {
    code: "AIC-WYSTARCZAJACE",
    level: "info",
    message: `Zdolność wyłączania ${aicA} A wystarcza na obliczony prąd zwarciowy.`,
    technicalMessage: `aicZabezpieczeniaA=${aicA}`,
  }
}
