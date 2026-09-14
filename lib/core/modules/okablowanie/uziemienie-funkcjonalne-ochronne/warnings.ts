import type { Warning } from "@/lib/core/calc-result"

export function biegunUziemionyWbrewIt(): Warning {
  return {
    code: "BIEGUN-UZIEMIONY-WBREW-IT",
    level: "critical",
    message: "Falownik wymaga układu izolowanego (IT), a biegun DC jest uziemiony — ryzyko uszkodzenia MPPT.",
    technicalMessage: "falownikWymagaUkladuIt=true, biegunDcUziemiony=true",
  }
}

export function wymaganyMonitorIzolacji(): Warning {
  return {
    code: "WYMAGANY-MONITOR-IZOLACJI",
    level: "warning",
    message: "Falownik pracuje w układzie IT — zastosuj monitor izolacji (IMD), zobacz Ekran 18.",
    technicalMessage: "falownikWymagaUkladuIt=true, biegunDcUziemiony=false",
  }
}

export function obudowaNiepolaczonaZGsw(): Warning {
  return {
    code: "OBUDOWA-NIEPOLACZONA-Z-GSW",
    level: "critical",
    message: "Uziemienie obudowy falownika nie jest połączone z Główną Szyną Wyrównawczą (GSW).",
    technicalMessage: "obudowaPolaczonaZGsw=false",
  }
}

export function uziemienieOk(): Warning {
  return {
    code: "UZIEMIENIE-OK",
    level: "info",
    message: "Uziemienie funkcjonalne i ochronne zgodne z wymaganiami producenta falownika.",
    technicalMessage: "brak sprzecznych ustawień",
  }
}
