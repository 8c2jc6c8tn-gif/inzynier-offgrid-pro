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

export function godzinyPozaDoba(h: number): Warning {
  return {
    code: "ZRODLO-GODZINY-POZA-DOBA",
    level: "critical",
    i18nKey: "ZRODLO-GODZINY-POZA-DOBA",
    technicalMessage: `godzinyPaleniaNaDobe = ${h}, oczekiwano 0..24`,
    field: "godzinyPaleniaNaDobe",
  }
}

export function sprawnoscPozaZakresem(s: number): Warning {
  return {
    code: "ZRODLO-SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "ZRODLO-SPRAWNOSC-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscProc = ${s}, oczekiwano (0, 100]`,
    field: "sprawnoscProc",
  }
}

export function mocDoWodyWiekszaNizMoc(mocDoWody: number, moc: number): Warning {
  return {
    code: "ZRODLO-MOC-WODY-WIEKSZA",
    level: "critical",
    i18nKey: "ZRODLO-MOC-WODY-WIEKSZA",
    technicalMessage: `mocDoWodyKw = ${mocDoWody} > mocKw = ${moc}`,
    field: "mocDoWodyKw",
  }
}

export function bezPlaszczaJednoPomieszczenie(): Warning {
  return {
    code: "ZRODLO-BEZ-PLASZCZA",
    level: "info",
    i18nKey: "ZRODLO-BEZ-PLASZCZA",
    technicalMessage: "plaszczWodny = false — ciepło oddawane lokalnie, pokrycie domu nieliczone (Biblia v2.0 §8.1, alert)",
    field: "plaszczWodny",
  }
}

export function niePokrywaZapotrzebowania(pokrycieProc: number): Warning {
  return {
    code: "ZRODLO-NIE-POKRYWA",
    level: "info",
    i18nKey: "ZRODLO-NIE-POKRYWA",
    params: { pokrycie: Math.round(pokrycieProc) },
    technicalMessage: `pokrycieProc = ${pokrycieProc} < 100 — reszta z pompy ciepła/innego źródła`,
    field: "zapotrzebowanieCieplaKwhDoba",
  }
}

export function przypomnienieCzujnikCo(): Warning {
  return {
    code: "ZRODLO-CZUJNIK-CO",
    level: "info",
    i18nKey: "ZRODLO-CZUJNIK-CO",
    technicalMessage: "Biblia v2.0 §8.1 — przypomnienie o czujniku CO; weryfikacja w M8/E2",
  }
}
