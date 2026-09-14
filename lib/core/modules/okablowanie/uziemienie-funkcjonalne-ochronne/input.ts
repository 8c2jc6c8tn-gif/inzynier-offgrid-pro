/**
 * Ekran 11, Moduł 5 "Okablowanie i zabezpieczenia" — "Uziemienie funkcjonalne vs ochronne"
 * (dawne 4.10, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type UkladSieci = "TN-S" | "TN-C-S" | "TT" | "IT"

export type UziemienieFunkcjonalneOchronneInput = {
  /** Układ sieci — informacyjnie (kontekst instalacji, źródło nie wiąże go bezpośrednio z werdyktem). */
  ukladSieci: UkladSieci | null
  /** Czy falownik wymaga/pracuje w układzie izolowanym (bieguny DC nie uziemione) — wg dokumentacji producenta. Zastępuje "auto z bazy komponentów" ręcznym wyborem. */
  falownikWymagaUkladuIt: boolean
  /** Czy w tej instalacji biegun DC jest uziemiony. */
  biegunDcUziemiony: boolean
  /** Czy obudowa falownika (uziemienie ochronne) jest połączona z GSW. */
  obudowaPolaczonaZGsw: boolean
}
