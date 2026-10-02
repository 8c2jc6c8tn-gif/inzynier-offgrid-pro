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

export function procentPozaZakresem(pole: string, value: number): Warning {
  return {
    code: "STRING-PROCENT-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "STRING-PROCENT-POZA-ZAKRESEM",
    technicalMessage: `${pole} = ${value}, oczekiwano (0, 100]`,
    field: pole,
  }
}

export function stringWiekszyNizCalosc(string: number, calosc: number): Warning {
  return {
    code: "STRING-WIEKSZY-NIZ-CALOSC",
    level: "critical",
    i18nKey: "STRING-WIEKSZY-NIZ-CALOSC",
    technicalMessage: `produkcjaStringuKwhDoba = ${string} > produkcjaCalkowitaKwhDoba = ${calosc}`,
    field: "produkcjaStringuKwhDoba",
  }
}

export function deficytPoAwarii(deficyt: number): Warning {
  return {
    code: "STRING-DEFICYT",
    level: "warning",
    i18nKey: "STRING-DEFICYT",
    params: { deficyt: deficyt.toFixed(1) },
    technicalMessage: `deficytDobowyKwh = ${deficyt} > 0 po awarii stringu (Tresc_Modul_7, Ekran 26, C)`,
    field: "produkcjaStringuKwhDoba",
  }
}

export function dniNaBaterii(dni: number): Warning {
  return {
    code: "STRING-DNI-NA-BATERII",
    level: "info",
    i18nKey: "STRING-DNI-NA-BATERII",
    params: { dni: dni.toFixed(1) },
    technicalMessage: `dniNaBaterii = ${dni}`,
    field: "pojemnoscBateriiKwh",
  }
}

export function kaskadaNieliczona(): Warning {
  return {
    code: "STRING-KASKADA",
    level: "info",
    i18nKey: "STRING-KASKADA",
    technicalMessage: "ryzyko kaskadowej awarii (przeciążenie pozostałych stringów) — źródło bez wzoru, nieliczone",
  }
}
