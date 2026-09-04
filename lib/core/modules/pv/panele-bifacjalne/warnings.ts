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

export function trawaNiskiZysk(): Warning {
  return {
    code: "TRAWA-NISKI-ZYSK",
    level: "warning",
    message:
      "Bez jasnego podłoża zysk z bifacjalności jest niewielki — nie przepłacaj za tę technologię, jeśli montujesz na trawie.",
    technicalMessage: "typPowierzchni = trawa",
  }
}

export function dobraPowierzchnia(dodatkowyUzyskKwh: number): Warning {
  return {
    code: "DOBRA-POWIERZCHNIA",
    level: "info",
    message: `Dodatkowy roczny uzysk z tylnej strony: ${dodatkowyUzyskKwh.toFixed(0)} kWh.`,
    technicalMessage: `dodatkowyUzyskKwh=${dodatkowyUzyskKwh}`,
  }
}
