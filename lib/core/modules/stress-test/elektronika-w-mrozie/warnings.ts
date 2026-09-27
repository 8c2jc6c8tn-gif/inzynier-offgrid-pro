import type { Warning } from "@/lib/core/calc-result"
import type { TypElektroniki } from "./input"

/** Skutek mrozu per typ — treść 1:1 z sekcji B źródła (Ekran 19). */
const KLUCZ_SKUTKU: Record<Exclude<TypElektroniki, "BMS">, string> = {
  wyswietlacz: "ELEKTRONIKA-PONIZEJ-MIN-WYSWIETLACZ",
  czujnik: "ELEKTRONIKA-PONIZEJ-MIN-CZUJNIK",
  przetwornica: "ELEKTRONIKA-PONIZEJ-MIN-PRZETWORNICA",
  inne: "ELEKTRONIKA-PONIZEJ-MIN-INNE",
}

export function bmsPonizejMin(nazwa: string, tempC: number, minC: number): Warning {
  return {
    code: "ELEKTRONIKA-BMS-PONIZEJ-MIN",
    level: "critical",
    i18nKey: "ELEKTRONIKA-BMS-PONIZEJ-MIN",
    params: { nazwa, temp: tempC, min: minC },
    technicalMessage: `typ=BMS, temperaturaMiejscaC=${tempC} < minTempPracyC=${minC} (Tresc_Modul_7, Ekran 19 — 🔴)`,
    field: "urzadzenia",
  }
}

export function urzadzeniePonizejMin(typ: Exclude<TypElektroniki, "BMS">, nazwa: string, tempC: number, minC: number): Warning {
  return {
    code: "ELEKTRONIKA-PONIZEJ-MIN",
    level: "warning",
    i18nKey: KLUCZ_SKUTKU[typ],
    params: { nazwa, temp: tempC, min: minC },
    technicalMessage: `typ=${typ}, temperaturaMiejscaC=${tempC} < minTempPracyC=${minC}`,
    field: "urzadzenia",
  }
}

export function brakMinTemp(nazwa: string): Warning {
  return {
    code: "ELEKTRONIKA-BRAK-MIN-TEMP",
    level: "info",
    i18nKey: "ELEKTRONIKA-BRAK-MIN-TEMP",
    params: { nazwa },
    technicalMessage: `${nazwa}: minTempPracyC = null`,
    field: "urzadzenia",
  }
}
