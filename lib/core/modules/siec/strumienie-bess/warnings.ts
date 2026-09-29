import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, field?: string, params?: Record<string, string | number>): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

/** 🟡 K13: contracted-power reduction is real only in C2x (and with exceedances). */
export function mocUmownaC1x(): Warning {
  return ostrzezenie("SIEC-BESS-MOC-C1X", "warning", "grupa=C1x, mocUmownaZlRok>0 (✏️ K13, 🔎B)", "mocUmownaZlRok")
}

/** ℹ️ Always: system services need an aggregator for small storage (🔎B). */
export function uslugiSystemowe(): Warning {
  return ostrzezenie("SIEC-BESS-USLUGI-SYSTEMOWE", "info", "usługi systemowe — tylko informacja (🔎B)")
}

/** ℹ️ A stream earns less per kWh than the storage wear costs. */
export function strumienStratny(strumien: "autokonsumpcja" | "arbitraz", zysk: number, koszt: number): Warning {
  const code = strumien === "autokonsumpcja" ? "SIEC-BESS-STRATNA-AUTOKONSUMPCJA" : "SIEC-BESS-STRATNY-ARBITRAZ"
  return ostrzezenie(code, "info", `${strumien}: zysk ${zysk} < koszt cyklu ${koszt}`, undefined, { zysk, koszt })
}

/** 🔴 Capacity-charge kWh must be a part of the discharged energy. */
export function mocowaPonadPrzeplyw(mocowa: number, przeplyw: number): Warning {
  return ostrzezenie("SIEC-BESS-MOCOWA-PONAD-PRZEPLYW", "critical", `mocowaKwhRok ${mocowa} > przepływ ${przeplyw}`, "mocowaKwhRok")
}
