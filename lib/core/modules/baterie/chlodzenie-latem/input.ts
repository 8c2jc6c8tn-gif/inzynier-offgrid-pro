/**
 * Ekran 27, Moduł 4 "Magazyn energii / baterie" — "Chłodzenie baterii latem" (dawne 3.30,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D — sprawdzenie temperatury
 * ogniw względem dopuszczalnego zakresu pracy. Nie liczy wielkości przyspieszenia degradacji
 * (przykład źródła "degradacja przyspieszy o 30%" jest ilustracyjny — źródło nie podaje wzoru
 * wiążącego przekroczenie temperatury z wielkością przyspieszenia).
 */

export type ChlodzenieLatemInput = {
  /** Zmierzona/spodziewana temperatura ogniw [°C]. `null` = jeszcze nie wpisano. */
  temperaturaOgniwC: number | null
}
