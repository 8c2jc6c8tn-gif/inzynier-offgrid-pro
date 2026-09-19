import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscRekuperatoraPct = ${value}, oczekiwano [0, 100]`,
    field: "sprawnoscRekuperatoraPct",
  }
}

export function odzyskInfo(odzyskaneCieploKw: number, poborWentylatorowW: number): Warning {
  return {
    code: "ODZYSK-INFO",
    level: "info",
    i18nKey: "ODZYSK-INFO",
    params: { odzysk: odzyskaneCieploKw.toFixed(2), pobor: poborWentylatorowW.toFixed(0) },
    technicalMessage: `odzyskaneCieploKw=${odzyskaneCieploKw}, poborWentylatorowW=${poborWentylatorowW}`,
  }
}
