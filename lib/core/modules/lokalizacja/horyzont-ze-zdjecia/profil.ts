/**
 * Horizon profile: elevation of the skyline [°] for azimuths 0…359 (index = azimuth rounded to a
 * whole degree), `null` where no photo covered that direction. Unknown is never turned into
 * "clear": consumers decide how to treat gaps and report the coverage.
 */
import { KROK_PROFILU_DEG, MAKS_LUKA_INTERPOLACJI_BINOW, PELNY_KAT_DEG } from "./constants"
import type { PunktPiksela } from "./input"
import { kierunekPiksela, type Kamera } from "./kamera"

export type ProfilHoryzontu = (number | null)[]

export const PUSTY_PROFIL: ProfilHoryzontu = Array.from({ length: PELNY_KAT_DEG / KROK_PROFILU_DEG }, () => null)

/** y of the polyline at column x; null outside its range. */
function wysokoscLinii(linia: PunktPiksela[], x: number): number | null {
  for (let i = 0; i + 1 < linia.length; i++) {
    const a = linia[i]!
    const b = linia[i + 1]!
    if (x < a.x || x > b.x) continue
    return b.x === a.x ? a.y : a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x)
  }
  return null
}

/**
 * Projects the skyline polylines into the profile: every pixel column gives one ray; a bin keeps the
 * HIGHEST skyline seen in it (conservative for PV yield). Stretches between separate polylines stay
 * unknown. Bins between covered ones are interpolated only across gaps of up to
 * MAKS_LUKA_INTERPOLACJI_BINOW.
 */
export function profilZLinii(kamera: Kamera, liniePunktow: PunktPiksela[][]): ProfilHoryzontu {
  const profil: ProfilHoryzontu = [...PUSTY_PROFIL]
  for (const linia0 of liniePunktow) {
    const linia = [...linia0].sort((a, b) => a.x - b.x)
    if (linia.length < 2) continue
    const od = Math.max(0, Math.ceil(linia[0]!.x))
    const do_ = Math.min(kamera.szerokoscPx - 1, Math.floor(linia[linia.length - 1]!.x))
    for (let x = od; x <= do_; x++) {
      const y = wysokoscLinii(linia, x)
      if (y === null) continue
      const k = kierunekPiksela(kamera, x, y)
      const bin = Math.round(k.azymutDeg / KROK_PROFILU_DEG) % (PELNY_KAT_DEG / KROK_PROFILU_DEG)
      const wysokosc = Math.max(0, k.wysokoscDeg)
      const stara = profil[bin]
      if (stara === null || stara === undefined || wysokosc > stara) profil[bin] = wysokosc
    }
  }
  return wypelnijLuki(profil)
}

function wypelnijLuki(profil: ProfilHoryzontu): ProfilHoryzontu {
  const n = profil.length
  const wynik = [...profil]
  for (let i = 0; i < n; i++) {
    if (profil[i] !== null) continue
    let l = 1
    while (l <= MAKS_LUKA_INTERPOLACJI_BINOW && profil[(i - l + n) % n] === null) l++
    let p = 1
    while (p <= MAKS_LUKA_INTERPOLACJI_BINOW && profil[(i + p) % n] === null) p++
    const lewy = profil[(i - l + n) % n]
    const prawy = profil[(i + p) % n]
    if (l > MAKS_LUKA_INTERPOLACJI_BINOW || p > MAKS_LUKA_INTERPOLACJI_BINOW || lewy === null || prawy === null || lewy === undefined || prawy === undefined) continue
    if (l + p - 1 > MAKS_LUKA_INTERPOLACJI_BINOW) continue
    wynik[i] = lewy + ((prawy - lewy) * l) / (l + p)
  }
  return wynik
}

/** New data replaces the bins it covers; the rest of the base profile stays. */
export function scalProfil(baza: ProfilHoryzontu, nowy: ProfilHoryzontu): ProfilHoryzontu {
  return baza.map((v, i) => nowy[i] ?? v)
}

export function pokrycieProc(profil: ProfilHoryzontu): number {
  return (100 * profil.filter((v) => v !== null).length) / profil.length
}

/** Skyline elevation for any azimuth, linearly interpolated between whole degrees; null where unknown. */
export function wysokoscHoryzontuDeg(profil: ProfilHoryzontu, azymutDeg: number): number | null {
  const n = profil.length
  const pozycja = (((azymutDeg / KROK_PROFILU_DEG) % n) + n) % n
  const i = Math.floor(pozycja)
  const a = profil[i]
  const b = profil[(i + 1) % n]
  if (a === null || a === undefined) return null
  if (b === null || b === undefined) return a
  return a + (b - a) * (pozycja - i)
}

/**
 * Profile from a list of (azimuth, elevation) points given by hand (e.g. "south: hill 8°"): linear
 * interpolation between neighbouring points, `null` outside the span of the points (no wrap-around,
 * no guessing what lies beyond the outermost point).
 */
export function profilZPunktow(punkty: { azymutDeg: number; wysokoscDeg: number }[]): ProfilHoryzontu {
  const profil: ProfilHoryzontu = [...PUSTY_PROFIL]
  const p = [...punkty].sort((a, b) => a.azymutDeg - b.azymutDeg)
  if (p.length === 0) return profil
  for (let i = 0; i < profil.length; i++) {
    const az = i * KROK_PROFILU_DEG
    if (az < p[0]!.azymutDeg || az > p[p.length - 1]!.azymutDeg) continue
    let k = 0
    while (k + 1 < p.length && p[k + 1]!.azymutDeg < az) k++
    const a = p[k]!
    const b = p[k + 1]
    if (!b || b.azymutDeg === a.azymutDeg) profil[i] = Math.max(0, a.wysokoscDeg)
    else profil[i] = Math.max(0, a.wysokoscDeg + ((b.wysokoscDeg - a.wysokoscDeg) * (az - a.azymutDeg)) / (b.azymutDeg - a.azymutDeg))
  }
  return profil
}
