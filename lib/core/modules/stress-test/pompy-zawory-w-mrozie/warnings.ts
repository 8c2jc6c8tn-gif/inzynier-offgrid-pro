import type { Warning } from "@/lib/core/calc-result"
import type { TypArmatury } from "./input"

/** Skutek mrozu per typ — treść z sekcji B/C źródła (Ekran 21). */
const KLUCZ_SKUTKU: Record<TypArmatury, string> = {
  pompa: "POMPY-PONIZEJ-MIN-POMPA",
  zawor: "POMPY-PONIZEJ-MIN-ZAWOR",
  silownik: "POMPY-PONIZEJ-MIN-SILOWNIK",
  inne: "POMPY-PONIZEJ-MIN-INNE",
}

export function elementPonizejMin(typ: TypArmatury, nazwa: string, tempC: number, minC: number): Warning {
  return {
    code: "POMPY-PONIZEJ-MIN",
    level: "warning",
    i18nKey: KLUCZ_SKUTKU[typ],
    params: { nazwa, temp: tempC, min: minC },
    technicalMessage: `typ=${typ}, temperaturaMiejscaC=${tempC} < minTempPracyC=${minC} (Tresc_Modul_7, Ekran 21 — 🟡)`,
    field: "elementy",
  }
}

export function zaworZewnetrznyNieoprozniony(): Warning {
  return {
    code: "POMPY-ZAWOR-ZEWNETRZNY",
    level: "warning",
    i18nKey: "POMPY-ZAWOR-ZEWNETRZNY",
    technicalMessage: "maZaworZewnetrzny && !zaworZewnetrznyOprozniony (Tresc_Modul_7, Ekran 21 — 🟡)",
    field: "zaworZewnetrznyOprozniony",
  }
}

export function brakMinTemp(nazwa: string): Warning {
  return {
    code: "POMPY-BRAK-MIN-TEMP",
    level: "info",
    i18nKey: "POMPY-BRAK-MIN-TEMP",
    params: { nazwa },
    technicalMessage: `${nazwa}: minTempPracyC = null`,
    field: "elementy",
  }
}
