/**
 * Ekran 22, Moduł 3 "Instalacja PV" — "Ochrona stringów (bezpieczniki, diody blokujące)"
 * (dawne 2.38, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md). Wzorzec D.
 *
 * Przepisane wg normy HD 60364-7-712:2016 (UNE-HD 60364-7-712:2017, "Sistemas de alimentación
 * solar fotovoltaica", docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf), §712.431-433 + Załącznik B.2
 * — patrz `calculator.ts` po uzasadnienie zmiany.
 */

export type OchronaStringowInput = {
  /** Prąd zwarciowy panelu w warunkach STC (Isc), z karty katalogowej [A]. 0 = jeszcze nie wpisano. */
  iscStcA: number
  /** Maksymalny prąd zabezpieczenia nadprądowego modułu (I_MOD_MAX_OCPR), z karty katalogowej
   *  wg EN 61730-1 [A]. 0 = jeszcze nie wpisano. */
  iModMaxOcprA: number
  /** Liczba stringów połączonych równolegle (Ns). 0 = jeszcze nie wpisano. */
  liczbaStringowRownoleglych: number
  /** Czy zainstalowane jest zabezpieczenie nadprądowe (bezpiecznik/wyłącznik) per string. */
  maZabezpieczeniaPerString: boolean
  /** Prąd znamionowy już wybranego bezpiecznika [A], do sprawdzenia czy mieści się w zakresie
   *  normy. null = nie sprawdzane (użytkownik jeszcze nie wybrał konkretnego bezpiecznika). */
  wybranyBezpiecznikA: number | null
}
