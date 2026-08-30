/**
 * Ekran 30, Moduł 4 "Magazyn energii / baterie" — "Porównanie technologii magazynów"
 * (dawne 3.34, docs/domena/Tresc_Modul_4_Baterie_Ekrany.md).
 * Wzorzec B — karty porównawcze: opisowe zestawienie technologii, bez werdyktu
 * bezpieczeństwa (docs/standards/08-ui-ux.md, 8.2).
 */

export type PorownanieTechnologiiInput = {
  /**
   * Planowana pojemność nominalna magazynu [kWh]. Opcjonalne — jeśli nie podano,
   * porównanie liczone jest per 1 kWh zainstalowanej pojemności (baseline).
   */
  pojemnoscKwh?: number
}
