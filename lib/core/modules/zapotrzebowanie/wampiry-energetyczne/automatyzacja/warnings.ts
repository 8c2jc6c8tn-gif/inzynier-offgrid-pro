import type { Warning } from "@/lib/core/calc-result"

export function standbyReferencyjnyNiedodatni(): Warning {
  return {
    code: "WAMPIR-STANDBY-REFERENCYJNY-NIEDODATNI",
    level: "critical",
    i18nKey: "WAMPIR-STANDBY-REFERENCYJNY-NIEDODATNI",
    technicalMessage: "standbyReferencyjnyW <= 0, oczekiwano > 0",
    field: "standbyReferencyjnyW",
  }
}

export function standbyWScenariuszuNiedodatni(): Warning {
  return {
    code: "WAMPIR-STANDBY-SCENARIUSZ-NIEDODATNI",
    level: "critical",
    i18nKey: "WAMPIR-STANDBY-SCENARIUSZ-NIEDODATNI",
    technicalMessage: "standbyWScenariuszuW < 0, oczekiwano >= 0",
    field: "standbyWScenariuszuW",
  }
}

export function redukcjaNiepozytywna(): Warning {
  return {
    code: "WAMPIR-REDUKCJA-NIEPOZYTYWNA",
    level: "info",
    i18nKey: "WAMPIR-REDUKCJA-NIEPOZYTYWNA",
    technicalMessage: "standbyWScenariuszuW >= standbyReferencyjnyW, scenariusz nie daje oszczędności",
    field: "standbyWScenariuszuW",
  }
}
