import type { TypElektroniki } from "./input"

/**
 * Typy, których brak startu w mrozie to twardy stop 🔴. Źródło (Ekran 19) daje 🔴 tylko BMS;
 * przetwornica/falownik dopisana decyzją właściciela projektu (28.09.2026, `rejestr-decyzji.md`
 * D31) — nie wystartuje = brak zasilania AC. Regulator ładowania celowo 🟡: brak ładowania przez
 * kilka godzin nie odcina zasilania, bateria dalej je daje.
 */
export const TYPY_KRYTYCZNE: readonly TypElektroniki[] = ["BMS", "przetwornica"]

export const jestKrytyczny = (typ: TypElektroniki): boolean => TYPY_KRYTYCZNE.includes(typ)
