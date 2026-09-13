import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"

/**
 * Ekran 26, Moduł 5 "Okablowanie i zabezpieczenia" — "Optymalizacja trasy i kosztu kabla"
 * (dawne 4.33, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec B.
 */

export type TrasaInput = {
  /** Długość trasy [m]. 0 = jeszcze nie wpisano. */
  dlugoscTrasyM: number
  /** Przekrój rozważany dla tej trasy [mm²]. 0 = jeszcze nie wpisano. */
  przekrojMm2: number
  /** Koszt zakupu (kabel + osłony + robocizna) [zł]. 0 = jeszcze nie wpisano. */
  kosztZakupuZl: number
}

export type OptymalizacjaTrasyKablaInput = {
  /** Prąd roboczy obwodu [A] — wspólny dla obu tras (to ten sam obwód). 0 = jeszcze nie wpisano. */
  pradA: number
  /** Napięcie systemowe [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  material: Material
  sposobUlozenia: SposobUlozenia
  /** Temperatura otoczenia [°C]. null = jeszcze nie wpisano. */
  temperaturaOtoczeniaC: number | null
  /** Liczba kabli w wiązce. 0/1 = brak wiązki. */
  liczbaKabliWWiazce: number
  /** Dopuszczalny spadek napięcia [%]. 0 = jeszcze nie wpisano. */
  dopuszczalnySpadekNapieciaPct: number
  /** Cena energii elektrycznej [zł/kWh]. 0 = jeszcze nie wpisano. */
  cenaEnergiiZlZaKwh: number
  /** Horyzont porównania [lat] — domyślnie 10 w UI, edytowalny. 0 = jeszcze nie wpisano. */
  liczbaLat: number
  trasaA: TrasaInput
  trasaB: TrasaInput
}
