import type { CalcResult } from "@/lib/core/calc-result"
import type { GodzinaPrognozy } from "./input"

// 🔎 TD7 (dlug-techniczny.md): liczy tylko bilans 24h i godzinę szczytu (12.1, 12.2, 12.5).
// 12.3 (trend produkcji 1-12 mies.), 12.4 (symulacja SoC 24-72h) i 12.43 (wizualizacja zbiorcza)
// NIE zbudowane, mimo że rejestr pokrycia wcześniej wymieniał je razem jako pokryte.
// 1.1.0 (29.09.2026, decyzja właściciela — wariant A): każdy punkt to średnia moc [kW] w swoim oknie
// próbkowania, więc energia = Σ P × Δt. Wersja 1.0.0 sumowała same kW (energia zaniżona ×3).
export const CALCULATOR_VERSION = "1.1.0"

/** Sampling step of the forecast points [h] — screen shows one point every 3 h (0, 3, …, 21). */
export const KROK_PROBKOWANIA_H = 3

const FORMULA = "E = Σ P_i × Δt (Δt = 3 h); bilans = E_produkcja − E_zużycie"

export type PrognozyResult = {
  produkcjaLacznaKwh: number
  zuzycieLaczneKwh: number
  bilansKwh: number
  godzinaSzczytuZuzycia: number
}

/**
 * Ekran 1, Moduł 10 — "Prognozy" (docs/zrodla/Tresc_Modul_10_AI_Ekrany.md). To jest "pogoda"
 * Twojego systemu energetycznego — nie tylko atmosferyczna, ale cała: ile będziesz mieć prądu,
 * ile zużyjesz, i kiedy będzie ciasno.
 *
 * Each point is the average power [kW] over its 3 h sampling window, so energy [kWh] = Σ P × 3 h.
 */
export function calculatePrognozy(punkty: GodzinaPrognozy[]): CalcResult<PrognozyResult> {
  if (punkty.length === 0) {
    return {
      value: { produkcjaLacznaKwh: 0, zuzycieLaczneKwh: 0, bilansKwh: 0, godzinaSzczytuZuzycia: 0 },
      unit: "kWh",
      status: "INCOMPLETE",
      formula: "",
      inputs: { liczbaPunktow: 0 },
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const produkcjaLacznaKwh = punkty.reduce((sum, p) => sum + p.produkcjaKw * KROK_PROBKOWANIA_H, 0)
  const zuzycieLaczneKwh = punkty.reduce((sum, p) => sum + p.zuzycieKw * KROK_PROBKOWANIA_H, 0)
  const szczyt = punkty.reduce((max, p) => (p.zuzycieKw > max.zuzycieKw ? p : max), punkty[0])

  return {
    value: {
      produkcjaLacznaKwh,
      zuzycieLaczneKwh,
      bilansKwh: produkcjaLacznaKwh - zuzycieLaczneKwh,
      godzinaSzczytuZuzycia: szczyt.godzina,
    },
    unit: "kWh",
    status: "VALID",
    formula: FORMULA,
    inputs: { liczbaPunktow: punkty.length, krokProbkowaniaH: KROK_PROBKOWANIA_H },
    assumptions: [
      { kod: "PROGNOZY-ZALOZENIE-DANE-DEMO" },
      { kod: "PROGNOZY-ZALOZENIE-PROBKOWANIE-3H" },
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
