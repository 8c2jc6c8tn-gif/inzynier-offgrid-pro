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
  it.each(["ikona-xs", "ikona-s", "ikona-ui", "ikona-kafel"])("token --%s is defined and sits on the scale", (nazwa) => {
    const wartosci = wartosciTokenu(nazwa)
    expect(wartosci.length).toBeGreaterThan(0)
    for (const px of wartosci) expect(SKALA_PX).toContain(px)
  })

  it("the tile icon grows with the screen: phone < tablet < desktop", () => {
    const [telefon, tablet, desktop] = wartosciTokenu("ikona-kafel")
    expect(telefon).toBeGreaterThanOrEqual(80)
    expect(tablet).toBeGreaterThan(telefon)
    expect(desktop).toBeGreaterThan(tablet)
  })

  it("the tile icon component takes its size from the token, not from a number in code", () => {
    const komponent = readFileSync(path.join(korzen, "components/kafle-ikony/ikona.tsx"), "utf8")
    expect(komponent).not.toMatch(/width=|height=|size\s*=\s*\d/)
    const css = readFileSync(path.join(korzen, "components/kafle-ikony/kafle-ikony.css"), "utf8")
    expect(css).toContain("var(--ikona-kafel)")
  })
})
