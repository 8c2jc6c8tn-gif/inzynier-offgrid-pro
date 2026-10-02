import type { Warning } from "@/lib/core/calc-result"

/** Zmigrowane do i18n (docs/standards/17-i18n.md) — bez `message`, patrz `lib/i18n/dictionary-*.ts`. */

export function outOfRange(field: string, labelKey: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { labelKey, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

export function przeszkodaNiepoprawna(nazwa: string, powod: string): Warning {
  return {
    code: "ZACIENIENIE-PRZESZKODA-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "ZACIENIENIE-PRZESZKODA-NIEPOPRAWNA",
    params: { nazwa },
    technicalMessage: `przeszkoda "${nazwa}": ${powod}`,
    field: "przeszkody",
  }
}

export function punktWewnatrzPrzeszkody(nazwa: string): Warning {
  return {
    code: "ZACIENIENIE-PUNKT-W-PRZESZKODZIE",
    level: "critical",
    i18nKey: "ZACIENIENIE-PUNKT-W-PRZESZKODZIE",
    params: { nazwa },
    technicalMessage: `punkt analizy leży wewnątrz obrysu przeszkody "${nazwa}"`,
    field: "punkt",
  }
}

export function prognozaNizszaNizObecna(nazwa: string): Warning {
  return {
    code: "ZACIENIENIE-PROGNOZA-NIZSZA",
    level: "warning",
    i18nKey: "ZACIENIENIE-PROGNOZA-NIZSZA",
    params: { nazwa },
    technicalMessage: `drzewo "${nazwa}": wysokoscPrognozowanaM < wysokoscM`,
    field: "przeszkody",
  }
}

export function powierzchniaNieoswietlona(): Warning {
  return {
    code: "ZACIENIENIE-POWIERZCHNIA-BEZ-SLONCA",
    level: "warning",
    i18nKey: "ZACIENIENIE-POWIERZCHNIA-BEZ-SLONCA",
    technicalMessage: "suma wagi promieniowania bezpośredniego na płaszczyźnie = 0 (słońce zawsze za płaszczyzną)",
    field: "azymutPowierzchniDeg",
  }
}

export function brakOkresuBezlisci(nazwy: string): Warning {
  return {
    code: "ZACIENIENIE-BRAK-OKRESU-BEZLISCI",
    level: "warning",
    i18nKey: "ZACIENIENIE-BRAK-OKRESU-BEZLISCI",
    params: { nazwy },
    technicalMessage: `drzewa liściaste (${nazwy}) bez miesiecyBezlisci — liczone jako nieprzezroczyste cały rok`,
    field: "miesiaceBezlisci",
  }
}
