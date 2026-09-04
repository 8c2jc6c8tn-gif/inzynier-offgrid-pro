/**
 * Ekran 20, Moduł 4 "Magazyn energii / baterie" — "Komunikacja BMS — CAN/RS485/Modbus" (dawne
 * 3.22, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D — sprawdzenie zgodności
 * protokołów, bez cennika konwerterów (przykład źródła "ok. 150 zł" jest ilustracyjny, nie
 * ogólny cennik).
 */

export type KomunikacjaBmsInput = {
  /** Id protokołu BMS (z `PROTOKOLY`). "" = jeszcze nie wybrano. */
  protokolBms: string
  /** Id protokołu falownika/ładowarki. "" = jeszcze nie wybrano. */
  protokolFalownika: string
}
