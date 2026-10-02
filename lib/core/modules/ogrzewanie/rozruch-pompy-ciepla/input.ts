/**
 * Moduł 6, Część 2C — „Pompa ciepła: rozruch i praca z falownika albo agregatu” (scala dawne 5.52 „praca w trybie
 * off-grid z ograniczoną mocą”, 5.61 „dobór do falownika hybrydowego”, 5.66 „praca z agregatem”; Biblia §6.27.26,
 * §6.27.35, §6.27.40). Wszystkie trzy pytają o to samo: czy źródło udźwignie prąd rozruchowy pompy (LRA) i jej pracę.
 * Prąd rozruchowy, napięcie i moce źródła wpisuje user z kart katalogowych (Dyrektywa #1).
 */

export type ZrodloZasilania = "falownik" | "agregat"

export type RozruchPompyCieplaInput = {
  /** Co zasila pompę; null = nie wybrano. */
  zrodlo: ZrodloZasilania | null
  /** Liczba faz zasilania pompy: 1 albo 3. */
  fazy: 1 | 3
  /** Napięcie zasilania [V] — fazowe dla 1 fazy, międzyfazowe dla 3 faz. 0 = nie wpisano. */
  napiecieV: number
  /** Prąd rozruchowy sprężarki (LRA) z karty pompy [A]. 0 = nie wpisano. */
  pradRozruchuA: number
  /** Prąd rozruchowy z softstartem [A] — karta softstartu/pompy z inwerterem; 0 = bez softstartu. */
  pradSoftstartA: number
  /** Pobór elektryczny pompy w pracy [kW]. 0 = nie wpisano. */
  poborPracyKw: number
  /** Inne odbiorniki pracujące w tym samym czasie [kW]; 0 = brak/nie wpisano. */
  inneObciazenieKw: number
  /** Moc ciągła falownika albo znamionowa agregatu [kW]. 0 = nie wpisano. */
  mocCiaglaKw: number
  /** Moc szczytowa falownika (kilka sekund) albo maksymalna agregatu [kW] — z karty. 0 = nie wpisano. */
  mocSzczytowaKw: number
}
