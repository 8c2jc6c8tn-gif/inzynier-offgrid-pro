import type { Warning } from "@/lib/core/calc-result"
import { IP_ZALECANE_NAMIOT_JACHT, IP_ZALECANE_WILGOC, MIN_IP_NAMIOT_JACHT } from "./constants"

/** Ostrzeżenie źródła (Biblia §12.34): "Wilgoć to cichy zabójca instalacji elektrycznej." */
export function wilgocCichyZabojca(): Warning {
  return {
    code: "WMI-WILGOC-CICHY-ZABOJCA",
    level: "info",
    i18nKey: "WMI-WILGOC-CICHY-ZABOJCA",
    technicalMessage: "narazoneNaWilgoc = true — korozja, zwarcia, uszkodzenia elektroniki (źródło)",
  }
}

/**
 * Przykład źródła (§12.34, wilgotny garaż) — IP65 jako ostrzeżenie; od D44 w każdym miejscu z zaznaczoną wilgocią.
 * Próg twardy zostaje IP55 z M4/E10.
 */
export function wilgocZalecaneIp65(miejsce: string, ipKod: number): Warning {
  return {
    code: "WMI-WILGOC-ZALECANE-IP65",
    level: "warning",
    i18nKey: "WMI-WILGOC-ZALECANE-IP65",
    params: { ip: ipKod, zalecane: IP_ZALECANE_WILGOC },
    technicalMessage: `miejsce = ${miejsce}, narazoneNaWilgoc = true, ipKod = ${ipKod} < ${IP_ZALECANE_WILGOC} (przykład źródła §12.34, D44)`,
    field: "ipKod",
  }
}

/** Namiot/jacht z obudową IP65–IP66 — zalecane IP67–IP68 (D44, praktyka właściciela, nie norma). */
export function namiotJachtZalecaneIp67(miejsce: string, ipKod: number): Warning {
  return {
    code: "WMI-NAMIOT-JACHT-ZALECANE-IP67",
    level: "warning",
    i18nKey: "WMI-NAMIOT-JACHT-ZALECANE-IP67",
    params: { ip: ipKod, zalecane: IP_ZALECANE_NAMIOT_JACHT },
    technicalMessage: `miejsce = ${miejsce}, ipKod = ${ipKod} < ${IP_ZALECANE_NAMIOT_JACHT} (D44)`,
    field: "ipKod",
  }
}

/** Namiot/jacht (zawsze traktowany jako narażony na wilgoć) — twardy stop poniżej IP65 (D44, praktyka właściciela, nie norma). */
export function namiotJachtPonizejIp65(miejsce: string, ipKod: number): Warning {
  return {
    code: "WMI-NAMIOT-JACHT-PONIZEJ-IP65",
    level: "critical",
    i18nKey: "WMI-NAMIOT-JACHT-PONIZEJ-IP65",
    params: { ip: ipKod, min: MIN_IP_NAMIOT_JACHT },
    technicalMessage: `miejsce = ${miejsce} (zawsze wilgoć), ipKod = ${ipKod} < ${MIN_IP_NAMIOT_JACHT} (D44)`,
    field: "ipKod",
  }
}
