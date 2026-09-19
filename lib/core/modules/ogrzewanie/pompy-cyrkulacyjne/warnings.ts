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

export function oszczednoscInfo(oszczednoscKwh: number, oszczednoscPct: number): Warning {
  return {
    code: "OSZCZEDNOSC",
    level: "info",
    i18nKey: "OSZCZEDNOSC-POMPA-CYRKULACYJNA",
    params: { oszczednoscKwh: oszczednoscKwh.toFixed(2), oszczednoscPct: oszczednoscPct.toFixed(0) },
    technicalMessage: `oszczednoscKwh=${oszczednoscKwh}, oszczednoscPct=${oszczednoscPct}`,
  }
}

export function nowaPompaNieOszczedza(): Warning {
  return {
    code: "NOWA-POMPA-NIE-OSZCZEDZA",
    level: "warning",
    i18nKey: "NOWA-POMPA-NIE-OSZCZEDZA",
    technicalMessage: "mocNowejPompyW >= mocObecnejPompyW",
  }
}
