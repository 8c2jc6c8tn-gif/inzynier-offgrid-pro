import type { Warning } from "@/lib/core/calc-result"

export function falownikSieWylaczy(vSagV: number, minimalneNapiecieV: number): Warning {
  return {
    code: "FALOWNIK-SIE-WYLACZY",
    level: "warning",
    i18nKey: "FALOWNIK-SIE-WYLACZY",
    params: { vSag: vSagV.toFixed(1), minNap: minimalneNapiecieV.toFixed(1) },
    technicalMessage: `vSagV=${vSagV} < minimalneNapiecieFalownikaV=${minimalneNapiecieV}`,
    field: "pradRozruchowyA",
  }
}

export function falownikUtrzymaNapiecie(vSagV: number, minimalneNapiecieV: number): Warning {
  return {
    code: "FALOWNIK-UTRZYMA-NAPIECIE",
    level: "info",
    i18nKey: "FALOWNIK-UTRZYMA-NAPIECIE",
    params: { vSag: vSagV.toFixed(1), minNap: minimalneNapiecieV.toFixed(1) },
    technicalMessage: `vSagV=${vSagV} >= minimalneNapiecieFalownikaV=${minimalneNapiecieV}`,
    field: "pradRozruchowyA",
  }
}

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
