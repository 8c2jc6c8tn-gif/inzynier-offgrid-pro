import type { Warning } from "@/lib/core/calc-result"

/** Zmigrowane do i18n (docs/standards/17-i18n.md) — bez `message`, patrz `lib/i18n/dictionary-*.ts`. */

export function poza(field: string, labelKey: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { labelKey, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

export function niedodatnia(field: string, labelKey: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { labelKey },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function ujemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

/** Do 30° jest norma (Tablica 7.6) — ten kalkulator jej nie zastępuje. */
export function katObjetyNorma(katDeg: number, maxNormaDeg: number): Warning {
  return {
    code: "WP30-KAT-OBJETY-NORMA",
    level: "warning",
    i18nKey: "WP30-KAT-OBJETY-NORMA",
    params: { kat: katDeg, max: maxNormaDeg },
    technicalMessage: `nachylenieDeg = ${katDeg} <= ${maxNormaDeg}: zakres Tablicy 7.6, wynik normowy w Porównywarce paneli / "Złoty środek"`,
    field: "nachylenieDeg",
  }
}

/** Wynik jest szacunkiem aplikacji, nie wynikiem normy (standard 3.3). */
export function szacunekPozaNorma(katDeg: number, maxNormaDeg: number): Warning {
  return {
    code: "WP30-SZACUNEK-POZA-NORMA",
    level: "warning",
    i18nKey: "WP30-SZACUNEK-POZA-NORMA",
    params: { kat: katDeg, max: maxNormaDeg },
    technicalMessage: `nachylenieDeg = ${katDeg} > ${maxNormaDeg}: współczynniki z ${maxNormaDeg}° Tablicy 7.6 zachowane (D90) — własne oszacowanie aplikacji`,
    field: "nachylenieDeg",
  }
}

/** Kalkulator zmiany kąta: ten kąt jest poza normą — siła i balast to szacunek, kąt ustawia i zabezpiecza użytkownik na własną odpowiedzialność. */
export function katNaWlasnaOdpowiedzialnosc(katDeg: number, maxNormaDeg: number): Warning {
  return {
    code: "WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC",
    level: "warning",
    i18nKey: "WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC",
    params: { kat: katDeg, max: maxNormaDeg },
    technicalMessage: `nachylenieDeg = ${katDeg} > ${maxNormaDeg}: współczynnik siły z ${maxNormaDeg}° Tablicy 7.6 zachowany (D95) — szacunek aplikacji, kąt na własną odpowiedzialność użytkownika`,
    field: "nachylenieDeg",
  }
}

/** To samo dla stelaża regulowanego: w części miesięcy kąt jest poza normą. */
export function miesiaceNaWlasnaOdpowiedzialnosc(liczba: number, katMaksDeg: number, maxNormaDeg: number): Warning {
  return {
    code: "WP30-MIESIACE-NA-WLASNA-ODPOWIEDZIALNOSC",
    level: "warning",
    i18nKey: "WP30-MIESIACE-NA-WLASNA-ODPOWIEDZIALNOSC",
    params: { liczba, katMaks: katMaksDeg, max: maxNormaDeg },
    technicalMessage: `${liczba} mies. z kątem > ${maxNormaDeg}° (maks. ${katMaksDeg}°): siła i balast to szacunek aplikacji (D95)`,
  }
}
