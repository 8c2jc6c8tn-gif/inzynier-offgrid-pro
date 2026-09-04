import type { Warning } from "@/lib/core/calc-result"

export function brakZabezpieczenia(): Warning {
  return {
    code: "BRAK-ZABEZPIECZENIA-DOZIEMIENIA",
    level: "critical",
    message:
      "Brak monitora izolacji (IMD) i różnicówki DC — przebicie w panelu spowoduje pojawienie się " +
      "niebezpiecznego potencjału na ramie bez wykrycia. Prąd stały trzyma ofiarę porażenia mocniej " +
      "niż zmienny — zainstaluj IMD lub różnicówkę DC.",
    technicalMessage: "maMonitorIzolacji === false && maRoznicowkeDc === false",
  }
}

export function zabezpieczenieObecne(): Warning {
  return {
    code: "ZABEZPIECZENIE-OBECNE",
    level: "info",
    message: "Zabezpieczenie przed doziemieniem jest obecne (IMD lub różnicówka DC).",
    technicalMessage: "maMonitorIzolacji === true || maRoznicowkeDc === true",
  }
}
