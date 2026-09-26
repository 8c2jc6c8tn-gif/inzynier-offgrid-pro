import type { Warning } from "@/lib/core/calc-result"

export { wartoscNiedodatnia, wartoscPozaZakresem } from "../obciazenie-cieplne/warnings"

/**
 * Owner's decision (26.09.2026): the source's C = Σ m·c of the whole building is implemented as written, with this
 * warning. In a day-scale cooling only the inner part of heavy elements exchanges heat with the room (PN-EN ISO 13786,
 * not in the repo), so the result overstates the effective capacity and the time to freezing.
 */
export function calaMasaZawyza(): Warning {
  return {
    code: "POJC-CALA-MASA-ZAWYZA",
    level: "warning",
    i18nKey: "POJC-CALA-MASA-ZAWYZA",
    technicalMessage: "C = Σ ρ·A·d·c całych warstw; bez głębokości penetracji (PN-EN ISO 13786 poza repo) — τ i czasy zawyżone",
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
