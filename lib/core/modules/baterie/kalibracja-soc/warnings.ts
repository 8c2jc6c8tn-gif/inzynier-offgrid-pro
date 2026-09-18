import type { Warning } from "@/lib/core/calc-result"
import { PROG_KALIBRACJI_DNI } from "./constants"

export function rekomendowanaKalibracja(dni: number): Warning {
  return {
    code: "REKOMENDOWANA-KALIBRACJA-SOC",
    level: "warning",
    i18nKey: "REKOMENDOWANA-KALIBRACJA-SOC",
    params: { dni, prog: PROG_KALIBRACJI_DNI },
    technicalMessage: `dniOdOstatniegoPelnegoNaladowania = ${dni} >= ${PROG_KALIBRACJI_DNI}`,
    field: "dniOdOstatniegoPelnegoNaladowania",
  }
}

export function kalibracjaNiepotrzebna(dni: number): Warning {
  return {
    code: "KALIBRACJA-NIEPOTRZEBNA",
    level: "info",
    i18nKey: "KALIBRACJA-NIEPOTRZEBNA",
    params: { dni, prog: PROG_KALIBRACJI_DNI },
    technicalMessage: `dniOdOstatniegoPelnegoNaladowania = ${dni} < ${PROG_KALIBRACJI_DNI}`,
    field: "dniOdOstatniegoPelnegoNaladowania",
  }
}

export function dniUjemne(value: number): Warning {
  return {
    code: "DNI-UJEMNE",
    level: "critical",
    i18nKey: "DNI-UJEMNE",
    technicalMessage: `dniOdOstatniegoPelnegoNaladowania = ${value}, oczekiwano >= 0`,
    field: "dniOdOstatniegoPelnegoNaladowania",
  }
}
