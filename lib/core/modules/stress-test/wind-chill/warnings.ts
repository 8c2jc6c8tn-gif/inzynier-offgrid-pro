import type { Warning } from "@/lib/core/calc-result"
import { WIND_CHILL_MAX_TEMP_C, WIND_CHILL_MIN_PREDKOSC_KMH } from "./constants"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function pozaZakresemWzoru(temperaturaC: number, predkoscWiatruKmh: number): Warning {
  return {
    code: "POZA-ZAKRESEM-WZORU-WIND-CHILL",
    level: "info",
    i18nKey: "POZA-ZAKRESEM-WZORU-WIND-CHILL",
    params: {
      maxTemp: WIND_CHILL_MAX_TEMP_C.toFixed(0),
      minWiatr: WIND_CHILL_MIN_PREDKOSC_KMH.toFixed(1),
    },
    technicalMessage: `temperaturaC=${temperaturaC}, predkoscWiatruKmh=${predkoscWiatruKmh} — poza zakresem ważności wzoru NWS (T<=${WIND_CHILL_MAX_TEMP_C}°C, V>${WIND_CHILL_MIN_PREDKOSC_KMH}km/h)`,
  }
}
