import type { TypOchrony } from "./input"

/** Porównanie 1:1 ze źródła (Ekran 15, Wzorzec C) — bez rekomendacji per miejsce (nie podana w źródle). */
export const OPISY_OCHRONY: Record<Exclude<TypOchrony, "brak">, { etykieta: string; opis: string }> = {
  "dioda-blokujaca": {
    etykieta: "Dioda blokująca",
    opis: "Prosta i tania, ale powoduje stały spadek napięcia i stratę mocy (dioda zawsze przewodzi w jedną stronę, grzeje się przy przepływie prądu).",
  },
  "wylacznik-blokada-mechaniczna": {
    etykieta: "Wyłącznik z blokadą mechaniczną",
    opis: "Brak strat mocy w normalnej pracy, ale droższy i wymaga poprawnego montażu (blokada uniemożliwia fizyczne podłączenie odwrotnej polaryzacji).",
  },
}
