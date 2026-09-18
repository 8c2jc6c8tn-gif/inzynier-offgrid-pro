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

export function falownikZaSlaby(mocWybranaW: number, mocZalecanaW: number): Warning {
  return {
    code: "FALOWNIK-ZA-SLABY",
    level: "critical",
    i18nKey: "FALOWNIK-MOCY-ZA-SLABY",
    params: { wybrana: mocWybranaW, zalecana: Math.round(mocZalecanaW) },
    technicalMessage: `mocFalownikaWybranaW=${mocWybranaW} < mocFalownikaZalecanaW=${mocZalecanaW}`,
  }
}

export function falownikWystarczajacy(mocWybranaW: number, mocZalecanaW: number): Warning {
  return {
    code: "FALOWNIK-WYSTARCZAJACY",
    level: "info",
    i18nKey: "FALOWNIK-MOCY-WYSTARCZAJACY",
    params: { wybrana: mocWybranaW, zalecana: Math.round(mocZalecanaW) },
    technicalMessage: `mocFalownikaWybranaW=${mocWybranaW} >= mocFalownikaZalecanaW=${mocZalecanaW}`,
  }
}

export function rekomendacjaBezSprawdzenia(mocZalecanaW: number): Warning {
  return {
    code: "REKOMENDACJA-BEZ-SPRAWDZENIA",
    level: "info",
    i18nKey: "REKOMENDACJA-MOCY-FALOWNIKA",
    params: { zalecana: Math.round(mocZalecanaW) },
    technicalMessage: "mocFalownikaWybranaW nie podana — pokazana tylko rekomendacja",
  }
}
