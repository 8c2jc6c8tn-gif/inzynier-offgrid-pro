import type { Warning } from "@/lib/core/calc-result"

/** 1:1 z cytatem 🔴 źródła. */
export function widoczneWybrzuszenie(): Warning {
  return {
    code: "WIDOCZNE-WYBRZUSZENIE",
    level: "critical",
    i18nKey: "WIDOCZNE-WYBRZUSZENIE",
    technicalMessage: "widocznePuchniecie = true",
  }
}
