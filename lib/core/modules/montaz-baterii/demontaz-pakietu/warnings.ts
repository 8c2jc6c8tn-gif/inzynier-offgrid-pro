import type { Warning } from "@/lib/core/calc-result"
import { MAX_ZALECANE_NAPIECIE_OGNIWA_V } from "./constants"

export function napieciePakietuNiedodatnie(value: number): Warning {
  return {
    code: "NAPIECIE-PAKIETU-NIEDODATNIE",
    level: "critical",
    i18nKey: "NAPIECIE-PAKIETU-NIEDODATNIE",
    technicalMessage: `napieciePakietuV = ${value}, oczekiwano > 0`,
    field: "napieciePakietuV",
  }
}

/** 1:1 z cytatem 🔴 źródła: "Nie odłączaj ogniw przy pełnym naładowaniu". */
export function pakietWciazNaladowany(napiecieOgniwaV: number): Warning {
  return {
    code: "PAKIET-WCIAZ-NALADOWANY",
    level: "critical",
    i18nKey: "PAKIET-WCIAZ-NALADOWANY",
    params: { napiecie: napiecieOgniwaV.toFixed(2), max: MAX_ZALECANE_NAPIECIE_OGNIWA_V },
    technicalMessage: `napiecieOgniwaV=${napiecieOgniwaV} > ${MAX_ZALECANE_NAPIECIE_OGNIWA_V}`,
    field: "napieciePakietuV",
  }
}

export function krokPozaKolejnoscia(): Warning {
  return {
    code: "KROK-POZA-KOLEJNOSCIA",
    level: "warning",
    i18nKey: "KROK-POZA-KOLEJNOSCIA",
    technicalMessage: "krok potwierdzony przed wcześniejszym niepotwierdzonym krokiem",
  }
}
