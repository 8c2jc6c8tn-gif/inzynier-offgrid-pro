import type { Warning } from "@/lib/core/calc-result"

/** 🟡 A heating curve whose supply temperature rises with the outdoor temperature — the points are swapped or wrong. */
export function krzywaRosnie(field: string): Warning {
  return {
    code: "KRZ-ROSNIE",
    level: "warning",
    technicalMessage: `${field}: temperatura zasilania rośnie z temperaturą zewnętrzną`,
    field,
  }
}

/** ℹ️ The reading temperature lies outside the two curve points — the line is extended. */
export function ocenaPozaPunktami(): Warning {
  return {
    code: "KRZ-OCENA-POZA-PUNKTAMI",
    level: "info",
    technicalMessage: "tOcenyC poza przedziałem [tZewn1C, tZewn2C]",
    field: "tOcenyC",
  }
}

/** Input check: the two curve points need two different outdoor temperatures. */
export function punktyWTejSamejTemperaturze(t: number): Warning {
  return {
    code: "KRZ-TEMPERATURY-POZA-ZAKRESEM",
    level: "critical",
    technicalMessage: `tZewn1C = tZewn2C = ${t}`,
    field: "tZewn2C",
  }
}
