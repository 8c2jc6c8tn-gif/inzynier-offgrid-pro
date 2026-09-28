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

export function dieselParafinizacja(tempC: number): Warning {
  return {
    code: "AGREGAT-DIESEL-PARAFINIZACJA",
    level: "info",
    i18nKey: "AGREGAT-DIESEL-PARAFINIZACJA",
    params: { temp: tempC },
    technicalMessage: `paliwo=diesel-zwykly, temperaturaMiejscaC=${tempC} < 0 — próg parafinizacji w źródle niejednoznaczny (B: −20°C, C: −15°C), decyzja właściciela`,
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
