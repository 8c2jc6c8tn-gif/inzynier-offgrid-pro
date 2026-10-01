import type { Warning } from "@/lib/core/calc-result"

/** 🔴 Biblia §12.31: charging voltage above the window for the battery type destroys the cells. */
export function napiecieZaWysokie(napiecieV: number, maxV: number): Warning {
  return {
    code: "AL-NAPIECIE-ZA-WYSOKIE",
    level: "critical",
    i18nKey: "AL-NAPIECIE-ZA-WYSOKIE",
    params: { napiecie: napiecieV, max: maxV },
    technicalMessage: `napiecieLadowaniaV=${napiecieV} > ${maxV} (Biblia §12.31)`,
    field: "napiecieLadowaniaV",
  }
}

/** 🟡 Below the window the battery never reaches full charge. */
export function napiecieZaNiskie(napiecieV: number, minV: number): Warning {
  return {
    code: "AL-NAPIECIE-ZA-NISKIE",
    level: "warning",
    i18nKey: "AL-NAPIECIE-ZA-NISKIE",
    params: { napiecie: napiecieV, min: minV },
    technicalMessage: `napiecieLadowaniaV=${napiecieV} < ${minV}`,
    field: "napiecieLadowaniaV",
  }
}

/** 🟡 Biblia §12.28: "Alternator nie naładuje LiFePO4 do pełna bez przetwornicy DC/DC." */
export function lifepo4BezDcDc(): Warning {
  return {
    code: "AL-LIFEPO4-BEZ-DCDC",
    level: "warning",
    i18nKey: "AL-LIFEPO4-BEZ-DCDC",
    technicalMessage: "typAkumulatora=lifepo4, maDcDc=false (Biblia §12.28)",
    field: "maDcDc",
  }
}

/** 🟡 Both sources together do not cover the daily demand. */
export function brakPokrycia(brakWh: number): Warning {
  return {
    code: "AL-BRAK-POKRYCIA",
    level: "warning",
    i18nKey: "AL-BRAK-POKRYCIA",
    params: { wh: Math.round(brakWh) },
    technicalMessage: `zapotrzebowanie - suma = ${brakWh.toFixed(0)} Wh`,
    field: "zapotrzebowanieWhDoba",
  }
}
