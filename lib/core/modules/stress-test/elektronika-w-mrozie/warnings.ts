import type { Warning } from "@/lib/core/calc-result"
import type { TypElektroniki } from "./input"

type TypOstrzezenia = Exclude<TypElektroniki, "BMS" | "przetwornica">

/** Skutek mrozu per typ — treść 1:1 z sekcji B źródła (Ekran 19); regulator — D31. */
const KLUCZ_SKUTKU: Record<TypOstrzezenia, string> = {
  wyswietlacz: "ELEKTRONIKA-PONIZEJ-MIN-WYSWIETLACZ",
  czujnik: "ELEKTRONIKA-PONIZEJ-MIN-CZUJNIK",
  regulator: "ELEKTRONIKA-PONIZEJ-MIN-REGULATOR",
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

/** 🔴 od 1.1.0 (D31): przetwornica/falownik, która nie wystartuje, to brak zasilania AC. */
export function przetwornicaPonizejMin(nazwa: string, tempC: number, minC: number): Warning {
  return {
    code: "ELEKTRONIKA-PRZETWORNICA-PONIZEJ-MIN",
    level: "critical",
    i18nKey: "ELEKTRONIKA-PONIZEJ-MIN-PRZETWORNICA",
    params: { nazwa, temp: tempC, min: minC },
    technicalMessage: `typ=przetwornica, temperaturaMiejscaC=${tempC} < minTempPracyC=${minC} (🔴 decyzja D31)`,
    field: "urzadzenia",
  }
}

export function urzadzeniePonizejMin(typ: TypOstrzezenia, nazwa: string, tempC: number, minC: number): Warning {
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
