import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

/**
 * Informacyjne — źródło NIE podaje progu %, od którego rozpływ jest "niebezpieczny" (oba
 * przykłady Sekcji C są ilustracyjne, nie normatywne progi) — nie wymyślamy własnego. Pokazujemy
 * policzone odchylenie wprost, użytkownik ocenia sam, ewentualnie w kontekście reszty instalacji.
 */
export function rozkladInfo(maxOdchylenieOdSredniejPct: number): Warning {
  return {
    code: "ROZKLAD-PRADU",
    level: "info",
    i18nKey: "ROZKLAD-PRADU",
    params: { odchylenie: maxOdchylenieOdSredniejPct.toFixed(1) },
    technicalMessage: `maxOdchylenieOdSredniejPct=${maxOdchylenieOdSredniejPct.toFixed(2)}`,
  }
}
