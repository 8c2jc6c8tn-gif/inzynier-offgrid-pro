/**
 * Ekran 13, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Dystrybucja ciepła — wybór systemu"
 * (scala dawne 5.13, 5.17, 5.18; docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.13, §6.17,
 * §6.18). Wzorzec A z przełącznikiem trybu.
 */

export type ZrodloCiepla = "pompa-ciepla" | "inne"

export type SystemDystrybucji = "podlogowe" | "grzejniki-niskotemperaturowe" | "grzejniki-standardowe"

export type DystrybucjaCieplaInput = {
  /** null = not chosen yet. */
  zrodloCiepla: ZrodloCiepla | null
  /** null = not chosen yet. */
  system: SystemDystrybucji | null
  /** Roczne zapotrzebowanie na ciepło do ogrzewania [kWh/rok] (Ekran 2) — opcjonalne; 0 = nie wpisano. */
  cieploRocznieKwh: number
  /** COP pompy przy temperaturze zasilania wybranego systemu (karta pompy) — opcjonalne; 0 = nie wpisano. */
  copSystemu: number
  /** COP tej samej pompy przy temperaturze zasilania grzejników standardowych (karta) — opcjonalne; 0 = nie wpisano. */
  copOdniesienia: number
  /** Dopłata za wybrany system względem grzejników standardowych [zł] — opcjonalna; 0 = nie wpisano. */
  doplataZl: number
  /** Cena prądu [zł/kWh] — opcjonalna; 0 = nie wpisano. */
  cenaPraduZlKwh: number
}
