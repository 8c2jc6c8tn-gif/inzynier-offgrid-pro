/**
 * Ekran 34, Moduł 4 "Magazyn energii / baterie" — "Matryca alarmów BMS i reakcje systemu"
 * (dawne 3.39, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec C — tabela referencyjna/
 * konfiguracyjna, ten sam kształt co M11 A10/B12 (`przechowywanie-recykling`). Ten ekran nie
 * ma kalkulatora — to czysta treść, dane 1:1 ze źródła.
 */

export type AlarmWiersz = { id: string; alarm: string; reakcja: string }

export const MATRYCA_ALARMOW: AlarmWiersz[] = [
  { id: "nadmierne-napiecie", alarm: "Nadmierne napięcie", reakcja: "Odłączenie ładowania" },
  { id: "podnapiecie", alarm: "Podnapięcie", reakcja: "Odłączenie obciążenia" },
  { id: "przegrzanie", alarm: "Przegrzanie", reakcja: "Ograniczenie prądu → awaryjne wyłączenie" },
  { id: "przeciazenie", alarm: "Przeciążenie", reakcja: "Ograniczenie prądu" },
  { id: "zwarcie", alarm: "Zwarcie", reakcja: "Awaryjne wyłączenie natychmiastowe" },
  { id: "awaria-czujnika", alarm: "Awaria czujnika", reakcja: "Ostrzeżenie" },
  { id: "rozjazd-ogniw", alarm: "Rozjazd ogniw", reakcja: "Ostrzeżenie → zalecenie balansowania" },
]

export const PRZYKLADOWY_KOMUNIKAT =
  'ALARM: Przegrzanie ogniwa #3 (52°C). BMS ograniczył prąd ładowania do 20A. Sprawdź wentylację komory.'
