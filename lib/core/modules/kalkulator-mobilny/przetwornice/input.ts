/**
 * Ekran 8, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Przetwornice — mode-switch po typie konwersji"
 * (scala dawne 8.9, 8.41, 8.42, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.9, §12.29, §12.30).
 * Wzorzec A. Sprawność, zapas mocy i krotność rozruchu wpisuje user (Dyrektywa #1).
 */
import type { TrybPrzetwornicy } from "./constants"

export type UrzadzenieFalownika = {
  nazwa: string
  /** Moc znamionowa [W]. */
  mocW: number
  /** Krotność prądu/mocy rozruchowej względem znamionowej (np. 3 = 3×); 0 = nie podano (liczone jak 1). */
  krotnoscRozruchu: number
}

export type PrzetwornicaInput = {
  tryb: TrybPrzetwornicy
  /** Napięcie akumulatora = wejście przetwornicy [V]. */
  napiecieAkumulatoraV: number
  /** Sprawność przetwornicy/falownika [%]. */
  sprawnoscPct: number
  /** Tryb "dcdc": napięcie urządzenia [V]. W trybie "usb" ignorowane (5 V). */
  napiecieUrzadzeniaV: number
  /** Tryby "usb"/"dcdc": moc urządzenia [W]. */
  mocUrzadzeniaW: number
  /** Tryby "usb"/"dcdc": prąd wyjściowy posiadanej przetwornicy/ładowarki [A]; 0 = nie sprawdzaj. */
  pradPrzetwornicyA: number
  /** Tryb "falownik": urządzenia 230 V pracujące jednocześnie. */
  urzadzenia: UrzadzenieFalownika[]
  /** Tryb "falownik": mnożnik zapasu mocy ciągłej (np. 1,5); 0 = jeszcze nie wpisano. */
  zapasMocy: number
  /** Tryb "falownik": moc ciągła posiadanego falownika [W]; 0 = nie sprawdzaj. */
  mocFalownikaW: number
  /** Tryb "falownik": moc szczytowa (rozruchowa) falownika z karty [W]; 0 = nie podano. */
  mocSzczytowaFalownikaW: number
}
