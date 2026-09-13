import type { MiejsceMontazu } from "./input"

/** Dobór puszki wg lokalizacji — 1:1 ze źródła (Ekran 27). */
export const WYMAGANY_TYP: Record<MiejsceMontazu, string> = {
  zewnatrz: "IP66 z dławikami",
  "w-ziemi": "Zalewana żywicą",
  wewnatrz: "IP20",
}

export const ETYKIETY_MIEJSC: Record<MiejsceMontazu, string> = {
  zewnatrz: "Na zewnątrz (na ścianie, konstrukcji)",
  "w-ziemi": "W ziemi",
  wewnatrz: "Wewnątrz budynku",
}
