import { ID_WENTYLACJI, type PozycjaChecklistyChemii } from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/constants"

/**
 * Ekran 36, Moduł 12 — "Bezpieczne ładowanie w garażu" (dawne 8.63, `Tresc` + Biblia §12.51). Pozycje 1:1
 * ze źródła: wentylacja pomieszczenia (szczególnie kwasowy/AGM — wodór), brak źródeł iskrzenia w pobliżu,
 * ładowarka właściwa dla chemii.
 */
export const CHECKLIST_ITEMS: PozycjaChecklistyChemii[] = [
  {
    id: ID_WENTYLACJI,
    element: "Wentylacja pomieszczenia (otwarte drzwi albo wentylator)",
    uwaga: "Akumulator ołowiowy podczas ładowania wydziela wodór — gaz wybuchowy.",
    chemie: ["AGM", "kwasowy"],
  },
  {
    id: "brak-iskrzenia",
    element: "Brak źródeł iskrzenia, otwartego ognia i papierosów w pobliżu",
    uwaga: "—",
    chemie: ["AGM", "kwasowy"],
  },
  {
    id: "ladowarka-chemia",
    element: "Ładowarka przeznaczona dla tej chemii akumulatora",
    uwaga: "Inne napięcia końcowe ładowania dla ołowiowego i LiFePO4.",
    chemie: ["AGM", "kwasowy", "LiFePO4"],
  },
]
