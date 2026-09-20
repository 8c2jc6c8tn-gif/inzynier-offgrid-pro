import type { Warning } from "@/lib/core/calc-result"

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "POJEMNOSC-NIEDODATNIA",
    technicalMessage: `pojemnoscUzytecznaKwh = ${value}, oczekiwano > 0`,
    field: "pojemnoscUzytecznaKwh",
  }
}

export function socPozaZakresem(field: string, value: number): Warning {
  return {
    code: "SOC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SOC-POZA-ZAKRESEM",
    technicalMessage: `${field} = ${value}, oczekiwano [0, 100]`,
    field,
  }
}

export function mocLadowaniaUjemna(value: number): Warning {
  return {
    code: "MOC-LADOWANIA-UJEMNA",
    level: "critical",
    i18nKey: "MOC-LADOWANIA-UJEMNA",
    technicalMessage: `mocLadowaniaKw = ${value}, oczekiwano >= 0`,
    field: "mocLadowaniaKw",
  }
}

export function mocRozladowaniaNiedodatnia(value: number): Warning {
  return {
    code: "MOC-ROZLADOWANIA-NIEDODATNIA",
    level: "critical",
    i18nKey: "MOC-ROZLADOWANIA-NIEDODATNIA",
    technicalMessage: `mocRozladowaniaKw = ${value}, oczekiwano > 0`,
    field: "mocRozladowaniaKw",
  }
}

export function dlugoscDniaPozaZakresem(value: number): Warning {
  return {
    code: "DLUGOSC-DNIA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DLUGOSC-DNIA-POZA-ZAKRESEM",
    technicalMessage: `dlugoscDniaGodz = ${value}, oczekiwano (0, 24)`,
    field: "dlugoscDniaGodz",
  }
}
