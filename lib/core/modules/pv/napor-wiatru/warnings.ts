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

/** Hard stop (source, Module 3 line 451): ballast/anchoring insufficient against wind uplift. */
export function balastNiewystarczajacy(planowanyKg: number, wymaganyKg: number): Warning {
  return {
    code: "NW-BALAST-NIEWYSTARCZAJACY",
    level: "critical",
    i18nKey: "NW-BALAST-NIEWYSTARCZAJACY",
    params: { planowany: planowanyKg.toFixed(0), wymagany: Math.ceil(wymaganyKg).toString() },
    technicalMessage: `balastPlanowanyKg = ${planowanyKg} < ${wymaganyKg} (EQU, PN-EN 1990 (6.7))`,
    field: "balastPlanowanyKg",
  }
}

/** The force of this screen is not the PN-EN 1991-1-4 path — design ballast is valid only for a peak gust speed. */
export function predkoscMusiBycPorywem(): Warning {
  return {
    code: "NW-PREDKOSC-SZCZYTOWA",
    level: "info",
    i18nKey: "NW-PREDKOSC-SZCZYTOWA",
    technicalMessage: "balast EQU z F = 0,5ρv²ACd — v musi być szczytową prędkością porywu dla lokalizacji; tor normowy: M3/E2, M3/E9",
  }
}

export function silaNaporu(silaN: number): Warning {
  return {
    code: "SILA-NAPORU",
    level: "info",
    i18nKey: "SILA-NAPORU",
    params: { sila: silaN.toFixed(0) },
    technicalMessage: `silaN=${silaN}`,
  }
}
