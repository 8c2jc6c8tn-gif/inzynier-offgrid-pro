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
