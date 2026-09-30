import type { Warning } from "@/lib/core/calc-result"

/** ℹ️ Biblia §12.49: DIY needs knowledge and work — fuses, cable sizes, connections. Always shown. */
export function diyWymagaWiedzy(): Warning {
  return { code: "SD-DIY-WYMAGA-WIEDZY", level: "info", i18nKey: "SD-DIY-WYMAGA-WIEDZY", technicalMessage: "always shown (Biblia §12.49)" }
}
