import type { Warning } from "@/lib/core/calc-result"
import { IP_ZALECANE_WILGOTNY_GARAZ, MIN_IP_NAMIOT_JACHT } from "./constants"

/** Ostrzeżenie źródła (Biblia §12.34): "Wilgoć to cichy zabójca instalacji elektrycznej." */
export function wilgocCichyZabojca(): Warning {
  return {
    code: "WMI-WILGOC-CICHY-ZABOJCA",
    level: "info",
    i18nKey: "WMI-WILGOC-CICHY-ZABOJCA",
    technicalMessage: "narazoneNaWilgoc = true — korozja, zwarcia, uszkodzenia elektroniki (źródło)",
  }
}

/** Przykład źródła dla wilgotnego garażu — IP65 jako ostrzeżenie (D44); próg twardy zostaje IP55 z M4/E10. */
export function garazZalecaneIp65(ipKod: number): Warning {
  return {
    code: "WMI-GARAZ-ZALECANE-IP65",
    level: "warning",
    i18nKey: "WMI-GARAZ-ZALECANE-IP65",
    params: { ip: ipKod, zalecane: IP_ZALECANE_WILGOTNY_GARAZ },
    technicalMessage: `miejsce = garaz, narazoneNaWilgoc = true, ipKod = ${ipKod} < ${IP_ZALECANE_WILGOTNY_GARAZ} (przykład źródła §12.34)`,
    field: "ipKod",
  }
}

/** Namiot/jacht narażony na wilgoć — twardy stop poniżej IP65 (D44, praktyka właściciela, nie norma). */
export function namiotJachtPonizejIp65(miejsce: string, ipKod: number): Warning {
  return {
    code: "WMI-NAMIOT-JACHT-PONIZEJ-IP65",
    level: "critical",
    i18nKey: "WMI-NAMIOT-JACHT-PONIZEJ-IP65",
    params: { ip: ipKod, min: MIN_IP_NAMIOT_JACHT },
    technicalMessage: `miejsce = ${miejsce}, narazoneNaWilgoc = true, ipKod = ${ipKod} < ${MIN_IP_NAMIOT_JACHT} (D44)`,
    field: "ipKod",
  }
}
