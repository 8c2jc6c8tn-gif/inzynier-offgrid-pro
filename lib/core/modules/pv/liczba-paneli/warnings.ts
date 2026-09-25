import type { Warning } from "@/lib/core/calc-result"

export function miesiacPozaZakresem(value: number): Warning {
  return {
    code: "LP-MIESIAC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { label: "miesiąc sezonu grzewczego", min: 0, max: 11 },
    technicalMessage: `miesiaceGrzewcze zawiera ${value}, oczekiwano liczby całkowitej 0–11`,
    field: "miesiaceGrzewcze",
  }
}

/** Dodatkowe zapotrzebowanie > 0 bez wskazania miesięcy — nie wiadomo, kiedy je doliczyć. */
export function sezonBezMiesiecy(): Warning {
  return {
    code: "LP-SEZON-BEZ-MIESIECY",
    level: "critical",
    i18nKey: "LP-SEZON-BEZ-MIESIECY",
    technicalMessage: "dodatkoweZimaKwhDzien > 0, miesiaceGrzewcze = []",
    field: "miesiaceGrzewcze",
  }
}

export function limitZaMalyNawetLato(limit: number, nLato: number): Warning {
  return {
    code: "LP-LIMIT-ZA-MALY-NAWET-LATO",
    level: "warning",
    i18nKey: "LP-LIMIT-ZA-MALY-NAWET-LATO",
    params: { limit, n: nLato },
    technicalMessage: `limitMontazowy = ${limit} < N(lato) = ${nLato}`,
  }
}

export function deficytPozaOkresem(kwh: number, n: number): Warning {
  return {
    code: "LP-DEFICYT-POZA-OKRESEM",
    level: "info",
    i18nKey: "LP-DEFICYT-POZA-OKRESEM",
    params: { kwh: Math.round(kwh), n },
    technicalMessage: `suma deficytu przy N = ${n}: ${kwh} kWh/rok`,
  }
}

/** Miesiąc bez produkcji w okresie (np. noc polarna) — N nieskończone, okres niewykonalny. */
export function okresBezProdukcji(okres: string, od: number, doM: number): Warning {
  return {
    code: "LP-OKRES-BEZ-PRODUKCJI",
    level: "warning",
    i18nKey: "LP-OKRES-BEZ-PRODUKCJI",
    params: { od, do: doM },
    technicalMessage: `okres ${okres}: produkcja panelu = 0 w co najmniej jednym miesiącu`,
  }
}
