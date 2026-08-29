/**
 * Katalog domyślnych odbiorników krytycznych — Biblia Offgrid, dawne 1.1.
 * Nazwane stałe, zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 */

export type DefaultCriticalLoad = {
  id: string
  label: string
  /**
   * Domyślna moc [W] wg źródła. `null` gdy źródło nie podaje wartości — pole wymaga
   * ręcznego wpisania, nigdy nie zgadujemy (docs/standards/15-wspolpraca-z-ai.md, 15.7).
   */
  defaultPowerW: number | null
}

export const DEFAULT_CRITICAL_LOADS: DefaultCriticalLoad[] = [
  { id: "pompa-glebinowa", label: "Pompa głębinowa / hydrofor", defaultPowerW: 800 },
  { id: "przepompownia-sciekow", label: "Przepompownia ścieków", defaultPowerW: 400 },
  {
    id: "wentylacja-rekuperator",
    label: "Wentylacja (rekuperator)",
    defaultPowerW: 80,
  },
  { id: "router", label: "Router", defaultPowerW: 15 },
  { id: "monitoring-kamery", label: "Monitoring (kamery)", defaultPowerW: 20 },
  {
    id: "ogrzewanie",
    label: "Ogrzewanie",
    // Źródło (Biblia Offgrid, dawne 1.1) nie podaje domyślnej mocy dla tej kategorii —
    // w przeciwieństwie do pozostałych pięciu. Decyzja (2026-08-29): na razie ręczne
    // wpisywanie przez użytkownika. Do wrócenia w przyszłości: ewentualne automatyczne
    // pobieranie z danych budynku. Patrz docs/memory.md.
    defaultPowerW: null,
  },
]
