import type { Warning } from "@/lib/core/calc-result"
import { PROG_KALIBRACJI_DNI } from "./constants"

export function rekomendowanaKalibracja(dni: number): Warning {
  return {
    code: "REKOMENDOWANA-KALIBRACJA-SOC",
    level: "warning",
    message: `${dni} dni bez pełnego naładowania (próg: ${PROG_KALIBRACJI_DNI}) — zrób pełne ładowanie, żeby BMS złapał punkty odniesienia. Liczenie prądu w BMS to ciągły szacunek, błąd kumuluje się bez okresowego resetu.`,
    technicalMessage: `dniOdOstatniegoPelnegoNaladowania = ${dni} >= ${PROG_KALIBRACJI_DNI}`,
    field: "dniOdOstatniegoPelnegoNaladowania",
  }
}

export function kalibracjaNiepotrzebna(dni: number): Warning {
  return {
    code: "KALIBRACJA-NIEPOTRZEBNA",
    level: "info",
    message: `${dni} dni od ostatniego pełnego naładowania — poniżej progu ${PROG_KALIBRACJI_DNI} dni, kalibracja jeszcze niepotrzebna.`,
    technicalMessage: `dniOdOstatniegoPelnegoNaladowania = ${dni} < ${PROG_KALIBRACJI_DNI}`,
    field: "dniOdOstatniegoPelnegoNaladowania",
  }
}

export function dniUjemne(value: number): Warning {
  return {
    code: "DNI-UJEMNE",
    level: "critical",
    message: "Liczba dni od ostatniego pełnego naładowania nie może być ujemna.",
    technicalMessage: `dniOdOstatniegoPelnegoNaladowania = ${value}, oczekiwano >= 0`,
    field: "dniOdOstatniegoPelnegoNaladowania",
  }
}
