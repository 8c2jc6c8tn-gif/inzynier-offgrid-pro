/**
 * Ekran 29, Moduł 4 "Magazyn energii / baterie" — "Detekcja doziemienia (Ground Fault & IMD)"
 * (dawne 3.32, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D — sprawdzenie
 * obecności zabezpieczenia (IMD lub różnicówka DC), bez symulacji konkretnego scenariusza
 * przebicia (przykład Sekcji C jest opisowy, nie liczbowy).
 */

export type DetekcjaDoziemieniaInput = {
  maMonitorIzolacji: boolean
  maRoznicowkeDc: boolean
}
