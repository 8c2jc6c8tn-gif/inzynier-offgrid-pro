import type { Warning } from "@/lib/core/calc-result"

export function liczbaKontaktowNiepoprawna(value: number): Warning {
  return {
    code: "ALARM-LICZBA-KONTAKTOW-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "ALARM-LICZBA-KONTAKTOW-NIEPOPRAWNA",
    technicalMessage: `liczbaKontaktow = ${value}, oczekiwano liczby całkowitej >= 0`,
    field: "liczbaKontaktow",
  }
}

export function wezwanieBezZgody(): Warning {
  return {
    code: "ALARM-WEZWANIE-BEZ-ZGODY",
    level: "critical",
    i18nKey: "ALARM-WEZWANIE-BEZ-ZGODY",
    technicalMessage: "autoWezwanieSluzb = true && zgodaNaWezwanieSluzb = false (Tresc_Modul_8, Ekran 10, B — tylko za wyraźną zgodą)",
    field: "zgodaNaWezwanieSluzb",
  }
}

export function brakSyreny(): Warning {
  return {
    code: "ALARM-BRAK-SYRENY",
    level: "warning",
    i18nKey: "ALARM-BRAK-SYRENY",
    technicalMessage: "maSyrene = false (Tresc_Modul_8, Ekran 10, B)",
    field: "maSyrene",
  }
}

export function brakKontaktow(): Warning {
  return {
    code: "ALARM-BRAK-KONTAKTOW",
    level: "warning",
    i18nKey: "ALARM-BRAK-KONTAKTOW",
    technicalMessage: "liczbaKontaktow = 0 (Tresc_Modul_8, Ekran 10, A/B)",
    field: "liczbaKontaktow",
  }
}

export function brakKamer(): Warning {
  return {
    code: "ALARM-BRAK-KAMER",
    level: "info",
    i18nKey: "ALARM-BRAK-KAMER",
    technicalMessage: "maKamery = false (Tresc_Modul_8, Ekran 10, A — obecność kamer opcjonalna)",
    field: "maKamery",
  }
}
