import type { Warning } from "@/lib/core/calc-result"
import { DIESEL_ROZRUCH_MROZ_C, DIESEL_ZWYKLY_RYZYKO_C, DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C, PROG_MROZU_C } from "./constants"

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

/** 🔴 (D32, od 1.2.0): zwykły diesel poniżej +5°C — najprawdopodobniej nie odpali. */
export function dieselParafinizacja(tempC: number): Warning {
  return {
    code: "AGREGAT-DIESEL-PARAFINIZACJA",
    level: "critical",
    i18nKey: "AGREGAT-DIESEL-PARAFINIZACJA",
    params: { temp: tempC },
    technicalMessage: `paliwo=diesel-zwykly, temperaturaMiejscaC=${tempC} < ${DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C} (D32)`,
    field: "paliwo",
  }
}

/** 🟡 (D32, od 1.2.0): zwykły diesel w [+5; +10]°C — może już nie wystartować. */
export function dieselRyzykoRozruchu(tempC: number): Warning {
  return {
    code: "AGREGAT-DIESEL-RYZYKO-ROZRUCHU",
    level: "warning",
    i18nKey: "AGREGAT-DIESEL-RYZYKO-ROZRUCHU",
    params: { temp: tempC },
    technicalMessage: `paliwo=diesel-zwykly, temperaturaMiejscaC=${tempC} <= ${DIESEL_ZWYKLY_RYZYKO_C} (D32)`,
    field: "paliwo",
  }
}

/** 🟡 (D32): każdy diesel przy ≤ −10°C — akumulator i świece żarowe decydują o rozruchu. */
export function dieselRozruchWMrozie(tempC: number): Warning {
  return {
    code: "AGREGAT-DIESEL-ROZRUCH-MROZ",
    level: "warning",
    i18nKey: "AGREGAT-DIESEL-ROZRUCH-MROZ",
    params: { temp: tempC },
    technicalMessage: `paliwo=diesel, temperaturaMiejscaC=${tempC} <= ${DIESEL_ROZRUCH_MROZ_C} (D32)`,
    field: "temperaturaMiejscaC",
  }
}

/** ℹ️ (D32): benzyna w mrozie — olej zimowy i sprawna świeca zapłonowa. */
export function benzynaWMrozie(tempC: number): Warning {
  return {
    code: "AGREGAT-BENZYNA-MROZ",
    level: "info",
    i18nKey: "AGREGAT-BENZYNA-MROZ",
    params: { temp: tempC },
    technicalMessage: `paliwo=benzyna, temperaturaMiejscaC=${tempC} < ${PROG_MROZU_C} (D32)`,
    field: "paliwo",
  }
}

export function dlugiPostoj(dni: number, tempC: number): Warning {
  return {
    code: "AGREGAT-DLUGI-POSTOJ",
    level: "warning",
    i18nKey: "AGREGAT-DLUGI-POSTOJ",
    params: { dni, temp: tempC },
    technicalMessage: `dniPostoju=${dni} >= 14 && temperaturaMiejscaC=${tempC} < 0 (Tresc_Modul_7, Ekran 8, B.3)`,
    field: "dniPostoju",
  }
}

export function przerwyWPracy(liczba: number, maxH: number, przerwaH: number): Warning {
  return {
    code: "AGREGAT-PRZERWY",
    level: "info",
    i18nKey: "AGREGAT-PRZERWY",
    params: { liczba, max: maxH, przerwa: przerwaH },
    technicalMessage: `liczbaPrzerw=${liczba} (maxPracaCiaglaH=${maxH}, przerwaH=${przerwaH})`,
    field: "maxPracaCiaglaH",
  }
}
