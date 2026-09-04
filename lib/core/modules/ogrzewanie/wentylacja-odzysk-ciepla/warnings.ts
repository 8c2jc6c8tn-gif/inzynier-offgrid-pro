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

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Sprawność rekuperatora musi być z przedziału 0-100%.",
    technicalMessage: `sprawnoscRekuperatoraPct = ${value}, oczekiwano [0, 100]`,
    field: "sprawnoscRekuperatoraPct",
  }
}

export function odzyskInfo(odzyskaneCieploKw: number, poborWentylatorowW: number): Warning {
  return {
    code: "ODZYSK-INFO",
    level: "info",
    message: `Odzyskane ciepło: ${odzyskaneCieploKw.toFixed(2)} kW. Stały pobór wentylatorów: ${poborWentylatorowW.toFixed(0)} W dolicza się do bilansu elektrycznego.`,
    technicalMessage: `odzyskaneCieploKw=${odzyskaneCieploKw}, poborWentylatorowW=${poborWentylatorowW}`,
  }
}
