/**
 * Ekran 20, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Ładowanie z alternatora vs paneli"
 * (scala dawne 8.40 i 8.43, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.28, §12.31).
 * Wzorzec B. Prąd ładowania, godziny słońca i sprawność wpisuje user (Dyrektywa #1).
 */
import type { TypAkumulatoraLadowanie } from "./constants"

export type AlternatorVsPaneleInput = {
  /** Napięcie nominalne akumulatora [V]. */
  napiecieV: number
  /** Godziny jazdy na dobę [h]. */
  godzinJazdy: number
  /** Prąd ładowania z alternatora [A] — prąd ładowarki DC/DC albo zmierzony. */
  pradLadowaniaA: number
  mocPaneluW: number
  /** Równoważne godziny pełnego słońca [h/dobę]. */
  godzinSlonca: number
  /** Sprawność toru panel → akumulator [%]. */
  sprawnoscToruPct: number
  /** Zapotrzebowanie na dobę [Wh]; 0 = bez porównania. */
  zapotrzebowanieWhDoba: number
  typAkumulatora: TypAkumulatoraLadowanie | null
  /** Czy między alternatorem a akumulatorem jest ładowarka DC/DC. null = nie wiadomo. */
  maDcDc: boolean | null
  /** Napięcie ładowania prostownika/alternatora/DC-DC [V]; 0 = nie sprawdzaj. */
  napiecieLadowaniaV: number
  /** Pojemność akumulatora [Ah]; 0 = bez czasu ładowania. */
  pojemnoscAh: number
  /** Stan naładowania na start [%]. */
  socStartPct: number
}
