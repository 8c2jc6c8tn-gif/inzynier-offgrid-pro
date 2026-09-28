/**
 * Ekran 27, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Czy mogę podłączyć urządzenie 12V
 * bezpośrednio?" (dawne 8.54, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md). Wzorzec D:
 * zakres napięcia urządzenia (znamionowe ± tolerancja) vs realny zakres napięcia akumulatora.
 */

export type Urzadzenie12vBezposrednioInput = {
  /** Napięcie znamionowe instalacji (akumulatora) [V]. 0 = jeszcze nie wybrano. */
  napiecieSystemuV: 0 | 12 | 24
  /** Napięcie znamionowe urządzenia [V]. 0 = jeszcze nie wpisano. */
  napiecieUrzadzeniaV: number
  /** Tolerancja napięcia urządzenia [±%] (z instrukcji/tabliczki). null = jeszcze nie wpisano. */
  tolerancjaPct: number | null
  /**
   * Maksymalne napięcie ładowania całej instalacji [V] — z ustawień regulatora/ładowarki (absorpcja,
   * a przy ołowiowym także wyrównywanie). Decyzja właściciela 28.09.2026: zamiast stałej. null = nie wpisano.
   */
  maksNapiecieLadowaniaV: number | null
  /** Urządzenie zasilane przez stabilizator/przetwornicę DC-DC, nie wprost z akumulatora. */
  przezStabilizator: boolean
}
