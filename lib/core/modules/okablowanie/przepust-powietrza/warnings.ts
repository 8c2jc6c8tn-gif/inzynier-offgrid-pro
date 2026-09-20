import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function szczelinaKrytyczna(szczelinaCm: number, strataPct: number): Warning {
  return {
    code: "SZCZELINA-KRYTYCZNA",
    level: "critical",
    i18nKey: "SZCZELINA-KRYTYCZNA",
    params: { szczelina: szczelinaCm, strata: strataPct.toFixed(0) },
    technicalMessage: `szczelinaCm=${szczelinaCm} < próg krytyczny — szacowana strata ${strataPct.toFixed(1)}%`,
  }
}

export function szczelinaPosrednia(szczelinaCm: number): Warning {
  return {
    code: "SZCZELINA-POSREDNIA-BRAK-DANYCH",
    level: "warning",
    i18nKey: "SZCZELINA-POSREDNIA-BRAK-DANYCH",
    params: { szczelina: szczelinaCm },
    technicalMessage: `szczelinaCm=${szczelinaCm} w zakresie pośrednim — źródło nie podaje ciągłej zależności`,
  }
}

export function szczelinaBezpieczna(): Warning {
  return {
    code: "SZCZELINA-BEZPIECZNA",
    level: "info",
    i18nKey: "SZCZELINA-BEZPIECZNA",
    technicalMessage: "szczelinaCm >= próg bezpieczny",
  }
}
