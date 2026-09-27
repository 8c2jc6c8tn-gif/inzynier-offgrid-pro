import type { ChemiaChecklisty } from "./input"

export type PozycjaChecklistyChemii = {
  id: string
  element: string
  uwaga: string
  /** Chemie, których pozycja dotyczy. */
  chemie: readonly ChemiaChecklisty[]
}

const WSZYSTKIE = ["AGM", "kwasowy", "LiFePO4"] as const
const OLOWIOWE = ["AGM", "kwasowy"] as const

/** ID pozycji wentylacji — jej brak przy akumulatorze ołowiowym daje ostrzeżenie (wodór). */
export const ID_WENTYLACJI = "wentylacja"

/**
 * Pozycje 1:1 ze źródła: `Tresc` (wentylacja — szczególnie AGM/kwasowy, mocowanie na wibracje, dostęp
 * serwisowy) + Biblia §12.33 (wilgoć i przegrzanie, osłona zacisków).
 */
export const CHECKLIST_ITEMS: PozycjaChecklistyChemii[] = [
  {
    id: ID_WENTYLACJI,
    element: "Akumulator w skrzyni wentylowanej na zewnątrz",
    uwaga: "Akumulator ołowiowy wydziela wodór — gaz wybuchowy.",
    chemie: OLOWIOWE,
  },
  {
    id: "mocowanie",
    element: "Stabilne mocowanie wytrzymujące wibracje drogowe",
    uwaga: "Akumulator nie może się przemieszczać podczas jazdy ani hamowania.",
    chemie: WSZYSTKIE,
  },
  { id: "dostep", element: "Dostęp serwisowy bez demontażu zabudowy", uwaga: "—", chemie: WSZYSTKIE },
  { id: "wilgoc-temperatura", element: "Ochrona przed wilgocią i przegrzaniem", uwaga: "—", chemie: WSZYSTKIE },
  { id: "oslona-zaciskow", element: "Osłonięte zaciski", uwaga: "Chroni przed zwarciem metalowym przedmiotem.", chemie: WSZYSTKIE },
]
