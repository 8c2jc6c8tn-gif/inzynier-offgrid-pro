import type { Warning } from "@/lib/core/calc-result"

export function wolumenUjemny(value: number): Warning {
  return {
    code: "WOLUMEN-UJEMNY",
    level: "critical",
    message: "Dobowe zapotrzebowanie na C.W.U. nie może być ujemne.",
    technicalMessage: `wolumenCwuLDoba = ${value}, oczekiwano >= 0`,
    field: "wolumenCwuLDoba",
  }
}

export function deltaTUjemna(value: number): Warning {
  return {
    code: "DELTA-T-UJEMNA",
    level: "critical",
    message: "Wzrost temperatury wody nie może być ujemny.",
    technicalMessage: `deltaTK = ${value}, oczekiwano >= 0`,
    field: "deltaTK",
  }
}

export function mocGrzalkiUjemna(value: number): Warning {
  return {
    code: "MOC-GRZALKI-UJEMNA",
    level: "critical",
    message: "Moc grzałki nie może być ujemna.",
    technicalMessage: `mocGrzalkiKw = ${value}, oczekiwano >= 0`,
    field: "mocGrzalkiKw",
  }
}

export function pojemnoscUjemna(value: number): Warning {
  return {
    code: "POJEMNOSC-BOJLERA-UJEMNA",
    level: "critical",
    message: "Pojemność bojlera nie może być ujemna.",
    technicalMessage: `pojemnoscBojleraL = ${value}, oczekiwano >= 0`,
    field: "pojemnoscBojleraL",
  }
}

export function bojlerZaMaly(pojemnoscBojleraL: number, wolumenCwuLDoba: number): Warning {
  return {
    code: "BOJLER-ZA-MALY",
    level: "warning",
    message: `Pojemność bojlera (${pojemnoscBojleraL} l) jest mniejsza niż dobowe zapotrzebowanie (${wolumenCwuLDoba} l) — jednego ładowania na dobę może nie wystarczyć.`,
    technicalMessage: `pojemnoscBojleraL=${pojemnoscBojleraL} < wolumenCwuLDoba=${wolumenCwuLDoba}`,
    field: "pojemnoscBojleraL",
  }
}
