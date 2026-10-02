import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function przeciazenieGniazda(pradA: number, bezpiecznikA: number, mocMaxW: number): Warning {
  return {
    code: "GZ-PRZECIAZENIE-GNIAZDA",
    level: "critical",
    i18nKey: "GZ-PRZECIAZENIE-GNIAZDA",
    params: { prad: pradA.toFixed(1), bezpiecznik: bezpiecznikA.toFixed(0), mocMax: mocMaxW.toFixed(0) },
    technicalMessage: `ΣI=${pradA} A > I_bezpiecznika=${bezpiecznikA} A`,
  }
}
