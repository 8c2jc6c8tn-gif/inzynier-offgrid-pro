import type { Warning } from "@/lib/core/calc-result"

export function kosztUjemny(label: string): Warning {
  return {
    code: "WAMPIR-KOSZT-UJEMNY",
    level: "critical",
    i18nKey: "WAMPIR-KOSZT-UJEMNY",
    params: { label },
    technicalMessage: `kosztZakupuZl < 0 dla metody "${label}"`,
    field: "metody",
  }
}

export function oszczednoscNiepozytywna(label: string): Warning {
  return {
    code: "WAMPIR-OSZCZEDNOSC-NIGDY-NIE-ZWROCI",
    level: "info",
    i18nKey: "WAMPIR-OSZCZEDNOSC-NIGDY-NIE-ZWROCI",
    params: { label },
    technicalMessage: `rocznaOszczednoscZl <= 0 dla metody "${label}" — koszt się nie zwróci`,
    field: "metody",
  }
}
