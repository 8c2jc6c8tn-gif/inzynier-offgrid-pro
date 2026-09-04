/**
 * Ekran 2, Moduł 2 "Zapotrzebowanie energetyczne" — "Inteligentny bojler C.W.U." (dawne 1.2,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D.
 *
 * Źródło nie podaje wzrostu temperatury (ΔT) wody jako liczby — przykład Sekcji C (200l, 4 osoby
 * → ok. 8 kWh) odpowiada ΔT≈35K, ale to NIE jest jawnie stwierdzona dana źródła (zweryfikowane
 * niezależnie w Pythonie), więc nie jest przyjmowana jako domyślna wartość — pole wymaga ręcznego
 * wpisania (ta sama zasada co "ogrzewanie" bez domyślnej mocy w Ekranie 1, Moduł 2).
 */

export type BojlerCwuInput = {
  /** Dobowe zapotrzebowanie na C.W.U. [l/dobę]. Docelowo auto z Ekranu 4 (liczba domowników × 50–70 l/osobę). 0 = jeszcze nie wpisano. */
  wolumenCwuLDoba: number
  /** Wzrost temperatury wody (zimna → C.W.U.) [K]. Źródło nie podaje wartości — wpisz własną. 0 = jeszcze nie wpisano. */
  deltaTK: number
  /** Moc grzałki bojlera [kW]. 0 = jeszcze nie wpisano. */
  mocGrzalkiKw: number
  /** Pojemność zbiornika bojlera [l] — do sprawdzenia, czy starcza na jedno dobowe ładowanie. 0 = jeszcze nie wpisano. */
  pojemnoscBojleraL: number
}
