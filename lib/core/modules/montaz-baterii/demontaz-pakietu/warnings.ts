import type { Warning } from "@/lib/core/calc-result"
import { MAX_ZALECANE_NAPIECIE_OGNIWA_V } from "./constants"

export function napieciePakietuNiedodatnie(value: number): Warning {
  return {
    code: "NAPIECIE-PAKIETU-NIEDODATNIE",
    level: "critical",
    message: 'Wartość pola "napięcie pakietu" musi być większa od zera.',
    technicalMessage: `napieciePakietuV = ${value}, oczekiwano > 0`,
    field: "napieciePakietuV",
  }
}

/** 1:1 z cytatem 🔴 źródła: "Nie odłączaj ogniw przy pełnym naładowaniu". */
export function pakietWciazNaladowany(napiecieOgniwaV: number): Warning {
  return {
    code: "PAKIET-WCIAZ-NALADOWANY",
    level: "critical",
    message: `Napięcie ogniwa (${napiecieOgniwaV.toFixed(2)} V) przekracza zalecane ${MAX_ZALECANE_NAPIECIE_OGNIWA_V} V przed demontażem — nie odłączaj ogniw przy pełnym naładowaniu, ryzyko iskrzenia i uszkodzenia terminali.`,
    technicalMessage: `napiecieOgniwaV=${napiecieOgniwaV} > ${MAX_ZALECANE_NAPIECIE_OGNIWA_V}`,
    field: "napieciePakietuV",
  }
}

export function krokPozaKolejnoscia(): Warning {
  return {
    code: "KROK-POZA-KOLEJNOSCIA",
    level: "warning",
    message: "Zaznaczono krok poza kolejnością — potwierdź wcześniejsze kroki najpierw, kolejność ma znaczenie.",
    technicalMessage: "krok potwierdzony przed wcześniejszym niepotwierdzonym krokiem",
  }
}
