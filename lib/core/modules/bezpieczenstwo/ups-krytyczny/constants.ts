/**
 * Katalog domyślnych urządzeń krytycznych do podtrzymania UPS — Sekcja A źródła
 * (docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Ekran 6). Źródło NIE podaje mocy żadnego
 * z tych urządzeń — wszystkie pola wymagają ręcznego wpisania (docs/standards/15, 15.7),
 * w przeciwieństwie do np. `systemy-podtrzymania-zycia` (M2/E1), gdzie część miała domyślne W.
 */

export type UrzadzenieKrytyczneDefault = {
  id: string
  label: string
}

export const DOMYSLNE_URZADZENIA_KRYTYCZNE: UrzadzenieKrytyczneDefault[] = [
  { id: "esp32", label: "ESP32 (kontroler)" },
  { id: "router", label: "Router" },
  { id: "silowniki", label: "Siłowniki drzwi/zamki elektromagnetyczne" },
  { id: "centrala-pozarowa", label: "Centrala sygnalizacji pożaru" },
  { id: "oswietlenie-awaryjne", label: "Oświetlenie awaryjne" },
]

/**
 * Shedding order of 12.54, 1:1 from the source (Ekran 6, Sekcja B punkt 2): „najpierw centrala pożarowa i ESP32,
 * potem router, na końcu siłowniki” — the order in which loads are KEPT; Sekcja C confirms siłowniki go first
 * („Wyłączono zasilanie siłowników, żeby centrala pożarowa i ESP32 działały jak najdłużej”). Emergency lighting is
 * in the device list (Sekcja A) but not in this order — no default, the user chooses (Dyrektywa #1).
 */
export const PRIORYTET_ZRODLA: Record<string, 1 | 2 | 3> = {
  "centrala-pozarowa": 1,
  esp32: 1,
  router: 2,
  silowniki: 3,
}
