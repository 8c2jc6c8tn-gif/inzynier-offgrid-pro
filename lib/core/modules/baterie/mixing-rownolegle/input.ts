/**
 * Ekran 18, Moduł 4 "Magazyn energii / baterie" — "Łączenie równoległe różnych baterii
 * (Mixing)" (dawne 3.20, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D — Doradca
 * z werdyktem bezpieczeństwa. Sekcja A wymienia też "chemia" i "wiek/SoH" jako parametry, ale
 * SoH i wiek nie wchodzą do żadnego wzoru w źródle (Sekcja B liczy wyłącznie z ΔV i rezystancji
 * wewnętrznej, którą SoH/wiek już pośrednio zmieniają) — nie dodane jako osobne, niepotrzebne
 * pola. Chemia zostaje jako pole (potrzebne do twardego stopu "mieszanie różnych chemii").
 */

export type MixingRownoleglInput = {
  /** Id chemii pierwszej baterii (z katalogu Ekranu 30 — `BATTERY_TECHNOLOGIES`), "" = jeszcze nie wybrano. */
  chemia1: string
  /** Id chemii drugiej baterii. */
  chemia2: string
  /** Napięcie nominalne (spoczynkowe) pierwszej baterii [V]. 0 = jeszcze nie wpisano. */
  napiecieNominalneV1: number
  /** Napięcie nominalne (spoczynkowe) drugiej baterii [V]. 0 = jeszcze nie wpisano. */
  napiecieNominalneV2: number
  /** Rezystancja wewnętrzna pierwszej baterii [mΩ]. 0 = jeszcze nie wpisano. */
  rezystancjaWewnetrznaMOhm1: number
  /** Rezystancja wewnętrzna drugiej baterii [mΩ]. 0 = jeszcze nie wpisano. */
  rezystancjaWewnetrznaMOhm2: number
}
