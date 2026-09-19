import type { Warning } from "@/lib/core/calc-result"
import { NAPIECIE_SANITY_MAX_V } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function napieciePozaSanityCheck(value: number): Warning {
  return {
    code: "NAPIECIE-POZA-SANITY-CHECK",
    level: "info",
    i18nKey: "NAPIECIE-POZA-SANITY-CHECK",
    params: { max: NAPIECIE_SANITY_MAX_V },
    technicalMessage: `value = ${value} > ${NAPIECIE_SANITY_MAX_V}`,
  }
}

export function pompaSieWylaczy(aktualneNapiecieSystemuV: number, minNapiecieRoboczeV: number): Warning {
  return {
    code: "POMPA-SIE-WYLACZY",
    level: "critical",
    i18nKey: "POMPA-SIE-WYLACZY",
    params: { aktualne: aktualneNapiecieSystemuV.toFixed(1), min: minNapiecieRoboczeV.toFixed(1) },
    technicalMessage: `aktualneNapiecieSystemuV=${aktualneNapiecieSystemuV} < minNapiecieRoboczeV=${minNapiecieRoboczeV}`,
  }
}

export function marginesBezpieczny(marginesV: number): Warning {
  return {
    code: "MARGINES-BEZPIECZNY",
    level: "info",
    i18nKey: "MARGINES-BEZPIECZNY",
    params: { margines: marginesV.toFixed(1) },
    technicalMessage: `marginesV=${marginesV}`,
  }
}
