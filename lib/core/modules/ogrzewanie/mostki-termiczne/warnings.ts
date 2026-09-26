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

/** Ψ comes from the user — EN ISO 14683 (tabulated Ψ) and EN ISO 10211 (numerical Ψ) are not in the app. */
export function psiOdUzytkownika(): Warning {
  return {
    code: "MT-PSI-OD-UZYTKOWNIKA",
    level: "info",
    i18nKey: "MT-PSI-OD-UZYTKOWNIKA",
    technicalMessage: "Ψ wpisane przez użytkownika — PN-EN ISO 14683 / 10211 poza repo",
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
