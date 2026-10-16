import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

export function dataNiepoprawnaTp(nazwa: string, pole: string): Warning {
  return ostrzezenie("TPRZ-DATA-NIEPOPRAWNA", "critical", `pozycja „${nazwa}”: ${pole} nie jest poprawną datą RRRR-MM-DD`, { nazwa }, pole)
}

export function interwalNiepoprawnyTp(nazwa: string, wartosc: number): Warning {
  return ostrzezenie("TPRZ-INTERWAL-NIEPOPRAWNY", "critical", `pozycja „${nazwa}”: interwał ${wartosc} — oczekiwano liczby całkowitej >= 1`, { nazwa, interwal: wartosc }, "interwalMiesiecy")
}

/** The last inspection is in the future relative to the reference day — probably a typo in the year. */
export function przegladWPrzyszlosciTp(nazwa: string): Warning {
  return ostrzezenie("TPRZ-PRZEGLAD-W-PRZYSZLOSCI", "warning", `pozycja „${nazwa}”: data ostatniego przeglądu jest późniejsza niż dziś`, { nazwa }, "ostatniPrzegladData")
}

export function pozycjaNiekompletnaTp(nazwa: string): Warning {
  return ostrzezenie("TPRZ-POZYCJA-NIEKOMPLETNA", "info", `pozycja „${nazwa}”: brak daty ostatniego przeglądu albo interwału — termin nie został policzony`, { nazwa })
}
