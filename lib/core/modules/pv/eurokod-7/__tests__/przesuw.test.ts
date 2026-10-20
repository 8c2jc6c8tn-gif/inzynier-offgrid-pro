import { describe, expect, it } from "vitest"
import { balastPrzesuwuEc7Kg, parsujListeLiczb, PODEJSCIA_EC7, przesuwEc7, wspolczynnikTarciaZKataGruntu, wspolczynnikTarciaZProby } from "../przesuw"

const g = 9.80665

describe("PN-EN 1997-1 p. 6.5.3 — przesuw, cztery kombinacje z Załącznika A", () => {
  // References computed independently in Python (Directive #3): Fh = 10000 N, Fv = 0, μ = 0,5, G = 0.
  it("czysta siła pozioma: PO1-K1 3059, PO1-K2 3314, PO2 3365, PO3 3824 kg", () => {
    const r = (p: Parameters<typeof balastPrzesuwuEc7Kg>[0]) => balastPrzesuwuEc7Kg(p, 10000, 0, 0.5, g)
    expect(r("PO1-K1")).toBeCloseTo(3058.9, 0)
    expect(r("PO1-K2")).toBeCloseTo(3314.0, 0)
    expect(r("PO2")).toBeCloseTo(3364.8, 0)
    expect(r("PO3")).toBeCloseTo(3823.6, 0)
  })

  it("z siłą odrywającą (Fh = Fv = 7071 N, 45°): PO1-K1 3245, PO1-K2 3281, PO2 3461, PO3 3786 kg", () => {
    const f = 10000 * Math.sin(Math.PI / 4)
    const r = (p: Parameters<typeof balastPrzesuwuEc7Kg>[0]) => balastPrzesuwuEc7Kg(p, f, f, 0.5, g)
    expect(r("PO1-K1")).toBeCloseTo(3245, 0)
    expect(r("PO1-K2")).toBeCloseTo(3281, 0)
    expect(r("PO2")).toBeCloseTo(3461, 0)
    expect(r("PO3")).toBeCloseTo(3786, 0)
  })

  it("obwiednia = największy ze wszystkich, z podaniem podejścia; przy wartościach zalecanych zawsze PO3", () => {
    for (const [fh, fv, mu] of [[10000, 0, 0.5], [3000, 9000, 0.3], [8000, 2000, 0.9]] as const) {
      const r = przesuwEc7(fh, fv, mu, g)
      expect(r.balastKg).toBeCloseTo(Math.max(...Object.values(r.wgPodejsc)), 9)
      expect(r.wgPodejsc[r.podejscie]).toBeCloseTo(r.balastKg, 9)
      expect(r.podejscie).toBe("PO3")
    }
  })

  it("masa własna pomniejsza balast (γ_G korzystne = 1,0 — bez zaniżania 0,9 jak w EQU), nie poniżej zera", () => {
    expect(balastPrzesuwuEc7Kg("PO3", 10000, 0, 0.5, g, 100)).toBeCloseTo(3823.6 - 100, 0)
    expect(balastPrzesuwuEc7Kg("PO3", 10000, 0, 0.5, g, 1e7)).toBe(0)
  })

  it("tabela współczynników = Załącznik A: γ_G korzystne 1,0 wszędzie, γ_Q 1,5 / 1,3, γ_φ′ 1,0 / 1,25, γ_R;h 1,0 / 1,1 / 1,0", () => {
    expect(Object.values(PODEJSCIA_EC7).every((w) => w.gammaGKorzystne === 1.0)).toBe(true)
    expect(PODEJSCIA_EC7["PO1-K2"]).toEqual({ gammaQ: 1.3, gammaGKorzystne: 1.0, gammaPhi: 1.25, gammaRh: 1.0 })
    expect(PODEJSCIA_EC7.PO2.gammaRh).toBe(1.1)
    expect(PODEJSCIA_EC7.PO3.gammaPhi).toBe(1.25)
  })
})

describe("μ z kąta tarcia gruntu wg p. 6.5.3 (10)", () => {
  it("prefabrykat: δ = 2/3·φ′_cv; beton wylewany: δ = φ′_cv", () => {
    expect(wspolczynnikTarciaZKataGruntu(30, "prefabrykat")).toBeCloseTo(Math.tan((20 * Math.PI) / 180), 12) // 0,3640
    expect(wspolczynnikTarciaZKataGruntu(30, "wylewany")).toBeCloseTo(Math.tan((30 * Math.PI) / 180), 12) // 0,5774
    expect(wspolczynnikTarciaZKataGruntu(30, "prefabrykat")!).toBeCloseTo(0.364, 3)
  })
  it("poza zakresem → null", () => {
    for (const x of [0, -5, 90, 120, NaN]) expect(wspolczynnikTarciaZKataGruntu(x, "prefabrykat")).toBeNull()
  })
})

describe("μ z próby na miejscu (F = μ·m·g w chwili ruszenia)", () => {
  // Reference computed independently in Python: 25 kg block, forces 118 / 124 / 121 N → min 118 → 118/(25·9,80665) = 0,4813.
  it("bierze NAJNIŻSZY wynik z prób", () => {
    const r = wspolczynnikTarciaZProby(25, [118, 124, 121], g)!
    expect(r.najnizszaSilaN).toBe(118)
    expect(r.liczbaProb).toBe(3)
    expect(r.wspolczynnikTarcia).toBeCloseTo(0.4813, 4)
  })

  it("jedna próba też działa; masa i siły muszą być dodatnie, lista niepusta", () => {
    expect(wspolczynnikTarciaZProby(10, [49], g)!.wspolczynnikTarcia).toBeCloseTo(49 / (10 * g), 9)
    expect(wspolczynnikTarciaZProby(0, [10], g)).toBeNull()
    expect(wspolczynnikTarciaZProby(-5, [10], g)).toBeNull()
    expect(wspolczynnikTarciaZProby(10, [], g)).toBeNull()
    expect(wspolczynnikTarciaZProby(10, [10, 0], g)).toBeNull()
    expect(wspolczynnikTarciaZProby(10, [10, NaN], g)).toBeNull()
  })

  it("parser listy: spacje, średniki i nowe linie rozdzielają, przecinek to przecinek dziesiętny", () => {
    expect(parsujListeLiczb("12,5 13  11.8")).toEqual([12.5, 13, 11.8])
    expect(parsujListeLiczb("1;2\n3")).toEqual([1, 2, 3])
    expect(parsujListeLiczb("")).toBeNull()
    expect(parsujListeLiczb("12 abc")).toBeNull()
  })
})
