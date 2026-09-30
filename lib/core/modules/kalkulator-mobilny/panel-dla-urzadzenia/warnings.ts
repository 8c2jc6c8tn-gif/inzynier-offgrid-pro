import type { Warning } from "@/lib/core/calc-result"

/** 🟡 The panel the user has is smaller than the computed minimum. */
export function panelZaMaly(posiadanyW: number, minimalnaW: number): Warning {
  return {
    code: "PU-PANEL-ZA-MALY",
    level: "warning",
    i18nKey: "PU-PANEL-ZA-MALY",
    params: { posiadany: posiadanyW, minimalna: Math.ceil(minimalnaW) },
    technicalMessage: `posiadanyPanelW = ${posiadanyW} < ${minimalnaW.toFixed(1)}`,
    field: "posiadanyPanelW",
  }
}

/** ℹ️ Biblia §12.6: on cloudy days production drops sharply — consider a bigger panel or a battery reserve. */
export function pochmurneDni(): Warning {
  return { code: "PU-POCHMURNE-DNI", level: "info", i18nKey: "PU-POCHMURNE-DNI", technicalMessage: "always shown (Biblia §12.6)" }
}
