import type { Warning } from "@/lib/core/calc-result"
import type { ZrodloBilansu } from "./input"

/** Translation key of a source name (`lib/i18n/dictionary-*.ts`), passed as `zrodloKey`. */
export const KLUCZ_ZRODLA: Record<ZrodloBilansu, string> = {
  odbiorniki: "BILANS-ZRODLO-ODBIORNIKI",
  bojler: "BILANS-ZRODLO-BOJLER",
  wampiry: "BILANS-ZRODLO-WAMPIRY",
  falownik: "BILANS-ZRODLO-FALOWNIK",
  zmienne: "BILANS-ZRODLO-ZMIENNE",
  specjalne: "BILANS-ZRODLO-SPECJALNE",
  sezonowe: "BILANS-ZRODLO-SEZONOWE",
}

export function ujemnaWartosc(zrodlo: ZrodloBilansu, wartosc: number): Warning {
  return {
    code: "BILANS-UJEMNA-WARTOSC",
    level: "critical",
    i18nKey: "BILANS-UJEMNA-WARTOSC",
    params: { zrodloKey: KLUCZ_ZRODLA[zrodlo] },
    technicalMessage: `${zrodlo}: ${wartosc} kWh/doba < 0`,
    field: zrodlo,
  }
}

export function zlaLiczbaMiesiecy(zrodlo: ZrodloBilansu, n: number): Warning {
  return {
    code: "BILANS-MIESIACE",
    level: "critical",
    i18nKey: "BILANS-MIESIACE",
    params: { zrodloKey: KLUCZ_ZRODLA[zrodlo] },
    technicalMessage: `${zrodlo}: ${n} wartości miesięcznych, oczekiwano 12`,
    field: zrodlo,
  }
}

export function ujemnyBufor(buforPct: number): Warning {
  return {
    code: "BILANS-BUFOR-UJEMNY",
    level: "critical",
    i18nKey: "BILANS-BUFOR-UJEMNY",
    technicalMessage: `buforPct = ${buforPct} < 0`,
    field: "buforPct",
  }
}

/** A source screen is not filled in: the balance is lower than the real demand by its share. */
export function brakZrodla(zrodlo: ZrodloBilansu): Warning {
  return {
    code: `BILANS-BRAK-DANYCH-${zrodlo.toUpperCase()}`,
    level: "info",
    i18nKey: "BILANS-BRAK-DANYCH",
    params: { zrodloKey: KLUCZ_ZRODLA[zrodlo] },
    technicalMessage: `${zrodlo}: brak danych`,
  }
}
