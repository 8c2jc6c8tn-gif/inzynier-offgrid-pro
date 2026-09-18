import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function wymaganyEFuse(pradZwarciowyA: number, zdolnoscA: number): Warning {
  return {
    code: "WYMAGANY-E-FUSE",
    level: "critical",
    i18nKey: "WYMAGANY-E-FUSE",
    params: { pradA: pradZwarciowyA.toFixed(0), zdolnoscA: zdolnoscA.toFixed(0) },
    technicalMessage: `pradZwarciowyA = ${pradZwarciowyA} > zdolnoscLaczeniowaTranzystorowA = ${zdolnoscA}`,
  }
}

export function eFuseNiepotrzebny(pradZwarciowyA: number, zdolnoscA: number): Warning {
  return {
    code: "E-FUSE-NIEPOTRZEBNY",
    level: "info",
    i18nKey: "E-FUSE-NIEPOTRZEBNY",
    params: { pradA: pradZwarciowyA.toFixed(0), zdolnoscA: zdolnoscA.toFixed(0) },
    technicalMessage: `pradZwarciowyA = ${pradZwarciowyA} <= zdolnoscLaczeniowaTranzystorowA = ${zdolnoscA}`,
  }
}
