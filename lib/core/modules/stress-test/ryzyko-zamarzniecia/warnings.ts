import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function plycejNizPrzemarzanie(nazwa: string, glebokoscCm: number, hzCm: number): Warning {
  return {
    code: "ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE",
    level: "critical",
    i18nKey: "ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE",
    params: { nazwa, glebokosc: glebokoscCm, hz: hzCm },
    technicalMessage: `${nazwa}: glebokoscCm=${glebokoscCm} < glebokoscPrzemarzaniaCm=${hzCm} (Tresc_Modul_7, Ekran 22 — 🔴)`,
    field: "instalacje",
  }
}

export function ruraBezZapasu(nazwa: string, glebokoscCm: number, wymaganaCm: number): Warning {
  return {
    code: "ZAMARZ-RURA-BEZ-ZAPASU",
    level: "warning",
    i18nKey: "ZAMARZ-RURA-BEZ-ZAPASU",
    params: { nazwa, glebokosc: glebokoscCm, wymagana: wymaganaCm },
    technicalMessage: `${nazwa}: rura wodna glebokoscCm=${glebokoscCm} < hz + 20 = ${wymaganaCm} (Biblia v2.0)`,
    field: "instalacje",
  }
}

export function brakGlebokosci(nazwa: string): Warning {
  return {
    code: "ZAMARZ-BRAK-GLEBOKOSCI",
    level: "info",
    i18nKey: "ZAMARZ-BRAK-GLEBOKOSCI",
    params: { nazwa },
    technicalMessage: `${nazwa}: glebokoscCm = null`,
    field: "instalacje",
  }
}

export function rozmrazanieOgniem(): Warning {
  return {
    code: "ZAMARZ-ROZMRAZANIE-OGIEN",
    level: "critical",
    i18nKey: "ZAMARZ-ROZMRAZANIE-OGIEN",
    technicalMessage: "metodaRozmrazania = otwarty-ogien (Tresc_Modul_7, Ekran 22, sekcja wspólna — 🔴)",
    field: "metodaRozmrazania",
  }
}
