/**
 * Ekran 4, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Mam akumulator — co mogę podłączyć?"
 * (dawne 8.4, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.4). Wzorzec D.
 */

export type ChemiaAkumulatora = "agm" | "lifepo4" | "kwasowy"

export type UrzadzenieDoPodlaczenia = {
  nazwa: string
  /** Moc urządzenia [W] — zawsze od usera (D33: przykładowe moce to tylko podpowiedź). 0 = nie wpisano. */
  mocW: number
}

export type MamAkumulatorInput = {
  /** null = not chosen yet. Chemistry only drives the DoD hint — DoD itself is entered by the user. */
  chemia: ChemiaAkumulatora | null
  pojemnoscAh: number
  napiecieV: number
  /** Dopuszczalna głębokość rozładowania [%] — od usera (Dyrektywa #1). */
  dodPct: number
  /** Sprawność przetwornicy [%]; 100 = odbiorniki DC wprost z akumulatora. */
  sprawnoscPct: number
  /** Maksymalny prąd ciągły akumulatora/BMS [A] — opcjonalny, z karty; 0 = nie podano (bez oceny prądu). */
  maksPradA: number
  urzadzenia: UrzadzenieDoPodlaczenia[]
}
