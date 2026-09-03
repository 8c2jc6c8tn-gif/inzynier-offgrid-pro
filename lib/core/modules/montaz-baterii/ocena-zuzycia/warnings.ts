import type { Warning } from "@/lib/core/calc-result"

/** 1:1 z cytatem 🔴 źródła. */
export function widoczneWybrzuszenie(): Warning {
  return {
    code: "WIDOCZNE-WYBRZUSZENIE",
    level: "critical",
    message: "Widoczne puchnięcie obudowy — ogniwo do wycofania z eksploatacji, nie do ponownego montażu.",
    technicalMessage: "widocznePuchniecie = true",
  }
}
