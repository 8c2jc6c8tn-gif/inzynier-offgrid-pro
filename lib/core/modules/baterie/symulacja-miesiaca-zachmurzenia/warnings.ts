import type { Warning } from "@/lib/core/calc-result"

export function produkcjaNominalnaNiedodatnia(value: number): Warning {
  return {
    code: "PRODUKCJA-NOMINALNA-NIEDODATNIA",
    level: "critical",
    i18nKey: "PRODUKCJA-NOMINALNA-NIEDODATNIA",
    technicalMessage: `produkcjaNominalnaDobowaKwh = ${value}, oczekiwano > 0`,
    field: "produkcjaNominalnaDobowaKwh",
  }
}

export function poziomZachmurzeniaPozaZakresem(value: number): Warning {
  return {
    code: "POZIOM-ZACHMURZENIA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "POZIOM-ZACHMURZENIA-POZA-ZAKRESEM",
    technicalMessage: `poziomZachmurzeniaPct = ${value}, oczekiwano [0, 100]`,
    field: "poziomZachmurzeniaPct",
  }
}

export function liczbaDniScenariuszaNiedodatnia(value: number): Warning {
  return {
    code: "LICZBA-DNI-SCENARIUSZA-NIEDODATNIA",
    level: "critical",
    i18nKey: "LICZBA-DNI-SCENARIUSZA-NIEDODATNIA",
    technicalMessage: `liczbaDniScenariusza = ${value}, oczekiwano > 0`,
    field: "liczbaDniScenariusza",
  }
}

export function systemNiePrzetrwaScenariusza(dzien: number, energiaBrakujacaKwh: number): Warning {
  return {
    code: "SYSTEM-NIE-PRZETRWA-SCENARIUSZA",
    level: "critical",
    i18nKey: "SYSTEM-NIE-PRZETRWA-SCENARIUSZA",
    technicalMessage: `blackout w dniu ${dzien} scenariusza, brakuje ${energiaBrakujacaKwh.toFixed(1)} kWh pojemności, żeby przetrwać cały scenariusz`,
  }
}
