/**
 * Ekran dodatkowy, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Kocioł elektryczny —
 * porównanie kosztu z pompą ciepła" (dawne 5.33, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md,
 * Część 2A: Alternatywne źródła ciepła). Wzorzec D.
 */

export type KociolElektrycznyInput = {
  /** Zapotrzebowanie na ciepło do pokrycia [kWh]. 0 = jeszcze nie wpisano. */
  zapotrzebowanieCieplneKwh: number
  /** COP pompy ciepła przy aktualnej temperaturze — z krzywej COP pompy lub zmierzony. 0 = jeszcze nie wpisano. */
  copPompy: number
  /** Cena energii elektrycznej [zł/kWh]. 0 = jeszcze nie wpisano. */
  cenaZaKwhZl: number
}
