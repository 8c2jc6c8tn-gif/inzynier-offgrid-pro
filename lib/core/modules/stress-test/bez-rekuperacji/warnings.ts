import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "REKU-SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "REKU-SPRAWNOSC-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscOdzyskuPct = ${value}, oczekiwano 0..100`,
    field: "sprawnoscOdzyskuPct",
  }
}

export function ryzykoZamarzniecia(tempZewn: number, tempGraniczna: number): Warning {
  return {
    code: "REKU-RYZYKO-ZAMARZNIECIA",
    level: "warning",
    i18nKey: "REKU-RYZYKO-ZAMARZNIECIA",
    params: { temp: tempZewn, granica: tempGraniczna },
    technicalMessage: `tempZewnC=${tempZewn} < tempZamarzaniaWymiennikaC=${tempGraniczna} (Tresc_Modul_7, Ekran 20, C)`,
    field: "tempZewnC",
  }
}

export function wilgotnoscIPlesn(): Warning {
  return {
    code: "REKU-WILGOTNOSC",
    level: "info",
    i18nKey: "REKU-WILGOTNOSC",
    technicalMessage: "wzrost wilgotności i ryzyko pleśni przy wyłączonej wentylacji — źródło bez wzoru, nieliczone",
  }
}
