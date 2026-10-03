import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative or non-finite number. */
export function wartoscUjemnaTurbina(pole: string, wartosc: number): Warning {
  return {
    code: "TURBW-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "TURBW-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano liczby >= 0`,
    field: pole,
  }
}

/** Form validation: the availability/loss factor outside 0..1. */
export function wspolczynnikPozaZakresemTurbina(wartosc: number): Warning {
  return {
    code: "TURBW-WSPOLCZYNNIK-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "TURBW-WSPOLCZYNNIK-POZA-ZAKRESEM",
    technicalMessage: `wspolczynnikDostepnosciStrat = ${wartosc}, oczekiwano [0, 1]`,
    field: "wspolczynnikDostepnosciStrat",
  }
}

/** Form validation: the speed column of the power curve is not strictly increasing. */
export function krzywaNieRosnaca(indeks: number): Warning {
  return {
    code: "TURBW-KRZYWA-NIEROSNACA",
    level: "critical",
    i18nKey: "TURBW-KRZYWA-NIEROSNACA",
    params: { wiersz: indeks + 1 },
    technicalMessage: `krzywa[${indeks}].predkoscMs nie jest większa od poprzedniego wiersza`,
    field: "krzywa",
  }
}

/** Form validation: the cut-out speed is below the last point of the power curve. */
export function wylaczeniePonizejKrzywej(wylaczenie: number, ostatni: number): Warning {
  return {
    code: "TURBW-WYLACZENIE-PONIZEJ-KRZYWEJ",
    level: "critical",
    i18nKey: "TURBW-WYLACZENIE-PONIZEJ-KRZYWEJ",
    params: { wylaczenie, ostatni },
    technicalMessage: `predkoscWylaczeniaMs = ${wylaczenie} < ostatni punkt krzywej ${ostatni} m/s`,
    field: "predkoscWylaczeniaMs",
  }
}

/** Form validation: the cut-out speed above the technical limit of the model. */
export function wylaczeniePozaZakresem(wylaczenie: number, maks: number): Warning {
  return {
    code: "TURBW-WYLACZENIE-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "TURBW-WYLACZENIE-POZA-ZAKRESEM",
    params: { wylaczenie, maks },
    technicalMessage: `predkoscWylaczeniaMs = ${wylaczenie} > ${maks} m/s (limit techniczny modelu)`,
    field: "predkoscWylaczeniaMs",
  }
}

/** Info: only the mean wind speed is known, the distribution is assumed (Rayleigh). */
export function sredniaBezRozkladu(srednia: number): Warning {
  return {
    code: "TURBW-SREDNIA-BEZ-ROZKLADU",
    level: "info",
    i18nKey: "TURBW-SREDNIA-BEZ-ROZKLADU",
    params: { srednia },
    technicalMessage: `znana tylko średnia prędkość ${srednia} m/s; rozkład Rayleigha założony, nie zmierzony`,
    field: "sredniaPredkoscMs",
  }
}
