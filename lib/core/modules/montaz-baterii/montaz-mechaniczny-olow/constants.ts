/**
 * Ekran B2, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Montaż mechaniczny +
 * mocowanie/wentylacja" (scala dawne 10.2, 10.11 — docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec E — checklist weryfikacyjna, bez wymuszonej kolejności.
 */

export type ChecklistItem = { id: string; element: string; uwaga: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "nosnosc-podloza",
    element: "Nośność podłoża/półki sprawdzona pod wagę zestawu",
    uwaga: "Akumulatory kwasowe są ciężkie.",
  },
  {
    id: "stabilne-mocowanie",
    element: "Stabilne mocowanie (pasy, obejmy)",
    uwaga: "Szczególnie ważne w pojazdach/łodziach.",
  },
  {
    id: "wentylacja",
    element: "Wentylacja pomieszczenia zapewniona",
    uwaga: "Akumulatory kwasowe wydzielają gazy podczas ładowania.",
  },
  {
    id: "dala-od-iskier",
    element: "Montaż z dala od źródeł iskier/otwartego ognia",
    uwaga: "Gazy wybuchowe (wodór).",
  },
]

/** 1:1 z cytatem 🔴 źródła — dopisane też do docs/rejestr-twardych-stopow.md. */
export const OSTRZEZENIA_STALE = [
  "Brak wentylacji w zamkniętym pomieszczeniu z akumulatorami kwasowymi — ryzyko wybuchu gromadzącego się wodoru.",
]
