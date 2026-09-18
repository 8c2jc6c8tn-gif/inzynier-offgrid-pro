import type { Warning } from "@/lib/core/calc-result"

export type Sezon = "lato" | "zima"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function pokryteWCalosci(sezon: Sezon): Warning {
  return {
    code: "POKRYTE-W-CALOSCI",
    level: "info",
    i18nKey: sezon === "lato" ? "POKRYTE-W-CALOSCI-LATO" : "POKRYTE-W-CALOSCI-ZIMA",
    technicalMessage: `sezon=${sezon}, brakKwh=0`,
  }
}

export function brakujeEnergii(sezon: Sezon, brakKwh: number): Warning {
  return {
    code: "BRAKUJE-ENERGII",
    level: "warning",
    i18nKey: sezon === "lato" ? "BRAKUJE-ENERGII-LATO" : "BRAKUJE-ENERGII-ZIMA",
    params: { brak: brakKwh.toFixed(1) },
    technicalMessage: `sezon=${sezon}, brakKwh=${brakKwh}`,
  }
}
