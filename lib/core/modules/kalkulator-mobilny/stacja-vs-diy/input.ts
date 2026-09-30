/**
 * Ekran 34, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Solarny generator (stacja) vs zestaw DIY"
 * (dawne 8.61, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.49). Wzorzec B.
 * Ceny, pojemności i masy od usera — aplikacja nie ma bazy stacji ani cennika (Dyrektywa #1).
 */
export type StacjaVsDiyInput = {
  /** Cena gotowej stacji [zł]. */
  cenaStacjiZl: number
  /** Pojemność stacji podana przez producenta [Wh]. */
  pojemnoscStacjiWh: number
  /** Część pojemności stacji do wykorzystania [%] — z karty stacji; 100 gdy producent podaje już pojemność użyteczną. */
  uzytecznaStacjiPct: number
  /** Masa stacji [kg]; 0 = nie porównuj masy. */
  masaStacjiKg: number
  /** Łączna cena elementów zestawu DIY (akumulator, regulator, przetwornica, przewody, bezpieczniki) [zł]. */
  cenaDiyZl: number
  /** Pojemność akumulatora zestawu [Ah]. */
  pojemnoscDiyAh: number
  /** Napięcie akumulatora zestawu [V]. */
  napiecieDiyV: number
  /** Dopuszczalna głębokość rozładowania akumulatora zestawu [%] — z karty akumulatora. */
  dodDiyPct: number
  /** Masa zestawu [kg]; 0 = nie porównuj masy. */
  masaDiyKg: number
}
