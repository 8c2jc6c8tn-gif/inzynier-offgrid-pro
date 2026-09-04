import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function commonPortNiewystarczajacy(bmsA: number, falownikA: number): Warning {
  return {
    code: "COMMON-PORT-NIEWYSTARCZAJACY",
    level: "critical",
    message: `Common Port BMS (${bmsA} A) jest poniżej szczytowego prądu rozruchu falownika (${falownikA} A) — wybierz wersję Separate Port.`,
    technicalMessage: `bmsCommonPortA = ${bmsA} < falownikPradRozruchuA = ${falownikA}`,
  }
}

export function commonPortWystarczajacy(bmsA: number, falownikA: number): Warning {
  return {
    code: "COMMON-PORT-WYSTARCZAJACY",
    level: "info",
    message: `Common Port BMS (${bmsA} A) wytrzymuje szczytowy prąd rozruchu falownika (${falownikA} A).`,
    technicalMessage: `bmsCommonPortA = ${bmsA} >= falownikPradRozruchuA = ${falownikA}`,
  }
}
