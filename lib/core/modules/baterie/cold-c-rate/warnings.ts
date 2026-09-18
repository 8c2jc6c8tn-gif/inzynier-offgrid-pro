import type { Warning } from "@/lib/core/calc-result"

/** 1:1 z cytatem 🔴 źródła. */
export function blokadaCalkowita(temperaturaC: number): Warning {
  return {
    code: "BLOKADA-LADOWANIA-MROZ",
    level: "critical",
    i18nKey: "BLOKADA-LADOWANIA-MROZ",
    params: { temp: temperaturaC.toFixed(1) },
    technicalMessage: `temperaturaOgniwaC = ${temperaturaC} < -10`,
    field: "temperaturaOgniwaC",
  }
}

export function limitZimno(temperaturaC: number, maxPradA: number): Warning {
  return {
    code: "LIMIT-PRADU-ZIMNO",
    level: "warning",
    i18nKey: "LIMIT-PRADU-ZIMNO",
    params: { temp: temperaturaC.toFixed(1), maxPrad: maxPradA.toFixed(1) },
    technicalMessage: `-10 <= temperaturaOgniwaC = ${temperaturaC} < 0`,
    field: "temperaturaOgniwaC",
  }
}

export function limitChlodno(temperaturaC: number, maxPradA: number): Warning {
  return {
    code: "LIMIT-PRADU-CHLODNO",
    level: "warning",
    i18nKey: "LIMIT-PRADU-CHLODNO",
    params: { temp: temperaturaC.toFixed(1), maxPrad: maxPradA.toFixed(1) },
    technicalMessage: `0 <= temperaturaOgniwaC = ${temperaturaC} < 5`,
    field: "temperaturaOgniwaC",
  }
}

export function lukaZrodla(temperaturaC: number): Warning {
  return {
    code: "LUKA-TABELI-ZRODLA",
    level: "info",
    i18nKey: "LUKA-TABELI-ZRODLA",
    params: { temp: temperaturaC.toFixed(1) },
    technicalMessage: `5 <= temperaturaOgniwaC = ${temperaturaC} <= 10 — poza zdefiniowanymi progami źródła`,
    field: "temperaturaOgniwaC",
  }
}

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "POJEMNOSC-NIEDODATNIA",
    technicalMessage: `pojemnoscAh = ${value}, oczekiwano > 0`,
    field: "pojemnoscAh",
  }
}
