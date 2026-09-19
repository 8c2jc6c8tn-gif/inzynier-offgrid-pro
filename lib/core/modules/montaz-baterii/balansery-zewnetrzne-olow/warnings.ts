import type { Warning } from "@/lib/core/calc-result"
import { MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA } from "./constants"

/** 1:1 z uzasadnieniem źródła (Ekran B4, Sekcja B). */
export function brakBalanseraZewnetrznego(iloscAkumulatorowWSzeregu: number): Warning {
  return {
    code: "BRAK-BALANSERA-ZEWNETRZNEGO",
    level: "critical",
    i18nKey: "BRAK-BALANSERA-ZEWNETRZNEGO",
    params: { ilosc: iloscAkumulatorowWSzeregu },
    technicalMessage: `iloscAkumulatorowWSzeregu=${iloscAkumulatorowWSzeregu} >= ${MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA}, posiadaBalanserZewnetrzny=false`,
    field: "posiadaBalanserZewnetrzny",
  }
}

export function iloscAkumulatorowNiedodatnia(value: number): Warning {
  return {
    code: "ILOSC-AKUMULATOROW-NIEDODATNIA",
    level: "critical",
    i18nKey: "ILOSC-AKUMULATOROW-NIEDODATNIA",
    technicalMessage: `iloscAkumulatorowWSzeregu = ${value}, oczekiwano > 0`,
    field: "iloscAkumulatorowWSzeregu",
  }
}
