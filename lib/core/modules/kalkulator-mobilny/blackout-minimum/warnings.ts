import type { Warning } from "@/lib/core/calc-result"

/** 🟡 The battery the user has is below the minimum for the entered blackout. */
export function akumulatorZaMaly(posiadanyAh: number, minimalnyAh: number, godzin: number): Warning {
  return {
    code: "BM-AKUMULATOR-ZA-MALY",
    level: "warning",
    i18nKey: "BM-AKUMULATOR-ZA-MALY",
    params: { posiadany: posiadanyAh, minimalny: Math.ceil(minimalnyAh), godzin: Math.floor(godzin) },
    technicalMessage: `posiadanyAh=${posiadanyAh} < minimalnyAh=${minimalnyAh.toFixed(1)}`,
    field: "posiadanyAh",
  }
}

/** ℹ️ The inverter minimum is the sum of running powers; compressor/motor start currents are checked on E8. */
export function rozruchPrzetwornicy(): Warning {
  return {
    code: "BM-ROZRUCH-PRZETWORNICY",
    level: "info",
    i18nKey: "BM-ROZRUCH-PRZETWORNICY",
    technicalMessage: "always shown — odsyłacz do E8 (prądy rozruchowe)",
  }
}
