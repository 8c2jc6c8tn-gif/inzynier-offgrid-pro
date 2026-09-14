/**
 * Ekran 2, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przeciwprzepięciowa (SPD)"
 * (dawne 4.5, 4.6, 4.7 + 2.47 z Modułu 3, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type OchronaPrzepieciowaSpdInput = {
  /** Napięcie robocze stringu PV (Voc max, zimowe) [V]. 0 = jeszcze nie wpisano. */
  vocMaxStringuV: number
  /** Czy budynek ma instalację odgromową. */
  maInstalacjeOdgromowa: boolean
  /** Odległość paneli od zwodu piorunochronu [m] — tylko gdy maInstalacjeOdgromowa. null = nie dotyczy/nie wpisano. */
  odlegloscOdZwoduM: number | null
  /** Czy zainstalowany jest SPD Typu 1 na wejściu do budynku — tylko gdy maInstalacjeOdgromowa. */
  maZainstalowanySpdTyp1: boolean
  /** Napięcie trwałej pracy (Uc) rozważanego SPD [V]. 0 = jeszcze nie wpisano. */
  ucSpdV: number
  /** Czy SPD jest uziemiony przez wspólną Główną Szynę Wyrównawczą (GSW). */
  uziemienieViaGsw: boolean
}
