import type { Warning } from "@/lib/core/calc-result"

export function brakDozownikaOlowiowy(chemia: string): Warning {
  return {
    code: "LVD-BRAK-OCHRONY-OLOWIOWY",
    level: "critical",
    i18nKey: "LVD-BRAK-OCHRONY-OLOWIOWY",
    technicalMessage: `chemia=${chemia}, maDozownik=false, odbiornikMaWlasneZabezpieczenie=false`,
    field: "maDozownik",
  }
}

export function progKwasowyNieznany(): Warning {
  return {
    code: "LVD-PROG-KWASOWY-BRAK-W-ZRODLE",
    level: "info",
    i18nKey: "LVD-PROG-KWASOWY-BRAK-W-ZRODLE",
    technicalMessage: "PROG_ODCIECIA_12V.kwasowy = null — źródło podaje próg tylko dla AGM i LiFePO4",
  }
}
