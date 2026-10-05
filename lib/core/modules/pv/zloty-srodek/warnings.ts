import type { Warning } from "@/lib/core/calc-result"

export function wartoscPozaZakresem(field: string, labelKey: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { labelKey, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

/** `nazwa` fills a `{nazwa}` placeholder in the label (e.g. „moc paneli ({nazwa})”). */
export function wartoscNiedodatnia(field: string, labelKey: string, value: number, nazwa?: string): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { labelKey, ...(nazwa === undefined ? {} : { nazwa }) },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function wartoscUjemna(field: string, labelKey: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey },
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

/**
 * Design ballast per PN-EN 1990 (EQU, Table A1.2(A)) — only uplift is checked. Sliding and
 * overturning need a friction coefficient and the point of application of the force — not in the
 * norms available to the app (6.4.2 (2) only allows adding friction, it gives no value).
 */
export function balastProjektowyEqu(): Warning {
  return {
    code: "ZS-BALAST-EQU-TYLKO-ODRYWANIE",
    level: "warning",
    i18nKey: "ZS-BALAST-EQU-TYLKO-ODRYWANIE",
    technicalMessage: "m = max(0, γQ·Fw/(γG,inf·g) − G), EQU (6.7) — sprawdzone oderwanie; przesuw i wywracanie niesprawdzone",
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
