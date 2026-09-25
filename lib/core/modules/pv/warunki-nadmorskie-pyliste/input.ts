/**
 * Ekran 25, Moduł 3 "Instalacja PV" — "Dobór paneli do warunków nadmorskich i pylistych"
 * (dawne 2.45, §3.45 `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 2317–2341;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 25). Wzorzec D — reguły doboru bez wzoru liczbowego.
 */

export type TypLokalizacji = "nadmorska" | "pylista" | "standardowa"

export type WarunkiNadmorskiePylisteInput = {
  /** `null` = jeszcze nie wybrano (źródło: docelowo auto z Modułu 1 — odległość od morza, typ terenu). */
  typLokalizacji: TypLokalizacji | null
  /** Wysoka wilgotność w miejscu montażu (podwyższone ryzyko PID). */
  wilgotnoscWysoka: boolean
  /** Panel ma certyfikat IEC 61701 (odporność na mgłę solną). */
  certyfikatIec61701: boolean
  /** Panel ma ramę anodowaną. */
  ramaAnodowana: boolean
  /** Złączki MC4 dedykowane do warunków morskich. */
  zlaczkiMorskie: boolean
  /** Panel ma certyfikat anty-PID. */
  certyfikatAntyPid: boolean
}
