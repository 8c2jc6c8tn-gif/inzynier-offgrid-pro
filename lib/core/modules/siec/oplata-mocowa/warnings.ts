import type { Warning } from "@/lib/core/calc-result"

export function przesunieciePozaZakresem(v: number): Warning {
  return {
    code: "SIEC-PRZESUNIECIE-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SIEC-PRZESUNIECIE-POZA-ZAKRESEM",
    technicalMessage: `przesuniecieProcent = ${v}, oczekiwano 0–100`,
    field: "przesuniecieProcent",
  }
}

export function brakStawkiMocowej(): Warning {
  return {
    code: "SIEC-BRAK-MOCOWA",
    level: "warning",
    i18nKey: "SIEC-BRAK-MOCOWA",
    technicalMessage: "brak stawki opłaty mocowej na datę rozliczenia",
    field: "stawkaWlasnaZlKwh",
  }
}
