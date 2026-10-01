import type { Warning } from "@/lib/core/calc-result"

/** 🟡 Biblia §12.7 / Tresc E7: power banks lack the continuous power for e.g. a camping fridge. */
export function zaMalaMocPowerbanku(mocUrzadzeniaW: number, powerbankMocWyjsciaW: number): Warning {
  return {
    code: "PBA-ZA-MALA-MOC-POWERBANKU",
    level: "warning",
    i18nKey: "PBA-ZA-MALA-MOC-POWERBANKU",
    params: { urzadzenie: mocUrzadzeniaW, powerbank: powerbankMocWyjsciaW },
    technicalMessage: `mocUrzadzeniaW=${mocUrzadzeniaW} > powerbankMocWyjsciaW=${powerbankMocWyjsciaW}`,
    field: "powerbankMocWyjsciaW",
  }
}

/** ℹ️ The battery set's continuous power is set by its converter/inverter (E8), price and weight per Wh by E34. */
export function mocZestawuIKoszt(): Warning {
  return {
    code: "PBA-MOC-ZESTAWU-I-KOSZT",
    level: "info",
    i18nKey: "PBA-MOC-ZESTAWU-I-KOSZT",
    technicalMessage: "always shown — odsyłacz do E8 i E34",
  }
}
