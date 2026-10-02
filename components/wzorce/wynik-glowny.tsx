import type { ReactNode } from "react"

/**
 * Duża liczba wynikowa wewnątrz WerdyktPanel (wzorzec A/D) — konfigurator stringów, dobór
 * bezpiecznika, COP pompy ciepła, kalkulatory pomocnicze, tryb uproszczony. Jeden token
 * rozmiaru (text-display) zamiast powtarzanego `text-2xl font-semibold` na każdym ekranie.
 */
export function WynikGlowny({ children }: { children: ReactNode }) {
  // `wynik-glowny`: hook for an appearance style's result font/colour (app/globals.css, lib/wyglad/style.ts).
  return <p className="wynik-glowny mt-1 text-display font-semibold">{children}</p>
}
