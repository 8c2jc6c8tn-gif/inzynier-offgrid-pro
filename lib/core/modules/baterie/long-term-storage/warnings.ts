import type { Warning } from "@/lib/core/calc-result"
import { SOC_ZALECANY_MAX_PCT, SOC_ZALECANY_MIN_PCT, TEMPERATURA_MIN_BEZPIECZNA_C } from "./constants"

export function socPozaZakresem(socPct: number): Warning {
  return {
    code: "SOC-POZA-ZALECANYM-ZAKRESEM",
    level: "warning",
    i18nKey: "SOC-POZA-ZALECANYM-ZAKRESEM",
    params: { soc: socPct, min: SOC_ZALECANY_MIN_PCT, max: SOC_ZALECANY_MAX_PCT },
    technicalMessage: `socDocelowyPct=${socPct}, oczekiwano [${SOC_ZALECANY_MIN_PCT}, ${SOC_ZALECANY_MAX_PCT}]`,
    field: "socDocelowyPct",
  }
}

export function temperaturaPonizejMinimum(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-PONIZEJ-MINIMUM",
    level: "warning",
    i18nKey: "TEMPERATURA-PONIZEJ-MINIMUM-BEZPIECZNEGO",
    params: { temp: temperaturaC.toFixed(1), min: TEMPERATURA_MIN_BEZPIECZNA_C },
    technicalMessage: `temperaturaMinC=${temperaturaC} < ${TEMPERATURA_MIN_BEZPIECZNA_C}`,
    field: "temperaturaMinC",
  }
}

export function socUjemny(value: number): Warning {
  return {
    code: "SOC-UJEMNY",
    level: "critical",
    i18nKey: "SOC-DOCELOWY-POZA-ZAKRESEM",
    technicalMessage: `socDocelowyPct = ${value}, oczekiwano [0, 100]`,
    field: "socDocelowyPct",
  }
}
