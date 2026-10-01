import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a defrost cannot last as long as (or longer than) the interval between defrosts. */
export function defrostDluzszyNizOdstep(czas: number, odstep: number): Warning {
  return {
    code: "CYK-DEFROST-DLUZSZY-NIZ-ODSTEP",
    level: "critical",
    i18nKey: "CYK-DEFROST-DLUZSZY-NIZ-ODSTEP",
    technicalMessage: `czasDefrostuMin = ${czas} >= odstepMin = ${odstep}`,
    field: "czasDefrostuMin",
  }
}

/** Biblia §7.8 alert: the pump does not work below its minimum temperature — backup heaters carry the house. */
export function ponizejMinPracy(tZewn: number, tMin: number): Warning {
  return {
    code: "CYK-PONIZEJ-MIN-PRACY",
    level: "warning",
    i18nKey: "CYK-PONIZEJ-MIN-PRACY",
    params: { tZewn, tMin },
    technicalMessage: `tZewnC = ${tZewn} < tMinPracyC = ${tMin} (karta pompy)`,
    field: "tMinPracyC",
  }
}

/** Above the source's 5–7 °C frosting range defrost is unlikely — the result stays as entered. */
export function powyzejZakresuSzronienia(tZewn: number, prog: number): Warning {
  return {
    code: "CYK-POWYZEJ-ZAKRESU-SZRONIENIA",
    level: "info",
    i18nKey: "CYK-POWYZEJ-ZAKRESU-SZRONIENIA",
    params: { tZewn, prog },
    technicalMessage: `tZewnC = ${tZewn} > ${prog} °C (górna granica zakresu szronienia ze źródła)`,
    field: "tZewnC",
  }
}
