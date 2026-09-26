/**
 * Moduł 6, Ekran 2 "Zapotrzebowanie na C.O. i C.W.U." (dawne 5.2, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`,
 * Biblia §6.2). A: "straty ciepła (auto z Ekranu 1), liczba domowników (auto z Modułu 2)". B: "C.O. zmienia
 * się z temperaturą zewnętrzną; C.W.U. zależne od liczby osób (norma: ok. 50 l/osobę/dobę) i temperatury
 * zimnej wody". `null` = not entered.
 */
export type ZapotrzebowanieCoCwuInput = {
  /**
   * Space-heating heat per month [kWh/month] from M6/E1 (monthly mean temperatures), January first;
   * `null` = month not computed there. Empty/all-null = no months yet (C.W.U. still computed).
   */
  cieploCoMiesiaceKwh: (number | null)[]
  /** Household size — M2/E4 "Liczba domowników" or entered here. */
  liczbaOsob: number | null
  /** Hot water per person per day [l] — the source: "ok. 50 l/osobę/dobę". */
  cwuLitrowNaOsobeDoba: number | null
  /** Cold (mains/well) water temperature [°C] — fixed all year (assumption). */
  temperaturaZimnejWodyC: number | null
  /** Hot water temperature at the tap/tank outlet [°C] — the source gives no value. */
  temperaturaCwuC: number | null
  /** Optional: COP of the space-heating source (from E1) — electricity for C.O. */
  copCo: number | null
  /** Optional: COP of the hot-water source (electric heater = 1) — electricity for C.W.U. */
  copCwu: number | null
}
