/**
 * Ekran 17, Moduł 2 "Zapotrzebowanie energetyczne" — "Agregat prądotwórczy – definicja i logika
 * pracy" (ID Biblii 1.19/2.19 — funkcja 1.19 z `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_
 * Modulowa.md`, linie 503-521; zaplanowana jako osobny ekran D w Module 2 wg §20 Zasad UX, ale
 * nigdy nie przepisana do treści modułu — luka udokumentowana w `docs/memory.md` i
 * `docs/rejestr-pokrycia.md`, domykana tym ekranem). Wzorzec D.
 *
 * Deficyt energetyczny w najgorszym miesiącu (różnica produkcja PV − zapotrzebowanie) wpisywany
 * jest wprost przez użytkownika, nie wyprowadzany automatycznie — wymagałoby to gotowego
 * potoku danych z Modułu 1 (klimat) i Modułu 3 (produkcja PV), których integracja z tym
 * ekranem jest osobnym, nie rozpoczętym krokiem (ten sam wzorzec co inne ekrany tej sesji,
 * gdzie user wpisuje bezpośrednio zmierzoną/oszacowaną wartość zamiast czekać na pełną
 * integrację międzymodułową).
 */

export type AgregatPradotworczyInput = {
  /** Deficyt energetyczny w najgorszym miesiącu roku [kWh]. 0 = jeszcze nie wpisano. */
  deficytKwh: number
  /** Moc znamionowa agregatu [kW]. 0 = jeszcze nie wpisano. */
  mocAgregatuKw: number
  /** Średnie zużycie paliwa przy optymalnym obciążeniu [l/h]. 0 = jeszcze nie wpisano. */
  sredniZuzycieLH: number
  /** Cena paliwa [zł/l]. 0 = jeszcze nie wpisano. */
  cenaZaLitrZl: number
  /** Czy BMS ma wyjście sterujące do automatycznego startu agregatu. */
  maWyjscieSterujaceBms: boolean
}
