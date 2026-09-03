import type { Warning } from "@/lib/core/calc-result"

/** 1:1 z cytatem 🔴 źródła. */
export function blokadaCalkowita(temperaturaC: number): Warning {
  return {
    code: "BLOKADA-LADOWANIA-MROZ",
    level: "critical",
    message: `Temperatura ogniwa ${temperaturaC.toFixed(1)}°C — poniżej -10°C ładowanie jest całkowicie zablokowane. Ładowanie w tych warunkach trwale uszkadza ogniwa (osadzanie litu metalicznego).`,
    technicalMessage: `temperaturaOgniwaC = ${temperaturaC} < -10`,
    field: "temperaturaOgniwaC",
  }
}

export function limitZimno(temperaturaC: number, maxPradA: number): Warning {
  return {
    code: "LIMIT-PRADU-ZIMNO",
    level: "warning",
    message: `Temperatura ogniwa ${temperaturaC.toFixed(1)}°C — maksymalny prąd ładowania ograniczony do 0,1C (${maxPradA.toFixed(1)} A).`,
    technicalMessage: `-10 <= temperaturaOgniwaC = ${temperaturaC} < 0`,
    field: "temperaturaOgniwaC",
  }
}

export function limitChlodno(temperaturaC: number, maxPradA: number): Warning {
  return {
    code: "LIMIT-PRADU-CHLODNO",
    level: "warning",
    message: `Temperatura ogniwa ${temperaturaC.toFixed(1)}°C — maksymalny prąd ładowania ograniczony do 0,2C (${maxPradA.toFixed(1)} A).`,
    technicalMessage: `0 <= temperaturaOgniwaC = ${temperaturaC} < 5`,
    field: "temperaturaOgniwaC",
  }
}

export function lukaZrodla(temperaturaC: number): Warning {
  return {
    code: "LUKA-TABELI-ZRODLA",
    level: "info",
    message: `Temperatura ogniwa ${temperaturaC.toFixed(1)}°C — źródło nie podaje limitu C-rate dla zakresu 5–10°C (luka w tabeli oryginalnej). Sprawdź specyfikację producenta ogniw dla tego zakresu — nie zgadujemy wartości pośredniej.`,
    technicalMessage: `5 <= temperaturaOgniwaC = ${temperaturaC} <= 10 — poza zdefiniowanymi progami źródła`,
    field: "temperaturaOgniwaC",
  }
}

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-NIEDODATNIA",
    level: "critical",
    message: "Pojemność pakietu musi być większa od zera.",
    technicalMessage: `pojemnoscAh = ${value}, oczekiwano > 0`,
    field: "pojemnoscAh",
  }
}
