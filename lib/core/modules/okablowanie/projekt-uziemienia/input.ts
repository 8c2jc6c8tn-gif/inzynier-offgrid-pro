/**
 * Ekran 9, Moduł 5 "Okablowanie i zabezpieczenia" — "Projekt uziemienia"
 * (dawne 4.8, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type CelUziemienia = "odgromowa" | "przeciwporazeniowa" | "czula-elektronika"

export type ProjektUziemieniaInput = {
  /** Rezystywność gruntu [Ω·m] (pomiar lub wartość orientacyjna dla typu gruntu). 0 = nie wpisano. */
  rezystywnoscGruntuOmM: number
  /** Długość pojedynczego pręta uziomowego [m]. 0 = nie wpisano. */
  dlugoscPretaM: number
  /** Średnica pręta uziomowego [mm]. 0 = nie wpisano. */
  srednicaPretaMm: number
  /** Cel uziemienia — determinuje docelową rezystancję (Sekcja B źródła). null = nie wybrano. */
  celUziemienia: CelUziemienia | null
}
