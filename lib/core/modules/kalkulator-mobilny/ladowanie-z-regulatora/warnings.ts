import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return { code: "LADREG-WARTOSC-UJEMNA", level: "critical", i18nKey: "LADREG-WARTOSC-UJEMNA", technicalMessage: `${field} = ${value}, oczekiwano >= 0`, field }
}

export function wartoscNiedodatnia(field: string, value: number): Warning {
  return { code: "LADREG-WARTOSC-NIEDODATNIA", level: "critical", i18nKey: "LADREG-WARTOSC-NIEDODATNIA", technicalMessage: `${field} = ${value}, oczekiwano > 0`, field }
}

export function wartoscPozaZakresem(field: string, value: number, min: number, max: number): Warning {
  return {
    code: "LADREG-WARTOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "LADREG-WARTOSC-POZA-ZAKRESEM",
    params: { min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

/** The current that can reach the battery is above the battery's own limit — the limit has to be set in the regulator. */
export function pradPonadLimitAkumulatora(pradA: number, limitA: number): Warning {
  return {
    code: "LADREG-PRAD-PONAD-LIMIT-AKUMULATORA",
    level: "warning",
    i18nKey: "LADREG-PRAD-PONAD-LIMIT-AKUMULATORA",
    params: { prad: pradA, limit: limitA },
    technicalMessage: `Możliwy prąd ładowania ${pradA} A > limit akumulatora ${limitA} A — ustawić limit prądu w regulatorze`,
  }
}

export function mocPaneliPonadLimitRegulatora(mocW: number, limitW: number): Warning {
  return {
    code: "LADREG-MOC-PANELI-PONAD-LIMIT",
    level: "warning",
    i18nKey: "LADREG-MOC-PANELI-PONAD-LIMIT",
    params: { moc: mocW, limit: limitW, nadmiar: mocW - limitW },
    technicalMessage: `Moc paneli ${mocW} W > limit wejścia PV regulatora ${limitW} W — nadmiar obcięty`,
  }
}

export function brakLimitu(kto: "regulatora" | "akumulatora"): Warning {
  return {
    code: "LADREG-BRAK-LIMITU",
    level: "info",
    i18nKey: kto === "regulatora" ? "LADREG-BRAK-LIMITU-REGULATORA" : "LADREG-BRAK-LIMITU-AKUMULATORA",
    technicalMessage: `Brak limitu prądu ${kto} — wynik uwzględnia tylko pozostałe ograniczenia`,
  }
}
