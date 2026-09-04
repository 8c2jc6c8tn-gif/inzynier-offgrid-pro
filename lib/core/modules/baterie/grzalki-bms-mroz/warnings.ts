import type { Warning } from "@/lib/core/calc-result"
import { PROG_SOC_WSTRZYMANIA_PCT, PROG_TEMPERATURY_GRZANIA_C } from "./constants"

export function socUjemny(value: number): Warning {
  return {
    code: "SOC-UJEMNY",
    level: "critical",
    message: "SoC musi być z przedziału 0–100%.",
    technicalMessage: `socPct = ${value}, oczekiwano [0, 100]`,
    field: "socPct",
  }
}

export function brakPotrzebyGrzania(temperaturaC: number): Warning {
  return {
    code: "BRAK-POTRZEBY-GRZANIA",
    level: "info",
    message: `Temperatura (${temperaturaC.toFixed(1)}°C) jest na tyle wysoka, że BMS nie włącza grzałek przed ładowaniem (próg: ${PROG_TEMPERATURY_GRZANIA_C}°C).`,
    technicalMessage: `temperaturaMinC = ${temperaturaC} >= PROG_TEMPERATURY_GRZANIA_C = ${PROG_TEMPERATURY_GRZANIA_C}`,
  }
}

export function grzanieZPv(): Warning {
  return {
    code: "GRZANIE-Z-PV",
    level: "info",
    message: "Jest produkcja PV — grzałki BMS zasilane bezpośrednio z paneli, zero obciążenia baterii.",
    technicalMessage: "produkcjaPv === 'tak'",
  }
}

export function grzanieZBaterii(socPct: number): Warning {
  return {
    code: "GRZANIE-Z-BATERII",
    level: "warning",
    message: `Brak produkcji PV, ale SoC (${socPct}%) jest powyżej ${PROG_SOC_WSTRZYMANIA_PCT}% — grzanie z baterii, tylko do osiągnięcia minimalnej temperatury ładowania.`,
    technicalMessage: `produkcjaPv === 'nie', socPct = ${socPct} > PROG_SOC_WSTRZYMANIA_PCT = ${PROG_SOC_WSTRZYMANIA_PCT}`,
  }
}

export function grzanieWstrzymane(socPct: number): Warning {
  return {
    code: "GRZANIE-WSTRZYMANE",
    level: "critical",
    message: `Brak produkcji PV i SoC (${socPct}%) poniżej ${PROG_SOC_WSTRZYMANIA_PCT}% — grzanie wstrzymane, tryb uśpienia. BMS zablokuje ładowanie przy tej temperaturze, dopóki nie pojawi się PV lub SoC nie wzrośnie.`,
    technicalMessage: `produkcjaPv === 'nie', socPct = ${socPct} < PROG_SOC_WSTRZYMANIA_PCT = ${PROG_SOC_WSTRZYMANIA_PCT}`,
  }
}
