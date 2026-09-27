import type { Warning } from "@/lib/core/calc-result"

export function napiecieUjemne(value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: "Napięcie spoczynkowe" },
    technicalMessage: `napiecieSpoczynkoweV = ${value}, oczekiwano >= 0`,
    field: "napiecieSpoczynkoweV",
  }
}

export function krytycznieRozladowany(napiecieV: number, progV: number): Warning {
  return {
    code: "RAM-KRYTYCZNIE-ROZLADOWANY",
    level: "info",
    i18nKey: "RAM-KRYTYCZNIE-ROZLADOWANY",
    params: { napiecie: napiecieV.toFixed(2), prog: progV.toFixed(1) },
    technicalMessage: `napiecieSpoczynkoweV=${napiecieV} < ${progV}`,
  }
}

export function lifepo4ZmierzOgniwa(): Warning {
  return {
    code: "RAM-LIFEPO4-ZMIERZ-OGNIWA",
    level: "info",
    i18nKey: "RAM-LIFEPO4-ZMIERZ-OGNIWA",
    technicalMessage: "LiFePO4: procedura A9 działa na napięciu pojedynczego ogniwa",
  }
}
