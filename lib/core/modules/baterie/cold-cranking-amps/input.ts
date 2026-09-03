/**
 * Ekran 15, Moduł 4 "Magazyn energii / baterie" — "Cold Cranking Amps (zimny start dużych
 * odbiorników)" (dawne 3.17, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D.
 *
 * Uwaga o źródle: Sekcja A wymienia jako pola wejściowe "temperaturę ogniw, prąd rozruchowy
 * odbiornika, rezystancję wewnętrzną ogniw, min. napięcie pracy falownika" — ale sam wzór
 * (Sekcja B: `V_sag = V_oc − I_rozruch × R_wewn`) wymaga też napięcia pakietu bez obciążenia
 * (V_oc), którego nie ma w tej liście pól. Bez niego wzoru nie da się policzyć — dodane tu jako
 * pole wejściowe (realna, mierzalna wielkość, nie wymyślony współczynnik), z jawną notatką o tej
 * rozbieżności zamiast cichego dopisania. Temperatura ogniw NIE wchodzi do samego wzoru — wpływa
 * na R_wewn pośrednio (im zimniej, tym większa rezystancja), ale użytkownik wpisuje R_wewn już
 * zmierzoną w bieżącej temperaturze, więc temperatura zostaje tylko kontekstem narracyjnym
 * (nagłówek ekranu), nie osobnym polem obliczeniowym.
 */

export type ColdCrankingAmpsInput = {
  /** Napięcie pakietu bez obciążenia (open-circuit) [V]. 0 = jeszcze nie wpisano. */
  napiecieOtwartegoObwoduV: number
  /** Prąd rozruchowy odbiornika [A]. 0 = jeszcze nie wpisano. */
  pradRozruchowyA: number
  /** Rezystancja wewnętrzna całego pakietu [mΩ], zmierzona w bieżącej temperaturze. 0 = jeszcze nie wpisano. */
  rezystancjaWewnetrznaMOhm: number
  /** Minimalne napięcie pracy falownika [V]. 0 = jeszcze nie wpisano. */
  minimalneNapiecieFalownikaV: number
}
