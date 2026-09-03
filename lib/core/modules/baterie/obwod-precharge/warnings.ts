import type { Warning } from "@/lib/core/calc-result"

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-FALOWNIKA-NIEDODATNIA",
    level: "critical",
    message: "Pojemność wejściowa DC falownika musi być większa od zera.",
    technicalMessage: `pojemnoscFalownikaUf = ${value}, oczekiwano > 0`,
    field: "pojemnoscFalownikaUf",
  }
}

export function rezystancjaNiedodatnia(value: number): Warning {
  return {
    code: "REZYSTANCJA-PRECHARGE-NIEDODATNIA",
    level: "critical",
    message: "Rezystor wstępny (pre-charge) musi być większy od zera.",
    technicalMessage: `rezystancjaPreChargeOhm = ${value}, oczekiwano > 0`,
    field: "rezystancjaPreChargeOhm",
  }
}
