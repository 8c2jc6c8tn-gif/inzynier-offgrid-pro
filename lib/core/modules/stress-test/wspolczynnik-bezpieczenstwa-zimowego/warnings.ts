import type { Warning } from "@/lib/core/calc-result"
import type { SkladowaId } from "./constants"

/** Form validation: a negative number. */
export function wartoscUjemnaWsp(pole: string, wartosc: number): Warning {
  return {
    code: "WSP-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WSP-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
    field: pole,
  }
}

/** Form validation: the weak-point threshold outside 0–100%. */
export function progPozaZakresem(prog: number): Warning {
  return {
    code: "WSP-PROG-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WSP-PROG-POZA-ZAKRESEM",
    technicalMessage: `progSlabegoPunktuPct = ${prog}, oczekiwano 0–100`,
    field: "progSlabegoPunktuPct",
  }
}

/** Form validation: more components without redundancy than components checked. */
export function spofPonadLiczbe(spof: number, n: number): Warning {
  return {
    code: "WSP-SPOF-PONAD-LICZBE",
    level: "critical",
    i18nKey: "WSP-SPOF-PONAD-LICZBE",
    params: { spof, n },
    technicalMessage: `liczbaSpof = ${spof} > liczbaKomponentow = ${n}`,
    field: "liczbaSpof",
  }
}

/** Form validation: the user's weights do not sum to 100%. */
export function wagiNieSumujaSie(suma: number): Warning {
  return {
    code: "WSP-WAGI-SUMA",
    level: "critical",
    i18nKey: "WSP-WAGI-SUMA",
    params: { suma: Math.round(suma * 100) / 100 },
    technicalMessage: `suma wag = ${suma}, oczekiwano 100`,
    field: "wagiWlasne",
  }
}

/** Info: which weight set is in use. Default = the provisional proposal that the owner still has to rework. */
export function zestawWagWstepny(): Warning {
  return {
    code: "WSP-WAGI-WSTEPNE",
    level: "info",
    i18nKey: "WSP-WAGI-WSTEPNE",
    technicalMessage: "wagi domyślne — propozycja asystenta, zaakceptowana „na razie” przez właściciela, do dopracowania",
    field: "wagiWlasne",
  }
}

export function zestawWagWlasny(): Warning {
  return {
    code: "WSP-WAGI-WLASNE",
    level: "info",
    i18nKey: "WSP-WAGI-WLASNE",
    technicalMessage: "wagi wpisane przez użytkownika",
    field: "wagiWlasne",
  }
}

const KLUCZ_SLABEGO: Record<SkladowaId, string> = {
  pokrycie: "WSP-SLABY-POKRYCIE",
  autonomia: "WSP-SLABY-AUTONOMIA",
  odpornosc: "WSP-SLABY-ODPORNOSC",
  agregat: "WSP-SLABY-AGREGAT",
  reakcja: "WSP-SLABY-REAKCJA",
}

/** 🟡 A component below the weak-point threshold — one message per component, each names the screen to improve it. */
export function slabyPunkt(id: SkladowaId, wynikPct: number, progPct: number): Warning {
  const klucz = KLUCZ_SLABEGO[id]
  return {
    code: klucz,
    level: "warning",
    i18nKey: klucz,
    params: { wynik: Math.round(wynikPct), prog: progPct },
    technicalMessage: `składowa ${id} = ${Math.round(wynikPct)}% < ${progPct}%`,
    field: id,
  }
}
