import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { obciazenieDachuSniegiemTool } from "../obciazenie-dachu-sniegiem-tool"
import { sztywnienieIzolacjiTool } from "../sztywnienie-izolacji-tool"
import { elektronikaWMrozieTool } from "../elektronika-w-mrozie-tool"
import { pompyZaworyWMrozieTool } from "../pompy-zawory-w-mrozie-tool"

describe("obciazenieDachuSniegiemTool (M7/E23, dawne 6.34→7.32)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(obciazenieDachuSniegiemTool.operationType).toBe("read")
    expect(obciazenieDachuSniegiemTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(obciazenieDachuSniegiemTool)).not.toThrow()
  })

  it("strefa 4, dach płaski, nośność 1,2 kN/m² → s = 1,28, twardy stop jako tekst PL", async () => {
    const w = await obciazenieDachuSniegiemTool.handler({
      strefa: 4,
      wysokoscNpmM: 50,
      katDachuDeg: 0,
      ekspozycja: "normalny",
      barierkiLubAttyka: false,
      nosnoscDachuKnM2: 1.2,
      gruboscWarstwyCm: 0,
      rodzajSniegu: null,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.sKnM2).toBeCloseTo(1.28, 12)
    expect(w.ostrzezenia).toContain(
      t("pl", "SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC", { s: "1.28", nosnosc: "1.20" }),
    )
    expect(w.zalozenia).toContain(t("pl", "SNIEG-ZALOZENIE-WARTOSC-CHARAKTERYSTYCZNA"))
  })
})

describe("sztywnienieIzolacjiTool (M7/E13, dawne 6.17→7.17)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(sztywnienieIzolacjiTool.operationType).toBe("read")
    expect(sztywnienieIzolacjiTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(sztywnienieIzolacjiTool)).not.toThrow()
  })

  it("PVC przy −15°C → twardy stop jako tekst PL, założenie o karcie producenta", async () => {
    const w = await sztywnienieIzolacjiTool.handler({ materialy: ["PVC"], temperaturaMinimalnaC: -15 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.ostrzezenia).toContain(t("pl", "MROZ-PVC-PONIZEJ-PROGU", { temp: -15, prog: -10 }))
    expect(w.zalozenia).toContain(t("pl", "MROZ-ZALOZENIE-PROGI-OGOLNE"))
  })
})

describe("elektronikaWMrozieTool (M7/E19, dawne 6.29→7.27)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(elektronikaWMrozieTool.operationType).toBe("read")
    expect(elektronikaWMrozieTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(elektronikaWMrozieTool)).not.toThrow()
  })

  it("BMS −10°C w garażu −20°C → twardy stop jako tekst PL", async () => {
    const w = await elektronikaWMrozieTool.handler({
      temperaturaMiejscaC: -20,
      urzadzenia: [{ nazwa: "BMS", typ: "BMS", minTempPracyC: -10 }],
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.liczbaPonizejMin).toBe(1)
    expect(w.ostrzezenia).toContain(t("pl", "ELEKTRONIKA-BMS-PONIZEJ-MIN", { nazwa: "BMS", temp: -20, min: -10 }))
  })
})

describe("pompyZaworyWMrozieTool (M7/E21, dawne 6.32)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(pompyZaworyWMrozieTool.operationType).toBe("read")
    expect(pompyZaworyWMrozieTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(pompyZaworyWMrozieTool)).not.toThrow()
  })

  it("pompa −10°C w garażu −15°C + nieopróżniony zawór → dwa ostrzeżenia jako tekst PL", async () => {
    const w = await pompyZaworyWMrozieTool.handler({
      temperaturaMiejscaC: -15,
      elementy: [{ nazwa: "Pompa", typ: "pompa", minTempPracyC: -10 }],
      maZaworZewnetrzny: true,
      zaworZewnetrznyOprozniony: false,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.liczbaPonizejMin).toBe(1)
    expect(w.ostrzezenia).toContain(t("pl", "POMPY-ZAWOR-ZEWNETRZNY"))
    expect(w.ostrzezenia).toContain(t("pl", "POMPY-PONIZEJ-MIN-POMPA", { nazwa: "Pompa", temp: -15, min: -10 }))
  })
})
