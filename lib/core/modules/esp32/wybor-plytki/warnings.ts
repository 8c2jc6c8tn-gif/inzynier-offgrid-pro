import type { Warning } from "@/lib/core/calc-result"

/** Żaden wariant ze źródła nie ma wszystkich zaznaczonych cech naraz — rekomendacja to płytki najbliższe. */
export function brakJednejPlytki(liczbaPotrzeb: number, pokryte: number): Warning {
  return {
    code: "ESP-PLYTKA-BRAK-JEDNEJ",
    level: "info",
    i18nKey: "ESP-PLYTKA-BRAK-JEDNEJ",
    params: { liczba: liczbaPotrzeb, pokryte },
    technicalMessage: `max(dopasowania) = ${pokryte} < liczba potrzeb = ${liczbaPotrzeb} (Tresc_Modul_9, Ekran 1, B)`,
  }
}

/** Zasilanie stałe bez zaznaczonej potrzeby — źródło nie wskazuje płytki domyślnej. */
export function bezWymagan(): Warning {
  return {
    code: "ESP-PLYTKA-BEZ-WYMAGAN",
    level: "info",
    i18nKey: "ESP-PLYTKA-BEZ-WYMAGAN",
    technicalMessage: "zasilanie = stale, brak zaznaczonych potrzeb — każdy wariant z listy B spełnia wymagania",
  }
}
