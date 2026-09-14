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

export function falownikZaSlaby(mocWybranaW: number, mocZalecanaW: number): Warning {
  return {
    code: "FALOWNIK-ZA-SLABY",
    level: "critical",
    message: `Wybrany falownik (${mocWybranaW} W) jest słabszy niż zalecana moc (${Math.round(mocZalecanaW)} W) — ryzyko częstych wyłączeń przy rozruchach silników.`,
    technicalMessage: `mocFalownikaWybranaW=${mocWybranaW} < mocFalownikaZalecanaW=${mocZalecanaW}`,
  }
}

export function falownikWystarczajacy(mocWybranaW: number, mocZalecanaW: number): Warning {
  return {
    code: "FALOWNIK-WYSTARCZAJACY",
    level: "info",
    message: `Wybrany falownik (${mocWybranaW} W) pokrywa zalecaną moc (${Math.round(mocZalecanaW)} W) z zapasem na rozruchy.`,
    technicalMessage: `mocFalownikaWybranaW=${mocWybranaW} >= mocFalownikaZalecanaW=${mocZalecanaW}`,
  }
}

export function rekomendacjaBezSprawdzenia(mocZalecanaW: number): Warning {
  return {
    code: "REKOMENDACJA-BEZ-SPRAWDZENIA",
    level: "info",
    message: `Zalecana moc ciągła falownika: ${Math.round(mocZalecanaW)} W (z zapasem na rozruchy silników, 5 s, do 200% przeciążalności).`,
    technicalMessage: "mocFalownikaWybranaW nie podana — pokazana tylko rekomendacja",
  }
}
