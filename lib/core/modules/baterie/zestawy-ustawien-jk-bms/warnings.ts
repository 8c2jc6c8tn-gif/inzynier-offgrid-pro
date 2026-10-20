import type { Warning } from "@/lib/core/calc-result"

/** Threshold order broken: `nizszy` must stay below `wyzszy` (e.g. Cell OVPR < Cell OVP). */
export function kolejnoscProgow(nizszy: string, wyzszy: string, vNizszy: number, vWyzszy: number): Warning {
  return {
    code: "ZJK-KOLEJNOSC-PROGOW",
    level: "warning",
    i18nKey: "ZJK-KOLEJNOSC-PROGOW",
    params: { nizszy, wyzszy, vNizszy, vWyzszy },
    technicalMessage: `${nizszy} = ${vNizszy} V is not below ${wyzszy} = ${vWyzszy} V`,
  }
}

/** Same order check, but one of the two parameters has an unconfirmed meaning in the JK manual. */
export function kolejnoscProgowNiepewna(nizszy: string, wyzszy: string, vNizszy: number, vWyzszy: number): Warning {
  return {
    code: "ZJK-KOLEJNOSC-NIEPEWNA",
    level: "warning",
    i18nKey: "ZJK-KOLEJNOSC-NIEPEWNA",
    params: { nizszy, wyzszy, vNizszy, vWyzszy },
    technicalMessage: `${nizszy} = ${vNizszy} V is not below ${wyzszy} = ${vWyzszy} V; the meaning of one of them is unconfirmed`,
  }
}

/** Recovery temperature equal to (or below) the protection temperature — no hysteresis. */
export function brakHisterezyTemperatury(utpr: number, utp: number): Warning {
  return {
    code: "ZJK-BRAK-HISTEREZY-TEMP",
    level: "warning",
    i18nKey: "ZJK-BRAK-HISTEREZY-TEMP",
    params: { utpr, utp },
    technicalMessage: `Charge UTPR = ${utpr} °C <= Charge UTP = ${utp} °C: recovery threshold has no hysteresis above the protection threshold`,
  }
}

export function ovpPozaZakresem(v: number, od: number, doo: number): Warning {
  return {
    code: "ZJK-OVP-POZA-ZAKRESEM",
    level: "warning",
    i18nKey: "ZJK-OVP-POZA-ZAKRESEM",
    params: { v, od, do: doo },
    technicalMessage: `Cell OVP = ${v} V outside the source range ${od}–${doo} V/cell`,
  }
}

export function uvpPozaZakresem(v: number, od: number, doo: number): Warning {
  return {
    code: "ZJK-UVP-POZA-ZAKRESEM",
    level: "warning",
    i18nKey: "ZJK-UVP-POZA-ZAKRESEM",
    params: { v, od, do: doo },
    technicalMessage: `Cell UVP = ${v} V outside the source range ${od}–${doo} V/cell`,
  }
}

export function pradLadowaniaPozaZakresem(c: number, od: number, doo: number): Warning {
  return {
    code: "ZJK-PRAD-LADOWANIA-POZA-ZAKRESEM",
    level: "warning",
    i18nKey: "ZJK-PRAD-LADOWANIA-POZA-ZAKRESEM",
    params: { c, od, do: doo },
    technicalMessage: `Continued Charge = ${c} C outside the source range ${od}–${doo} C`,
  }
}

export function startBalansuInny(v: number, zrodlo: number): Warning {
  return {
    code: "ZJK-START-BALANSU-INNY",
    level: "info",
    i18nKey: "ZJK-START-BALANSU-INNY",
    params: { v, zrodlo },
    technicalMessage: `Start balance volt = ${v} V differs from the source value ${zrodlo} V`,
  }
}

export function parametryDoPotwierdzenia(liczba: number): Warning {
  return {
    code: "ZJK-DO-POTWIERDZENIA",
    level: "info",
    i18nKey: "ZJK-DO-POTWIERDZENIA",
    params: { liczba },
    technicalMessage: `${liczba} parameter(s) have a meaning not confirmed in the JK manual; the app compares nothing for them`,
  }
}
