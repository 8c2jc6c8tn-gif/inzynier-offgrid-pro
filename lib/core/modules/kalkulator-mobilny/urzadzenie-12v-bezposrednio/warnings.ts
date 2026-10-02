import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function tolerancjaPozaZakresem(value: number): Warning {
  return {
    code: "U12-TOLERANCJA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "U12-TOLERANCJA-POZA-ZAKRESEM",
    technicalMessage: `tolerancjaPct = ${value}, oczekiwano [0, 100)`,
    field: "tolerancjaPct",
  }
}

export function maksLadowaniaPonizejZnamionowego(maksV: number, systemV: number): Warning {
  return {
    code: "U12-MAKS-LADOWANIA-PONIZEJ-ZNAMIONOWEGO",
    level: "critical",
    i18nKey: "U12-MAKS-LADOWANIA-PONIZEJ-ZNAMIONOWEGO",
    params: { maks: maksV, system: systemV },
    technicalMessage: `maksNapiecieLadowaniaV=${maksV} < napiecieSystemuV=${systemV}`,
    field: "maksNapiecieLadowaniaV",
  }
}

export function przepieciePrzyLadowaniu(akuMaxV: number, urzadzenieMaxV: number): Warning {
  return {
    code: "U12-PRZEPIECIE-PRZY-LADOWANIU",
    level: "critical",
    i18nKey: "U12-PRZEPIECIE-PRZY-LADOWANIU",
    params: { aku: akuMaxV.toFixed(1), urzadzenie: urzadzenieMaxV.toFixed(1) },
    technicalMessage: `akuMaxV=${akuMaxV} > urzadzenieMaxV=${urzadzenieMaxV}`,
  }
}

export function zaNiskiePrzyRozladowaniu(akuMinV: number, urzadzenieMinV: number): Warning {
  return {
    code: "U12-ZA-NISKIE-PRZY-ROZLADOWANIU",
    level: "info",
    i18nKey: "U12-ZA-NISKIE-PRZY-ROZLADOWANIU",
    params: { aku: akuMinV.toFixed(1), urzadzenie: urzadzenieMinV.toFixed(1) },
    technicalMessage: `akuMinV=${akuMinV} < urzadzenieMinV=${urzadzenieMinV}`,
  }
}

export function przezStabilizatorInfo(akuMinV: number, akuMaxV: number): Warning {
  return {
    code: "U12-PRZEZ-STABILIZATOR",
    level: "info",
    i18nKey: "U12-PRZEZ-STABILIZATOR",
    params: { min: akuMinV.toFixed(1), max: akuMaxV.toFixed(1) },
    technicalMessage: "przezStabilizator=true — sprawdzany zakres wejścia stabilizatora, nie urządzenia",
  }
}
