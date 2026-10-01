import type { Warning } from "@/lib/core/calc-result"

/** Source 🟡 (Ekran 20, cross-ref E12): natural ventilation in a new, airtight house leads to mould. */
export function naturalnaWSzczelnymDomu(): Warning {
  return {
    code: "WPOR-NATURALNA-SZCZELNY-DOM",
    level: "warning",
    i18nKey: "WPOR-NATURALNA-SZCZELNY-DOM",
    technicalMessage: "szczelnyDom = true — wentylacja grawitacyjna w szczelnym budynku nie zapewnia wymiany powietrza (pleśń)",
    field: "szczelnyDom",
  }
}

/** Mechanical ventilation uses more electricity on fans than it saves on heating. */
export function mechanicznaNieOszczedza(nettoKwh: number): Warning {
  return {
    code: "WPOR-MECHANICZNA-NIE-OSZCZEDZA",
    level: "warning",
    i18nKey: "WPOR-MECHANICZNA-NIE-OSZCZEDZA",
    params: { netto: nettoKwh },
    technicalMessage: `bilans prądu mechanicznej = ${nettoKwh} kWh/doba <= 0`,
    field: "mocWentylatorowW",
  }
}

/** Non-electric heating: heat and fan electricity are shown separately, no net balance. */
export function bezCopWentylacja(): Warning {
  return {
    code: "WPOR-BEZ-COP",
    level: "info",
    i18nKey: "WPOR-BEZ-COP",
    technicalMessage: "copOgrzewania = 0 — bilans prądu nie liczony",
    field: "copOgrzewania",
  }
}
