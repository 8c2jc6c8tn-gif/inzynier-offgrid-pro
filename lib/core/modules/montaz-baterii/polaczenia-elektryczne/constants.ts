/**
 * Ekran A3, Moduł 11 "Montaż baterii" — "Połączenia elektryczne + kolejność łączenia"
 * (dawne 9.3, 9.11, docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4).
 * Wzorzec E — checklist z wymuszoną kolejnością (ten sam wzorzec co Procedura Black Start,
 * Moduł 7, Ekran 5): kolejność ma znaczenie, zaznaczenie kroku poza kolejnością nie liczy się
 * do postępu.
 */

export type ChecklistItem = {
  id: string
  krok: string
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "polaczenia-szeregowe", krok: "Połączenia szeregowe najpierw (minus do plusa)." },
  { id: "szyny-zbiorcze", krok: "Następnie szyny zbiorcze." },
  { id: "styki-przetarte", krok: "Styki przetarte przed połączeniem (usunięcie utlenienia)." },
  { id: "moment-dokrecenia", krok: "Moment dokręcenia zgodny z Modułem 4, Ekran 11 (Moment dokręcania śrub)." },
]

export const OSTRZEZENIA_STALE = [
  "Kolejność łączenia ma znaczenie — przypadkowe zwarcie podczas montażu szeregu ogniw to najczęstsza przyczyna wypadków przy budowie własnego pakietu.",
]
