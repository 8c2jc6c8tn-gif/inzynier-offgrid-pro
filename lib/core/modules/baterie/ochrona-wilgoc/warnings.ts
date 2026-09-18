import type { Warning } from "@/lib/core/calc-result"
import { MIN_IP_KOD_WILGOTNE } from "./constants"

export function wilgotnoscPozaZakresem(value: number): Warning {
  return {
    code: "WILGOTNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WILGOTNOSC-POZA-ZAKRESEM",
    technicalMessage: `wilgotnoscPct = ${value}, oczekiwano (0, 100]`,
    field: "wilgotnoscPct",
  }
}

export function ryzykoKondensacji(temperaturaObudowyC: number, punktRosyC: number): Warning {
  return {
    code: "RYZYKO-KONDENSACJI",
    level: "warning",
    i18nKey: "RYZYKO-KONDENSACJI",
    params: { temp: temperaturaObudowyC.toFixed(1), rosa: punktRosyC.toFixed(1) },
    technicalMessage: `temperaturaObudowyC = ${temperaturaObudowyC} <= punktRosyC = ${punktRosyC}`,
  }
}

export function bezpiecznyMargines(temperaturaObudowyC: number, punktRosyC: number): Warning {
  return {
    code: "BEZPIECZNY-MARGINES",
    level: "info",
    i18nKey: "BEZPIECZNY-MARGINES",
    params: { temp: temperaturaObudowyC.toFixed(1), rosa: punktRosyC.toFixed(1) },
    technicalMessage: `temperaturaObudowyC = ${temperaturaObudowyC} > punktRosyC = ${punktRosyC}`,
  }
}

export function ipPonizejWymaganego(ipKod: number): Warning {
  return {
    code: "IP-PONIZEJ-WYMAGANEGO",
    level: "critical",
    i18nKey: "IP-PONIZEJ-WYMAGANEGO",
    params: { ip: ipKod, min: MIN_IP_KOD_WILGOTNE },
    technicalMessage: `ipKod = ${ipKod} < MIN_IP_KOD_WILGOTNE = ${MIN_IP_KOD_WILGOTNE}, srodowiskoWilgotne = true`,
    field: "ipKod",
  }
}
