/**
 * Ekran 2, Moduł 4 "Magazyn energii / baterie" — "Doradca doboru napięcia systemowego (12/24/48V)"
 * (dawne 3.2, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D pełny.
 *
 * Rozbudowane w wersji 2.0.0 o materiał źródłowy "Dobór napięcia systemu Off-Grid v3.0"
 * (docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md), po 4 rundach
 * poprawek zamkniętych w docs/memory.md (13.09.2026). Rdzeń I=P/V (Etap istniejący) zachowany
 * bez zmian — reszta pól to nowe Etapy A-H z tego materiału.
 */

import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import type { Zastosowanie, Priorytet } from "./constants"

export type OdbiornikWybor = {
  id: string
  /** Moc [W] — startowana z katalogowej domyślnej, edytowalna. 0 = jeszcze nie wpisano. */
  mocW: number
  /** Czas pracy jednorazowo [min]. 0 = nie podano (traktowane jako chwilowe, Etap B.3). */
  czasPracyMin: number
  selected: boolean
}

export type NapiecieSystemoweInput = {
  /** Obciążenie szczytowe [W] — pole historyczne (v1.0.0), nadal akceptowane jako ręczny fallback
   *  gdy użytkownik nie korzysta z kreatora odbiorników (Etap B) poniżej. 0 = brak. */
  mocSzczytowaW: number

  // Etap A — kontekst zastosowania (informacyjny, nie steruje samym I=P/V).
  zastosowanie: Zastosowanie | null
  priorytet: Priorytet | null
  /** Ogrzewanie budynku NIE dotyczy tego systemu (np. kamper, łódź, ogrzewanie na paliwo stałe). */
  ogrzewanieNieDotyczy: boolean
  /** Szczytowa moc ogrzewania elektrycznego budynku [W], jeśli nie wybrano "nie dotyczy" i nie
   *  rozpisano urządzeń grzewczych osobno w kreatorze odbiorników (Etap B). 0 = nie podano. */
  ogrzewanieMocW: number

  // Etap B — kreator odbiorników + analiza jednoczesności/długotrwałego obciążenia.
  odbiorniki: OdbiornikWybor[]
  /** Planowana moc ciągła falownika [W] — opcjonalna, do sprawdzenia konfliktu jednoczesności
   *  (Etap B.2). 0 = nie podano, sprawdzenie pomijane. */
  mocCiaglaFalownikaPlanowanaW: number

  // Etap C — echo doboru przekroju kabla (M5/Ekran 1) dla 12V/24V/48V przy tej samej mocy.
  dlugoscTrasyM: number
  material: Material
  sposobUlozenia: SposobUlozenia
  temperaturaOtoczeniaC: number | null
  liczbaKabliWWiazce: number
  dopuszczalnySpadekNapieciaPct: number

  // Etap E — kosztorysy 12V/24V/48V dla tej samej docelowej pojemności energetycznej, ceny edytowalne.
  /** Docelowa pojemność energetyczna banku [kWh]. 0 = nie podano. */
  docelowaPojemnoscKwh: number
  cenaOgniwaZl: number
  cenaBms4sZl: number
  cenaBms8sZl: number
  cenaBms16sZl: number
  cenaFalownika12vZl: number
  cenaFalownika24vZl: number
  cenaFalownika48vZl: number
  cenaPrzewodow12vZl: number
  cenaPrzewodow24vZl: number
  cenaPrzewodow48vZl: number
  cenaBezpiecznika12vZl: number
  cenaBezpiecznika24vZl: number
  cenaBezpiecznika48vZl: number
  /** Liczba linii oświetleniowych 24V wymagających przetwornicy DC-DC 48V→24V — tylko dla
   *  kosztorysu 48V (Etap D.1). 0 = brak/nie dotyczy. */
  liczbaLiniiOswietlenia24vPrzySystemie48v: number
  cenaPrzetwornicyDcDcZl: number

  // Etap H — pułapka konwersji 24V→48V (koszt przejścia, reużywa cen z Etapu E).
  planowanaKonwersja24Do48: boolean
}
