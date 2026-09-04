import type { Warning } from "@/lib/core/calc-result"
import { MIN_IP_KOD_WILGOTNE } from "./constants"

export function wilgotnoscPozaZakresem(value: number): Warning {
  return {
    code: "WILGOTNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Wilgotność względna musi być z przedziału 0–100%.",
    technicalMessage: `wilgotnoscPct = ${value}, oczekiwano (0, 100]`,
    field: "wilgotnoscPct",
  }
}

export function ryzykoKondensacji(temperaturaObudowyC: number, punktRosyC: number): Warning {
  return {
    code: "RYZYKO-KONDENSACJI",
    level: "warning",
    message: `Temperatura obudowy (${temperaturaObudowyC.toFixed(1)}°C) jest poniżej punktu rosy (${punktRosyC.toFixed(1)}°C) — wysokie ryzyko wykroplenia wody w środku. Mokry BMS i miedziane szyny to gotowy przepis na zwarcie.`,
    technicalMessage: `temperaturaObudowyC = ${temperaturaObudowyC} <= punktRosyC = ${punktRosyC}`,
  }
}

export function bezpiecznyMargines(temperaturaObudowyC: number, punktRosyC: number): Warning {
  return {
    code: "BEZPIECZNY-MARGINES",
    level: "info",
    message: `Temperatura obudowy (${temperaturaObudowyC.toFixed(1)}°C) jest powyżej punktu rosy (${punktRosyC.toFixed(1)}°C) — brak ryzyka kondensacji przy tych warunkach.`,
    technicalMessage: `temperaturaObudowyC = ${temperaturaObudowyC} > punktRosyC = ${punktRosyC}`,
  }
}

export function ipPonizejWymaganego(ipKod: number): Warning {
  return {
    code: "IP-PONIZEJ-WYMAGANEGO",
    level: "critical",
    message: `Obudowa IP${ipKod} jest poniżej wymaganego minimum IP${MIN_IP_KOD_WILGOTNE} dla środowiska narażonego na wilgoć.`,
    technicalMessage: `ipKod = ${ipKod} < MIN_IP_KOD_WILGOTNE = ${MIN_IP_KOD_WILGOTNE}, srodowiskoWilgotne = true`,
    field: "ipKod",
  }
}
