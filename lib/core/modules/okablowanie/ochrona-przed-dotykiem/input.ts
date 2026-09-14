/**
 * Ekran 17, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przed dotykiem"
 * (dawne 4.16, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec C.
 *
 * "Lista wymaganych stopni IP wg miejsca montażu" (z treści źródłowej) NIE zbudowana — źródło
 * nie podaje tabeli miejsce→IP dla TEGO ekranu (w odróżnieniu od Ekranu 27, które taką tabelę
 * ma dla puszek połączeniowych). Zbudowany tylko checklist dwóch mechanizmów ochrony.
 */

export type OchronaPrzedDotykiemInput = {
  potwierdzoneIds: string[]
}
