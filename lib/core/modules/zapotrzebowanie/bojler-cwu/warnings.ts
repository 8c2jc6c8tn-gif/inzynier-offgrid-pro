import type { Warning } from "@/lib/core/calc-result"

export function wolumenUjemny(value: number): Warning {
  return {
    code: "WOLUMEN-UJEMNY",
    level: "critical",
    i18nKey: "WOLUMEN-UJEMNY",
    technicalMessage: `wolumenCwuLDoba = ${value}, oczekiwano >= 0`,
    field: "wolumenCwuLDoba",
  }
}

export function deltaTUjemna(value: number): Warning {
  return {
    code: "DELTA-T-UJEMNA",
    level: "critical",
    i18nKey: "DELTA-T-UJEMNA",
    technicalMessage: `deltaTK = ${value}, oczekiwano >= 0`,
    field: "deltaTK",
  }
}

export function mocGrzalkiUjemna(value: number): Warning {
  return {
    code: "MOC-GRZALKI-UJEMNA",
    level: "critical",
    i18nKey: "MOC-GRZALKI-UJEMNA",
    technicalMessage: `mocGrzalkiKw = ${value}, oczekiwano >= 0`,
    field: "mocGrzalkiKw",
  }
}

export function pojemnoscUjemna(value: number): Warning {
  return {
    code: "POJEMNOSC-BOJLERA-UJEMNA",
    level: "critical",
    i18nKey: "POJEMNOSC-BOJLERA-UJEMNA",
    technicalMessage: `pojemnoscBojleraL = ${value}, oczekiwano >= 0`,
    field: "pojemnoscBojleraL",
  }
}

export function bojlerZaMaly(pojemnoscBojleraL: number, wolumenCwuLDoba: number): Warning {
  return {
    code: "BOJLER-ZA-MALY",
    level: "warning",
    i18nKey: "BOJLER-ZA-MALY",
    params: { pojemnosc: pojemnoscBojleraL, wolumen: wolumenCwuLDoba },
    technicalMessage: `pojemnoscBojleraL=${pojemnoscBojleraL} < wolumenCwuLDoba=${wolumenCwuLDoba}`,
    field: "pojemnoscBojleraL",
  }
}
