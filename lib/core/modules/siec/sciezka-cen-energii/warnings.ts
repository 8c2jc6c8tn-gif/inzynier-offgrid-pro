import type { Warning } from "@/lib/core/calc-result"

export function horyzontPozaZakresem(n: number, min: number, max: number): Warning {
  return {
    code: "SIEC-HORYZONT-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SIEC-HORYZONT-POZA-ZAKRESEM",
    params: { min, max },
    technicalMessage: `horyzontLat = ${n}, dozwolone ${min}–${max} (D40)`,
    field: "horyzontLat",
  }
}

export function kosztUjemny(v: number): Warning {
  return {
    code: "SIEC-KOSZT-UJEMNY",
    level: "critical",
    i18nKey: "SIEC-KOSZT-UJEMNY",
    technicalMessage: `kosztRocznyZl = ${v} < 0`,
    field: "kosztRocznyZl",
  }
}

export function suwakPozaLista(g: number): Warning {
  return {
    code: "SIEC-SUWAK-POZA-LISTA",
    level: "critical",
    i18nKey: "SIEC-SUWAK-POZA-LISTA",
    technicalMessage: `gProcent = ${g}, dozwolone −3 / 0 / +5 / +10 (D40)`,
    field: "gProcent",
  }
}

export function inflacjaNiepoprawna(v: number | null): Warning {
  return {
    code: "SIEC-INFLACJA-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "SIEC-INFLACJA-NIEPOPRAWNA",
    technicalMessage: `wlasnaInflacjaProcent = ${v} (oczekiwano liczby > −100)`,
    field: "wlasnaInflacjaProcent",
  }
}

/** The EU projection does not reach past its last point — no extrapolation. */
export function pozaProjekcjaUe(rokKoncowy: number, rokOstatni: number): Warning {
  return {
    code: "SIEC-POZA-PROJEKCJA-UE",
    level: "critical",
    i18nKey: "SIEC-POZA-PROJEKCJA-UE",
    params: { rokKoncowy, rokOstatni },
    technicalMessage: `rokBazowy + N = ${rokKoncowy} > ostatni punkt projekcji ${rokOstatni}`,
    field: "horyzontLat",
  }
}

/** Mandatory warning shown with the EU path (`03_M14` §4, "Ostrzeżenie widoczne przy wyborze ścieżki"). */
export function zalozeniaUe2019(): Warning {
  return {
    code: "SIEC-UE-ZALOZENIA-2019",
    level: "info",
    i18nKey: "SIEC-UE-ZALOZENIA-2019",
    technicalMessage: "REF2020: polityka z końca 2019 r., bez kryzysu 2021–2023, Fit for 55 i ETS2",
  }
}
