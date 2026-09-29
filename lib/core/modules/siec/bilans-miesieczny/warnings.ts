import type { Warning } from "@/lib/core/calc-result"

export function tablicaNie12(pole: string, n: number): Warning {
  return {
    code: "SIEC-MIESIACE-NIEPOPRAWNE",
    level: "critical",
    i18nKey: "SIEC-MIESIACE-NIEPOPRAWNE",
    technicalMessage: `${pole}: ${n} pozycji zamiast 12 albo wartość ujemna`,
    field: pole,
  }
}

export function udzialPozaZakresem(pole: string): Warning {
  return {
    code: "SIEC-UDZIAL-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SIEC-UDZIAL-POZA-ZAKRESEM",
    params: { pole },
    technicalMessage: `${pole} poza (0; 1]`,
    field: pole,
  }
}

/** Monthly model with at most one full storage cycle per day — an upper estimate, not a daily simulation. */
export function modelMiesieczny(): Warning {
  return {
    code: "SIEC-BILANS-MODEL-MIESIECZNY",
    level: "info",
    i18nKey: "SIEC-BILANS-MODEL-MIESIECZNY",
    technicalMessage: "bilans miesięczny, ΔE_mag ≤ C·dni·η (jeden pełny cykl na dobę) — górne oszacowanie",
  }
}

/** Off-grid: shortfall in December/January — the winter condition of scenario D (M14 §4). */
export function niedoborZimowy(kwh: number, miesiace: string): Warning {
  return {
    code: "SIEC-BILANS-NIEDOBOR-ZIMA",
    level: "warning",
    i18nKey: "SIEC-BILANS-NIEDOBOR-ZIMA",
    params: { kwh: Math.round(kwh), miesiace },
    technicalMessage: `tryb wyspa: niedobór ${kwh.toFixed(1)} kWh w miesiącach ${miesiace}`,
    field: "niedoborKwh",
  }
}

/** Off-grid: shortfall outside winter too. */
export function niedoborPozaZima(miesiace: string): Warning {
  return {
    code: "SIEC-BILANS-NIEDOBOR-POZA-ZIMA",
    level: "warning",
    i18nKey: "SIEC-BILANS-NIEDOBOR-POZA-ZIMA",
    params: { miesiace },
    technicalMessage: `tryb wyspa: niedobór także w miesiącach ${miesiace}`,
    field: "niedoborKwh",
  }
}
