/**
 * Ekran B7, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Demontaż — procedura,
 * kolejność, zabezpieczenie" (scala dawne 10.7, 10.14, 10.15 —
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md). Wzorzec E — checklist z wymuszoną
 * kolejnością (ten sam wzorzec co Ekran A3/Procedura Black Start): kolejność ma znaczenie,
 * zaznaczenie kroku poza kolejnością nie liczy się do postępu.
 */

export type ChecklistItem = { id: string; krok: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "odlacz-minus", krok: "Najpierw odłącz minus (masa)." },
  { id: "odlacz-plus", krok: "Potem odłącz plus." },
  { id: "rozpiecie-szeregu", krok: "Przy rozpinaniu szeregu: od końca o najwyższym potencjale." },
  { id: "zaslepki", krok: "Załóż zaślepki na bieguny lub owiń taśmą izolacyjną." },
  { id: "brak-metalu", krok: "Sprawdź, czy metalowe narzędzia nie leżą na akumulatorach." },
]

export const OSTRZEZENIA_STALE = [
  "Ta sama zasada co w LiFePO4 — masa (minus) zawsze pierwsza przy odłączaniu, ostatnia przy podłączaniu, żeby zminimalizować ryzyko zwarcia narzędziem o karoserię/obudowę.",
]
