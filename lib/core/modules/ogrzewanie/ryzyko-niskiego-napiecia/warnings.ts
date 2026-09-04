import type { Warning } from "@/lib/core/calc-result"
import { NAPIECIE_SANITY_MAX_V } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function napieciePozaSanityCheck(value: number): Warning {
  return {
    code: "NAPIECIE-POZA-SANITY-CHECK",
    level: "info",
    message: `To nietypowo wysoka wartość napięcia (>${NAPIECIE_SANITY_MAX_V}V) — sprawdź, czy nie pomyliłeś jednostek.`,
    technicalMessage: `value = ${value} > ${NAPIECIE_SANITY_MAX_V}`,
  }
}

export function pompaSieWylaczy(aktualneNapiecieSystemuV: number, minNapiecieRoboczeV: number): Warning {
  return {
    code: "POMPA-SIE-WYLACZY",
    level: "critical",
    message: `Aktualne napięcie systemu (${aktualneNapiecieSystemuV.toFixed(1)} V) jest poniżej minimalnego napięcia pracy pompy (${minNapiecieRoboczeV.toFixed(1)} V) — pompa się wyłączy. Niskie napięcie to cichy zabójca pomp: nie zepsuje się od razu, po prostu przestanie działać dokładnie wtedy, gdy jest najbardziej potrzebna.`,
    technicalMessage: `aktualneNapiecieSystemuV=${aktualneNapiecieSystemuV} < minNapiecieRoboczeV=${minNapiecieRoboczeV}`,
  }
}

export function marginesBezpieczny(marginesV: number): Warning {
  return {
    code: "MARGINES-BEZPIECZNY",
    level: "info",
    message: `Margines do progu wyłączenia pompy: ${marginesV.toFixed(1)} V.`,
    technicalMessage: `marginesV=${marginesV}`,
  }
}
