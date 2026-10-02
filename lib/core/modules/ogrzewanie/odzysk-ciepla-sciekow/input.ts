/**
 * Moduł 6, Część 2C — „Odzysk ciepła ze ścieków (Drain Water Heat Recovery)” (dawne 5.41, Biblia §6.27.15). Wymiennik
 * na pionie kanalizacyjnym oddaje ciepło spływającej wody (prysznic) zimnej wodzie zasilającej bojler. Ilość wody,
 * temperatury i sprawność wymiennika wpisuje user (Dyrektywa #1).
 */

export type OdzyskCieplaSciekowInput = {
  /** Woda spływająca przez wymiennik w tym samym czasie, gdy płynie zimna woda (prysznic) [l/dobę]. 0 = nie wpisano. */
  litryDoba: number
  /** Temperatura wody spływającej do odpływu [°C]; null = nie wpisano. */
  tSciekowC: number | null
  /** Temperatura zimnej wody z sieci/studni [°C]; null = nie wpisano. */
  tZimnejC: number | null
  /** Sprawność wymiennika [%] — karta produktu. 0 = nie wpisano. */
  sprawnoscPct: number
  /** Dni użytkowania w roku; 0 = nie wpisano (bez wyniku rocznego). */
  dniRok: number
  /** Roczne zapotrzebowanie na ciepło C.W.U. [kWh] (Ekran 2/17); 0 = nie wpisano. */
  cwuKwhRok: number
  /** COP/sprawność podgrzewacza C.W.U. — do przeliczenia ciepła na prąd; 0 = nie wpisano. */
  copPodgrzewacza: number
}
