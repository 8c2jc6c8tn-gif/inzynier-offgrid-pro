import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { malyObiektCieplaTool, MalyObiektCieplaToolInput } from "../maly-obiekt-ciepla-tool"

const kamper = {
  dlugoscM: 4,
  szerokoscM: 2,
  wysokoscM: 2,
  uScianWM2K: 0.5,
  uDachuWM2K: 0.4,
  uPodlogiWM2K: 0.6,
  podlogaNadPowietrzem: true,
  otworyM2: 2,
  uOtworowWM2K: 2,
  temperaturaWewnetrznaC: 20,
  strefaKlimatyczna: 3,
  wymianyPowietrzaNaH: 1,
}

describe("malyObiektCieplaTool (M6, tryb mikroinstalacji)", () => {
  it("kontrakt 9.3 ('read', bez potwierdzenia)", () => {
    expect(malyObiektCieplaTool.operationType).toBe("read")
    expect(malyObiektCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(malyObiektCieplaTool)).not.toThrow()
  })

  it("kamper 4×2×2 m: przenikanie 23 W/K × 40 K = 920 W, moc ≈ 1,1 kW, ostrzeżenia i założenia po polsku", async () => {
    const w = await malyObiektCieplaTool.handler(MalyObiektCieplaToolInput.parse(kamper))
    expect(w.strataPrzenikanieW).toBeCloseTo(920, 6)
    expect(w.temperaturaObliczeniowaC).toBe(-20)
    expect(w.obciazenieW).toBeGreaterThan(920)
    expect(w.cieploDobaObliczeniowaKwh).toBeCloseTo((w.obciazenieW! * 24) / 1000, 6)
    expect(w.zalozenia).toContain(t("pl", "MOBIEKT-ZAL-PROSTOPADLOSCIAN"))
    expect(w.energiaElektrycznaUzytkowanieKwh).toBeNull()
  })

  it("prąd tylko w miesiącach użytkowania", async () => {
    const w = await malyObiektCieplaTool.handler(
      MalyObiektCieplaToolInput.parse({
        ...kamper,
        cop: 1,
        srednieTemperaturyMiesieczneC: [-3, -2, 2, 8, 13, 16, 18, 18, 13, 8, 3, -1],
        miesiaceUzytkowania: [true, false, false, false, false, false, false, false, false, false, false, true],
      }),
    )
    const e = w.energiaElektrycznaUzytkowanieKwh!
    expect(e.filter((x) => x > 0)).toHaveLength(2)
    expect(w.rokUzytkowaniaKwh).toBeCloseTo(e[0]! + e[11]!, 6)
  })

  it("nagrzewnica na paliwo: dni zapasu z silnika M6/E1; otwory większe niż ściany → INVALID_INPUT z tekstem PL", async () => {
    const p = await malyObiektCieplaTool.handler(MalyObiektCieplaToolInput.parse({ ...kamper, paliwo: { jednostka: "l", wartoscOpalowaKwh: 10, sprawnoscPct: 80, zapas: 20 } }))
    expect(p.dniPaliwaPrzyMrozieObliczeniowym).toBeGreaterThan(0)
    const b = await malyObiektCieplaTool.handler(MalyObiektCieplaToolInput.parse({ ...kamper, otworyM2: 30 }))
    expect(b.status).toBe("INVALID_INPUT")
    expect(b.ostrzezenia[0]).toBe(t("pl", "MOBIEKT-OTWORY-WIEKSZE-NIZ-SCIANY", { otwory: 30, sciany: 24 }))
  })
})
