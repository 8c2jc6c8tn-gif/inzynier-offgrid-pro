import type { Warning } from "@/lib/core/calc-result"

export function biegunUziemionyWbrewIt(): Warning {
  return {
    code: "BIEGUN-UZIEMIONY-WBREW-IT",
    level: "critical",
    i18nKey: "BIEGUN-UZIEMIONY-WBREW-IT",
    technicalMessage: "falownikWymagaUkladuIt=true, biegunDcUziemiony=true",
  }
}

export function wymaganyMonitorIzolacji(): Warning {
  return {
    code: "WYMAGANY-MONITOR-IZOLACJI",
    level: "warning",
    i18nKey: "WYMAGANY-MONITOR-IZOLACJI",
    technicalMessage: "falownikWymagaUkladuIt=true, biegunDcUziemiony=false",
  }
}

export function obudowaNiepolaczonaZGsw(): Warning {
  return {
    code: "OBUDOWA-NIEPOLACZONA-Z-GSW",
    level: "critical",
    i18nKey: "OBUDOWA-NIEPOLACZONA-Z-GSW",
    technicalMessage: "obudowaPolaczonaZGsw=false",
  }
}

export function uziemienieOk(): Warning {
  return {
    code: "UZIEMIENIE-OK",
    level: "info",
    i18nKey: "UZIEMIENIE-OK",
    technicalMessage: "brak sprzecznych ustawień",
  }
}
