import type { Warning } from "@/lib/core/calc-result"
import { SOC_ZALECANY_MAX_PCT, SOC_ZALECANY_MIN_PCT, TEMPERATURA_MIN_BEZPIECZNA_C } from "./constants"

export function socPozaZakresem(socPct: number): Warning {
  return {
    code: "SOC-POZA-ZALECANYM-ZAKRESEM",
    level: "warning",
    message: `Docelowy SoC (${socPct}%) jest poza zalecanym zakresem ${SOC_ZALECANY_MIN_PCT}–${SOC_ZALECANY_MAX_PCT}%. Bateria nie lubi być ani przesuszona (0% SoC), ani przelana (100% SoC) przez długi czas bezczynności.`,
    technicalMessage: `socDocelowyPct=${socPct}, oczekiwano [${SOC_ZALECANY_MIN_PCT}, ${SOC_ZALECANY_MAX_PCT}]`,
    field: "socDocelowyPct",
  }
}

export function temperaturaPonizejMinimum(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-PONIZEJ-MINIMUM",
    level: "warning",
    message: `Spodziewana temperatura (${temperaturaC.toFixed(1)}°C) jest poniżej bezpiecznego minimum ${TEMPERATURA_MIN_BEZPIECZNA_C}°C — zabezpiecz przed mrozem lub zmień miejsce przechowywania.`,
    technicalMessage: `temperaturaMinC=${temperaturaC} < ${TEMPERATURA_MIN_BEZPIECZNA_C}`,
    field: "temperaturaMinC",
  }
}

export function socUjemny(value: number): Warning {
  return {
    code: "SOC-UJEMNY",
    level: "critical",
    message: "Docelowy SoC musi być z przedziału 0–100%.",
    technicalMessage: `socDocelowyPct = ${value}, oczekiwano [0, 100]`,
    field: "socDocelowyPct",
  }
}
