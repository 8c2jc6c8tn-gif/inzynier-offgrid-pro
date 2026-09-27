/**
 * Ekran 9, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Ochrona przed rozładowaniem akumulatora"
 * (dawne 8.11, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md). Wzorzec D: dobór progu dozownika
 * napięcia (LVD, low voltage disconnect) i twardy stop dla akumulatora kwasowego/AGM bez ochrony.
 */

export type ChemiaMalegoAkumulatora = "AGM" | "kwasowy" | "LiFePO4"

export type OchronaPrzedRozladowaniemInput = {
  /** Chemia akumulatora. null = jeszcze nie wybrano. */
  chemia: ChemiaMalegoAkumulatora | null
  /** Napięcie znamionowe akumulatora [V]. 0 = jeszcze nie wybrano. */
  napiecieZnamionoweV: 0 | 12 | 24 | 48
  /** Czy w instalacji jest dozownik napięcia (LVD) odłączający odbiornik. */
  maDozownik: boolean
  /** Czy odbiornik ma własne zabezpieczenie przed zbyt niskim napięciem (np. lodówka z odcięciem). */
  odbiornikMaWlasneZabezpieczenie: boolean
}
