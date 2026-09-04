/**
 * Standardowa konstrukcja panelu PV: 3 sekcje ogniw, każda chroniona osobną diodą bocznikującą
 * (bypass diode) — fakt konstrukcyjny (typowy panel 60/72-ogniwowy), nie wymyślony współczynnik.
 * Zacienienie choćby jednej komórki w sekcji uruchamia diodę dla całej sekcji, obniżając napięcie
 * panelu o 1/3 przy zbliżonym prądzie — stąd strata mocy panelu ≈ (sekcje zacienione / 3) × 100%.
 * Odtwarza wartości źródła: 1 sekcja → 33% (dokładnie 33,3%), 2 sekcje → 66% (dokładnie 66,7%)
 * (docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Ekran 13, Sekcja C) — różnica ostatniej cyfry to
 * zaokrąglenie źródła do pełnych procentów, nie rozbieżność formuły.
 */
export const LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH = 3

export const MAKS_LICZBA_ZACIENIONYCH_SEKCJI = 3
