/**
 * Automatic skyline detection on decoded RGBA pixels. A heuristic, not a segmentation model: sky is
 * a blue-dominant or bright colourless pixel; for every column the skyline is where a run of
 * non-sky pixels starts (short runs — birds, wires — are skipped). Dark storm clouds or a white wall
 * will be misread, which is why the screen always lets the user redraw the line by hand.
 */
import {
  NIEBO_MAX_ROZNICA_KANALOW_BIALE,
  NIEBO_MIN_JASNOSC_BIALE,
  NIEBO_MIN_SERIA_PX,
  NIEBO_MIN_SERIA_UDZIAL_WYSOKOSCI,
  NIEBO_OKNO_MEDIANY_UDZIAL,
  NIEBO_PRZEWAGA_NIEBIESKIEGO,
  NIEBO_PUNKTOW_NA_ZDJECIE,
} from "./constants"
import type { PunktPiksela } from "./input"

export type WykrytaLinia = {
  /** Skyline polylines; a column of pure sky ends one and starts the next. */
  linie: PunktPiksela[][]
  /** Columns where an obstacle reaches the top edge of the frame: the real horizon is higher than drawn. */
  kolumnPrzyGorzeKadru: number
  /** Columns with sky all the way down to the bottom edge: no skyline in the frame. */
  kolumnSameNiebo: number
}

export function czyNiebo(r: number, g: number, b: number): boolean {
  if (b >= r + NIEBO_PRZEWAGA_NIEBIESKIEGO && b >= g) return true
  const maks = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return maks >= NIEBO_MIN_JASNOSC_BIALE && maks - min <= NIEBO_MAX_ROZNICA_KANALOW_BIALE
}

function mediana(wartosci: number[]): number {
  const s = [...wartosci].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]!
}

export function wykryjLinieHoryzontu(rgba: ArrayLike<number>, szerokoscPx: number, wysokoscPx: number): WykrytaLinia {
  const minSeria = Math.max(NIEBO_MIN_SERIA_PX, Math.round(wysokoscPx * NIEBO_MIN_SERIA_UDZIAL_WYSOKOSCI))
  const krok = Math.max(1, Math.floor(szerokoscPx / NIEBO_PUNKTOW_NA_ZDJECIE))
  const surowe: (PunktPiksela | null)[] = []
  let przyGorze = 0
  let sameNiebo = 0
  for (let x = 0; x < szerokoscPx; x += krok) {
    let seria = 0
    let poczatekSerii = -1
    let znalezione = -1
    for (let y = 0; y < wysokoscPx; y++) {
      const i = (y * szerokoscPx + x) * 4
      if (czyNiebo(rgba[i]!, rgba[i + 1]!, rgba[i + 2]!)) {
        seria = 0
        poczatekSerii = -1
      } else {
        if (seria === 0) poczatekSerii = y
        seria++
        if (seria >= minSeria) {
          znalezione = poczatekSerii
          break
        }
      }
    }
    if (znalezione < 0) {
      sameNiebo++
      surowe.push(null)
      continue
    }
    if (znalezione === 0) przyGorze++
    surowe.push({ x, y: znalezione })
  }
  // Split at pure-sky columns, smooth every stretch with a running median.
  const odcinki: PunktPiksela[][] = []
  let biezacy: PunktPiksela[] = []
  for (const p of surowe) {
    if (p) biezacy.push(p)
    else if (biezacy.length > 0) {
      odcinki.push(biezacy)
      biezacy = []
    }
  }
  if (biezacy.length > 0) odcinki.push(biezacy)
  const polowa = Math.max(1, Math.round(surowe.length * NIEBO_OKNO_MEDIANY_UDZIAL))
  const linie = odcinki.map((o) =>
    o.map((p, i) => ({ x: p.x, y: mediana(o.slice(Math.max(0, i - polowa), i + polowa + 1).map((q) => q.y)) })),
  )
  return { linie, kolumnPrzyGorzeKadru: przyGorze, kolumnSameNiebo: sameNiebo }
}
