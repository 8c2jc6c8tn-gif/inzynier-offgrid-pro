import type { Warning } from "@/lib/core/calc-result"

export function poza123(data: string): Warning {
  return {
    code: "SIEC-DEPOZYT-POZA-OKRESEM",
    level: "critical",
    i18nKey: "SIEC-DEPOZYT-POZA-OKRESEM",
    technicalMessage: `${data}: brak okresu współczynnika 1,23 w danych (obowiązuje od 2025-02-01)`,
    field: "dataMiesiaca",
  }
}

export function wykorzystanoPonadDepozyt(w: number, d: number): Warning {
  return {
    code: "SIEC-DEPOZYT-WYKORZYSTANO-PONAD",
    level: "critical",
    i18nKey: "SIEC-DEPOZYT-WYKORZYSTANO-PONAD",
    technicalMessage: `wykorzystanoZl = ${w} > depozyt ${d}`,
    field: "wykorzystanoZl",
  }
}

/** Leaving the grid ends settlements — use the balance first (`03_M14` §3, loss of deposit is not a stop). */
export function utrataPrzyOdejsciu(): Warning {
  return {
    code: "SIEC-DEPOZYT-UTRATA-PRZY-ODEJSCIU",
    level: "warning",
    i18nKey: "SIEC-DEPOZYT-UTRATA-PRZY-ODEJSCIU",
    technicalMessage: "rozwiązanie umowy kończy rozliczenia prosumenckie",
  }
}

/** RCEm → RCE and net-metering → net-billing are one-way decisions (art. 4b ust. 2b, art. 4d ust. 1). */
export function decyzjaJednokierunkowa(): Warning {
  return {
    code: "SIEC-DECYZJA-JEDNOKIERUNKOWA",
    level: "info",
    i18nKey: "SIEC-DECYZJA-JEDNOKIERUNKOWA",
    technicalMessage: "art. 4b ust. 2b, art. 4d ust. 1 ustawy o OZE",
  }
}
