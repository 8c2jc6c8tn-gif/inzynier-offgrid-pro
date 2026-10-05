import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, value: number): Warning {
  return {
    code: "LADAG-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "LADAG-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function socPozaZakresem(start: number, stop: number): Warning {
  return {
    code: "LADAG-SOC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "LADAG-SOC-POZA-ZAKRESEM",
    params: { start, stop },
    technicalMessage: `socStartPct=${start}, socStopPct=${stop}, oczekiwano 0 <= start < stop <= 100`,
    field: "socStopPct",
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "LADAG-SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "LADAG-SPRAWNOSC-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscLadowaniaPct = ${value}, oczekiwano 0 < x <= 100`,
    field: "sprawnoscLadowaniaPct",
  }
}

/** 🔴 The emergency-line loads alone take all of the generator's power — nothing is left to charge the store. */
export function brakZapasuMocy(mocAgregatu: number, mocOdbiornikow: number): Warning {
  return {
    code: "LADAG-BRAK-ZAPASU-MOCY",
    level: "critical",
    i18nKey: "LADAG-BRAK-ZAPASU-MOCY",
    params: { agregat: mocAgregatu, odbiorniki: mocOdbiornikow },
    technicalMessage: `mocOdbiornikowKw=${mocOdbiornikow} >= mocAgregatuKw=${mocAgregatu}: generator power - loads <= 0, charging impossible, generator at or over its rating`,
    field: "mocOdbiornikowKw",
  }
}

/**
 * 🟡 Charger + loads exceed the generator: the calculation limits charging to the remaining margin, but only an
 * inverter that limits its AC-input (generator) current does that in reality — otherwise the generator is overloaded.
 */
export function ograniczenieLadowania(mocLadowarki: number, mocOdbiornikow: number, mocAgregatu: number): Warning {
  return {
    code: "LADAG-LADOWANIE-OGRANICZONE",
    level: "warning",
    i18nKey: "LADAG-LADOWANIE-OGRANICZONE",
    params: { ladowarka: mocLadowarki, odbiorniki: mocOdbiornikow, agregat: mocAgregatu, zapas: mocAgregatu - mocOdbiornikow },
    technicalMessage: `mocLadowarkiKw + mocOdbiornikowKw = ${mocLadowarki + mocOdbiornikow} > mocAgregatuKw = ${mocAgregatu}; charging limited to the margin`,
    field: "mocLadowarkiKw",
  }
}

/** ℹ️ Fuel per hour must be read from the datasheet at this load — the l/h figure depends on it. */
export function odczytajZuzycie(obciazeniePct: number): Warning {
  return {
    code: "LADAG-ODCZYTAJ-ZUZYCIE",
    level: "info",
    i18nKey: "LADAG-ODCZYTAJ-ZUZYCIE",
    params: { procent: obciazeniePct },
    technicalMessage: `fuel l/h not given; read it from the datasheet at ${obciazeniePct}% load`,
    field: "zuzyciePaliwaLH",
  }
}
