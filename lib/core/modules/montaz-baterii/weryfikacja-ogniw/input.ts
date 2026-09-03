/**
 * Ekran A1, Moduł 11 "Montaż baterii" — "Weryfikacja kompletności + kontrola wstępna ogniw"
 * (dawne 9.1, 9.8, docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4).
 * Wzorzec E (checklist) z dwoma wbudowanymi kontrolami liczbowymi zamiast ręcznych checkboxów —
 * "liczba ogniw zgodna z napięciem" i "różnica napięć <0,05V" da się policzyć z danych, które i
 * tak trzeba wpisać, więc apka liczy je sama zamiast pytać usera, czy sam to sprawdził.
 */

export type NapiecieSystemu = 12 | 24 | 48

export type WeryfikacjaOgniwInput = {
  napiecieSystemu: NapiecieSystemu
  /** Napięcie każdego ogniwa [V], zmierzone przed montażem — jeden wpis na ogniwo. */
  napieciaOgniwV: number[]
  /** Czy BMS ma balancer (przewody balansujące) — bez tego montaż jest niebezpieczny. */
  bmsMaBalancer: boolean
  /** Potwierdzone pozycje z prostego checklistu (narzędzia, ochrona osobista, rezystancja, ocena wizualna). */
  potwierdzoneIds: string[]
}
