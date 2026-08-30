import type { ReactNode } from "react"

/**
 * Duża liczba wynikowa wewnątrz WerdyktPanel (wzorzec A/D) — konfigurator stringów, dobór
 * bezpiecznika, COP pompy ciepła, kalkulatory pomocnicze, tryb uproszczony. Jeden token
 * rozmiaru (text-display) zamiast powtarzanego `text-2xl font-semibold` na każdym ekranie.
 */
export function WynikGlowny({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-display font-semibold">{children}</p>
}
