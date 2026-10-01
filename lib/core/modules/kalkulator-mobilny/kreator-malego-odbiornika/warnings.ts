import type { Warning } from "@/lib/core/calc-result"

/** 🟡 The owned battery does not hold the loads for the required backup time. */
export function akumulatorZaMaly(posiadanyAh: number, minimalnyAh: number, starczyH: number): Warning {
  return {
    code: "KZ-AKUMULATOR-ZA-MALY",
    level: "warning",
    i18nKey: "KZ-AKUMULATOR-ZA-MALY",
    params: { posiadany: posiadanyAh, minimalny: Math.ceil(minimalnyAh), h: Math.round(starczyH * 10) / 10 },
    technicalMessage: `posiadanyAh=${posiadanyAh} < ${minimalnyAh}`,
    field: "posiadanyAh",
  }
}

/** 🟡 The panel does not cover the daily consumption — the battery runs down day by day. */
export function panelNiePokrywa(panelWh: number, dobaWh: number): Warning {
  return {
    code: "KZ-PANEL-NIE-POKRYWA",
    level: "warning",
    i18nKey: "KZ-PANEL-NIE-POKRYWA",
    params: { panel: Math.round(panelWh), doba: Math.round(dobaWh) },
    technicalMessage: `panelWh=${panelWh} < dobaWh=${dobaWh}`,
    field: "mocPaneluW",
  }
}

/** 🟡 Biblia §12.24.1: "Światło awaryjne nie może być podłączone przez falownik 230V – strata energii." */
export function swiatloPrzezFalownik(): Warning {
  return {
    code: "KZ-SWIATLO-PRZEZ-FALOWNIK",
    level: "warning",
    i18nKey: "KZ-SWIATLO-PRZEZ-FALOWNIK",
    technicalMessage: "scenariusz=oswietlenie-awaryjne, przezFalownik=true (Biblia §12.24.1)",
    field: "przezFalownik",
  }
}

/** ℹ️ Motor/compressor start through an inverter — size it on screen 8. */
export function rozruchPrzezFalownik(szczytW: number): Warning {
  return {
    code: "KZ-ROZRUCH-FALOWNIKA",
    level: "info",
    i18nKey: "KZ-ROZRUCH-FALOWNIKA",
    params: { szczyt: Math.ceil(szczytW) },
    technicalMessage: `szczyt=${szczytW} W`,
  }
}

/** ℹ️ Scenario note from the Bible (one per scenario, see SCENARIUSZE). */
export function uwagaScenariusza(kod: string): Warning {
  return { code: kod, level: "info", i18nKey: kod, technicalMessage: `scenario note ${kod}` }
}
