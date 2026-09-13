/**
 * Ekran 15, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przed odwrotną polaryzacją"
 * (dawne 4.14, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec C, z elementem D.
 */

export type MiejsceObwodu = "bateria" | "panele" | "falownik"
export type TypOchrony = "brak" | "dioda-blokujaca" | "wylacznik-blokada-mechaniczna"

export type OchronaOdwrotnaPolaryzacjaInput = {
  /** Miejsce obwodu — informacyjnie, źródło nie podaje osobnej reguły per miejsce. */
  miejsceObwodu: MiejsceObwodu | null
  typOchrony: TypOchrony | null
}
