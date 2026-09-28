import type { Warning } from "@/lib/core/calc-result"

export function lampaNiesprawna(nazwa: string, indeks: number): Warning {
  return {
    code: "OSW-LAMPA-NIESPRAWNA",
    level: "critical",
    i18nKey: "OSW-LAMPA-NIESPRAWNA",
    params: { nazwa },
    technicalMessage: `lampy[${indeks}].stan = niesprawna (Tresc_Modul_8, Ekran 7, C)`,
    field: `lampy.${indeks}`,
  }
}

export function lampaNietestowana(nazwa: string, indeks: number): Warning {
  return {
    code: "OSW-LAMPA-NIETESTOWANA",
    level: "warning",
    i18nKey: "OSW-LAMPA-NIETESTOWANA",
    params: { nazwa },
    technicalMessage: `lampy[${indeks}].stan = nietestowana — sprawność nieznana (Tresc_Modul_8, Ekran 7, B.1 okresowe testy)`,
    field: `lampy.${indeks}`,
  }
}

export function brakOswietleniaZewnetrznego(): Warning {
  return {
    code: "OSW-BRAK-ZEWNETRZNEGO",
    level: "info",
    i18nKey: "OSW-BRAK-ZEWNETRZNEGO",
    technicalMessage: "oswietlenieZewnetrzne = false (Tresc_Modul_8, Ekran 7, B.1)",
    field: "oswietlenieZewnetrzne",
  }
}
