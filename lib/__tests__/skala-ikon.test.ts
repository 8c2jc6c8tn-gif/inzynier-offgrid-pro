import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const korzen = path.resolve(__dirname, "../..")
const globals = readFileSync(path.join(korzen, "app/globals.css"), "utf8")
const SKALA_PX = [16, 20, 24, 32, 48, 64, 80, 96, 112, 128]

function wartosciTokenu(nazwa: string): number[] {
  const wzor = new RegExp(`--${nazwa}:\\s*(\\d+)px`, "g")
  return [...globals.matchAll(wzor)].map((m) => Number(m[1]))
}

describe("skala rozmiarów ikon (D83)", () => {
  it.each(["ikona-kafel"])("token --%s is defined and sits on the scale", (nazwa) => {
    const wartosci = wartosciTokenu(nazwa)
    expect(wartosci.length).toBeGreaterThan(0)
    for (const px of wartosci) expect(SKALA_PX).toContain(px)
  })

  it("the legibility minimum of a tile illustration is 80 px (owner's decision 18.10.2026), on the scale and below the cap", () => {
    expect(wartosciTokenu("ikona-min")).toEqual([80])
    const [telefon] = wartosciTokenu("ikona-kafel")
    expect(telefon).toBeGreaterThanOrEqual(80)
  })

  it("every tile illustration wrapper carries the minimum next to the cap (3D icon / Bob and the animated SVG)", () => {
    for (const plik of ["components/ilustracja-kafla.tsx", "app/page.tsx"]) {
      const kod = readFileSync(path.join(korzen, plik), "utf8")
      expect(kod, plik).toContain("min-w-(--ikona-min) max-w-(--ikona-kafel)")
    }
  })

  it("the tile icon cap does not shrink with the screen: phone < tablet", () => {
    const [telefon, tablet] = wartosciTokenu("ikona-kafel")
    expect(telefon).toBeGreaterThanOrEqual(80)
    expect(tablet).toBeGreaterThan(telefon)
  })

  it("the tile icon takes its size from the token (CSS cap), not from a number in code", () => {
    const komponent = readFileSync(path.join(korzen, "components/kafle-ikony/ikona.tsx"), "utf8")
    expect(komponent).not.toMatch(/width=|height=|size\s*=\s*\d/)
    const pulpit = readFileSync(path.join(korzen, "app/page.tsx"), "utf8")
    expect(pulpit).toContain("max-w-(--ikona-kafel)")
  })
})
