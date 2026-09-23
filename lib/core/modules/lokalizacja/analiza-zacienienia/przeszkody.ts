/**
 * Geometria przeszkód: kąt wzniesienia krawędzi przeszkody widzianej z punktu analizy w danym
 * kierunku (azymucie). Czysta geometria analityczna — przecięcie półprostej poziomej z okręgiem
 * (drzewo) lub z krawędziami wielokąta (bryła); kąt = atan((h − z_punktu) / odległość).
 *
 * Dla graniastosłupa/walca o płaskim wierzchu najbliższa krawędź daje największy kąt (ta sama
 * wysokość, najmniejsza odległość), więc wystarcza pierwsze przecięcie.
 */
import { EPS_GEOMETRII } from "./constants"
import type { Punkt2D, Punkt3D, Przeszkoda } from "./input"

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

/** Odległość wzdłuż półprostej z `p` w kierunku (dx, dy) do pierwszego przecięcia z okręgiem; null = brak. */
function przeciecieZOkregiem(p: Punkt2D, dx: number, dy: number, s: Punkt2D, r: number): number | null {
  const cx = s.x - p.x
  const cy = s.y - p.y
  const b = dx * cx + dy * cy
  const c = cx * cx + cy * cy - r * r
  const delta = b * b - c
  if (delta < 0) return null
  const pierw = Math.sqrt(delta)
  const t1 = b - pierw
  const t2 = b + pierw
  if (t1 > EPS_GEOMETRII) return t1
  if (t2 > EPS_GEOMETRII) return t2
  return null
}

/** Odległość do pierwszego przecięcia półprostej z krawędziami wielokąta; null = brak. */
function przeciecieZWielokatem(p: Punkt2D, dx: number, dy: number, obrys: Punkt2D[]): number | null {
  let najblizej: number | null = null
  for (let i = 0; i < obrys.length; i++) {
    const a = obrys[i]!
    const b = obrys[(i + 1) % obrys.length]!
    const ex = b.x - a.x
    const ey = b.y - a.y
    const mianownik = dx * ey - dy * ex
    if (Math.abs(mianownik) < EPS_GEOMETRII) continue
    const ax = a.x - p.x
    const ay = a.y - p.y
    const t = (ax * ey - ay * ex) / mianownik
    const u = (ax * dy - ay * dx) / mianownik
    if (t > EPS_GEOMETRII && u >= 0 && u <= 1 && (najblizej === null || t < najblizej)) najblizej = t
  }
  return najblizej
}

/** Czy punkt leży wewnątrz wielokąta (ray casting). */
export function punktWWielokacie(p: Punkt2D, obrys: Punkt2D[]): boolean {
  let wewnatrz = false
  for (let i = 0, j = obrys.length - 1; i < obrys.length; j = i++) {
    const a = obrys[i]!
    const b = obrys[j]!
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) wewnatrz = !wewnatrz
  }
  return wewnatrz
}

export function punktWewnatrzPrzeszkody(p: Punkt2D, przeszkoda: Przeszkoda): boolean {
  if (przeszkoda.typ === "drzewo") {
    return Math.hypot(p.x - przeszkoda.srodek.x, p.y - przeszkoda.srodek.y) <= przeszkoda.promienKoronyM
  }
  return punktWWielokacie(p, przeszkoda.obrys)
}

/**
 * Kąt wzniesienia wierzchu przeszkody widzianego z `punkt` w kierunku `azymutDeg` [°].
 * 0, gdy przeszkoda nie leży w tym kierunku albo jej wierzch jest nie wyżej niż punkt.
 */
export function katPrzeszkodyDeg(
  punkt: Punkt3D,
  azymutDeg: number,
  przeszkoda: Przeszkoda,
  wysokoscM: number = przeszkoda.wysokoscM,
): number {
  const roznicaWysokosci = wysokoscM - punkt.z
  if (roznicaWysokosci <= 0) return 0
  const dx = Math.sin(azymutDeg * RAD)
  const dy = Math.cos(azymutDeg * RAD)
  const odleglosc =
    przeszkoda.typ === "drzewo"
      ? przeciecieZOkregiem(punkt, dx, dy, przeszkoda.srodek, przeszkoda.promienKoronyM)
      : przeciecieZWielokatem(punkt, dx, dy, przeszkoda.obrys)
  if (odleglosc === null) return 0
  return Math.atan2(roznicaWysokosci, odleglosc) * DEG
}
