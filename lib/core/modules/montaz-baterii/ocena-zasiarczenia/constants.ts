export type ObjawItem = { id: string; element: string }

/** Objawy do sprawdzenia — dane 1:1 ze źródła (dawne 10.16). */
export const OBJAWY: ObjawItem[] = [
  { id: "dlugi-czas-ladowania", element: "Długi czas ładowania" },
  { id: "szybkie-rozladowanie", element: "Szybkie rozładowanie" },
  { id: "bialy-nalot", element: "Biały nalot na klemach (siarczan ołowiu)" },
  {
    id: "szybki-spadek-napiecia",
    element: "Szybki spadek napięcia po naładowaniu (samorozładowanie)",
  },
]
