/**
 * Ekran 16, Moduł 5 "Okablowanie i zabezpieczenia" — "Wyłączniki RCD" (dawne 4.15,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type TypRcd = "AC" | "A" | "B"
export type CelOchrony = "osob" | "pozarowa"

export type WylacznikiRcdInput = {
  /** Czy falownik generuje składową stałą (typowe dla hybrydowych). */
  falownikHybrydowy: boolean
  /** Czy w obwodzie są odbiorniki z silnikami. */
  odbiornikiZSilnikami: boolean
  /** Zainstalowany typ RCD. null = jeszcze nie wybrano. */
  zainstalowanyTyp: TypRcd | null
  /** Cel ochrony tego obwodu — reguluje próg (30mA osoby / 300mA przeciwpożarowo). */
  celOchrony: CelOchrony
  /** Prąd różnicowy zainstalowanego RCD [mA]. 0 = jeszcze nie wpisano. */
  progMa: number
}
