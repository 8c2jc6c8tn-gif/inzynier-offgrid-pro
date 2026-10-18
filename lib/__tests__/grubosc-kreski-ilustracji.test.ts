import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const korzen = path.resolve(__dirname, "../..")
const symbole = readFileSync(path.join(korzen, "components/kafle-ikony/definicje-symboli.tsx"), "utf8")

/**
 * Minimal stroke of a tile illustration (owner's decision 18.10.2026, docs/ikony-rozmiary.md): at the minimum display size of 80 px a 256-unit
 * `viewBox` is scaled by 80/256, so 1 px = 3.2 units. Strokes carrying meaning must be at least that thick, and text inside illustrations is not
 * allowed (the meaning is carried by shapes). The existing animated SVG illustrations do not meet it; they are NOT shown today (every tile has a
 * Bob or a 3D image), so this is a ratchet: the debt may only shrink, a new stroke thinner than the minimum or a new <text> fails the test.
 */
const MIN_KRESKA_JEDNOSTEK = 3.2
const ISTNIEJACE_CIENKIE_KRESKI = 65
const ISTNIEJACE_NAPISY = 23

describe("stroke thickness and text in tile illustrations (ratchet)", () => {
  const kreski = [...symbole.matchAll(/stroke-width="(\.?[0-9.]+)"/g)].map((m) => Number(m[1]))
  const napisy = [...symbole.matchAll(/<text\b/g)].length

  it("the number of strokes thinner than 3.2 units does not grow", () => {
    expect(kreski.filter((k) => k < MIN_KRESKA_JEDNOSTEK).length).toBeLessThanOrEqual(ISTNIEJACE_CIENKIE_KRESKI)
  })

  it("the number of texts inside illustrations does not grow", () => {
    expect(napisy).toBeLessThanOrEqual(ISTNIEJACE_NAPISY)
  })

  it("the minimum matches the 80 px minimum on a 256-unit viewBox (1 px = 3.2 units)", () => {
    expect(MIN_KRESKA_JEDNOSTEK).toBeCloseTo(256 / 80, 10)
  })
})
