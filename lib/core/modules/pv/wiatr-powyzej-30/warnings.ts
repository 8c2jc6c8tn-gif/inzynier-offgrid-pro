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
    technicalMessage: `nachylenieDeg = ${katDeg} > ${maxNormaDeg}: współczynnik siły interpolowany liniowo między ${maxNormaDeg}° (Tablica 7.6) a 90° (cf = 1,80, 7.4.3) (D97) — szacunek aplikacji, kąt na własną odpowiedzialność użytkownika`,
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

/** Przesuw i przewracanie policzone z danych użytkownika (tarcie, punkt przyłożenia siły, podstawa) — szacunek aplikacji, nie wynik normy. */
export function statecznoscSzacunek(mu: number, wysokoscM: number, szerokoscM: number): Warning {
  // Geometry derived from L and α is not a round number — show it to the centimetre.
  wysokoscM = Math.round(wysokoscM * 100) / 100
  szerokoscM = Math.round(szerokoscM * 100) / 100
  return {
    code: "WP30-STATECZNOSC-SZACUNEK",
    level: "warning",
    i18nKey: "WP30-STATECZNOSC-SZACUNEK",
    params: { mu, h: wysokoscM, b: szerokoscM },
    technicalMessage: `przesuw (PN-EN 1997-1 p. 6.5.3, obwiednia podejść 1–3) i przewracanie (EQU, Tablica A.1) z μ = ${mu}, h = ${wysokoscM} m, b = ${szerokoscM} m — szacunek aplikacji, norma nie podaje punktu przyłożenia siły ani tarcia dla pary materiałów`,
  }
}

/** Podano część danych stateczności (tarcie, wysokość, podstawa) — bez kompletu przesuw i przewracanie nie są liczone. */
export function statecznoscNiekompletna(): Warning {
  return {
    code: "WP30-STATECZNOSC-NIEKOMPLETNA",
    level: "info",
    i18nKey: "WP30-STATECZNOSC-NIEKOMPLETNA",
    technicalMessage: "przesuw i przewracanie wymagają trzech danych naraz: μ, wysokości punktu przyłożenia siły i szerokości podstawy",
  }
}

/** To samo dla zestawienia wielu kątów (Złoty środek): geometria zmienia się z kątem, więc ostrzeżenie podaje tylko tarcie. */
export function statecznoscSzacunekKaty(mu: number, dlugoscM: number): Warning {
  return {
    code: "WP30-STATECZNOSC-SZACUNEK-KATY",
    level: "warning",
    i18nKey: "WP30-STATECZNOSC-SZACUNEK-KATY",
    params: { mu, dlugosc: dlugoscM },
    technicalMessage: `przesuw (PN-EN 1997-1 p. 6.5.3, obwiednia podejść 1–3) i przewracanie (EQU, Tablica A.1) dla każdego kąta z μ = ${mu} i L = ${dlugoscM} m — szacunek aplikacji, norma nie podaje punktu przyłożenia siły ani tarcia dla pary materiałów`,
  }
}
