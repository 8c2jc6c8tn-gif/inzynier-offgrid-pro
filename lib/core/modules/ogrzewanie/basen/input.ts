/**
 * Moduł 6, Część 2C — „Pompa ciepła: tryb ogrzewania basenu” (dawne 5.48, Biblia §6.27.22). Ciepło na podgrzanie wody
 * basenu, czas pracy pompy i prąd; dogrzanie po nocnym wychłodzeniu. Objętość, przyrost temperatury, moc i COP wpisuje
 * user (Dyrektywa #1). Straty przez parowanie i powierzchnię — źródło je wymienia, ale nie podaje modelu — nie są
 * liczone; nocny spadek temperatury user wpisuje z pomiaru.
 */

export type BasenInput = {
  /** Objętość wody w basenie [m³]. 0 = nie wpisano. */
  objetoscM3: number
  /** O ile podgrzać wodę [K]. 0 = nie wpisano. */
  przyrostK: number
  /** Moc grzewcza pompy w trybie basenowym [kW]. 0 = nie wpisano. */
  mocPompyKw: number
  /** COP pompy w trybie basenowym; 0 = nie wpisano (bez prądu). */
  cop: number
  /** Zmierzony spadek temperatury wody przez noc [K]; 0 = nie wpisano. */
  spadekNocK: number
}
