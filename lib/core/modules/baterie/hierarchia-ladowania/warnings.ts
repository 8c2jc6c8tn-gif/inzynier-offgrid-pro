import type { Warning } from "@/lib/core/calc-result"

export function oczekiwanieNaSlonce(socAktualnyPct: number, socProguKrytycznegoPct: number): Warning {
  return {
    code: "OCZEKIWANIE-NA-SLONCE",
    level: "warning",
    i18nKey: "OCZEKIWANIE-NA-SLONCE",
    technicalMessage: `SoC=${socAktualnyPct}% < próg=${socProguKrytycznegoPct}%, ale prognoza przewiduje słońce jutro — system celowo nie włącza agregatu`,
  }
}

export function brakDostepnegoZrodlaLadowania(socAktualnyPct: number, socProguKrytycznegoPct: number): Warning {
  return {
    code: "BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA",
    level: "critical",
    i18nKey: "BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA",
    technicalMessage: `SoC=${socAktualnyPct}% < próg=${socProguKrytycznegoPct}%, brak PV, brak dostępnego agregatu/prognozy słońca, brak taniej taryfy sieciowej`,
  }
}
