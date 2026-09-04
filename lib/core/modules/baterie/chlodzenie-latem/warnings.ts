import type { Warning } from "@/lib/core/calc-result"
import { ZAKRES_PRACY_MAX_C, ZAKRES_PRACY_MIN_C } from "./constants"

export function powyzejZakresu(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-POWYZEJ-ZAKRESU",
    level: "critical",
    message: `Temperatura ogniw (${temperaturaC.toFixed(1)}°C) przekracza dopuszczalne ${ZAKRES_PRACY_MAX_C}°C — ryzyko trwale przyspieszonej degradacji. Bateria to nie piec — wysoka temperatura nie tylko chwilowo obniża wydajność, ale trwale przyspiesza starzenie ogniw.`,
    technicalMessage: `temperaturaOgniwC = ${temperaturaC} > ZAKRES_PRACY_MAX_C = ${ZAKRES_PRACY_MAX_C}`,
    field: "temperaturaOgniwC",
  }
}

export function ponizejZakresu(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-PONIZEJ-ZAKRESU",
    level: "info",
    message: `Temperatura ogniw (${temperaturaC.toFixed(1)}°C) jest poniżej dopuszczalnego zakresu pracy (${ZAKRES_PRACY_MIN_C}°C) — to nie jest ryzyko przegrzania (temat tego ekranu), sprawdź ograniczenie prądu ładowania w mrozie na osobnych ekranach (Cold C-Rate, Cold Cranking Amps).`,
    technicalMessage: `temperaturaOgniwC = ${temperaturaC} < ZAKRES_PRACY_MIN_C = ${ZAKRES_PRACY_MIN_C}`,
    field: "temperaturaOgniwC",
  }
}

export function wZakresie(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-W-ZAKRESIE",
    level: "info",
    message: `Temperatura ogniw (${temperaturaC.toFixed(1)}°C) mieści się w dopuszczalnym zakresie pracy ${ZAKRES_PRACY_MIN_C}–${ZAKRES_PRACY_MAX_C}°C.`,
    technicalMessage: `temperaturaOgniwC = ${temperaturaC} w [${ZAKRES_PRACY_MIN_C}, ${ZAKRES_PRACY_MAX_C}]`,
    field: "temperaturaOgniwC",
  }
}
