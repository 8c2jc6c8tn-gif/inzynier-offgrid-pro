import type { Warning } from "@/lib/core/calc-result"
import { MIN_CZUJNIKOW_POTWIERDZENIA } from "./constants"

export function liczbaCzujnikowNiepoprawna(value: number): Warning {
  return {
    code: "GASZ-LICZBA-CZUJNIKOW-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "GASZ-LICZBA-CZUJNIKOW-NIEPOPRAWNA",
    technicalMessage: `liczbaCzujnikowPotwierdzenia = ${value}, oczekiwano liczby całkowitej >= 1`,
    field: "liczbaCzujnikowPotwierdzenia",
  }
}

export function srodekNieskutecznyLifepo4(srodek: string): Warning {
  return {
    code: "GASZ-SRODEK-NIESKUTECZNY-LIFEPO4",
    level: "critical",
    i18nKey: "GASZ-SRODEK-NIESKUTECZNY-LIFEPO4",
    technicalMessage: `srodek=${srodek}, magazynWStrefie=lifepo4 — proszek/CO2 nie gaszą reakcji ogniwa (Tresc_Modul_8, Ekran 4, przypomnienie z M4)`,
    field: "srodek",
  }
}

export function srodekNiepotwierdzonyLifepo4(srodek: string): Warning {
  return {
    code: "GASZ-SRODEK-NIEPOTWIERDZONY-LIFEPO4",
    level: "warning",
    i18nKey: "GASZ-SRODEK-NIEPOTWIERDZONY-LIFEPO4",
    technicalMessage: `srodek=${srodek}, magazynWStrefie=lifepo4 — źródło wymaga mgły wodnej lub środka do magazynów energii; ten środek nie jest ani wymagany, ani wymieniony jako nieskuteczny`,
    field: "srodek",
  }
}

/**
 * D54 (owner: gas/aerosol stays 🟡, propose agents and cell cooling): ℹ️ shown with 🟡/🔴 in a LiFePO4 zone.
 * Water mist and energy-storage agents are the source's wording; cell cooling is the AI proposal (✅🤖).
 */
export function propozycjaSrodkowLifepo4(): Warning {
  return {
    code: "GASZ-PROPOZYCJA-LIFEPO4",
    level: "info",
    i18nKey: "GASZ-PROPOZYCJA-LIFEPO4",
    technicalMessage: "magazynWStrefie=lifepo4, środek spoza wymaganych — propozycja: mgła wodna, środek do magazynów energii, chłodzenie ogniw (D54)",
    field: "srodek",
  }
}

export function innaChemiaMagazynu(): Warning {
  return {
    code: "GASZ-INNA-CHEMIA",
    level: "info",
    i18nKey: "GASZ-INNA-CHEMIA",
    technicalMessage: "magazynWStrefie=inna — przypomnienie źródła dotyczy LiFePO4; dobór środka wg producenta magazynu",
    field: "magazynWStrefie",
  }
}

export function zaMaloCzujnikow(liczba: number): Warning {
  return {
    code: "GASZ-ZA-MALO-CZUJNIKOW",
    level: "warning",
    i18nKey: "GASZ-ZA-MALO-CZUJNIKOW",
    params: { liczba, min: MIN_CZUJNIKOW_POTWIERDZENIA },
    technicalMessage: `liczbaCzujnikowPotwierdzenia=${liczba} < ${MIN_CZUJNIKOW_POTWIERDZENIA} (Tresc_Modul_8, Ekran 4, B.1)`,
    field: "liczbaCzujnikowPotwierdzenia",
  }
}

export function brakOdcieciaWentylacji(): Warning {
  return {
    code: "GASZ-BRAK-ODCIECIA-WENTYLACJI",
    level: "warning",
    i18nKey: "GASZ-BRAK-ODCIECIA-WENTYLACJI",
    technicalMessage: "odcinaWentylacjeIKlapy = false (Tresc_Modul_8, Ekran 4, B.1 — środek gaśniczy ucieknie)",
    field: "odcinaWentylacjeIKlapy",
  }
}

export function modulRozladowany(): Warning {
  return {
    code: "GASZ-MODUL-ROZLADOWANY",
    level: "critical",
    i18nKey: "GASZ-MODUL-ROZLADOWANY",
    technicalMessage: "stanModulu = rozladowany (Tresc_Modul_8, Ekran 4, C — status krytyczny)",
    field: "stanModulu",
  }
}
