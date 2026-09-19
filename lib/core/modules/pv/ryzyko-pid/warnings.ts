import type { Warning } from "@/lib/core/calc-result"
import { PROG_NAPIECIA_PID_V } from "./constants"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function ryzykoPid(napiecieDcV: number): Warning {
  return {
    code: "RYZYKO-PID",
    level: "warning",
    i18nKey: "RYZYKO-PID",
    params: { napiecie: napiecieDcV.toFixed(0), prog: PROG_NAPIECIA_PID_V.toFixed(0) },
    technicalMessage: `napiecieDcV=${napiecieDcV} > PROG_NAPIECIA_PID_V=${PROG_NAPIECIA_PID_V} && wilgotnoscWysoka=true`,
  }
}

export function brakRyzykaPid(napiecieDcV: number): Warning {
  return {
    code: "BRAK-RYZYKA-PID",
    level: "info",
    i18nKey: "BRAK-RYZYKA-PID",
    params: { napiecie: napiecieDcV.toFixed(0) },
    technicalMessage: `napiecieDcV=${napiecieDcV}, warunek ryzyka PID niespełniony`,
  }
}
