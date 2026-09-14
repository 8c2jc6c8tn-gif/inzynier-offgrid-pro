import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
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
    message: `Największa gałąź odbiega od równego podziału o ${maxOdchylenieOdSredniejPct.toFixed(1)} pkt proc. Źródło nie podaje progu "bezpiecznego" odchylenia — jeśli rozpływ wygląda nierówno, rozważ szynę zbiorczą (gwiazda) z kablami o równej długości zamiast łączenia kaskadowego.`,
    technicalMessage: `maxOdchylenieOdSredniejPct=${maxOdchylenieOdSredniejPct.toFixed(2)}`,
  }
}
