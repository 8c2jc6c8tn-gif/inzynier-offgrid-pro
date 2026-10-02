import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { labelKey: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

/** Uwaga serwisowa ze źródła — informacyjna, nie zmienia statusu (D13). */
export function czyszczeniePowloki(): Warning {
  return {
    code: "POWLOKA-AR-CZYSZCZENIE",
    level: "info",
    i18nKey: "POWLOKA-AR-CZYSZCZENIE",
    technicalMessage: "uwaga serwisowa źródła: powłoka AR brudzi się, mycie bez środków ściernych",
  }
}
