import type { Warning } from "@/lib/core/calc-result"
import { CZAS_DO_MIKROPEKNIEC_LATA, ODSTEP_DYLATACYJNY_MIN_MM } from "./constants"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function odstepZaMaly(odstepMm: number): Warning {
  return {
    code: "MIKROPEKNIECIA-ODSTEP-ZA-MALY",
    level: "warning",
    i18nKey: "MIKROPEKNIECIA-ODSTEP-ZA-MALY",
    params: { odstep: odstepMm, min: ODSTEP_DYLATACYJNY_MIN_MM, lata: CZAS_DO_MIKROPEKNIEC_LATA },
    technicalMessage: `odstepDylatacyjnyMm=${odstepMm} < ODSTEP_DYLATACYJNY_MIN_MM=${ODSTEP_DYLATACYJNY_MIN_MM}`,
    field: "odstepDylatacyjnyMm",
  }
}

export function brakPodkladekEpdm(): Warning {
  return {
    code: "MIKROPEKNIECIA-BRAK-EPDM",
    level: "warning",
    i18nKey: "MIKROPEKNIECIA-BRAK-EPDM",
    params: { lata: CZAS_DO_MIKROPEKNIEC_LATA },
    technicalMessage: "podkladkiEpdm=false — mocowanie sztywne (metal-metal/szkło)",
    field: "podkladkiEpdm",
  }
}

export function montazElastyczny(odstepMm: number): Warning {
  return {
    code: "MIKROPEKNIECIA-MONTAZ-ELASTYCZNY",
    level: "info",
    i18nKey: "MIKROPEKNIECIA-MONTAZ-ELASTYCZNY",
    params: { odstep: odstepMm },
    technicalMessage: `odstepDylatacyjnyMm=${odstepMm} >= ${ODSTEP_DYLATACYJNY_MIN_MM} && podkladkiEpdm=true`,
  }
}
