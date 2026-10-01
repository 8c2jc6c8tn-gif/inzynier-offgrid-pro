import type { Warning } from "@/lib/core/calc-result"

/** Source 🟡 (Ekran 16): the actuators and controllers use as much electricity as zoning saves. */
export function silownikiZjadajaZysk(pradSterowaniaKwh: number, oszczednoscPraduKwh: number): Warning {
  return {
    code: "STREF-SILOWNIKI-ZJADAJA-ZYSK",
    level: "warning",
    i18nKey: "STREF-SILOWNIKI-ZJADAJA-ZYSK",
    params: { sterowanie: pradSterowaniaKwh, zysk: oszczednoscPraduKwh },
    technicalMessage: `prąd sterowania ${pradSterowaniaKwh} kWh/doba >= oszczędność prądu ${oszczednoscPraduKwh} kWh/doba`,
    field: "liczbaSilownikow",
  }
}

/** Steady-state saving is an upper bound — the building mass and reheating reduce it (✅🤖, Ekran 8). */
export function stanUstalony(): Warning {
  return {
    code: "STREF-STAN-USTALONY",
    level: "info",
    i18nKey: "STREF-STAN-USTALONY",
    technicalMessage: "oszczędność liczona w stanie ustalonym Q = H·ΔT·t — górne oszacowanie (bez bezwładności i wymiany ciepła między strefami)",
  }
}

/** Non-electric heating: the balance against the actuators' electricity is not computed. */
export function bezCop(): Warning {
  return {
    code: "STREF-BEZ-COP",
    level: "info",
    i18nKey: "STREF-BEZ-COP",
    technicalMessage: "copOgrzewania = 0 — ogrzewanie nieelektryczne, bilans prądu sterowania nie liczony",
    field: "copOgrzewania",
  }
}
