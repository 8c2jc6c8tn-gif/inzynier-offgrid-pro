import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative number. */
export function wartoscUjemnaDef(pole: string, wartosc: number): Warning {
  return {
    code: "DEFM-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "DEFM-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
    field: pole,
  }
}

/** Form validation: the month list must have 12 entries. */
export function zlaLiczbaMiesiecy(n: number): Warning {
  return {
    code: "DEFM-MIESIACE-NIE-12",
    level: "critical",
    i18nKey: "DEFM-MIESIACE-NIE-12",
    technicalMessage: `deficytyKwh.length = ${n}, oczekiwano 12`,
    field: "deficytyKwh",
  }
}

/** Source 🟡 „W lutym agregat będzie pracował 40 h — sprawdź zapas paliwa”: fuel of a month above the stock entered. */
export function paliwoPonadZapas(miesiac: number, godziny: number, litry: number, zapas: number): Warning {
  return {
    code: "DEFM-PALIWO-PONAD-ZAPAS",
    level: "warning",
    i18nKey: "DEFM-PALIWO-PONAD-ZAPAS",
    params: { miesiac, godziny: Math.round(godziny), litry: Math.round(litry), zapas: Math.round(zapas) },
    technicalMessage: `miesiąc ${miesiac}: paliwo ${litry} l > zapas ${zapas} l`,
    field: "zapasPaliwaL",
  }
}

/** Without a stock entered: the busiest month as an info (the source gives no hour threshold for its 🟡). */
export function sprawdzZapas(miesiac: number, godziny: number, litry: number): Warning {
  return {
    code: "DEFM-SPRAWDZ-ZAPAS",
    level: "info",
    i18nKey: "DEFM-SPRAWDZ-ZAPAS",
    params: { miesiac, godziny: Math.round(godziny), litry: Math.round(litry) },
    technicalMessage: `najwięcej godzin: miesiąc ${miesiac}, ${godziny} h, ${litry} l; zapas paliwa nie wpisany`,
    field: "zapasPaliwaL",
  }
}
