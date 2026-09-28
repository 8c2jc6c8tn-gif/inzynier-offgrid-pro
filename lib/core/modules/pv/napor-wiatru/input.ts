/**
 * Ekran 6, Moduł 3 "Instalacja PV" — "Aerodynamika — napór wiatru i ssanie" (dawne 2.12,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzorzec D.
 *
 * Zbudowana siła naporu wiatru (`F = 0,5×ρ×v²×A×Cd`, wzór dany wprost) i — od 26.09.2026 —
 * balast projektowy przeciw oderwaniu wg PN-EN 1990 (EQU), z całą siłą F traktowaną zachowawczo
 * jako pionowa. Siła ssania od spodu jako osobna wartość i moment wywracający NIE zbudowane —
 * wymagają geometrii montażu (dźwignia od ziemi do środka parcia, typ konstrukcji), której
 * źródło nie podaje jako liczb.
 *
 * Uwaga o przykładzie źródła (Sekcja C): "przy 120 km/h siła 350 N" NIE odtwarza się dla
 * realnego panelu (~2 m²) przy Cd z podanego zakresu (1,2-1,5) — wymagałoby to A≈0,34-0,43 m²,
 * nierealistycznie małej powierzchni. Zweryfikowane niezależnie w Pythonie przed implementacją —
 * to rozbieżność w przykładzie źródła (ten sam rodzaj co M3/E17 mismatch), wzór wdrożony
 * dokładnie jak podany, nie wymuszony do dopasowania.
 */

export type NaporWiatruInput = {
  /** Prędkość wiatru referencyjna [m/s]. 0 = jeszcze nie wpisano. */
  predkoscWiatruMS: number
  /** Powierzchnia panelu [m²]. 0 = jeszcze nie wpisano. */
  powierzchniaM2: number
  /** Współczynnik oporu Cd, typowo 1,2-1,5 dla paneli. 0 = jeszcze nie wpisano. */
  cd: number
  /**
   * Planned ballast mass [kg] — optional (`null` = not entered, no comparison). Compared with the
   * design ballast per PN-EN 1990 (EQU); less than required = hard stop (source line 451, Ekran 6).
   */
  balastPlanowanyKg: number | null
  /**
   * Mass of panels and frame for the area A (without ballast) [kg] — from the datasheet or a scale,
   * never a default (D29). Stabilising action with γG,inf = 0,90; required ballast is on top of it.
   * `null` = not entered, ignored (on the safe side).
   */
  masaPaneliStelazaKg: number | null
}
