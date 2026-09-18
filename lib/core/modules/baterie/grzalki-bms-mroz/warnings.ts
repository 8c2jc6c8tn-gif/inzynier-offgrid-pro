import type { Warning } from "@/lib/core/calc-result"
import { PROG_SOC_WSTRZYMANIA_PCT, PROG_TEMPERATURY_GRZANIA_C } from "./constants"

export function socUjemny(value: number): Warning {
  return {
    code: "SOC-UJEMNY",
    level: "critical",
    i18nKey: "SOC-POZA-ZAKRESEM",
    technicalMessage: `socPct = ${value}, oczekiwano [0, 100]`,
    field: "socPct",
  }
}

export function brakPotrzebyGrzania(temperaturaC: number): Warning {
  return {
    code: "BRAK-POTRZEBY-GRZANIA",
    level: "info",
    i18nKey: "BRAK-POTRZEBY-GRZANIA",
    params: { temp: temperaturaC.toFixed(1), prog: PROG_TEMPERATURY_GRZANIA_C },
    technicalMessage: `temperaturaMinC = ${temperaturaC} >= PROG_TEMPERATURY_GRZANIA_C = ${PROG_TEMPERATURY_GRZANIA_C}`,
  }
}

export function grzanieZPv(): Warning {
  return {
    code: "GRZANIE-Z-PV",
    level: "info",
    i18nKey: "GRZANIE-Z-PV",
    technicalMessage: "produkcjaPv === 'tak'",
  }
}

export function grzanieZBaterii(socPct: number): Warning {
  return {
    code: "GRZANIE-Z-BATERII",
    level: "warning",
    i18nKey: "GRZANIE-Z-BATERII",
    params: { soc: socPct, prog: PROG_SOC_WSTRZYMANIA_PCT },
    technicalMessage: `produkcjaPv === 'nie', socPct = ${socPct} > PROG_SOC_WSTRZYMANIA_PCT = ${PROG_SOC_WSTRZYMANIA_PCT}`,
  }
}

export function grzanieWstrzymane(socPct: number): Warning {
  return {
    code: "GRZANIE-WSTRZYMANE",
    level: "critical",
    i18nKey: "GRZANIE-WSTRZYMANE",
    params: { soc: socPct, prog: PROG_SOC_WSTRZYMANIA_PCT },
    technicalMessage: `produkcjaPv === 'nie', socPct = ${socPct} < PROG_SOC_WSTRZYMANIA_PCT = ${PROG_SOC_WSTRZYMANIA_PCT}`,
  }
}
