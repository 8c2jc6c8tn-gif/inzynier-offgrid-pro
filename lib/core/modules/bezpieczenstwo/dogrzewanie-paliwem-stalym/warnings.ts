import type { Warning } from "@/lib/core/calc-result"
import { MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function zaMalaOdleglosc(odlegloscCm: number): Warning {
  return {
    code: "ZA-MALA-ODLEGLOSC",
    level: "critical",
    i18nKey: "ZA-MALA-ODLEGLOSC",
    params: { odleglosc: odlegloscCm.toFixed(0), min: MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM },
    technicalMessage: `odlegloscCm=${odlegloscCm} < ${MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM}`,
  }
}

export function odlegloscOk(odlegloscCm: number): Warning {
  return {
    code: "ODLEGLOSC-OK",
    level: "info",
    i18nKey: "ODLEGLOSC-OK",
    params: { odleglosc: odlegloscCm.toFixed(0), min: MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM },
    technicalMessage: `odlegloscCm=${odlegloscCm} >= ${MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM}`,
  }
}

export function brakNawiewu(): Warning {
  return {
    code: "BRAK-NAWIEWU",
    level: "critical",
    i18nKey: "BRAK-NAWIEWU",
    technicalMessage: "maNawiewPowietrzaDoSpalania = false",
  }
}

export function nawiewObecny(): Warning {
  return {
    code: "NAWIEW-OBECNY",
    level: "info",
    i18nKey: "NAWIEW-OBECNY",
    technicalMessage: "maNawiewPowietrzaDoSpalania = true",
  }
}

export function brakCzujnikaCo(): Warning {
  return {
    code: "BRAK-CZUJNIKA-CO",
    level: "critical",
    i18nKey: "BRAK-CZUJNIKA-CO",
    technicalMessage: "maCzujnikCo = false",
  }
}

export function czujnikCoObecny(): Warning {
  return {
    code: "CZUJNIK-CO-OBECNY",
    level: "info",
    i18nKey: "CZUJNIK-CO-OBECNY",
    technicalMessage: "maCzujnikCo = true",
  }
}
