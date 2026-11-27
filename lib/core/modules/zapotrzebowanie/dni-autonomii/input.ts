/**
 * Ekran 7, Moduł 2 "Zapotrzebowanie energetyczne" — "Dni autonomii" (dawne 1.9,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D-lite.
 *
 * Wartość produkowana tu (dniAutonomii) docelowo zasila Moduł 4, Ekran 1 ("Dobór pojemności
 * baterii") jako auto-wypełnienie — to jeszcze nie zbudowane (brak współdzielonego stanu
 * projektu, `docs/memory.md`). Trzy dodatkowe pola tutaj są opcjonalne i służą wyłącznie do
 * podglądu na żywo szacunkowego wpływu suwaka na wielkość magazynu (żądanie źródła: "ekran
 * powinien pokazywać na żywo szacunkowy wpływ na wielkość/koszt magazynu") — reużywają wzoru
 * z Moduł 4/Ekran 1, nie duplikują go (wzorzec "echo").
 */

export type DniAutonomiiInput = {
  /**
   * Dni autonomii — liczba dni (także ułamkowa); typowe wartości 1/2/3/5/7 ze źródła są tylko podpowiedzią
   * (`OPCJE_DNI_AUTONOMII`), decyzja właściciela 26.11.2026 — pole liczbowe zamiast listy, łączone z liczbą projektu.
   * 0 = jeszcze nie wpisano.
   */
  dniAutonomii: number
  /** Opcjonalne — do podglądu wpływu na wielkość magazynu. Zapotrzebowanie dobowe [kWh]. 0 = pominięte. */
  zapotrzebowanieDoboweKwh: number
  /** Opcjonalne — sprawność falownika [%], 0–100. 0 = pominięte. */
  sprawnoscFalownikaPct: number
  /** Opcjonalne — DoD [%], 0–100. 0 = pominięte. */
  dodPct: number
}
