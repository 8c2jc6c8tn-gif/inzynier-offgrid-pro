/**
 * Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — Ekran 10 "Integracja z syreną, monitoringiem i służbami" (dawne 12.55;
 * docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Biblia v2.0 §8.13). Wzorzec D. Sprawdzenie konfiguracji
 * powiadomień; automatyczne wezwanie służb — „tylko za wcześniejszą, wyraźną zgodą użytkownika”. Flagi domyślnie `false`.
 */

export type PowiadomieniaAlarmoweInput = {
  maSyrene: boolean
  /** Liczba kontaktów alarmowych (użytkownik, rodzina, ochrona). null = nie wpisano. */
  liczbaKontaktow: number | null
  maKamery: boolean
  autoWezwanieSluzb: boolean
  /** Wcześniejsza, wyraźna zgoda użytkownika na automatyczne wezwanie służb. */
  zgodaNaWezwanieSluzb: boolean
}
