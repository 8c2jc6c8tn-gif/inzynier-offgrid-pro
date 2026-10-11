/**
 * Moduł 12 (tryb mobilny / mikroinstalacja, etap O2 `docs/tryb-mikroinstalacji-specyfikacja.md`): ładowanie akumulatora z regulatora MPPT
 * (albo hybrydy) z małej tablicy paneli — jaki prąd naprawdę popłynie do akumulatora, kto go ogranicza (panele, regulator czy akumulator)
 * i ile godzin trwa naładowanie od−do. Limity regulatora z katalogu urządzeń PV albo z karty, limit akumulatora z karty akumulatora —
 * silnik niczego nie zakłada; pole, którego użytkownik nie wpisał, to `null` (brak danych), nie wartość „typowa”.
 */
export type LadowanieZRegulatoraInput = {
  /** Łączna moc paneli podłączonych do regulatora [W] (1–4 panele: suma mocy znamionowych STC). */
  mocPaneliW: number | null
  /** Napięcie systemowe akumulatora [V]. */
  napiecieAkumulatoraV: number | null
  /** Pojemność akumulatora [Ah]; potrzebna do C-rate i czasu ładowania. */
  pojemnoscAh: number | null
  /** Maksymalny prąd ładowania akumulatora wg jego karty [A]; `null` = karta nie podaje / nie wpisano. */
  maksPradLadowaniaAkumulatoraA: number | null
  /** Maksymalny prąd ładowania regulatora [A] (katalog albo karta); `null` = brak. */
  regulatorPradMaxA: number | null
  /** Maksymalna moc wejścia PV regulatora przy tym napięciu akumulatora [W]; moc paneli powyżej jest obcinana. `null` = brak. */
  regulatorMocPvMaxW: number | null
  /** Sprawność przetwarzania regulatora [%] z karty; `null` = bez strat (górna granica prądu). */
  sprawnoscRegulatoraPct: number | null
  /** Stan naładowania na początku i na końcu ładowania [%]; oba potrzebne do czasu ładowania. */
  socOdPct: number | null
  socDoPct: number | null
}
