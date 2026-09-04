import type { Warning } from "@/lib/core/calc-result"
import { MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function zaMalaOdleglosc(odlegloscCm: number): Warning {
  return {
    code: "ZA-MALA-ODLEGLOSC",
    level: "critical",
    message: `Odległość od materiałów palnych (${odlegloscCm.toFixed(0)} cm) jest mniejsza od minimum ${MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM} cm — realne ryzyko pożaru.`,
    technicalMessage: `odlegloscCm=${odlegloscCm} < ${MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM}`,
  }
}

export function odlegloscOk(odlegloscCm: number): Warning {
  return {
    code: "ODLEGLOSC-OK",
    level: "info",
    message: `Odległość od materiałów palnych (${odlegloscCm.toFixed(0)} cm) spełnia minimum ${MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM} cm.`,
    technicalMessage: `odlegloscCm=${odlegloscCm} >= ${MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM}`,
  }
}

export function brakNawiewu(): Warning {
  return {
    code: "BRAK-NAWIEWU",
    level: "critical",
    message:
      "Brak osobnego nawiewu powietrza do spalania — ryzyko niedotlenienia pomieszczenia i cofki spalin.",
    technicalMessage: "maNawiewPowietrzaDoSpalania = false",
  }
}

export function nawiewObecny(): Warning {
  return {
    code: "NAWIEW-OBECNY",
    level: "info",
    message: "Osobny nawiew powietrza do spalania jest zapewniony.",
    technicalMessage: "maNawiewPowietrzaDoSpalania = true",
  }
}

export function brakCzujnikaCo(): Warning {
  return {
    code: "BRAK-CZUJNIKA-CO",
    level: "critical",
    message:
      "Brak czujnika czadu (CO) w pomieszczeniu z otwartym źródłem spalania — to zagrożenie życia, nie tylko mienia. Czad nie ma zapachu i zabija we śnie.",
    technicalMessage: "maCzujnikCo = false",
  }
}

export function czujnikCoObecny(): Warning {
  return {
    code: "CZUJNIK-CO-OBECNY",
    level: "info",
    message: "Czujnik czadu (CO) jest zamontowany w pomieszczeniu.",
    technicalMessage: "maCzujnikCo = true",
  }
}
