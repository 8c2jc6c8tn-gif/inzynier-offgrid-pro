import type { Warning } from "@/lib/core/calc-result"

export function selectedDeviceNotPositive(label: string, value: number): Warning {
  return {
    code: "WAMPIR-POZYCJA-NIEDODATNIA",
    level: "critical",
    i18nKey: "WAMPIR-POZYCJA-NIEDODATNIA",
    params: { label },
    technicalMessage: `powerW = ${value} dla zaznaczonego urządzenia "${label}", oczekiwano > 0`,
    field: "items",
  }
}

export function nothingSelected(): Warning {
  return {
    code: "WAMPIR-BRAK-ZAZNACZONYCH",
    level: "warning",
    i18nKey: "WAMPIR-BRAK-ZAZNACZONYCH",
    technicalMessage: "items.filter(selected).length === 0",
    field: "items",
  }
}
