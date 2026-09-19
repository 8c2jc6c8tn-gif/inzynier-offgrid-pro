import type { Warning } from "@/lib/core/calc-result"

export function notPositive(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-NIEDODATNIE",
    level: "critical",
    i18nKey: "ZAPOTRZEBOWANIE-CALKOWITE-NIEDODATNIE",
    technicalMessage: `zapotrzebowanieCalkowiteKwh = ${value}, oczekiwano > 0`,
    field: "zapotrzebowanieCalkowiteKwh",
  }
}

export function buforInfo(buforPct: number, dodatekKwh: number): Warning {
  if (buforPct === 0) {
    return {
      code: "BUFOR-INFO",
      level: "info",
      i18nKey: "BUFOR-BRAK",
      technicalMessage: `buforPct = ${buforPct}, dodatekKwh = ${dodatekKwh}`,
    }
  }
  return {
    code: "BUFOR-INFO",
    level: "info",
    i18nKey: "BUFOR-DOLICZONY",
    params: { procent: buforPct, dodatek: dodatekKwh.toFixed(1) },
    technicalMessage: `buforPct = ${buforPct}, dodatekKwh = ${dodatekKwh}`,
  }
}
