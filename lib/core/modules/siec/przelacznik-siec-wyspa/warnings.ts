import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(field ? { field } : {}) }
}

/** 🔴 Hard stop 1: island inverter / generator can energise the DSO line (no switch with 0 and interlock). */
export function backfeed(): Warning {
  return ostrzezenie("SIEC-BACKFEED", "critical", "przelacznik=brak-lub-bez-blokady (twardy stop 1, §6.1)", "przelacznik")
}

/** 🟡 Neutral not switched (or unknown) — must follow the network system; detail 🔎 HD 60364-5-551. */
export function przelacznikN(): Warning {
  return ostrzezenie("SIEC-PRZELACZNIK-N", "warning", "przelaczaN!=true — faza i N zgodnie z układem sieci (🔎)", "przelaczaN")
}

/** ℹ️ Switch with 0 and mechanical interlock (or ATS with electrical + mechanical interlock). */
export function przelacznikOk(): Warning {
  return ostrzezenie("SIEC-PRZELACZNIK-OK", "info", "przelacznik z pozycją 0 i blokadą", "przelacznik")
}

/** ℹ️ Parallel operation = generating source connected to the grid: DSO notification + NC RfG (🔎A). */
export function pracaRownolegla(): Warning {
  return ostrzezenie("SIEC-TCO-PRACA-ROWNOLEGLA", "info", "trybPracy=rownolegle (§6.2)", "trybPracy")
}

/** 🟡 Parallel operation declared as not notified to the DSO. */
export function rownolegleBezZgloszenia(): Warning {
  return ostrzezenie("SIEC-ROWNOLEGLE-BEZ-ZGLOSZENIA", "warning", "trybPracy=rownolegle, zgloszenieOsd=false", "zgloszenieOsd")
}

/** ℹ️ Always: the switch detail requires HD 60364-5-551, which is not in the repo (D47). */
export function normaBrak(): Warning {
  return ostrzezenie("SIEC-PRZELACZNIK-NORMA-BRAK", "info", "HD 60364-5-551 not in repo (docs/normy-brakujace.md)")
}
