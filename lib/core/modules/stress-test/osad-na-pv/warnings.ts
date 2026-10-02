import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative number. */
export function wartoscUjemnaOsad(pole: string, wartosc: number): Warning {
  return {
    code: "OSAD-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "OSAD-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
    field: pole,
  }
}

/** Form validation: a percentage or a tilt outside its range. */
export function poZakresem(pole: string, wartosc: number, max: number): Warning {
  return {
    code: "OSAD-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "OSAD-POZA-ZAKRESEM",
    params: { max },
    technicalMessage: `${pole} = ${wartosc}, oczekiwano [0, ${max}]`,
    field: pole,
  }
}

/** Source (Biblia §7.7): „Przy kącie 10° śnieg nie zsunie się sam. Rozważ system grzewczy lub odśnieżanie ręczne”. */
export function snieNieZsunie(kat: number, prog: number): Warning {
  return {
    code: "OSAD-SNIEG-NIE-ZSUNIE",
    level: "warning",
    i18nKey: "OSAD-SNIEG-NIE-ZSUNIE",
    params: { kat, prog },
    technicalMessage: `śnieg sypki, kąt ${kat}° <= ${prog}° — nie zsunie się sam`,
    field: "katDeg",
  }
}

/** Source: dry snow above 30° may slide off by itself. */
export function sniegMozeZsunac(kat: number, prog: number): Warning {
  return {
    code: "OSAD-SNIEG-MOZE-ZSUNAC",
    level: "info",
    i18nKey: "OSAD-SNIEG-MOZE-ZSUNAC",
    params: { kat, prog },
    technicalMessage: `śnieg sypki, kąt ${kat}° > ${prog}° — może zsunąć się sam`,
    field: "katDeg",
  }
}

/** Source: wet snow sticks to the panels, heavy and hard to remove. */
export function mokryPrzykleja(): Warning {
  return {
    code: "OSAD-MOKRY-PRZYKLEJA",
    level: "warning",
    i18nKey: "OSAD-MOKRY-PRZYKLEJA",
    technicalMessage: "śnieg mokry — przykleja się niezależnie od kąta",
    field: "rodzaj",
  }
}

/** Source: glaze/frost blocks the light completely. */
export function lodBlokuje(): Warning {
  return {
    code: "OSAD-LOD-BLOKUJE",
    level: "warning",
    i18nKey: "OSAD-LOD-BLOKUJE",
    technicalMessage: "gołoledź/szron — blokuje światło, nie zsuwa się",
    field: "rodzaj",
  }
}

/** Source (Biblia §7.18): „Szadź jest gorsza od śniegu – nie zsuwa się sama i blokuje światło”. */
export function szadzNieZsuwa(): Warning {
  return {
    code: "OSAD-SZADZ-NIE-ZSUWA",
    level: "warning",
    i18nKey: "OSAD-SZADZ-NIE-ZSUWA",
    technicalMessage: "szadź — nie zsuwa się sama, mgła nie pozwala jej stopnieć",
    field: "rodzaj",
  }
}

/** Source (Biblia §7.19, cross-ref M3/E17): uneven cover can cause voltage differences between strings. */
export function nierownoStringi(): Warning {
  return {
    code: "OSAD-NIEROWNO-STRINGI",
    level: "warning",
    i18nKey: "OSAD-NIEROWNO-STRINGI",
    technicalMessage: "nierównomierne zasypanie stringów — niedopasowanie (M3/E17)",
    field: "nierownoStringi",
  }
}
