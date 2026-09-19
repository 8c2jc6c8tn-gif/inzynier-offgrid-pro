import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function liczbaSekcjiPozaZakresem(value: number): Warning {
  return {
    code: "LICZBA-SEKCJI-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "LICZBA-SEKCJI-POZA-ZAKRESEM",
    technicalMessage: `liczbaZacienionychSekcji = ${value}, oczekiwano 0-3 (liczba całkowita)`,
    field: "liczbaZacienionychSekcji",
  }
}

export function brakZacienienia(): Warning {
  return {
    code: "BRAK-ZACIENIENIA",
    level: "info",
    i18nKey: "BRAK-ZACIENIENIA",
    technicalMessage: "liczbaZacienionychSekcji = 0",
  }
}

export function zacienienieJednejSekcji(strataPct: number): Warning {
  return {
    code: "ZACIENIENIE-1-SEKCJA",
    level: "warning",
    i18nKey: "ZACIENIENIE-1-SEKCJA",
    params: { strata: strataPct.toFixed(0) },
    technicalMessage: `liczbaZacienionychSekcji = 1, strataPaneluPct = ${strataPct.toFixed(1)}`,
  }
}

export function zacienienieDwochSekcji(strataPct: number): Warning {
  return {
    code: "ZACIENIENIE-2-SEKCJE",
    level: "critical",
    i18nKey: "ZACIENIENIE-2-SEKCJE",
    params: { strata: strataPct.toFixed(0) },
    technicalMessage: `liczbaZacienionychSekcji = 2, strataPaneluPct = ${strataPct.toFixed(1)}`,
  }
}

export function zacienieniePelnegoPanelu(strataPct: number): Warning {
  return {
    code: "ZACIENIENIE-PELNY-PANEL",
    level: "critical",
    i18nKey: "ZACIENIENIE-PELNY-PANEL",
    params: { strata: strataPct.toFixed(0) },
    technicalMessage: `liczbaZacienionychSekcji = 3, strataPaneluPct = ${strataPct.toFixed(1)}`,
  }
}
