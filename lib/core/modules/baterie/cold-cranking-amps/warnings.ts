import type { Warning } from "@/lib/core/calc-result"

export function falownikSieWylaczy(vSagV: number, minimalneNapiecieV: number): Warning {
  return {
    code: "FALOWNIK-SIE-WYLACZY",
    level: "warning",
    message: `Napięcie pod obciążeniem rozruchowym spadnie do ${vSagV.toFixed(1)} V — poniżej minimalnego napięcia pracy falownika (${minimalneNapiecieV.toFixed(1)} V). Falownik się wyłączy.`,
    technicalMessage: `vSagV=${vSagV} < minimalneNapiecieFalownikaV=${minimalneNapiecieV}`,
    field: "pradRozruchowyA",
  }
}

export function falownikUtrzymaNapiecie(vSagV: number, minimalneNapiecieV: number): Warning {
  return {
    code: "FALOWNIK-UTRZYMA-NAPIECIE",
    level: "info",
    message: `Napięcie pod obciążeniem rozruchowym spadnie do ${vSagV.toFixed(1)} V — powyżej minimalnego napięcia pracy falownika (${minimalneNapiecieV.toFixed(1)} V).`,
    technicalMessage: `vSagV=${vSagV} >= minimalneNapiecieFalownikaV=${minimalneNapiecieV}`,
    field: "pradRozruchowyA",
  }
}

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: `${etykieta} nie może być ujemna.`,
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}
