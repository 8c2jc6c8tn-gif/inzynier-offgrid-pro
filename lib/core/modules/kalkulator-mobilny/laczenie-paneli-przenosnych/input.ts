/**
 * Ekran 10, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Łączenie paneli przenośnych"
 * (dawne 8.12, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.12). Wzorzec D.
 * Zgodność złączy i typów paneli; napięcie/prąd wobec limitów wejścia liczy E39
 * (`panel-do-stacji-zasilania`) — ten ekran do niego odsyła, nie duplikuje (jak E28/E42).
 */
export type TypPaneluPrzenosnego = "skladany" | "mata" | "powerbank-solarny"

export type ZlaczePaneli = "mc4" | "xt60" | "anderson" | "dc5521" | "usb" | "inne"

export type LaczeniePaneliPrzenosnychInput = {
  typ: TypPaneluPrzenosnego | null
  liczbaPaneli: number
  /** Czy wszystkie panele to ten sam model (ta sama moc, napięcie, prąd). null = nie odpowiedziano. */
  takieSame: boolean | null
  zlaczePaneli: ZlaczePaneli | null
  zlaczeWejscia: ZlaczePaneli | null
  /** Czy user ma przejściówkę/adapter między złączami. */
  maAdapter: boolean
}
