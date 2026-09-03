export type ChecklistItem = { id: string; krok: string }

/** Dane 1:1 ze źródła (docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, Ekran A4). */
export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "wtyczka-balansujaca", krok: "Wtyczka balansująca (pomiarowa) — podłączana pierwsza." },
  { id: "przewody-glowne", krok: "Przewody główne: B− do minusa pakietu, P− do odbiornika. Nigdy nie zamieniać kolejności." },
  { id: "pre-charge", krok: "Procedura pre-charge do falownika wykonana (patrz kalkulator wyżej)." },
  { id: "komunikacja-bms", krok: "Sprawdzenie komunikacji BMS↔falownik (CAN/RS485) — poprawny odczyt SoC." },
]

/** Przykładowa wartość ze źródła — tylko sugerowany start UI, nie ukryty domyślny. */
export const PRZYKLADOWA_REZYSTANCJA_OHM = 50

export const OSTRZEZENIA_STALE = ["Bez pre-charge zaiskrzy i uszkodzisz styki bezpiecznika."]
