import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

/** Windows and doors are as large as (or larger than) the walls — the wall area would be zero or negative. */
export function otworyWiekszeNizScianyMo(otworyM2: number, scianyBruttoM2: number): Warning {
  return ostrzezenie("MOBIEKT-OTWORY-WIEKSZE-NIZ-SCIANY", "critical", `otwory ${otworyM2} m² ≥ ściany brutto ${scianyBruttoM2.toFixed(2)} m²`, { otwory: otworyM2, sciany: Math.round(scianyBruttoM2 * 100) / 100 }, "otworyM2")
}

/** A dimension or the opening area is negative / not positive where it must be. */
export function wymiarNiedodatniMo(pole: string, wartosc: number): Warning {
  return ostrzezenie("MOBIEKT-WYMIAR-NIEDODATNI", "critical", `${pole} = ${wartosc}, oczekiwano liczby > 0`, undefined, pole)
}

export function wartoscUjemnaMo(pole: string, wartosc: number): Warning {
  return ostrzezenie("MOBIEKT-WARTOSC-UJEMNA", "critical", `${pole} = ${wartosc}, oczekiwano liczby >= 0`, undefined, pole)
}

/** No month of use was chosen in the object profile — the energy for the months of use cannot be summed. */
export function brakMiesiecyUzytkowaniaMo(): Warning {
  return ostrzezenie("MOBIEKT-BRAK-MIESIECY-UZYTKOWANIA", "info", "w profilu obiektu nie zaznaczono miesięcy użytkowania — energia w miesiącach użytkowania nie została zsumowana")
}
