import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function przekroczonyLimitMppt(vStringV: number, limitMpptV: number): Warning {
  return {
    code: "PRZEKROCZONY-LIMIT-MPPT",
    level: "critical",
    message: `Napięcie stringu w mrozie (${vStringV.toFixed(0)} V) przekracza limit MPPT falownika (${limitMpptV.toFixed(0)} V) — realne ryzyko trwałego uszkodzenia wejścia DC. Zmień konfigurację stringów.`,
    technicalMessage: `vStringV=${vStringV} > limitMpptV=${limitMpptV}`,
  }
}

export function bliskoLimituMppt(vStringV: number, limitMpptV: number, progV: number): Warning {
  return {
    code: "BLISKO-LIMITU-MPPT",
    level: "warning",
    message: `Napięcie stringu w mrozie (${vStringV.toFixed(0)} V) przekracza 95% limitu MPPT (${progV.toFixed(0)} V z ${limitMpptV.toFixed(0)} V) — mały margines bezpieczeństwa.`,
    technicalMessage: `vStringV=${vStringV} > 0.95×limitMpptV=${progV}`,
  }
}

export function bezpiecznyMargines(vStringV: number, limitMpptV: number): Warning {
  return {
    code: "BEZPIECZNY-MARGINES-MPPT",
    level: "info",
    message: `Napięcie stringu w mrozie (${vStringV.toFixed(0)} V) mieści się bezpiecznie poniżej limitu MPPT (${limitMpptV.toFixed(0)} V).`,
    technicalMessage: `vStringV=${vStringV} <= 0.95×limitMpptV`,
  }
}
