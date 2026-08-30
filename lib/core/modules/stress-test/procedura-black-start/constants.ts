/**
 * Ekran 5, Moduł 7 "Stress-test zimowy" — "Procedura Black Start" (dawne 6.5,
 * docs/domena/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec E — checklist weryfikacyjna, sekwencja
 * musi być wykonana w podanej kolejności (docs/standards/08-ui-ux.md, 8.2).
 */

export type ChecklistItem = {
  id: string
  krok: string
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "uruchom-agregat", krok: "Uruchom agregat, poczekaj na stabilne napięcie." },
  {
    id: "podlacz-do-ladowarki",
    krok: "Podłącz agregat do ładowarki/MPPT (lub bezpośrednio do falownika, jeśli ma wejście AC).",
  },
  { id: "wybudz-bms", krok: "Wybudź BMS (jeśli w trybie uśpienia)." },
  { id: "naladuj-baterie", krok: "Naładuj baterię do minimalnego poziomu (np. 20%)." },
  { id: "wlacz-falownik", krok: "Włącz falownik, załączaj stopniowo systemy krytyczne." },
]

export const OSTRZEZENIA_STALE = [
  "Nie podłączaj agregatu bezpośrednio do baterii bez ładowarki — uszkodzisz ogniwa!",
]
