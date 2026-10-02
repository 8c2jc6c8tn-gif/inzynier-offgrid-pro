import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, labelKey: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { labelKey },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function tanszaNizNowa(kosztZaKwh: number, cenaNowejZaKwh: number): Warning {
  return {
    code: "TANSZA-NIZ-NOWA",
    level: "info",
    i18nKey: "TANSZA-NIZ-NOWA",
    params: { koszt: kosztZaKwh.toFixed(0), nowa: cenaNowejZaKwh.toFixed(0) },
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} < cenaNowejLiFePO4ZlZaKwh = ${cenaNowejZaKwh}`,
  }
}

export function drozszaNizNowa(kosztZaKwh: number, cenaNowejZaKwh: number): Warning {
  return {
    code: "DROZSZA-NIZ-NOWA",
    level: "warning",
    i18nKey: "DROZSZA-NIZ-NOWA",
    params: { koszt: kosztZaKwh.toFixed(0), nowa: cenaNowejZaKwh.toFixed(0) },
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} >= cenaNowejLiFePO4ZlZaKwh = ${cenaNowejZaKwh}`,
  }
}
