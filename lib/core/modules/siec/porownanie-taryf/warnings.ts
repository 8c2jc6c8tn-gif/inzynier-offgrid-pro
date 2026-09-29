import type { Warning } from "@/lib/core/calc-result"

export function brakWariantow(): Warning {
  return {
    code: "SIEC-BRAK-WARIANTOW",
    level: "warning",
    i18nKey: "SIEC-BRAK-WARIANTOW",
    technicalMessage: "warianty.length === 0",
    field: "warianty",
  }
}

export function grupaPowtorzona(grupa: string): Warning {
  return {
    code: "SIEC-GRUPA-POWTORZONA",
    level: "critical",
    i18nKey: "SIEC-GRUPA-POWTORZONA",
    params: { grupa },
    technicalMessage: `grupa ${grupa} podana więcej niż raz`,
    field: "warianty",
  }
}

export function roznieZuzycie(min: number, max: number): Warning {
  return {
    code: "SIEC-ROZNE-ZUZYCIE-WARIANTOW",
    level: "warning",
    i18nKey: "SIEC-ROZNE-ZUZYCIE-WARIANTOW",
    params: { min: Math.round(min), max: Math.round(max) },
    technicalMessage: `zużycie roczne wariantów różni się: ${min}–${max} kWh`,
    field: "warianty",
  }
}
