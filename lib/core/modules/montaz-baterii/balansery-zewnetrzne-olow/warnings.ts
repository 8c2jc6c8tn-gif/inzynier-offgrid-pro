import type { Warning } from "@/lib/core/calc-result"
import { MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA } from "./constants"

/** 1:1 z uzasadnieniem źródła (Ekran B4, Sekcja B). */
export function brakBalanseraZewnetrznego(iloscAkumulatorowWSzeregu: number): Warning {
  return {
    code: "BRAK-BALANSERA-ZEWNETRZNEGO",
    level: "critical",
    message:
      `${iloscAkumulatorowWSzeregu} akumulatory kwasowe w szeregu bez balansera zewnętrznego — z czasem rozjadą się ` +
      "napięciowo (w przeciwieństwie do LiFePO4 z aktywnym BMS). Wymagany balanser podłączony równolegle do każdego akumulatora.",
    technicalMessage: `iloscAkumulatorowWSzeregu=${iloscAkumulatorowWSzeregu} >= ${MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA}, posiadaBalanserZewnetrzny=false`,
    field: "posiadaBalanserZewnetrzny",
  }
}

export function iloscAkumulatorowNiedodatnia(value: number): Warning {
  return {
    code: "ILOSC-AKUMULATOROW-NIEDODATNIA",
    level: "critical",
    message: "Liczba akumulatorów w szeregu musi być większa od zera.",
    technicalMessage: `iloscAkumulatorowWSzeregu = ${value}, oczekiwano > 0`,
    field: "iloscAkumulatorowWSzeregu",
  }
}
