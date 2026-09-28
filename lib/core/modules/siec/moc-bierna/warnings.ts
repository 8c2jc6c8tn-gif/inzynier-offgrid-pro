import type { Warning } from "@/lib/core/calc-result"

export function tgFi0PonizejMinimum(v: number, min: number): Warning {
  return {
    code: "SIEC-TGFI0-PONIZEJ-MINIMUM",
    level: "critical",
    i18nKey: "SIEC-TGFI0-PONIZEJ-MINIMUM",
    params: { min },
    technicalMessage: `tgφ₀ = ${v} < ${min} (taryfy OSD 2026)`,
    field: "tgFi0",
  }
}

export function celNiePonizejTgFi0(cel: number, tg0: number): Warning {
  return {
    code: "SIEC-TGFI-CEL-NIE-PONIZEJ-TGFI0",
    level: "warning",
    i18nKey: "SIEC-TGFI-CEL-NIE-PONIZEJ-TGFI0",
    technicalMessage: `tgφ_cel = ${cel} ≥ tgφ₀ = ${tg0}`,
    field: "tgFiCel",
  }
}

export function celNieMniejszyOdObecnego(): Warning {
  return {
    code: "SIEC-TGFI-CEL-NIE-MNIEJSZY",
    level: "warning",
    i18nKey: "SIEC-TGFI-CEL-NIE-MNIEJSZY",
    technicalMessage: "tgφ_cel ≥ tgφ — kompensacja zbędna",
    field: "tgFiCel",
  }
}

/** Overcompensation → capacitive energy billed in full; automatic regulation needed. */
export function przekompensowanie(): Warning {
  return {
    code: "SIEC-PRZEKOMPENSOWANIE",
    level: "warning",
    i18nKey: "SIEC-PRZEKOMPENSOWANIE",
    technicalMessage: "bateria kondensatorów bez automatyki → energia pojemnościowa (weekend, noc)",
  }
}

/** ✏️ K3: on nN reactive billing applies only when the contract says so. */
export function czyDotyczy(): Warning {
  return {
    code: "SIEC-MOC-BIERNA-CZY-DOTYCZY",
    level: "info",
    i18nKey: "SIEC-MOC-BIERNA-CZY-DOTYCZY",
    technicalMessage: "✏️ K3 — rozliczenie mocy biernej na nN wg umowy/warunków przyłączenia",
  }
}
