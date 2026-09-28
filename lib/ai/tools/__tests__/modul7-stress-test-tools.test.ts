import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { obciazenieDachuSniegiemTool } from "../obciazenie-dachu-sniegiem-tool"
import { sztywnienieIzolacjiTool } from "../sztywnienie-izolacji-tool"
import { elektronikaWMrozieTool } from "../elektronika-w-mrozie-tool"
import { pompyZaworyWMrozieTool } from "../pompy-zawory-w-mrozie-tool"
import { grzalkiDachoweTool } from "../grzalki-dachowe-tool"
import { ryzykoZamarznieciaTool } from "../ryzyko-zamarzniecia-tool"
import { agregatWMrozieTool } from "../agregat-w-mrozie-tool"

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

describe("grzalkiDachoweTool (M7/E11, dawne 6.16)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(grzalkiDachoweTool.operationType).toBe("read")
    expect(grzalkiDachoweTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(grzalkiDachoweTool)).not.toThrow()
  })

  it("przykład źródła 12 m × 30 W/m, 6 h → 360 W, 2,16 kWh; zapas 300 W → ostrzeżenie PL", async () => {
    const w = await grzalkiDachoweTool.handler({
      dlugoscKablaM: 12,
      mocNaMetrW: 30,
      godzinyPracyNaDobe: 6,
      mocPompyCieplaW: null,
      zapasMocyW: 300,
    })
    expect(w.mocW).toBe(360)
    expect(w.energiaKwhDoba).toBeCloseTo(2.16, 12)
    expect(w.ostrzezenia).toContain(t("pl", "GRZALKI-BRAK-ZAPASU-MOCY", { moc: 360, zapas: 300 }))
  })
})

describe("ryzykoZamarznieciaTool (M7/E22 tryb grunt, dawne 6.35 + 6.37)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(ryzykoZamarznieciaTool.operationType).toBe("read")
    expect(ryzykoZamarznieciaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(ryzykoZamarznieciaTool)).not.toThrow()
  })

  it("kabel 40 cm przy strefie 80 cm → twardy stop jako tekst PL", async () => {
    const w = await ryzykoZamarznieciaTool.handler({
      glebokoscPrzemarzaniaCm: 80,
      instalacje: [{ nazwa: "Kabel", typ: "kabel", glebokoscCm: 40 }],
      metodaRozmrazania: "nie-dotyczy",
    })
    expect(w.liczbaWStrefie).toBe(1)
    expect(w.ostrzezenia).toContain(t("pl", "ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE", { nazwa: "Kabel", glebokosc: 40, hz: 80 }))
  })
})

describe("agregatWMrozieTool (M7/E8, dawne 6.9/6.23/6.36)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(agregatWMrozieTool.operationType).toBe("read")
    expect(agregatWMrozieTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(agregatWMrozieTool)).not.toThrow()
  })

  it("przykład źródła 120 h, 1,5 l/h, olej co 50 h → 180 l, 2 wymiany; postój 14 dni w −20°C → ostrzeżenie PL", async () => {
    const w = await agregatWMrozieTool.handler({
      paliwo: "diesel-arktyczny",
      temperaturaMiejscaC: -20,
      wymaganyCzasPracyH: 120,
      maxPracaCiaglaH: 8,
      przerwaH: 1,
      zuzyciePaliwaLH: 1.5,
      interwalWymianyOlejuH: 50,
      dniPostoju: 14,
    })
    expect(w.paliwoL).toBeCloseTo(180, 12)
    expect(w.wymianyOleju).toBe(2)
    expect(w.ostrzezenia).toContain(t("pl", "AGREGAT-DLUGI-POSTOJ", { dni: 14, temp: -20 }))
  })
})
