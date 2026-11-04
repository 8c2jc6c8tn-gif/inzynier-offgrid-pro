import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

/** Form validation: a value outside its allowed range. */
export function torsPozaZakresem(code: string, pole: string, wartosc: number, zakres: string): Warning {
  return ostrzezenie(code, "critical", `${pole} = ${wartosc} poza zakresem ${zakres}`, { zakres }, pole)
}

/** The sun path needs only coordinates and a month; PV energy needs tilt, azimuth, kWp and PR as well. */
export function bezDanychPv(): Warning {
  return ostrzezenie("TORS-BEZ-DANYCH-PV", "info", "bez nachylenia, azymutu, mocy i PR pokazuję sam tor słońca, bez energii PV")
}

/** No TMY: only the clear-sky direct-beam energy can be shown, not the typical day of the month. */
export function bezTmy(): Warning {
  return ostrzezenie("TORS-BEZ-TMY", "info", "bez danych pogodowych (TMY) pokazuję tylko energię przy czystym niebie z samego promieniowania bezpośredniego, bez typowego dnia miesiąca")
}

/** The sun does not rise above the horizon on the selected day at this latitude (polar night). */
export function sloncePodHoryzontem(): Warning {
  return ostrzezenie("TORS-SLONCE-POD-HORYZONTEM", "info", "w wybranym dniu słońce nie wschodzi nad horyzont na tej szerokości geograficznej", undefined, "miesiac")
}

/** Panels face away from the sun for the whole selected day: zero clear-sky beam energy. */
export function panelTylemDoSlonca(): Warning {
  return ostrzezenie("TORS-PANEL-TYLEM", "warning", "w wybranym dniu słońce świeci na panele od tyłu przez cały dzień — bezpośrednie promieniowanie na płaszczyznę wynosi zero", undefined, "azymutDeg")
}
