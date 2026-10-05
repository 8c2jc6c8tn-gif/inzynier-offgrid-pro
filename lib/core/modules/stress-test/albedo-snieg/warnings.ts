import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative or non-finite number. */
export function wartoscUjemnaAlbedo(pole: string, wartosc: number): Warning {
  return {
    code: "ALBS-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "ALBS-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano liczby >= 0`,
    field: pole,
  }
}

/** Source 🟡: rooftop panels barely use the albedo — the snow in front of the building gets dirty quickly. */
export function dachMaloAlbedo(): Warning {
  return {
    code: "ALBS-DACH-MALO-ALBEDO",
    level: "warning",
    i18nKey: "ALBS-DACH-MALO-ALBEDO",
    technicalMessage: "typMontazu = dach",
    field: "typMontazu",
  }
}
