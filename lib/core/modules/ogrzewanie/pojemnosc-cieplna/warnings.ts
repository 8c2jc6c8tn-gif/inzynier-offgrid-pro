import type { Warning } from "@/lib/core/calc-result"
import type { NazwaElementu } from "@/lib/core/nazwa-elementu"

export { wartoscNiedodatnia, wartoscPozaZakresem } from "../obciazenie-cieplne/warnings"

/**
 * [27.09.2026] Replaces POJC-CALA-MASA-ZAWYZA (owner's decision 26.09.2026: whole mass until the norm arrives).
 * EN ISO 13786 A.1 requires the note that Załącznik A was used and which approximation; A.2.4 UWAGA: real effective
 * thickness 40 %…120 % of the conventional one, the method may overstate capacity (e.g. timber, aerated concrete).
 */
export function zalacznikAPrzyblizenie(): Warning {
  return {
    code: "POJC-ZALACZNIK-A-PRZYBLIZENIE",
    level: "warning",
    i18nKey: "POJC-ZALACZNIK-A-PRZYBLIZENIE",
    technicalMessage: "κ wg EN ISO 13786 Zał. A (A.2.4 grubość efektywna, okres 1 doba, A.4 z Rsi) — przybliżenie, dT rzeczywiste 40–120 %",
  }
}

/** Element thinner than its own massive layer. */
export function elementCienszyNizWarstwa(field: string, nazwa: NazwaElementu, element: number, warstwa: number): Warning {
  return {
    code: "POJC-ELEMENT-CIENSZY-NIZ-WARSTWA",
    level: "critical",
    i18nKey: "POJC-ELEMENT-CIENSZY-NIZ-WARSTWA",
    params: { ...nazwa, element, warstwa },
    technicalMessage: `gruboscElementuCm = ${element} < gruboscCm = ${warstwa}`,
    field,
  }
}

/** θ∞ is at or above the limit — the lumped model never reaches it. */
export function granicaNieosiagalna(granica: number, rownowaga: number): Warning {
  return {
    code: "POJC-GRANICA-NIEOSIAGALNA",
    level: "info",
    i18nKey: "POJC-GRANICA-NIEOSIAGALNA",
    params: { granica, rownowaga: rownowaga.toFixed(1) },
    technicalMessage: `θ∞ = ${rownowaga} >= θgr = ${granica}`,
  }
}

/** Start temperature at or below the equilibrium — the building does not cool down. */
export function brakWychladzania(start: number, rownowaga: number): Warning {
  return {
    code: "POJC-BRAK-WYCHLADZANIA",
    level: "info",
    i18nKey: "POJC-BRAK-WYCHLADZANIA",
    params: { start, rownowaga: rownowaga.toFixed(1) },
    technicalMessage: `θ0 = ${start} <= θ∞ = ${rownowaga}`,
  }
}

/** Limit at or above the start temperature — already there. */
export function granicaNieNizszaNizStart(granica: number, start: number): Warning {
  return {
    code: "POJC-GRANICA-NIE-NIZSZA",
    level: "critical",
    i18nKey: "POJC-GRANICA-NIE-NIZSZA",
    params: { granica, start },
    technicalMessage: `θgr = ${granica} >= θ0 = ${start}`,
    field: "temperaturaGranicznaC",
  }
}
