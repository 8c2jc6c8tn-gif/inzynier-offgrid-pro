import type { Warning } from "@/lib/core/calc-result"

/** Liczba paneli musi być całkowita — ułamek panelu nie istnieje. */
export function liczbaNiecalkowita(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIECALKOWITA`,
    level: "critical",
    i18nKey: "TVS-LICZBA-NIECALKOWITA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano liczby całkowitej`,
    field,
  }
}

/**
 * Źródło (sekcja B): tracker generuje dużo większy napór wiatru i wymaga solidniejszego
 * fundamentu. Źródło nie podaje wzoru zależności naporu od konstrukcji trackera (przykład
 * "1800 kg vs 450 kg" niewyprowadzalny) — informacja, bez liczby (Dyrektywa #1).
 */
export function naporWiatruTrackera(): Warning {
  return {
    code: "TVS-NAPOR-WIATRU-TRACKERA",
    level: "info",
    i18nKey: "TVS-NAPOR-WIATRU-TRACKERA",
    technicalMessage: "napór wiatru trackera nieliczony — źródło nie podaje wzoru",
  }
}

/** Za cenę trackera nie da się dokupić ani jednego panelu — porównanie traci sens ekonomiczny. */
export function zeroDodatkowychPaneli(): Warning {
  return {
    code: "TVS-ZERO-DODATKOWYCH-PANELI",
    level: "info",
    i18nKey: "TVS-ZERO-DODATKOWYCH-PANELI",
    technicalMessage: "kosztTrackeraZl < kosztPaneluZl — floor(koszt/cena) = 0",
  }
}
