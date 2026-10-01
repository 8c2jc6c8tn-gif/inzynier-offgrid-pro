import type { Warning } from "@/lib/core/calc-result"

/** Source 🟡 (Ekran 17 C, Biblia §6.20): a tank in an unheated garage loses much more. */
export function zasobnikNieogrzewany(strataKwh: number): Warning {
  return {
    code: "ZAS-NIEOGRZEWANE",
    level: "warning",
    i18nKey: "ZAS-NIEOGRZEWANE",
    params: { strata: strataKwh },
    technicalMessage: `nieogrzewane = true — strata postojowa ${strataKwh} kWh/doba przy niskiej temperaturze otoczenia`,
    field: "nieogrzewane",
  }
}

/** Circulation heat loss counted only while the pump runs, pipe at hot-water temperature (✅🤖). */
export function cyrkulacjaUproszczenie(): Warning {
  return {
    code: "ZAS-CYRKULACJA-UPROSZCZENIE",
    level: "info",
    i18nKey: "ZAS-CYRKULACJA-UPROSZCZENIE",
    technicalMessage: "straty rur liczone tylko w godzinach pracy pompy, rura w temperaturze C.W.U.; wychładzanie po wyłączeniu pominięte",
    field: "godzinCyrkulacji",
  }
}
