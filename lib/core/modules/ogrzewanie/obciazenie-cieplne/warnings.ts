import type { Warning } from "@/lib/core/calc-result"
import type { NazwaElementu } from "@/lib/core/nazwa-elementu"

export function wartoscUjemna(field: string, labelKey: string, value: number, element?: NazwaElementu): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey, ...element },
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function wartoscNiedodatnia(field: string, labelKey: string, value: number, element?: NazwaElementu): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { labelKey, ...element },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function wartoscPozaZakresem(field: string, labelKey: string, value: number, min: number, max: number, element?: NazwaElementu): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { labelKey, min, max, ...element },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

/** θi ≤ θe — no heating demand at design conditions, the input is almost certainly wrong. */
export function temperaturaWewnetrznaNieWyzsza(ti: number, te: number): Warning {
  return {
    code: "OC-TEMP-WEWN-NIE-WYZSZA",
    level: "critical",
    i18nKey: "OC-TEMP-WEWN-NIE-WYZSZA",
    params: { ti, te },
    technicalMessage: `temperaturaWewnetrznaC = ${ti} <= θe = ${te}`,
    field: "temperaturaWewnetrznaC",
  }
}

/** PN-EN 12831-1 not in the repo — thermal bridges and ground factors missing (result may be too low). */
export function bezMostkowIZyskow(): Warning {
  return {
    code: "OC-BEZ-PN-EN-12831",
    level: "warning",
    i18nKey: "OC-BEZ-PN-EN-12831",
    technicalMessage:
      "Σ U·A·ΔT + H_V·ΔT: bez mostków cieplnych, współczynników gruntowych, zysków i nadwyżki na nagrzewanie (PN-EN 12831-1 poza repo)",
  }
}

/** Monthly energy from monthly mean temperatures — exact only when outdoor air stays below θi all month. */
export function miesiaceZeSrednich(): Warning {
  return {
    code: "OC-MIESIACE-ZE-SREDNICH",
    level: "info",
    i18nKey: "OC-MIESIACE-ZE-SREDNICH",
    technicalMessage: "E_m = H·max(0, θi − θm)·24·d — średnia miesięczna zamiast godzin; bez zysków słonecznych i wewnętrznych",
  }
}
