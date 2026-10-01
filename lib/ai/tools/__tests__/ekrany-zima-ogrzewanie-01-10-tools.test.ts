import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { deficytyMiesieczneTool } from "../deficyty-miesieczne-tool"
import { cykleOdszranianiaTool } from "../cykle-odszraniania-tool"
import { wentylacjaGrawitacyjnaTool } from "../wentylacja-grawitacyjna-tool"

describe("deficytyMiesieczneTool (M7/E2, dawne 6.2)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(deficytyMiesieczneTool.operationType).toBe("read")
    expect(deficytyMiesieczneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(deficytyMiesieczneTool)).not.toThrow()
  })

  it("luty 160 kWh, agregat 5 kW, zapas 50 l → 🟡 paliwo ponad zapas jako tekst PL", async () => {
    const deficytyKwh = Array.from({ length: 12 }, (_, i) => (i === 1 ? 160 : 0))
    const w = await deficytyMiesieczneTool.handler({
      deficytyKwh,
      mocAgregatuKw: 5,
      zuzyciePaliwaLH: 1.5,
      cenaPaliwaZlL: 7,
      kosztSerwisuZlH: 0,
      zapasPaliwaL: 50,
    })
    expect(w.sumaGodzin).toBeCloseTo(40, 9)
    expect(w.ostrzezenia).toContain(t("pl", "DEFM-PALIWO-PONAD-ZAPAS", { miesiac: 2, godziny: 40, litry: 60, zapas: 50 }))
  })
})

describe("cykleOdszranianiaTool (M6/E6, dawne 5.6 + 1.14 + 6.8)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(cykleOdszranianiaTool.operationType).toBe("read")
    expect(cykleOdszranianiaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(cykleOdszranianiaTool)).not.toThrow()
  })

  it("−22 °C przy minimum pracy −20 °C → 🟡 jako tekst PL", async () => {
    const w = await cykleOdszranianiaTool.handler({
      tZewnC: -22,
      wilgotnoscPct: 0,
      odstepMin: 60,
      czasDefrostuMin: 5,
      mocDefrostuKw: 2,
      mocBazowaKw: 2,
      godzinySzronieniaH: 0,
      copKatalogowy: 0,
      tMinPracyC: -20,
    })
    expect(w.ostrzezenia).toContain(t("pl", "CYK-PONIZEJ-MIN-PRACY", { tZewn: -22, tMin: -20 }))
  })
})

describe("wentylacjaGrawitacyjnaTool (M6/E9, dawne 5.9)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(wentylacjaGrawitacyjnaTool.operationType).toBe("read")
    expect(wentylacjaGrawitacyjnaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(wentylacjaGrawitacyjnaTool)).not.toThrow()
  })

  it("szczelny dom → 🟡 pleśń jako tekst PL", async () => {
    const w = await wentylacjaGrawitacyjnaTool.handler({
      kubaturaM3: 300,
      wymianyNaDobe: 8,
      tWewC: 20,
      tZewnC: 0,
      stratyPozostaleW: 0,
      sprawnoscOdzyskuPct: 0,
      dni: 0,
      szczelnyDom: true,
    })
    expect(w.strumienM3H).toBeCloseTo(100, 9)
    expect(w.ostrzezenia).toContain(t("pl", "WPOR-NATURALNA-SZCZELNY-DOM"))
  })
})
