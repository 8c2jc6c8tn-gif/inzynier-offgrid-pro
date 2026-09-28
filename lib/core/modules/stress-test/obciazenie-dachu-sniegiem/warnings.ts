import type { Warning } from "@/lib/core/calc-result"
import { NAWISY_STREFA, NAWISY_WYSOKOSC_PROG_M } from "@/lib/core/modules/pv/eurokod-1/snieg"
import { PROG_ZBLIZANIA_DO_NOSNOSCI } from "./constants"

const kn = (x: number) => x.toFixed(2)

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

export function katPozaZakresem(value: number): Warning {
  return {
    code: "WARTOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { label: "Kąt spadku dachu", min: 0, max: 90 },
    technicalMessage: `katDachuDeg = ${value}, oczekiwano 0–90°`,
    field: "katDachuDeg",
  }
}

export function normowePrzekraczaNosnosc(sKnM2: number, nosnoscKnM2: number): Warning {
  return {
    code: "SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC",
    level: "critical",
    i18nKey: "SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC",
    params: { s: kn(sKnM2), nosnosc: kn(nosnoscKnM2) },
    technicalMessage: `s = ${sKnM2} kN/m² > nośność ${nosnoscKnM2} kN/m² (PN-EN 1991-1-3, 5.1)`,
    field: "nosnoscDachuKnM2",
  }
}

export function aktualnePrzekraczaNosnosc(qKnM2: number, nosnoscKnM2: number): Warning {
  return {
    code: "SNIEG-AKTUALNE-PRZEKRACZA-NOSNOSC",
    level: "critical",
    i18nKey: "SNIEG-AKTUALNE-PRZEKRACZA-NOSNOSC",
    params: { q: kn(qKnM2), nosnosc: kn(nosnoscKnM2) },
    technicalMessage: `γ·h = ${qKnM2} kN/m² (górna wartość γ z Tablicy E.1) > nośność ${nosnoscKnM2} kN/m²`,
    field: "gruboscWarstwyCm",
  }
}

export function normoweZblizaSieDoNosnosci(sKnM2: number, nosnoscKnM2: number): Warning {
  return {
    code: "SNIEG-NORMOWE-ZBLIZA-SIE-DO-NOSNOSCI",
    level: "warning",
    i18nKey: "SNIEG-NORMOWE-ZBLIZA-SIE-DO-NOSNOSCI",
    params: { s: kn(sKnM2), nosnosc: kn(nosnoscKnM2), pct: Math.round((sKnM2 / nosnoscKnM2) * 100) },
    technicalMessage: `s = ${sKnM2} kN/m² >= ${PROG_ZBLIZANIA_DO_NOSNOSCI} × nośność ${nosnoscKnM2} kN/m² (próg D30)`,
    field: "nosnoscDachuKnM2",
  }
}

export function aktualneZblizaSieDoNosnosci(qKnM2: number, nosnoscKnM2: number): Warning {
  return {
    code: "SNIEG-AKTUALNE-ZBLIZA-SIE-DO-NOSNOSCI",
    level: "warning",
    i18nKey: "SNIEG-AKTUALNE-ZBLIZA-SIE-DO-NOSNOSCI",
    params: { q: kn(qKnM2), nosnosc: kn(nosnoscKnM2), pct: Math.round((qKnM2 / nosnoscKnM2) * 100) },
    technicalMessage: `γ·h = ${qKnM2} kN/m² >= ${PROG_ZBLIZANIA_DO_NOSNOSCI} × nośność ${nosnoscKnM2} kN/m² (próg D30)`,
    field: "gruboscWarstwyCm",
  }
}

export function brakNosnosci(): Warning {
  return {
    code: "SNIEG-BRAK-NOSNOSCI",
    level: "info",
    i18nKey: "SNIEG-BRAK-NOSNOSCI",
    technicalMessage: "nosnoscDachuKnM2 = 0 — brak porównania z nośnością konstrukcji",
    field: "nosnoscDachuKnM2",
  }
}

export function pomiarBezRodzaju(): Warning {
  return {
    code: "SNIEG-POMIAR-BEZ-RODZAJU",
    level: "info",
    i18nKey: "SNIEG-POMIAR-BEZ-RODZAJU",
    technicalMessage: "gruboscWarstwyCm > 0, rodzajSniegu = null — brak ciężaru objętościowego γ",
    field: "rodzajSniegu",
  }
}

export function nawisySniezne(): Warning {
  return {
    code: "SNIEG-NAWISY-NB1-12",
    level: "info",
    i18nKey: "SNIEG-NAWISY-NB1-12",
    params: { prog: NAWISY_WYSOKOSC_PROG_M, strefa: NAWISY_STREFA },
    technicalMessage: `NB1.12: A > ${NAWISY_WYSOKOSC_PROG_M} m lub strefa ${NAWISY_STREFA} — zaleca się uwzględnić nawisy (6.3), poza tym ekranem`,
  }
}
