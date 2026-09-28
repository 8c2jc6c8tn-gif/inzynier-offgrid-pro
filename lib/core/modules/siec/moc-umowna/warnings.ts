import type { Warning } from "@/lib/core/calc-result"

export function brakStalej(): Warning {
  return {
    code: "SIEC-BRAK-SIECIOWASTALA",
    level: "warning",
    i18nKey: "SIEC-BRAK-SIECIOWASTALA",
    technicalMessage: "brak składnika stałego stawki sieciowej (dane ✅ ani faktura)",
    field: "stalaZlKwMiesWlasna",
  }
}

export function tylkoGrupaC(grupa: string): Warning {
  return {
    code: "SIEC-MOC-UMOWNA-TYLKO-C",
    level: "critical",
    i18nKey: "SIEC-MOC-UMOWNA-TYLKO-C",
    params: { grupa },
    technicalMessage: `grupa ${grupa} — przekroczenia mocy umownej liczone dla grup C`,
    field: "grupa",
  }
}

export function miesiacyNie12(n: number): Warning {
  return {
    code: "SIEC-MIESIACE-NIEPOPRAWNE",
    level: "critical",
    i18nKey: "SIEC-MIESIACE-NIEPOPRAWNE",
    technicalMessage: `miesiace.length = ${n}, oczekiwano 12`,
    field: "miesiace",
  }
}

/** Variant (a) without the 10 largest values: the 10 × max bound is used (upper estimate). */
export function gorneOszacowanie(miesiace: string): Warning {
  return {
    code: "SIEC-PRZEKROCZENIA-GORNE-OSZACOWANIE",
    level: "warning",
    i18nKey: "SIEC-PRZEKROCZENIA-GORNE-OSZACOWANIE",
    params: { miesiace },
    technicalMessage: `wariant suma10 bez 10 największych wartości w miesiącach: ${miesiace}`,
    field: "miesiace",
  }
}

export function niepelnyRok(n: number): Warning {
  return {
    code: "SIEC-NIEPELNY-ROK",
    level: "warning",
    i18nKey: "SIEC-NIEPELNY-ROK",
    params: { n },
    technicalMessage: `wpisano ${n} z 12 miesięcy`,
    field: "miesiace",
  }
}

/** Optimum searched only within the current group range (C1x ≤ 40 / C2x > 40 kW) — the fixed rate differs between them. */
export function optimumWGrupie(): Warning {
  return {
    code: "SIEC-OPTIMUM-W-GRUPIE",
    level: "info",
    i18nKey: "SIEC-OPTIMUM-W-GRUPIE",
    technicalMessage: "optymalizacja P_u w zakresie bieżącej grupy",
  }
}
