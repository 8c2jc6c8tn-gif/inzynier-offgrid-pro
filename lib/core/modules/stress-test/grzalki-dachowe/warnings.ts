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

export function godzinyPonadDobe(value: number): Warning {
  return {
    code: "GRZALKI-GODZINY-PONAD-DOBE",
    level: "critical",
    i18nKey: "GRZALKI-GODZINY-PONAD-DOBE",
    technicalMessage: `godzinyPracyNaDobe = ${value}, oczekiwano [0, 24]`,
    field: "godzinyPracyNaDobe",
  }
}

export function wiekszeNizPompa(mocW: number, pompaW: number): Warning {
  return {
    code: "GRZALKI-WIEKSZE-NIZ-POMPA",
    level: "warning",
    i18nKey: "GRZALKI-WIEKSZE-NIZ-POMPA",
    params: { moc: Math.round(mocW), pompa: Math.round(pompaW) },
    technicalMessage: `P_grzalek=${mocW} W > P_pompy=${pompaW} W (Tresc_Modul_7, Ekran 11 — 🟡)`,
    field: "mocPompyCieplaW",
  }
}

export function brakZapasuMocy(mocW: number, zapasW: number): Warning {
  return {
    code: "GRZALKI-BRAK-ZAPASU-MOCY",
    level: "warning",
    i18nKey: "GRZALKI-BRAK-ZAPASU-MOCY",
    params: { moc: Math.round(mocW), zapas: Math.round(zapasW) },
    technicalMessage: `P_grzalek=${mocW} W > zapasMocyW=${zapasW} W (Tresc_Modul_7, Ekran 11 — 🟡 „sprawdź zapas mocy”)`,
    field: "zapasMocyW",
  }
}

export function sprawdzZapasMocy(): Warning {
  return {
    code: "GRZALKI-SPRAWDZ-ZAPAS",
    level: "info",
    i18nKey: "GRZALKI-SPRAWDZ-ZAPAS",
    technicalMessage: "zapasMocyW = null — przypomnienie ze źródła (Ekran 11)",
    field: "zapasMocyW",
  }
}
