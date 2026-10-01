/**
 * Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — Część 2A, ekran porównawczy "Alternatywne i uzupełniające
 * źródła ciepła" (dawne 5.32–5.36, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.27.6–6.27.10).
 * Wzorzec B: karta na każde źródło. Kocioł elektryczny (5.33) ma już własny ekran — tu tylko odsyłacz.
 */

export type ZrodloAlternatywne = "kominek" | "kociol-elektryczny" | "ir" | "maty" | "pcm"

export type AlternatywneZrodlaCieplaInput = {
  /** Wybrana karta; null = nie wybrano. */
  zrodlo: ZrodloAlternatywne | null
  /** Zapotrzebowanie domu na moc grzewczą w mroźny dzień [kW] (Ekran 2) — opcjonalne, do pokrycia %. 0 = nie wpisano. */
  zapotrzebowanieKw: number
  /** Kominek: moc nominalna [kW] — karta. */
  kominekMocKw: number
  /** Kominek: udział mocy oddawanej do wody przez płaszcz [%] — karta. */
  kominekDoWodyPct: number
  /** Kominek: jest zabezpieczenie przed przegrzaniem przy braku prądu (schładzanie grawitacyjne / wężownica schładzająca). */
  kominekZabezpieczenieBezPradu: boolean
  /** IR: moc panelu/paneli [W] — karta. */
  irMocW: number
  /** IR: godziny pracy na dobę [h]. */
  irGodzinNaDobe: number
  /** IR: planowane jako ogrzewanie podstawowe (nie strefowe/uzupełniające). */
  irJakoPodstawowe: boolean
  /** Maty kapilarne: moc jednostkowa przy danej temperaturze zasilania [W/m²] — karta. */
  matyMocWm2: number
  /** Maty kapilarne: powierzchnia aktywna [m²]. */
  matyPowierzchniaM2: number
  /** Maty na suficie pod nieizolowanym stropem. */
  matyStropNieizolowany: boolean
  /** PCM: objętość materiału [l]. */
  pcmObjetoscL: number
  /** PCM: gęstość [kg/l] — karta materiału. */
  pcmGestoscKgL: number
  /** PCM: ciepło topnienia [kJ/kg] — karta materiału. */
  pcmCieploTopnieniaKjKg: number
  /** Bufor wodny do porównania: użyteczna różnica temperatur [K] — opcjonalna; 0 = bez porównania. */
  buforDeltaTK: number
}
