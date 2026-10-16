import { describe, expect, it } from "vitest"
import { uZWarstw } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/u-z-warstw"
import { MATERIALY_PRZEGROD, SZABLONY_PRZEGROD, znajdzMaterial, znajdzSzablon } from "../index"

describe("biblioteka materiałów przegród", () => {
  it("identyfikatory są unikalne, λ i grubości dodatnie", () => {
    expect(new Set(MATERIALY_PRZEGROD.map((m) => m.id)).size).toBe(MATERIALY_PRZEGROD.length)
    for (const m of MATERIALY_PRZEGROD) {
      expect(m.lambdaWmK).toBeGreaterThan(0)
      expect(m.gruboscDomyslnaMm).toBeGreaterThan(0)
    }
  })

  it("tylko Knauf (karta producenta) i EPDM (ISO 10456) mają status inny niż orientacyjny — jak w źródle", () => {
    const lepsze = MATERIALY_PRZEGROD.filter((m) => m.status !== "orientacyjne").map((m) => `${m.id}:${m.status}`)
    expect(lepsze).toEqual([
      "knauf-unifit-032:karta-producenta",
      "knauf-unifit-033:karta-producenta",
      "knauf-unifit-035:karta-producenta",
      "knauf-unifit-037:karta-producenta",
      "membrana-epdm:norma",
    ])
  })

  it("λ Knauf Unifit 032/033/035/037 = 0,032/0,033/0,035/0,037 (karta producenta wg źródła)", () => {
    expect(["032", "033", "035", "037"].map((s) => znajdzMaterial(`knauf-unifit-${s}`)!.lambdaWmK)).toEqual([0.032, 0.033, 0.035, 0.037])
  })

  it("każdy szablon odwołuje się do istniejących materiałów", () => {
    for (const s of SZABLONY_PRZEGROD) for (const w of s.warstwy) expect(znajdzMaterial(w.materialId)).not.toBeNull()
  })

  it("ściana szkieletowa: R = 0,012/0,13 + 0,145/0,038 + 0,0125/0,25 = 3,9581; U = 1/(0,13 + R + 0,04) = 0,2423 (obliczenie ręczne)", () => {
    const s = znajdzSzablon("sciana-szkieletowa")!
    const warstwy = s.warstwy.map((w) => ({ nazwa: w.materialId, gruboscMm: w.gruboscMm, lambdaWmK: znajdzMaterial(w.materialId)!.lambdaWmK, oporM2KW: null }))
    const u = uZWarstw(warstwy, s.kierunek)!
    expect(u.oporWarstwM2KW).toBeCloseTo(0.012 / 0.13 + 0.145 / 0.038 + 0.0125 / 0.25, 6)
    expect(u.oporWarstwM2KW).toBeCloseTo(3.9581, 3)
    expect(u.uWM2K).toBeCloseTo(1 / (0.13 + 3.9581 + 0.04), 4)
  })
})
