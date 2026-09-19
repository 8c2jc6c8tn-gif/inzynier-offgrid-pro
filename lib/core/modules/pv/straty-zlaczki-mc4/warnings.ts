import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function dobryStyk(rezystancjaMOhm: number, strataCalkowitaW: number): Warning {
  return {
    code: "DOBRY-STYK",
    level: "info",
    i18nKey: "DOBRY-STYK",
    params: { rezystancja: rezystancjaMOhm.toFixed(2), strata: strataCalkowitaW.toFixed(1) },
    technicalMessage: `rezystancjaMOhm=${rezystancjaMOhm} <= 2`,
  }
}

export function podwyzszonaRezystancja(rezystancjaMOhm: number, strataCalkowitaW: number): Warning {
  return {
    code: "PODWYZSZONA-REZYSTANCJA",
    level: "warning",
    i18nKey: "PODWYZSZONA-REZYSTANCJA",
    params: { rezystancja: rezystancjaMOhm.toFixed(2), strata: strataCalkowitaW.toFixed(1) },
    technicalMessage: `2 < rezystancjaMOhm=${rezystancjaMOhm} <= 20`,
  }
}

export function zlyStyk(rezystancjaMOhm: number, strataCalkowitaW: number): Warning {
  return {
    code: "ZLY-STYK",
    level: "critical",
    i18nKey: "ZLY-STYK",
    params: { rezystancja: rezystancjaMOhm.toFixed(2), strata: strataCalkowitaW.toFixed(1) },
    technicalMessage: `rezystancjaMOhm=${rezystancjaMOhm} > 20`,
  }
}
