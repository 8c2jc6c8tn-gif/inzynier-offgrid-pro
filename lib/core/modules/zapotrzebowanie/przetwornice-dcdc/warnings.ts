import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, value: number): Warning {
  const code = `${field.toUpperCase()}-NIEDODATNI`
  return {
    code,
    level: "critical",
    i18nKey: code,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-PRZETWORNICY-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscPrzetwornicyPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscPrzetwornicyPct",
  }
}

export function strataNaKonwersji(strataPct: number, strataW: number): Warning {
  return {
    code: "STRATA-NA-KONWERSJI",
    level: "info",
    i18nKey: "STRATA-NA-KONWERSJI",
    params: { strata: strataPct.toFixed(0), strataW: strataW.toFixed(1) },
    technicalMessage: `strataPct = ${strataPct}, strataW = ${strataW}`,
  }
}

export function zasilanieBezposrednieInfo(): Warning {
  return {
    code: "ZASILANIE-BEZPOSREDNIE",
    level: "info",
    i18nKey: "ZASILANIE-BEZPOSREDNIE",
    technicalMessage: "zasilanieBezposrednie === true",
  }
}
