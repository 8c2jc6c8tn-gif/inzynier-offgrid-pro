import type { Warning } from "@/lib/core/calc-result"

export function standbyNiedodatni(): Warning {
  return {
    code: "WAMPIR-STANDBY-NIEDODATNI",
    level: "critical",
    i18nKey: "WAMPIR-STANDBY-NIEDODATNI",
    technicalMessage: "standbyW <= 0, oczekiwano > 0",
    field: "standbyW",
  }
}

export function dodPozaZakresem(): Warning {
  return {
    code: "WAMPIR-DOD-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WAMPIR-DOD-POZA-ZAKRESEM",
    technicalMessage: "dodPct musi być z przedziału (0, 100]",
    field: "dodPct",
  }
}

export function pojemnoscNiedodatnia(): Warning {
  return {
    code: "WAMPIR-POJEMNOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "WAMPIR-POJEMNOSC-NIEDODATNIA",
    technicalMessage: "pojemnoscUzytecznaKwh <= 0, oczekiwano > 0",
    field: "pojemnoscUzytecznaKwh",
  }
}

export function cenaEnergiiNiedodatnia(): Warning {
  return {
    code: "WAMPIR-CENA-ENERGII-NIEDODATNIA",
    level: "critical",
    i18nKey: "WAMPIR-CENA-ENERGII-NIEDODATNIA",
    technicalMessage: "cenaEnergiiZlZaKwh <= 0, oczekiwano > 0",
    field: "cenaEnergiiZlZaKwh",
  }
}

export function eliminacjaPozaZakresem(): Warning {
  return {
    code: "WAMPIR-ELIMINACJA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WAMPIR-ELIMINACJA-POZA-ZAKRESEM",
    technicalMessage: "eliminacjaPct musi być z przedziału (0, 100]",
    field: "eliminacjaPct",
  }
}
