/**
 * Ekran 18, Moduł 5 "Okablowanie i zabezpieczenia" — "Monitorowanie izolacji (IMD)"
 * (dawne 4.17, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec C z elementem D —
 * ekran staje się aktywnym Doradcą TYLKO gdy układ jest typu IT (źródło: "jeśli Ekran 11 wykrył
 * układ IT"). Ten projekt nie wiąże jeszcze stanu między ekranami (brak "profilu sprzętu" dla
 * tego pola) — pytanie o typ układu jest tu zadawane wprost użytkownikowi.
 */

export type MonitorowanieIzolacjiImdInput = {
  /** Czy układ sieci jest typu IT (bez bezpośredniego uziemienia punktu neutralnego). */
  ukladIt: boolean
  /** Czy IMD jest już zainstalowany — tylko istotne, gdy ukladIt. */
  maZainstalowanyImd: boolean
  /** Próg alarmu IMD [kΩ] — tylko istotne, gdy ukladIt i maZainstalowanyImd. 0 = nie wpisano. */
  progAlarmuKOm: number
}
