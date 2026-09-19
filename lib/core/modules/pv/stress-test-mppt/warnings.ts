import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function przekroczonyLimitMppt(vStringV: number, limitMpptV: number): Warning {
  return {
    code: "PRZEKROCZONY-LIMIT-MPPT",
    level: "critical",
    i18nKey: "PRZEKROCZONY-LIMIT-MPPT",
    params: { vString: vStringV.toFixed(0), limit: limitMpptV.toFixed(0) },
    technicalMessage: `vStringV=${vStringV} > limitMpptV=${limitMpptV}`,
  }
}

export function bliskoLimituMppt(vStringV: number, limitMpptV: number, progV: number): Warning {
  return {
    code: "BLISKO-LIMITU-MPPT",
    level: "warning",
    i18nKey: "BLISKO-LIMITU-MPPT",
    params: { vString: vStringV.toFixed(0), limit: limitMpptV.toFixed(0), prog: progV.toFixed(0) },
    technicalMessage: `vStringV=${vStringV} > 0.95×limitMpptV=${progV}`,
  }
}

export function bezpiecznyMargines(vStringV: number, limitMpptV: number): Warning {
  return {
    code: "BEZPIECZNY-MARGINES-MPPT",
    level: "info",
    i18nKey: "BEZPIECZNY-MARGINES-MPPT",
    params: { vString: vStringV.toFixed(0), limit: limitMpptV.toFixed(0) },
    technicalMessage: `vStringV=${vStringV} <= 0.95×limitMpptV`,
  }
}
