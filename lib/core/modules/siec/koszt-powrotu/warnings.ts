import type { Warning } from "@/lib/core/calc-result"

/** 🟡 R1: disconnection is practically irreversible — return = new connection application. */
export function nieodwracalne(): Warning {
  return { code: "SIEC-POWROT-NIEODWRACALNE", level: "warning", i18nKey: "SIEC-POWROT-NIEODWRACALNE", technicalMessage: "R1 (§5.1)" }
}

/** ℹ️ Above the standard distance the DSO charges actual costs — only the formula is shown. */
export function wycenaIndywidualna(): Warning {
  return {
    code: "SIEC-POWROT-WYCENA-INDYWIDUALNA",
    level: "info",
    i18nKey: "SIEC-POWROT-WYCENA-INDYWIDUALNA",
    technicalMessage: "odlegloscStandardowa=false — wycena wg rzeczywistych nakładów OSD",
    field: "odlegloscStandardowa",
  }
}
