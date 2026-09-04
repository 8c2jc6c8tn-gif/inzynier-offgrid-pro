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
