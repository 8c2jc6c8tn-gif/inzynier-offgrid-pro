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

export function ochronaObowiazkowaBrak(ns: number, iScMaxA: number, iModMaxOcprA: number): Warning {
  return {
    code: "OCHRONA-OBOWIAZKOWA-BRAK",
    level: "critical",
    i18nKey: "OCHRONA-OBOWIAZKOWA-BRAK",
    params: { ns },
    technicalMessage: `Ns=${ns}, 1,35×I_MOD_MAX_OCPR=${(1.35 * iModMaxOcprA).toFixed(2)}A < (Ns-1)×I_SC_MAX=${((ns - 1) * iScMaxA).toFixed(2)}A, maZabezpieczeniaPerString=false`,
  }
}

export function zakresBezpiecznikaNiepoprawny(inMinA: number, inMaxA: number): Warning {
  return {
    code: "ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY",
    level: "critical",
    i18nKey: "ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY",
    params: { inMin: inMinA.toFixed(2), inMax: inMaxA.toFixed(2) },
    technicalMessage: `inMinA=${inMinA}, inMaxA=${inMaxA}`,
  }
}

export function wybranyBezpiecznikPozaZakresem(wybranyA: number, inMinA: number, inMaxA: number): Warning {
  return {
    code: "WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM",
    params: { wybrany: wybranyA.toFixed(1), inMin: inMinA.toFixed(2), inMax: inMaxA.toFixed(2) },
    technicalMessage: `wybranyBezpiecznikA=${wybranyA}, inMinA=${inMinA}, inMaxA=${inMaxA}`,
  }
}

export function alternatywaKablowaNiesprawdzona(ns: number, iScMaxA: number): Warning {
  return {
    code: "ALTERNATYWA-KABLOWA-NIESPRAWDZONA",
    level: "warning",
    i18nKey: "ALTERNATYWA-KABLOWA-NIESPRAWDZONA",
    params: { ns, wymaganeIz: ((ns - 1) * iScMaxA).toFixed(2) },
    technicalMessage: `Ns=${ns}, wymaganeIzA=${(ns - 1) * iScMaxA}`,
  }
}

export function bezpiecznikDobrany(inMinA: number, inMaxA: number): Warning {
  return {
    code: "BEZPIECZNIK-DOBRANY",
    level: "info",
    i18nKey: "BEZPIECZNIK-DOBRANY",
    params: { inMin: inMinA.toFixed(2), inMax: inMaxA.toFixed(2) },
    technicalMessage: `inMinA=${inMinA}, inMaxA=${inMaxA}`,
  }
}
