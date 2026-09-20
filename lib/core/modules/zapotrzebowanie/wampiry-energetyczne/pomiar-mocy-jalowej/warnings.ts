import type { Warning } from "@/lib/core/calc-result"

export function measuredItemNotPositive(nazwa: string, value: number): Warning {
  return {
    code: "WAMPIR-POMIAR-NIEDODATNI",
    level: "critical",
    i18nKey: "WAMPIR-POMIAR-NIEDODATNI",
    params: { label: nazwa || "(bez nazwy)" },
    technicalMessage: `mocJalowaW = ${value} dla pozycji "${nazwa}", oczekiwano > 0`,
    field: "pozycje",
  }
}

export function noMeasurements(): Warning {
  return {
    code: "WAMPIR-BRAK-POMIAROW",
    level: "warning",
    i18nKey: "WAMPIR-BRAK-POMIAROW",
    technicalMessage: "pozycje.length === 0",
    field: "pozycje",
  }
}
