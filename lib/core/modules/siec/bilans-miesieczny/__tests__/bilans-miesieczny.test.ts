import { describe, expect, it } from "vitest"
import { bilansMiesiaca, calculateBilansMiesieczny } from "../calculator"
import type { BilansMiesiecznyInput } from "../input"

const ZUZYCIE = [500, 450, 400, 330, 300, 300, 300, 300, 320, 380, 450, 500]
const UZYSK = [20, 35, 75, 110, 135, 140, 140, 120, 85, 55, 25, 15]

function wejscie(z: Partial<BilansMiesiecznyInput> = {}): BilansMiesiecznyInput {
  return {
    tryb: "siec",
    zuzycieMiesieczneKwh: ZUZYCIE,
    uzyskMiesiecznyKwhNaKwp: UZYSK,
    mocPvKwp: 5,
    autokonsumpcjaBezposrednia: 0.3,
    pojemnoscMagazynuKwh: 10,
    sprawnoscMagazynu: 0.9,
    ...z,
  }
}

describe("bilansMiesiaca — arytmetyka ręczna", () => {
  it("lato: magazyn domyka potrzebę, reszta nadwyżką", () => {
    const m = bilansMiesiaca(300, 500, 0.3, 10, 0.9, 31)
    expect(m.bezposrednioKwh).toBeCloseTo(150, 9)
    expect(m.zMagazynuKwh).toBeCloseTo(150, 9)
    expect(m.niedoborKwh).toBeCloseTo(0, 9)
    expect(m.nadwyzkaKwh).toBeCloseTo(350 - 150 / 0.9, 9)
  })

  it("zima: magazyn ograniczony nadmiarem produkcji × η", () => {
    const m = bilansMiesiaca(500, 100, 0.3, 10, 0.9, 31)
    expect(m.zMagazynuKwh).toBeCloseTo(63, 9)
    expect(m.niedoborKwh).toBeCloseTo(407, 9)
    expect(m.nadwyzkaKwh).toBeCloseTo(0, 9)
  })

  it("limit jednego cyklu na dobę", () => {
    const m = bilansMiesiaca(1000, 2000, 0.1, 2, 1, 30)
    expect(m.zMagazynuKwh).toBeCloseTo(60, 9)
  })

  it("bez magazynu — cała reszta produkcji to nadwyżka", () => {
    const m = bilansMiesiaca(300, 500, 0.3, 0, 0.9, 31)
    expect(m.zMagazynuKwh).toBe(0)
    expect(m.nadwyzkaKwh).toBeCloseTo(350, 9)
    expect(m.niedoborKwh).toBeCloseTo(150, 9)
  })
})

describe("calculateBilansMiesieczny", () => {
  it("sumy roczne zgodne z sumą miesięcy, bilans energii domknięty", () => {
    const r = calculateBilansMiesieczny(wejscie())
    const v = r.value!
    expect(v.zuzycieRokKwh).toBe(ZUZYCIE.reduce((s, x) => s + x, 0))
    for (const m of v.miesiace) {
      expect(m.bezposrednioKwh + m.zMagazynuKwh + m.niedoborKwh).toBeCloseTo(m.zuzycieKwh, 9)
    }
    expect(v.pokrycieWlasne).toBeCloseTo(1 - v.niedoborRokKwh / v.zuzycieRokKwh, 12)
    expect(v.niedoborZimaKwh).toBeCloseTo(v.miesiace[0].niedoborKwh + v.miesiace[11].niedoborKwh, 9)
  })

  it("tryb wyspa: niedobór zimą → ostrzeżenie z miesiącami", () => {
    const r = calculateBilansMiesieczny(wejscie({ tryb: "wyspa" }))
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    const w = r.warnings.find((x) => x.code === "SIEC-BILANS-NIEDOBOR-ZIMA")
    expect(w?.params?.miesiace).toBe("XII, I")
  })

  it("tryb sieć: niedobór to pobór z sieci, bez ostrzeżenia zimowego", () => {
    const r = calculateBilansMiesieczny(wejscie())
    expect(r.status).toBe("VALID")
    expect(r.warnings.map((w) => w.code)).toEqual(["SIEC-BILANS-MODEL-MIESIECZNY"])
  })

  it("brak autokonsumpcji przy PV albo sprawności przy magazynie → INCOMPLETE", () => {
    expect(calculateBilansMiesieczny(wejscie({ autokonsumpcjaBezposrednia: null })).status).toBe("INCOMPLETE")
    expect(calculateBilansMiesieczny(wejscie({ sprawnoscMagazynu: null })).status).toBe("INCOMPLETE")
    expect(calculateBilansMiesieczny(wejscie({ sprawnoscMagazynu: null, pojemnoscMagazynuKwh: 0 })).status).toBe("VALID")
  })

  it("11 miesięcy, udział > 1, ujemna moc → INVALID_INPUT", () => {
    expect(calculateBilansMiesieczny(wejscie({ zuzycieMiesieczneKwh: ZUZYCIE.slice(1) })).status).toBe("INVALID_INPUT")
    expect(calculateBilansMiesieczny(wejscie({ autokonsumpcjaBezposrednia: 1.2 })).status).toBe("INVALID_INPUT")
    expect(calculateBilansMiesieczny(wejscie({ mocPvKwp: -1 })).status).toBe("INVALID_INPUT")
  })
})
