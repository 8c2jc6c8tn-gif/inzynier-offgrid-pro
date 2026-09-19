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

export function trawaNiskiZysk(): Warning {
  return {
    code: "TRAWA-NISKI-ZYSK",
    level: "warning",
    i18nKey: "TRAWA-NISKI-ZYSK",
    technicalMessage: "typPowierzchni = trawa",
  }
}

export function dobraPowierzchnia(dodatkowyUzyskKwh: number): Warning {
  return {
    code: "DOBRA-POWIERZCHNIA",
    level: "info",
    i18nKey: "DOBRA-POWIERZCHNIA",
    params: { dodatkowyUzysk: dodatkowyUzyskKwh.toFixed(0) },
    technicalMessage: `dodatkowyUzyskKwh=${dodatkowyUzyskKwh}`,
  }
}
