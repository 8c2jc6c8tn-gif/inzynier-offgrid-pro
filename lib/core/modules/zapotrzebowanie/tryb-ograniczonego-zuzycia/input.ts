/**
 * Moduł 13, widżety „Tryb wakacyjny/nieobecności" (dawne 7.27) i „Tryb nocny — minimalne zużycie i cisza" (7.49), w wersji bez telemetrii:
 * z listy odbiorników Modułu 12 (dobowe zużycie każdego) i wyboru użytkownika, które odbiorniki mają zostać włączone, liczę zużycie
 * w trybie ograniczonym wobec normalnego. Aplikacja NIE ocenia, co jest krytyczne dla bezpieczeństwa (lodówka, alarm, pompa) —
 * to decyzja użytkownika, widoczna w wyniku.
 */
export type TrybOgraniczony = "wyjazd" | "noc"

export type OdbiornikTrybu = {
  id: string
  nazwa: string
  /** Dobowe zużycie odbiornika w normalnej pracy [Wh] (z listy Modułu 12). */
  zuzycieDobaWh: number
  /** Czy odbiornik zostaje włączony w trybie ograniczonym. */
  zostaje: boolean
}

export type TrybOgraniczonegoZuzyciaInput = {
  tryb: TrybOgraniczony
  odbiorniki: OdbiornikTrybu[]
  /** Tryb „wyjazd": liczba dób nieobecności (> 0). `null` = nie wpisano. */
  dniNieobecnosci: number | null
  /** Tryb „noc": długość nocnego okna ograniczenia [h] (0 < h ≤ 24). `null` = nie wpisano. */
  godzinNocy: number | null
  /** Opcjonalnie: energia użyteczna baterii [kWh] — daje, na ile dób/nocy wystarczy bez ładowania. `null` = nie wpisano. */
  pojemnoscUzytecznaKwh: number | null
}
