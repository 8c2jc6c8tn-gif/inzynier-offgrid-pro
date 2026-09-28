import type { Warning } from "@/lib/core/calc-result"

export function otaBezPodpisu(): Warning {
  return {
    code: "OTA-BEZ-PODPISU",
    level: "critical",
    i18nKey: "OTA-BEZ-PODPISU",
    technicalMessage: "ota = true && otaPodpis = false (Tresc_Modul_9, Ekran 6, 🔴)",
    field: "otaPodpis",
  }
}

export function otaBezSumyKontrolnej(): Warning {
  return {
    code: "OTA-BEZ-SUMY-KONTROLNEJ",
    level: "warning",
    i18nKey: "OTA-BEZ-SUMY-KONTROLNEJ",
    technicalMessage: "ota = true && otaSumaKontrolna = false (Biblia §9.49)",
    field: "otaSumaKontrolna",
  }
}

export function otaBezRollbacku(): Warning {
  return {
    code: "OTA-BEZ-ROLLBACKU",
    level: "warning",
    i18nKey: "OTA-BEZ-ROLLBACKU",
    technicalMessage: "ota = true && otaRollback = false (Biblia §9.49 — powrót do poprzedniej wersji)",
    field: "otaRollback",
  }
}
