import type { Warning } from "@/lib/core/calc-result"

/** 🟡 The solar set costs more up front and saves nothing per year — it never pays back. */
export function nigdySieNieZwroci(): Warning {
  return {
    code: "SP-NIGDY-SIE-NIE-ZWROCI",
    level: "warning",
    i18nKey: "SP-NIGDY-SIE-NIE-ZWROCI",
    technicalMessage: "kosztZestawu > kosztPrzedluzacza i roczna oszczędność <= 0",
  }
}

/** ℹ️ Biblia §12.44: a long cable means voltage drop — check the cable before choosing it. Always shown. */
export function spadekNapieciaKabla(): Warning {
  return {
    code: "SP-SPADEK-NAPIECIA-KABLA",
    level: "info",
    i18nKey: "SP-SPADEK-NAPIECIA-KABLA",
    technicalMessage: "always shown (Biblia §12.44)",
  }
}
