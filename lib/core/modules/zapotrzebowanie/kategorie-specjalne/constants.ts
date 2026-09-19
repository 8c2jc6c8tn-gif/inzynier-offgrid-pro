import type { Kategoria } from "./input"

export const KATEGORIE: { id: Kategoria; label: string }[] = [
  { id: "warsztat", label: "Warsztat" },
  { id: "gospodarstwo", label: "Gospodarstwo" },
  { id: "oswietlenie-terenowe", label: "Oświetlenie terenowe" },
]

/**
 * Nazwy przykładowych urządzeń, 1:1 ze źródła — TYLKO dla kategorii "Warsztat" (jedyna z trzech
 * opisana przykładem w źródle). Bez mocy domyślnej — źródło nie podaje liczb, tylko nazwy.
 * "Gospodarstwo" i "Oświetlenie terenowe" nie mają w źródle żadnych przykładowych urządzeń.
 */
export const PRZYKLADOWE_URZADZENIA_WARSZTAT = ["Szlifierka", "Wiertarka", "Spawarka"]
