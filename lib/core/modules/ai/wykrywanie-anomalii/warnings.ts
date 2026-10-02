import type { Warning } from "@/lib/core/calc-result"
import { KOD_PRZYCZYNY, type PrzyczynaSpadku } from "./constants"

const r1 = (x: number) => Math.round(x * 10) / 10

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "ANOM-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, expected >= 0`,
    field,
  }
}

export function odchylenie(pct: number, kwh: number): Warning {
  return {
    code: "ANOM-ODCHYLENIE",
    level: "info",
    params: { pct: r1(pct), kwh: r1(kwh) },
    technicalMessage: `deviation ${pct} % (${kwh} kWh), no threshold`,
  }
}

export function pvSpadek(pct: number, prog: number): Warning {
  return {
    code: "ANOM-PV-SPADEK",
    level: "warning",
    params: { pct: r1(-pct), prog },
    technicalMessage: `PV ${pct} % vs expected, threshold ${prog} %`,
  }
}

export function zuzycieWzrost(pct: number, prog: number): Warning {
  return {
    code: "ANOM-ZUZYCIE-WZROST",
    level: "warning",
    params: { pct: r1(pct), prog },
    technicalMessage: `consumption +${pct} % vs usual, threshold ${prog} %`,
  }
}

export function zuzycieSpadek(pct: number, prog: number): Warning {
  return {
    code: "ANOM-ZUZYCIE-SPADEK",
    level: "warning",
    params: { pct: r1(-pct), prog },
    technicalMessage: `consumption ${pct} % vs usual, threshold ${prog} %`,
  }
}

export function przyczyna(p: PrzyczynaSpadku): Warning {
  return {
    code: KOD_PRZYCZYNY[p],
    level: p === "uszkodzenie" ? "warning" : "info",
    technicalMessage: `cascade 12.17: ${p}`,
  }
}
