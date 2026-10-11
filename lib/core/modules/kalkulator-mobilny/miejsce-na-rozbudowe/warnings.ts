import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return { code: "MIEJROZ-WARTOSC-UJEMNA", level: "critical", i18nKey: "MIEJROZ-WARTOSC-UJEMNA", technicalMessage: `${field} = ${value}, oczekiwano >= 0`, field }
}

export function wartoscNiedodatnia(field: string, value: number): Warning {
  return { code: "MIEJROZ-WARTOSC-NIEDODATNIA", level: "critical", i18nKey: "MIEJROZ-WARTOSC-NIEDODATNIA", technicalMessage: `${field} = ${value}, oczekiwano > 0`, field }
}

export function liczbaNiecalkowita(value: number): Warning {
  return { code: "MIEJROZ-LICZBA-NIECALKOWITA", level: "critical", i18nKey: "MIEJROZ-LICZBA-NIECALKOWITA", technicalMessage: `planowanaLiczba = ${value}, oczekiwano liczby całkowitej >= 1`, field: "planowanaLiczba" }
}

/** The planned number is above what fits. */
export function planPonadMiejsce(plan: number, maks: number): Warning {
  return {
    code: "MIEJROZ-PLAN-PONAD-MIEJSCE",
    level: "warning",
    i18nKey: "MIEJROZ-PLAN-PONAD-MIEJSCE",
    params: { plan, maks, brak: plan - maks },
    technicalMessage: `Planowane ${plan} szt., mieści się ${maks} szt. — brakuje miejsca na ${plan - maks}`,
  }
}

export function elementWiekszyNizMiejsce(): Warning {
  return {
    code: "MIEJROZ-ELEMENT-WIEKSZY-NIZ-MIEJSCE",
    level: "warning",
    i18nKey: "MIEJROZ-ELEMENT-WIEKSZY-NIZ-MIEJSCE",
    technicalMessage: "Element (z odstępami) jest większy niż wolne miejsce w obu ustawieniach — nie zmieści się ani jedna sztuka",
  }
}

export function elementZaWysoki(elementMm: number, miejsceMm: number): Warning {
  return {
    code: "MIEJROZ-ELEMENT-ZA-WYSOKI",
    level: "warning",
    i18nKey: "MIEJROZ-ELEMENT-ZA-WYSOKI",
    params: { element: elementMm, miejsce: miejsceMm },
    technicalMessage: `Wysokość elementu ${elementMm} mm > wysokość miejsca ${miejsceMm} mm — nie zmieści się`,
  }
}

export function pietrowanieBezWysokosci(): Warning {
  return {
    code: "MIEJROZ-PIETROWANIE-BEZ-WYSOKOSCI",
    level: "info",
    i18nKey: "MIEJROZ-PIETROWANIE-BEZ-WYSOKOSCI",
    technicalMessage: "Piętrowanie wymaga wysokości miejsca i elementu — liczone w jednej warstwie",
  }
}

export function brakOdstepow(): Warning {
  return {
    code: "MIEJROZ-BRAK-ODSTEPOW",
    level: "info",
    i18nKey: "MIEJROZ-BRAK-ODSTEPOW",
    technicalMessage: "Nie wpisano odstępów między elementami lub od ścian — liczone jako 0",
  }
}
