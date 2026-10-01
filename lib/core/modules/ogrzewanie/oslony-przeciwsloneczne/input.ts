/**
 * Ekran 19, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Ochrona przed przegrzaniem latem (solar
 * shading)" (dawne 5.25, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.25). Wzorzec D —
 * zbudowana tylko część geometryczna (stały okap nad oknem południowym), patrz kalkulator.
 */

export type OslonyPrzeciwsloneczneInput = {
  /** Szerokość geograficzna [°N]; null = nie wpisano. */
  szerokoscDeg: number | null
  /** Wysięg okapu od ściany [m]. 0 = nie wpisano. */
  wysiegM: number
  /** Odstęp od spodu okapu do górnej krawędzi okna [m] (0 = okap tuż nad oknem). */
  odstepM: number
  /** Wysokość okna (przeszklenia) [m]. 0 = nie wpisano. */
  wysokoscOknaM: number
}
