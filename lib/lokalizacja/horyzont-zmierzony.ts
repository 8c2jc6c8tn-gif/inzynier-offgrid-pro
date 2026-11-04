/**
 * Measured horizon (screen "Horyzont ze zdjęcia") as shared by other screens. The screen stores its
 * draft under `KLUCZ_HORYZONTU`; consumers read it only through `profilZDraftu`, which returns
 * `undefined` for anything that is not a usable 360-element profile.
 */
import { PELNY_KAT_DEG } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/constants"
import type { ProfilHoryzontu } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/profil"

export const KLUCZ_HORYZONTU = "horyzont-ze-zdjecia"

export type DraftHoryzontu = {
  /** Merged horizon profile [°] per whole degree of azimuth; null = not photographed. Photos themselves are never stored. */
  profil: ProfilHoryzontu
  [pole: string]: unknown
}

/** A profile with at least one known direction, in the shape the shading engine accepts. */
export function profilZDraftu(draft: { profil?: unknown } | null | undefined): ProfilHoryzontu | undefined {
  const p = draft?.profil
  if (!Array.isArray(p) || p.length !== PELNY_KAT_DEG) return undefined
  if (!p.every((v) => v === null || (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 90))) return undefined
  return p.some((v) => v !== null) ? (p as ProfilHoryzontu) : undefined
}
