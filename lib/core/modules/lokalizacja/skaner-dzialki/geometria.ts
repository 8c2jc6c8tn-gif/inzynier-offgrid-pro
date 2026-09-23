/**
 * Geometria Skanera działki — czyste funkcje (03-jadro, 3.2).
 *
 * Rzutowanie GPS → układ lokalny: płaszczyzna styczna w punkcie odniesienia z promieniami
 * krzywizny elipsoidy WGS84 (południkowy M, w pierwszym wertykale N): x = Δλ·N·cos φ0,
 * y = Δφ·M. Standardowe przybliżenie dla obszarów rzędu setek metrów (działka), błąd
 * pomijalny wobec błędu samego GPS.
 */
import { NACHYLENIE_PLASKIE_EPS_DEG, WGS84_A, WGS84_E2 } from "./constants"
import type { PunktGps } from "./input"

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

export type PunktLokalny = { x: number; y: number; z: number | null }

export function normalizujKat(stopnie: number): number {
  return ((stopnie % 360) + 360) % 360
}

export function rzutujNaUkladLokalny(p: PunktGps, odniesienie: PunktGps): PunktLokalny {
  const fi0 = odniesienie.szerokosc * RAD
  const w = 1 - WGS84_E2 * Math.sin(fi0) ** 2
  const n = WGS84_A / Math.sqrt(w)
  const m = (WGS84_A * (1 - WGS84_E2)) / w ** 1.5
  return {
    x: (p.dlugosc - odniesienie.dlugosc) * RAD * n * Math.cos(fi0),
    y: (p.szerokosc - odniesienie.szerokosc) * RAD * m,
    z: p.wysokoscM ?? null,
  }
}

/** Pole ze znakiem (wzór Gaussa / shoelace): > 0 — obchodzenie przeciwnie do ruchu wskazówek zegara. */
export function poleZeZnakiem(punkty: { x: number; y: number }[]): number {
  let s = 0
  for (let i = 0; i < punkty.length; i++) {
    const a = punkty[i]!
    const b = punkty[(i + 1) % punkty.length]!
    s += a.x * b.y - b.x * a.y
  }
  return s / 2
}

export function obwod(punkty: { x: number; y: number }[]): number {
  let s = 0
  for (let i = 0; i < punkty.length; i++) {
    const a = punkty[i]!
    const b = punkty[(i + 1) % punkty.length]!
    s += Math.hypot(b.x - a.x, b.y - a.y)
  }
  return s
}

/** Azymut wektora poziomego (od północy, zgodnie z ruchem wskazówek zegara) [°]. */
export function azymutWektora(dx: number, dy: number): number {
  return normalizujKat(Math.atan2(dx, dy) * DEG)
}

/**
 * Normalna płaszczyzny metodą Newella (M. E. Newell, 1972; stabilna dla ≥3 punktów, także
 * nieidealnie współpłaszczyznowych) — zwrócona w górę (n_z ≥ 0).
 */
export function normalnaNewella(punkty: { x: number; y: number; z: number }[]): { nx: number; ny: number; nz: number } {
  let nx = 0
  let ny = 0
  let nz = 0
  for (let i = 0; i < punkty.length; i++) {
    const a = punkty[i]!
    const b = punkty[(i + 1) % punkty.length]!
    nx += (a.y - b.y) * (a.z + b.z)
    ny += (a.z - b.z) * (a.x + b.x)
    nz += (a.x - b.x) * (a.y + b.y)
  }
  const dl = Math.hypot(nx, ny, nz)
  const znak = nz < 0 ? -1 : 1
  return { nx: (znak * nx) / dl, ny: (znak * ny) / dl, nz: (znak * nz) / dl }
}

/** Nachylenie [°] i azymut, w który płaszczyzna "patrzy" [°, null gdy płaska]. */
export function orientacjaPlaszczyzny(n: { nx: number; ny: number; nz: number }): {
  nachylenieDeg: number
  azymutDeg: number | null
} {
  const nachylenieDeg = Math.acos(Math.min(1, n.nz)) * DEG
  return {
    nachylenieDeg,
    azymutDeg: nachylenieDeg < NACHYLENIE_PLASKIE_EPS_DEG ? null : azymutWektora(n.nx, n.ny),
  }
}
