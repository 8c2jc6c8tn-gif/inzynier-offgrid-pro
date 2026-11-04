/**
 * Pinhole (rectilinear) camera with zero roll. Coordinates: x east, y north, z up; azimuth from
 * north clockwise. The camera looks along azimuth `azymutSrodkaDeg` (yaw) and is tilted by
 * `nachylenieDeg` (pitch, up positive). A pixel (x, y) gives the ray
 *   d = u·right + v·up + f·forward,  u = x − cx,  v = cy − y,
 * so the elevation of the ray depends on the tilt only, and the azimuth is yaw + atan2(u, B) with
 * B = f·cosθ − v·sinθ. That makes the sun click solvable in closed form (no iteration).
 */
import { DIAGONALA_KLATKI_35MM_MM } from "./constants"

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

export type Kamera = {
  szerokoscPx: number
  wysokoscPx: number
  /** Focal length in pixels. */
  ogniskowaPx: number
  azymutSrodkaDeg: number
  nachylenieDeg: number
}

export type Kierunek = { azymutDeg: number; wysokoscDeg: number }

export function ogniskowaZHfov(szerokoscPx: number, hfovDeg: number): number {
  return szerokoscPx / 2 / Math.tan((hfovDeg * RAD) / 2)
}

/** 35 mm-equivalent focal length is defined by the diagonal, so it is independent of the aspect ratio and orientation. */
export function ogniskowaZ35mm(szerokoscPx: number, wysokoscPx: number, ogniskowa35mmMm: number): number {
  return (ogniskowa35mmMm * Math.hypot(szerokoscPx, wysokoscPx)) / DIAGONALA_KLATKI_35MM_MM
}

export function hfovDeg(szerokoscPx: number, ogniskowaPx: number): number {
  return 2 * Math.atan(szerokoscPx / 2 / ogniskowaPx) * DEG
}

export function vfovDeg(wysokoscPx: number, ogniskowaPx: number): number {
  return 2 * Math.atan(wysokoscPx / 2 / ogniskowaPx) * DEG
}

const normalizuj360 = (a: number) => ((a % 360) + 360) % 360

/** Direction (azimuth, elevation) of the ray through pixel (x, y). */
export function kierunekPiksela(k: Kamera, x: number, y: number): Kierunek {
  const u = x - k.szerokoscPx / 2
  const v = k.wysokoscPx / 2 - y
  const f = k.ogniskowaPx
  const theta = k.nachylenieDeg * RAD
  const rho = Math.sqrt(u * u + v * v + f * f)
  const z = v * Math.cos(theta) + f * Math.sin(theta)
  const b = f * Math.cos(theta) - v * Math.sin(theta)
  return {
    azymutDeg: normalizuj360(k.azymutSrodkaDeg + Math.atan2(u, b) * DEG),
    wysokoscDeg: Math.asin(Math.max(-1, Math.min(1, z / rho))) * DEG,
  }
}

/**
 * Yaw and tilt of a level (zero-roll) camera such that pixel (x, y) shows the direction `cel`
 * (the sun at the moment of the photo). `null` when no tilt in [−90°, 90°] reproduces the elevation.
 */
export function kalibrujPoSlonca(
  szerokoscPx: number,
  wysokoscPx: number,
  ogniskowaPx: number,
  x: number,
  y: number,
  cel: Kierunek,
): { azymutSrodkaDeg: number; nachylenieDeg: number } | null {
  const u = x - szerokoscPx / 2
  const v = wysokoscPx / 2 - y
  const f = ogniskowaPx
  const rho = Math.sqrt(u * u + v * v + f * f)
  const a = Math.hypot(v, f)
  const s = (rho * Math.sin(cel.wysokoscDeg * RAD)) / a
  if (Math.abs(s) > 1) return null
  const phi = Math.atan2(v, f)
  const kandydaci = [Math.asin(s) - phi, Math.PI - Math.asin(s) - phi]
  const theta = kandydaci.find((t) => t >= -Math.PI / 2 - 1e-9 && t <= Math.PI / 2 + 1e-9)
  if (theta === undefined) return null
  const b = f * Math.cos(theta) - v * Math.sin(theta)
  return { azymutSrodkaDeg: normalizuj360(cel.azymutDeg - Math.atan2(u, b) * DEG), nachylenieDeg: theta * DEG }
}
