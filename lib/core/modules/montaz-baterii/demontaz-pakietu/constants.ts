export type ChecklistItem = { id: string; krok: string }

/** Dane 1:1 ze źródła (docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, Ekran A6) — kolejność
 * to dokładna odwrotność montażu (A2–A4), każde odstępstwo zwiększa ryzyko zwarcia w rękach. */
export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "zatrzymaj-obciazenia", krok: "Zatrzymaj wszystkie obciążenia i ładowarki (falownik, MPPT, agregat) — poczekaj, aż przestaną pobierać prąd." },
  { id: "wylacz-bms", krok: "Wyłącz BMS, poczekaj na rozładowanie kondensatorów wewnętrznych." },
  { id: "odlacz-wtyczke-balansujaca", krok: "Odłącz wtyczkę balansującą od BMS (nie od ogniw)." },
  { id: "odlacz-p-minus", krok: "Odłącz P− (minus do obciążenia/ładowarki)." },
  { id: "odlacz-b-minus", krok: "Odłącz B− (minus akumulatora)." },
  { id: "odlacz-b-plus", krok: "Odłącz B+ (plus akumulatora) — zaizoluj końcówkę." },
  { id: "demontaz-ogniw", krok: "Demontaż ogniw: od najwyższego potencjału w dół — izoluj każdą odsłoniętą końcówkę na bieżąco." },
]

/** Zalecany zakres napięcia na ogniwo przed demontażem — niżej = mniej energii, mniejsze ryzyko iskrzenia. */
export const MAX_ZALECANE_NAPIECIE_OGNIWA_V = 3.2

export const OSTRZEZENIA_STALE = [
  "Nie odłączaj ogniw przy pełnym naładowaniu — ryzyko iskrzenia i uszkodzenia terminali.",
]

export const WYMAGANE_WYPOSAZENIE =
  "Wymagane: izolowane narzędzia, rękawice ochronne, okulary, nieprzewodzące podłoże."
