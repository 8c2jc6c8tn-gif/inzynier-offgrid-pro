import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { doborMocyPompyTool } from "../dobor-mocy-pompy-tool"
import { krzywaGrzewczaTool } from "../krzywa-grzewcza-tool"
import { modelSezonowyPompyTool } from "../model-sezonowy-pompy-tool"
import { buforPracaPompyTool } from "../bufor-praca-pompy-tool"
import { przeplywPompyCieplaTool } from "../przeplyw-pompy-ciepla-tool"
import { cwuPompaCieplaTool } from "../cwu-pompa-ciepla-tool"
import { gwcPompaCieplaTool } from "../gwc-pompa-ciepla-tool"
import { defrostSezonTool } from "../defrost-sezon-tool"
import { raportEfektywnosciTool } from "../raport-efektywnosci-budynku-tool"
import { planPoprawyTool } from "../plan-poprawy-efektywnosci-tool"

describe("doborMocyPompyTool (M6 Część 2B, dawne 5.27 + 5.67)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(doborMocyPompyTool.operationType).toBe("read")
    expect(doborMocyPompyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(doborMocyPompyTool)).not.toThrow()
  })

  it("pompa 5 kW przy 6 kW zapotrzebowania → 🟡 deficyt jako tekst PL", async () => {
    const w = await doborMocyPompyTool.handler({
      zapotrzebowanieKw: 6,
      mocPompyProjKw: 5,
      tProjC: -20,
      tWewnC: 20,
      tDrugiC: null,
      mocPompyDrugiKw: 0,
    })
    expect(w.dogrzewanieKw).toBeCloseTo(1, 9)
    expect(w.ostrzezenia).toContain(t("pl", "DMP-DEFICYT", { brak: 1, zapotrzebowanie: 6, moc: 5 }))
  })
})

describe("krzywaGrzewczaTool (M6 Część 2B, dawne 5.71)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(krzywaGrzewczaTool.operationType).toBe("read")
    expect(krzywaGrzewczaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(krzywaGrzewczaTool)).not.toThrow()
  })

  it("przykład źródła: 33 °C przy 0 °C; założenie o grzejnikach jako tekst PL", async () => {
    const w = await krzywaGrzewczaTool.handler({
      tZewn1C: 10,
      tZewn2C: -10,
      tZasil1C: 28,
      tZasil2C: 38,
      tZasilNowa1C: null,
      tZasilNowa2C: null,
      tOcenyC: 0,
      copObecny: 0,
      cieploSezonKwh: 0,
    })
    expect(w.zasilanieC).toBeCloseTo(33, 9)
    expect(w.zalozenia).toContain(t("pl", "KRZ-ZAL-BEZ-GRZEJNIKOW"))
  })
})

describe("modelSezonowyPompyTool (M6 Część 2C, dawne 5.64 + 5.43)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(modelSezonowyPompyTool.operationType).toBe("read")
    expect(modelSezonowyPompyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(modelSezonowyPompyTool)).not.toThrow()
  })

  it("jeden miesiąc 3100 kWh przy COP 3,1 → 1000 kWh, ℹ️ zapas zimowy jako tekst PL", async () => {
    const pusty = Array<number | null>(12).fill(null)
    const w = await modelSezonowyPompyTool.handler({
      cieploKwh: pusty.map((x, i) => (i === 0 ? 3100 : x)),
      cop: pusty.map((x, i) => (i === 0 ? 3.1 : x)),
      scopKatalogowy: 0,
    })
    expect(w.energiaSumaKwh).toBeCloseTo(1000, 9)
    expect(w.ostrzezenia).toContain(t("pl", "MSP-ZIMA-ZAPAS", { kwh: 1000, doba: 32.26 }))
  })
})

describe("buforPracaPompyTool (M6 Część 2B, dawne 5.28 + 5.70)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(buforPracaPompyTool.operationType).toBe("read")
    expect(buforPracaPompyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(buforPracaPompyTool)).not.toThrow()
  })

  it("bufor 400 l przy 100 l wody → 5× mniej startów; założenie o oszczędnościach jako tekst PL", async () => {
    const w = await buforPracaPompyTool.handler({
      mocPompyKw: 8,
      obciazenieKw: 2,
      wodaInstalacjiL: 100,
      histerezaK: 5,
      buforL: 400,
      dTMagazynK: 0,
      stratyPostojoweW: 0,
      dniPracy: 0,
    })
    expect(w.bez!.startyDoba / w.z!.startyDoba).toBeCloseTo(5, 9)
    expect(w.zalozenia).toContain(t("pl", "BPP-ZAL-BEZ-OSZCZEDNOSCI"))
  })
})

describe("przeplywPompyCieplaTool (M6 Część 2B, dawne 5.65)", () => {
  const r2 = (x: number) => Math.round(x * 100) / 100

  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(przeplywPompyCieplaTool.operationType).toBe("read")
    expect(przeplywPompyCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(przeplywPompyCieplaTool)).not.toThrow()
  })

  it("7 kW przy ΔT 5 K → ok. 1,2 m³/h; pompa obiegowa 0,9 m³/h → 🟡 za mały przepływ jako tekst PL", async () => {
    const w = await przeplywPompyCieplaTool.handler({ mocPompyKw: 7, dTK: 5, przeplywPompyM3H: 0.9, minPrzeplywM3H: 0 })
    expect(w.wymaganyM3H).toBeCloseTo(1.2, 1)
    expect(w.rzeczywistyDTK).not.toBeNull()
    expect(w.ostrzezenia).toContain(
      t("pl", "PRZ-PRZEPLYW-ZA-MALY", { pompa: 0.9, wymagany: r2(w.wymaganyM3H), dt: r2(w.rzeczywistyDTK!) }),
    )
  })
})

describe("cwuPompaCieplaTool (M6 Część 2B, dawne 5.30 + 5.58)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(cwuPompaCieplaTool.operationType).toBe("read")
    expect(cwuPompaCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(cwuPompaCieplaTool)).not.toThrow()
  })

  it("200 l do 60 °C przy pompie do 55 °C → ℹ️ dogrzew grzałką jako tekst PL", async () => {
    const w = await cwuPompaCieplaTool.handler({
      pojemnoscL: 200,
      tStartC: 30,
      tKoniecC: 60,
      tMaxPompyC: 55,
      copCwu: 3.2,
      mocCieplnaPompyKw: 2.9,
      mocGrzalkiKw: 2,
      mocPvKw: 0,
    })
    expect(w.energiaRazemKwh).toBeLessThan(w.energiaSamaGrzalkaKwh)
    expect(w.ostrzezenia).toContain(t("pl", "CWP-PRZEGRZEW-GRZALKA", { tmax: 55, kwh: Math.round(w.cieploGrzalkaKwh * 100) / 100 }))
  })
})

describe("gwcPompaCieplaTool (M6 Część 2B, dawne 5.54)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(gwcPompaCieplaTool.operationType).toBe("read")
    expect(gwcPompaCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(gwcPompaCieplaTool)).not.toThrow()
  })

  it("GWC 600 m³/h +6 K przed parownikiem 1200 m³/h → +3 K; ℹ️ tylko wsparcie jako tekst PL", async () => {
    const w = await gwcPompaCieplaTool.handler({
      strumienGwcM3H: 600,
      przyrostGwcK: 6,
      strumienParownikaM3H: 1200,
      mocPompyKw: 6,
      copBezGwc: 3,
      copZGwc: 0,
      cieploKwh: 0,
    })
    expect(w.wzrostTempParownikaK).toBeCloseTo(3, 9)
    expect(w.ostrzezenia).toContain(t("pl", "GWP-TYLKO-WSPARCIE", { pct: Math.round(w.udzialGwcPct) }))
  })
})

describe("defrostSezonTool (M6 Część 2B, dawne 5.56)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(defrostSezonTool.operationType).toBe("read")
    expect(defrostSezonTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(defrostSezonTool)).not.toThrow()
  })

  it("2 kW, co 45 min na 5 min, 12 h × 60 dni przy 4000 kWh pompy → ℹ️ udział jako tekst PL", async () => {
    const w = await defrostSezonTool.handler({
      mocDefrostuKw: 2,
      scenariusze: [{ odstepMin: 45, czasDefrostuMin: 5, godzinyDobaH: 12, dni: 60 }],
      zuzyciePompySezonKwh: 4000,
    })
    expect(w.sumaKwh).toBeCloseTo(2 * (5 / 45) * 12 * 60, 9)
    expect(w.ostrzezenia).toContain(t("pl", "DSZ-UDZIAL-USTAWIENIA", { pct: Math.round(w.udzialPct! * 10) / 10 }))
  })
})

describe("raportEfektywnosciTool (M6 Część 2B, dawne 5.40 + 5.67)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(raportEfektywnosciTool.operationType).toBe("read")
    expect(raportEfektywnosciTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(raportEfektywnosciTool)).not.toThrow()
  })

  it("wentylacja największa; założenie o braku klasy energetycznej jako tekst PL", async () => {
    const w = await raportEfektywnosciTool.handler({
      pozycje: [
        { nazwa: "Ściany", strataW: 3000 },
        { nazwa: "Wentylacja", strataW: 4000 },
      ],
      cieploRokKwh: 12000,
      powierzchniaM2: 120,
      cop: 3,
      cenaZlKwh: 1.2,
    })
    expect(w.ranking[0].nazwa).toBe("Wentylacja")
    expect(w.kosztRokZl).toBeCloseTo(4800, 9)
    expect(w.zalozenia).toContain(t("pl", "RAP-ZAL-BEZ-KLASY"))
  })
})

describe("planPoprawyTool (M6 Część 2C, dawne 5.68)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(planPoprawyTool.operationType).toBe("read")
    expect(planPoprawyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(planPoprawyTool)).not.toThrow()
  })

  it("dach (3 lata) przed oknami (8 lat); ℹ️ brak sumowania jako tekst PL", async () => {
    const w = await planPoprawyTool.handler({
      dzialania: [
        { nazwa: "Okna", oszczednoscCieplaKwh: 800, kosztZl: 6400 },
        { nazwa: "Dach", oszczednoscCieplaKwh: 2000, kosztZl: 6000 },
      ],
      cop: 1,
      cenaZlKwh: 1,
    })
    expect(w.plan.map((p) => p.nazwa)).toEqual(["Dach", "Okna"])
    expect(w.ostrzezenia).toContain(t("pl", "PLAN-NIE-SUMUJ"))
  })
})
