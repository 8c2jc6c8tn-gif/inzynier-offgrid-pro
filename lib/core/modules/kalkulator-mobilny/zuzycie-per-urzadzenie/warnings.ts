import type { Warning } from "@/lib/core/calc-result"

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

export function godzinPonadDobe(pole: string, value: number): Warning {
  return {
    code: "ZPU-GODZIN-PONAD-DOBE",
    level: "critical",
    i18nKey: "ZPU-GODZIN-PONAD-DOBE",
    technicalMessage: `${pole} = ${value}, oczekiwano [0, 24]`,
    field: pole,
  }
}

export function wspolczynnikPozaZakresem(pole: string, value: number): Warning {
  return {
    code: "ZPU-WSPOLCZYNNIK-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "ZPU-WSPOLCZYNNIK-POZA-ZAKRESEM",
    technicalMessage: `${pole} = ${value}, oczekiwano [0, 100]`,
    field: pole,
  }
}

export function cykliczneRealnieMniej(nazwa: string, realneWh: number, znamionoweWh: number): Warning {
  return {
    code: "ZPU-CYKLICZNE-REALNIE-MNIEJ",
    level: "info",
    i18nKey: "ZPU-CYKLICZNE-REALNIE-MNIEJ",
    params: { nazwa, realne: realneWh.toFixed(0), znamionowe: znamionoweWh.toFixed(0) },
    technicalMessage: `${nazwa}: ${realneWh} Wh zamiast ${znamionoweWh} Wh z mocy znamionowej`,
  }
}
