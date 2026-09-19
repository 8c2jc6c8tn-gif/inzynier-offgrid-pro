/**
 * Moduł 3 "Instalacja PV" — "Zjawisko PID (degradacja indukowana napięciem)" (dawne 2.15/3.15,
 * docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md, linie 1536-1548). Wzorzec D.
 * Luka 2.15 znaleziona i domknięta natychmiast przy audycie GOD BOOK Część N (05.09.2026,
 * `docs/rejestr-pokrycia.md`) — dopiero teraz zbudowana.
 */

export type RyzykoPidInput = {
  /** Napięcie systemu DC względem ziemi (Voc panelu × liczba paneli w stringu) [V]. 0 = jeszcze nie wpisano. */
  napiecieDcV: number
  /** Wysoka wilgotność w miejscu montażu (źródło: "przy wilgotnej pogodzie jony sodu ze szkła migrują"). */
  wilgotnoscWysoka: boolean
}
