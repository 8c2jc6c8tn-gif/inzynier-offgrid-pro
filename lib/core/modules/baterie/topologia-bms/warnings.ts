import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function commonPortNiewystarczajacy(bmsA: number, falownikA: number): Warning {
  return {
    code: "COMMON-PORT-NIEWYSTARCZAJACY",
    level: "critical",
    i18nKey: "COMMON-PORT-NIEWYSTARCZAJACY",
    params: { bms: bmsA, falownik: falownikA },
    technicalMessage: `bmsCommonPortA = ${bmsA} < falownikPradRozruchuA = ${falownikA}`,
  }
}

export function commonPortWystarczajacy(bmsA: number, falownikA: number): Warning {
  return {
    code: "COMMON-PORT-WYSTARCZAJACY",
    level: "info",
    i18nKey: "COMMON-PORT-WYSTARCZAJACY",
    params: { bms: bmsA, falownik: falownikA },
    technicalMessage: `bmsCommonPortA = ${bmsA} >= falownikPradRozruchuA = ${falownikA}`,
  }
}
