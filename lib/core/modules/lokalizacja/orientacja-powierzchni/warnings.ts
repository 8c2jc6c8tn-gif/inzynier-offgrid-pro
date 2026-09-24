import type { Warning } from "@/lib/core/calc-result"

/** Zmigrowane do i18n (docs/standards/17-i18n.md) — bez `message`, patrz `lib/i18n/dictionary-*.ts`. */

export function outOfRange(field: string, label: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { label, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

export function daneNiepelnyRok(liczba: number): Warning {
  return {
    code: "ORIENTACJA-DANE-NIEPELNY-ROK",
    level: "critical",
    i18nKey: "ORIENTACJA-DANE-NIEPELNY-ROK",
    params: { liczba },
    technicalMessage: `daneGodzinowe.length = ${liczba}, oczekiwano 8760 lub 8784 (pełny rok godzinowy)`,
    field: "daneGodzinowe",
  }
}

export function daneUjemne(indeks: number): Warning {
  return {
    code: "ORIENTACJA-DANE-UJEMNE",
    level: "critical",
    i18nKey: "ORIENTACJA-DANE-UJEMNE",
    params: { indeks },
    technicalMessage: `daneGodzinowe[${indeks}]: ghi/dni/dhi < 0 albo nie jest liczbą`,
    field: "daneGodzinowe",
  }
}

export function powierzchniaNiepoprawna(nazwa: string): Warning {
  return {
    code: "ORIENTACJA-POWIERZCHNIA-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "ORIENTACJA-POWIERZCHNIA-NIEPOPRAWNA",
    params: { nazwa },
    technicalMessage: `powierzchnia "${nazwa}": nachylenie poza [0, 90] albo azymut poza [0, 360]`,
    field: "powierzchnie",
  }
}

export function horyzontNiepoprawny(nazwa: string): Warning {
  return {
    code: "ORIENTACJA-HORYZONT-NIEPOPRAWNY",
    level: "critical",
    i18nKey: "ORIENTACJA-HORYZONT-NIEPOPRAWNY",
    params: { nazwa },
    technicalMessage: `powierzchnia "${nazwa}": profil horyzontu pusty albo kąt poza [0, 90]`,
    field: "powierzchnie",
  }
}
