import type { Warning } from "@/lib/core/calc-result"

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-FALOWNIKA-NIEDODATNIA",
    level: "critical",
    i18nKey: "POJEMNOSC-FALOWNIKA-NIEDODATNIA",
    technicalMessage: `pojemnoscFalownikaUf = ${value}, oczekiwano > 0`,
    field: "pojemnoscFalownikaUf",
  }
}

export function rezystancjaNiedodatnia(value: number): Warning {
  return {
    code: "REZYSTANCJA-PRECHARGE-NIEDODATNIA",
    level: "critical",
    i18nKey: "REZYSTANCJA-PRECHARGE-NIEDODATNIA",
    technicalMessage: `rezystancjaPreChargeOhm = ${value}, oczekiwano > 0`,
    field: "rezystancjaPreChargeOhm",
  }
}
