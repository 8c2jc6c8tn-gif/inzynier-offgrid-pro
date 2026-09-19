import type { Warning } from "@/lib/core/calc-result"

export function szerokoscPozaZakresem(value: number): Warning {
  return {
    code: "SZEROKOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SZEROKOSC-POZA-ZAKRESEM",
    technicalMessage: `szerokoscGeograficzna = ${value}, oczekiwano [-90, 90]`,
    field: "szerokoscGeograficzna",
  }
}

export function dzienPozaZakresem(value: number): Warning {
  return {
    code: "DZIEN-ROKU-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DZIEN-ROKU-POZA-ZAKRESEM",
    technicalMessage: `dzienRoku = ${value}, oczekiwano [1, 365]`,
    field: "dzienRoku",
  }
}

export function mocOdbiornikaUjemna(value: number): Warning {
  return {
    code: "MOC-ODBIORNIKA-UJEMNA",
    level: "critical",
    i18nKey: "MOC-ODBIORNIKA-UJEMNA",
    technicalMessage: `mocOdbiornikaNocnegoW = ${value}, oczekiwano >= 0`,
    field: "mocOdbiornikaNocnegoW",
  }
}

export function nocPolarnaLubDzienPolarny(dlugoscDniaH: number): Warning {
  return {
    code: "NOC-DZIEN-POLARNY",
    level: "info",
    i18nKey: dlugoscDniaH === 0 ? "NOC-POLARNA" : "DZIEN-POLARNY",
    technicalMessage: `dlugoscDniaH=${dlugoscDniaH}`,
  }
}

export function energiaNocna(mocW: number, dlugoscNocyH: number, energiaKwh: number): Warning {
  return {
    code: "ENERGIA-NOCNA",
    level: "info",
    i18nKey: "ENERGIA-NOCNA",
    params: { moc: mocW, dlugoscNocy: dlugoscNocyH.toFixed(1), energia: energiaKwh.toFixed(2) },
    technicalMessage: `mocW=${mocW}, dlugoscNocyH=${dlugoscNocyH}, energiaKwh=${energiaKwh}`,
  }
}
