import type { PoziomRyzykaGryzoni } from "./input"

/** Rekomendacja 1:1 ze źródła (Ekran 25): wysokie ryzyko → peszel metalowy, niskie → plastikowy wystarcza. */
export const REKOMENDACJA: Record<PoziomRyzykaGryzoni, string> = {
  wysokie: "Peszel metalowy spiralny",
  niskie: "Peszel plastikowy (standardowy)",
}

export const ETYKIETY_RYZYKA: Record<PoziomRyzykaGryzoni, string> = {
  wysokie: "Wysokie (np. działka leśna, pole, stodoła w pobliżu)",
  niskie: "Niskie (np. teren miejski, zabudowa zwarta)",
}
