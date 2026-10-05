import type { Warning } from "@/lib/core/calc-result"

/** Form validation: horizon / window / percentile / threshold outside its range (matches the `*-POZA-ZAKRESEM` guard exception). */
export function poleHistoriiPozaZakresem(pole: string, wartosc: number, zakres: string): Warning {
  return {
    code: "DEFM-HISTORIA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DEFM-HISTORIA-POZA-ZAKRESEM",
    params: { zakres },
    technicalMessage: `${pole} = ${wartosc}, oczekiwano ${zakres}`,
    field: pole,
  }
}

/** Form validation: the history is malformed (year length, negative / non-finite value, duplicate year, missing conversion). */
export function historiaPozaZakresem(powod: string): Warning {
  return {
    code: "DEFM-DANE-HISTORII-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DEFM-DANE-HISTORII-POZA-ZAKRESEM",
    params: { powod },
    technicalMessage: `historia: ${powod}`,
    field: "historia",
  }
}

/** 🟡 The stock does not cover the chosen fixed horizon in the worst month. */
export function horyzontPonadZapas(miesiac: number, dni: number, litry: number, zapas: number): Warning {
  return {
    code: "DEFM-HORYZONT-PONAD-ZAPAS",
    level: "warning",
    i18nKey: "DEFM-HORYZONT-PONAD-ZAPAS",
    params: { miesiac, dni, litry: Math.round(litry), zapas: Math.round(zapas) },
    technicalMessage: `horyzont ${dni} dni, miesiąc ${miesiac}: paliwo ${litry} l > zapas ${zapas} l`,
    field: "zapasPaliwaL",
  }
}

/** 🟡 The stock is below the history-based recommendation (user-chosen percentile of the yearly worst windows). */
export function historiaZapasZaMaly(
  okno: number,
  percentyl: number,
  litry: number,
  zapas: number,
  lataPokryte: number,
  lata: number,
): Warning {
  return {
    code: "DEFM-HISTORIA-ZAPAS-ZA-MALY",
    level: "warning",
    i18nKey: "DEFM-HISTORIA-ZAPAS-ZA-MALY",
    params: { okno, percentyl, litry: Math.round(litry), zapas: Math.round(zapas), lataPokryte, lata },
    technicalMessage: `okno ${okno} dni, P${percentyl}: ${litry} l > zapas ${zapas} l (zapas wystarczyłby w ${lataPokryte}/${lata} lat)`,
    field: "zapasPaliwaL",
  }
}

/** ℹ️ Plain note: the estimate rests on a single year. */
export function historiaMaloDanych(lata: number, dni: number): Warning {
  return {
    code: "DEFM-HISTORIA-MALO-DANYCH",
    level: "info",
    i18nKey: "DEFM-HISTORIA-MALO-DANYCH",
    params: { lata, dni },
    technicalMessage: `szacunek na ${lata} roku (${dni} dni z danymi)`,
    field: "historia",
  }
}

/** ℹ️ Plain note: with this few years the chosen percentile is the maximum (nearest-rank method). */
export function historiaPercentylToMaksimum(lata: number, dni: number, percentyl: number): Warning {
  return {
    code: "DEFM-HISTORIA-PERCENTYL-TO-MAKSIMUM",
    level: "info",
    i18nKey: "DEFM-HISTORIA-PERCENTYL-TO-MAKSIMUM",
    params: { lata, dni, percentyl },
    technicalMessage: `P${percentyl} z ${lata} lat = maksimum (${dni} dni z danymi)`,
    field: "historia",
  }
}

/** ℹ️ History entered but the analysis parameters (demand / window) are missing — nothing computed from it. */
export function historiaBrakParametrow(): Warning {
  return {
    code: "DEFM-HISTORIA-BRAK-PARAMETROW",
    level: "info",
    i18nKey: "DEFM-HISTORIA-BRAK-PARAMETROW",
    technicalMessage: "historia wpisana, brak zapotrzebowania dobowego (12 miesięcy) albo okna dostaw — analiza pominięta",
    field: "analizaHistorii",
  }
}

/** ℹ️ Years that hold no complete window of the chosen length are left out. */
export function historiaPominieteLata(lata: number[]): Warning {
  return {
    code: "DEFM-HISTORIA-POMINIETE-LATA",
    level: "info",
    i18nKey: "DEFM-HISTORIA-POMINIETE-LATA",
    params: { lata: lata.join(", ") },
    technicalMessage: `lata bez pełnego okna: ${lata.join(", ")}`,
    field: "historia",
  }
}

/**
 * 🟡 Months without a complete month of data in any year — no result for them (not 0), so the stock may be too
 * small (owner decision D74 pkt 5, 04.10.2026; was ℹ️ with 0).
 */
export function historiaBrakMiesiecy(miesiace: number[]): Warning {
  return {
    code: "DEFM-HISTORIA-BRAK-MIESIECY",
    level: "warning",
    i18nKey: "DEFM-HISTORIA-BRAK-MIESIECY",
    params: { miesiace: miesiace.join(", ") },
    technicalMessage: `miesiące bez pełnych danych: ${miesiace.join(", ")}`,
    field: "historia",
  }
}

/**
 * 🟡 The history has days marked as missing (owner decision 05.10.2026, "niech pisze brak danych z możliwością
 * ręcznego uzupełnienia"): a window or streak containing such a day is skipped, so the worst window may be
 * understated; with a store its state after the gap restarts from 0. `przyklady` = the first dates (ISO).
 */
export function historiaBrakDni(liczba: number, przyklady: string[]): Warning {
  const dni = przyklady.join(", ") + (liczba > przyklady.length ? ", …" : "")
  return {
    code: "DEFM-HISTORIA-BRAK-DNI",
    level: "warning",
    i18nKey: "DEFM-HISTORIA-BRAK-DNI",
    params: { liczba, dni },
    technicalMessage: `dni bez danych: ${liczba} (${dni})`,
    field: "historia",
  }
}
