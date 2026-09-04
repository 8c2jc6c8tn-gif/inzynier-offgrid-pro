/**
 * Ekran 23, Moduł 4 "Magazyn energii / baterie" — "Analiza opłacalności magazynu (True Cost of
 * Storage)" (dawne 3.25, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B; wchłania też
 * dawną funkcję 12.12 z Modułu AI, uznaną w źródle za duplikat). Wzorzec D.
 */

export type OplacalnoscMagazynuInput = {
  /** Cena zakupu baterii [zł]. 0 = jeszcze nie wpisano. */
  cenaBateriiZl: number
  /** Pojemność użyteczna [kWh]. 0 = jeszcze nie wpisano. */
  pojemnoscUzytecznaKwh: number
  /** Liczba cykli życia przy wybranym DoD (np. z karty katalogowej lub Ekranu 30). 0 = jeszcze nie wpisano. */
  liczbaCykli: number
  /** Sprawność magazynu [%]. 0 = jeszcze nie wpisano. */
  sprawnoscPct: number
  /** Koszt alternatywy (agregat/sieć) [zł/kWh]. `null` = nie podano (porównanie pominięte). */
  kosztAlternatywyZlZaKwh: number | null
}
