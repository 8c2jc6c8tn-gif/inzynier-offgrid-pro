/**
 * Ekran 29, Moduł 5 "Okablowanie i zabezpieczenia" — "Pomiary i testy powykonawcze"
 * (dawne 4.40, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec E z progami liczbowymi.
 */

export type CelUziemienia = "odgromowa" | "ochronna"

export type PomiaryPowykonawczeInput = {
  ciagloscPotwierdzona: boolean
  /** Rezystancja izolacji [MΩ]. 0 = jeszcze nie zmierzono. */
  rezystancjaIzolacjiMohm: number
  celUziemienia: CelUziemienia
  /** Rezystancja uziemienia [Ω]. 0 = jeszcze nie zmierzono. */
  rezystancjaUziemieniaOhm: number
  /** Czas zadziałania RCD [s]. 0 = jeszcze nie zmierzono. */
  czasZadzialaniaRcdS: number
  testZwarciowyPotwierdzony: boolean
  termowizjaPotwierdzona: boolean
}
