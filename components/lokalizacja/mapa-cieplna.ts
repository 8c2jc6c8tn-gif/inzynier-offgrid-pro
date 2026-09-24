/**
 * Wspólne dla strony Ekranu 3 i widoku 3D, bez importu three.js — strona nie może statycznie
 * wciągać modułu `widok-3d.tsx` (ładowanego przez `next/dynamic`), bo three.js trafiłby do bundla strony.
 */
import type { Punkt3D } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/input"
import { normalnaNewella } from "@/lib/core/modules/lokalizacja/skaner-dzialki/geometria"

export type ProbkaMapy = { punkt: Punkt3D; strataProcent: number | null; normalna: Punkt3D; rozmiarM: number }

/** 0 → zielony, skalaMax → czerwony (odcień HSL 120° → 0°). */
export function kolorStraty(strata: number, skalaMax: number): string {
  const t = Math.min(1, Math.max(0, skalaMax > 0 ? strata / skalaMax : 0))
  return `hsl(${Math.round(120 * (1 - t))}, 80%, 45%)`
}

/** Normalna połaci (orientacja kwadratów mapy cieplnej) — ta sama metoda co w Skanerze. */
export function normalnaPolaci(punkty: Punkt3D[]): Punkt3D {
  const n = normalnaNewella(punkty)
  return { x: n.nx, y: n.ny, z: n.nz }
}
