import type { Warning } from "@/lib/core/calc-result"

export function wartoscPozaZakresem(field: string, label: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { label, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

export function wartoscNiedodatnia(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function wartoscUjemna(field: string, label: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

/** Wzór strefy 3 (Tablica NA.1) ma czynnik (20000 − A) — poza tą dziedziną wynik traci sens. */
export function wysokoscPozaWzoremStrefy3(value: number): Warning {
  return {
    code: "ZS-WYSOKOSC-POZA-WZOREM-STREFY-3",
    level: "critical",
    i18nKey: "ZS-WYSOKOSC-POZA-WZOREM-STREFY-3",
    technicalMessage: `wysokoscNpmM = ${value}, wzór strefy 3 wymaga A < 20000 m`,
    field: "wysokoscNpmM",
  }
}

/** D27: brak PN-EN 1990 — balast to masa równoważąca samą siłę wiatru, nie balast projektowy. */
export function balastBezWspolczynnikow(): Warning {
  return {
    code: "ZS-BALAST-BEZ-WSPOLCZYNNIKOW",
    level: "warning",
    i18nKey: "ZS-BALAST-BEZ-WSPOLCZYNNIKOW",
    technicalMessage: "m = Fw/g bez częściowych współczynników PN-EN 1990 (γQ, γG,inf), bez przesuwu i wywracania",
  }
}

export function wybranyKatBezDanychWiatru(kat: number): Warning {
  return {
    code: "ZS-KAT-BEZ-DANYCH-WIATRU",
    level: "info",
    i18nKey: "ZS-KAT-BEZ-DANYCH-WIATRU",
    params: { kat },
    technicalMessage: `nachylenieDeg = ${kat}: Tablica 7.6 obejmuje 0–30°, 7.4.3 tylko pion 90°`,
    field: "nachylenieDeg",
  }
}

export function pionSilaPozioma(): Warning {
  return {
    code: "ZS-PION-SILA-POZIOMA",
    level: "info",
    i18nKey: "ZS-PION-SILA-POZIOMA",
    technicalMessage: "90°: cf = 1,80 (7.4.3) to siła pozioma — balast zależy od tarcia i wywracania, brak w normie",
  }
}

export function rekomendacjaWymagaWyceny(): Warning {
  return {
    code: "ZS-REKOMENDACJA-WYMAGA-WYCENY",
    level: "info",
    i18nKey: "ZS-REKOMENDACJA-WYMAGA-WYCENY",
    technicalMessage: "brak mocy/PR/ceny kWh/liczby lat — kryterium D27 (wartość energii − koszt balastu) nieliczone",
  }
}

export function optimumPozaZakresemWiatru(kat: number): Warning {
  return {
    code: "ZS-OPTIMUM-ENERGII-POZA-ZAKRESEM-WIATRU",
    level: "info",
    i18nKey: "ZS-OPTIMUM-ENERGII-POZA-ZAKRESEM-WIATRU",
    params: { kat },
    technicalMessage: `optimum energii ${kat}° > 30° — rekomendacja wybierana tylko z 0–30° (zakres Tablicy 7.6)`,
  }
}
