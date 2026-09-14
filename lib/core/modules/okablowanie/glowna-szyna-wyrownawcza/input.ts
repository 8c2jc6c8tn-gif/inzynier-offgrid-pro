/**
 * Ekran 10, Moduł 5 "Okablowanie i zabezpieczenia" — "Główna Szyna Wyrównawcza (GSW)"
 * (dawne 4.9, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec E.
 */

export type GlownaSzynaWyrownawczaInput = {
  potwierdzoneIds: string[]
  /** Czy GSW jest (błędnie) używana jako punkt przyłączeniowy dla odbiorników. */
  uzywanaJakoPrzylaczeOdbiornikow: boolean
}
