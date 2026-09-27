import type { Warning } from "@/lib/core/calc-result"

export { wartoscPozaZakresem, wartoscUjemna } from "../obciazenie-cieplne/warnings"

/** Source (🟡): "Niezaizolowane nadproże nad oknem to stały wyciek ciepła." */
export function nadprozeBezIzolacji(nazwa: string): Warning {
  return {
    code: "MT-NADPROZE-BEZ-IZOLACJI",
    level: "warning",
    i18nKey: "MT-NADPROZE-BEZ-IZOLACJI",
    params: { nazwa },
    technicalMessage: `mostek "${nazwa}": nadprozeBezIzolacji = true`,
  }
}

/** Ψ typed by the user — the app does not check it (EN ISO 10211 numerics are not in the app). */
export function psiOdUzytkownika(): Warning {
  return {
    code: "MT-PSI-OD-UZYTKOWNIKA",
    level: "info",
    i18nKey: "MT-PSI-OD-UZYTKOWNIKA",
    technicalMessage: "Ψ wpisane przez użytkownika — bez weryfikacji (ISO 10211 poza aplikacją)",
  }
}

/** PN-EN ISO 14683 5.1, 5.5, Zał. A Uwaga 1: indicative values, worst case, accuracy 0 %…50 %, heat loss only. */
export function psiZTablicyA2(): Warning {
  return {
    code: "MT-PSI-Z-TABLICY-A2",
    level: "info",
    i18nKey: "MT-PSI-Z-TABLICY-A2",
    technicalMessage: "Ψ z PN-EN ISO 14683 Tablica A.2 — wartości orientacyjne, najgorszy przypadek, dokładność 0–50 %",
  }
}

/** Detail code outside Tablica A.2. */
export function nieznanyKodKatalogu(field: string, kod: string): Warning {
  return {
    code: "MT-NIEZNANY-KOD",
    level: "critical",
    i18nKey: "MT-NIEZNANY-KOD",
    params: { kod },
    technicalMessage: `${field} = "${kod}" — brak w PN-EN ISO 14683 Tablica A.2`,
    field,
  }
}

/** θi ≤ θe — same check as Ekran 1. */
export function temperaturaWewnetrznaNieWyzsza(ti: number, te: number): Warning {
  return {
    code: "MT-TEMP-WEWN-NIE-WYZSZA",
    level: "critical",
    i18nKey: "OC-TEMP-WEWN-NIE-WYZSZA",
    params: { ti, te },
    technicalMessage: `temperaturaWewnetrznaC = ${ti} <= θe = ${te}`,
    field: "temperaturaWewnetrznaC",
  }
}
