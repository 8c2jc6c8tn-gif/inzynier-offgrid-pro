import { existsSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV, znajdzPanelKatalogu } from "../index"

describe("katalog paneli PV", () => {
  it("identyfikatory są unikalne, a każdy wpis wskazuje istniejący plik źródłowy w repo", () => {
    expect(new Set(KATALOG_PANELI_PV.map((p) => p.id)).size).toBe(KATALOG_PANELI_PV.length)
    for (const p of KATALOG_PANELI_PV) expect(existsSync(p.zrodlo), p.zrodlo).toBe(true)
  })

  it("JA Solar: moc, γ i NOCT zgodne z transkrypcją karty; brakujące parametry karty to null, nie wartości typowe", () => {
    const zrodlo = readFileSync(KATALOG_PANELI_PV[0]!.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,290%/°C**")
    expect(zrodlo).toContain("NOCT | 45±2°C")
    const p500 = znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!
    expect(p500).toMatchObject({ pmaxW: 500, gammaPctNaC: -0.29, noctC: 45, bifacjalny: true })
    expect(p500.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(p500.degradacjaPierwszyRokPct).toBeNull()
    expect(KATALOG_PANELI_PV.map((p) => p.pmaxW)).toEqual([485, 490, 495, 500, 505, 510])
  })
})
