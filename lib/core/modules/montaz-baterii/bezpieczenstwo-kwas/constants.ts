/**
 * Ekran B8, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Bezpieczeństwo pracy z
 * kwasem" (dawne 10.9 — docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec E — checklist weryfikacyjna, bez wymuszonej kolejności.
 */

export type ChecklistItem = { id: string; element: string; uwaga: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "okulary", element: "Okulary ochronne kwasoodporne", uwaga: "—" },
  { id: "rekawice", element: "Rękawice kwasoodporne", uwaga: "—" },
  {
    id: "soda-oczyszczona",
    element: "Dostęp do sody oczyszczonej",
    uwaga: "Neutralizator rozlanego kwasu.",
  },
  {
    id: "procedura-kontaktu",
    element: "Znana procedura przy kontakcie ze skórą/oczami",
    uwaga: "Natychmiastowe płukanie dużą ilością wody, przy oczach — konsultacja medyczna.",
  },
]

/** 1:1 z cytatem 🔴 źródła — dopisane też do docs/rejestr-twardych-stopow.md. */
export const OSTRZEZENIA_STALE = [
  "Praca bez okularów ochronnych przy akumulatorach z korkami — ryzyko pryśnięcia kwasu przy sprawdzaniu poziomu elektrolitu.",
]
