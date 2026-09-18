import { describe, expect, it } from "vitest"
import { calculateSzynyZbiorczeMiedzypakietowe } from "../calculator"

describe("calculateSzynyZbiorczeMiedzypakietowe", () => {
  it("2 gałęzie, R_B=3×R_A -> podział 75%/25% (reguła podziału prądu, podwójna weryfikacja ręczna)", () => {
    // R_A = 0,0175*2*1/25 = 0,0014 Ω ; R_B = 0,0175*2*3/25 = 0,0042 Ω = 3×R_A
    // I_A/I_total = R_B/(R_A+R_B) = 3/4 = 75% ; I_B = 25%
    const result = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: 100,
      material: "Cu",
      galezie: [
        { id: "A", dlugoscM: 1, przekrojMm2: 25 },
        { id: "B", dlugoscM: 3, przekrojMm2: 25 },
      ],
    })
    expect(result.status).toBe("VALID")
    const a = result.value.galezie.find((g) => g.id === "A")!
    const b = result.value.galezie.find((g) => g.id === "B")!
    expect(a.rezystancjaOhm).toBeCloseTo(0.0014, 6)
    expect(b.rezystancjaOhm).toBeCloseTo(0.0042, 6)
    expect(a.udzialPct).toBeCloseTo(75, 5)
    expect(b.udzialPct).toBeCloseTo(25, 5)
    expect(a.pradA).toBeCloseTo(75, 5)
    expect(b.pradA).toBeCloseTo(25, 5)
    expect(result.value.maxOdchylenieOdSredniejPct).toBeCloseTo(25, 5)
  })

  it("3 gałęzie identyczne -> podział równy 1/3 każda", () => {
    const result = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: 90,
      material: "Cu",
      galezie: [
        { id: "A", dlugoscM: 2, przekrojMm2: 16 },
        { id: "B", dlugoscM: 2, przekrojMm2: 16 },
        { id: "C", dlugoscM: 2, przekrojMm2: 16 },
      ],
    })
    for (const g of result.value.galezie) {
      expect(g.pradA).toBeCloseTo(30, 5)
      expect(g.udzialPct).toBeCloseTo(33.333, 2)
    }
    expect(result.value.maxOdchylenieOdSredniejPct).toBeCloseTo(0, 5)
  })

  it("INCOMPLETE — tylko 1 gałąź", () => {
    const result = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: 100,
      material: "Cu",
      galezie: [{ id: "A", dlugoscM: 1, przekrojMm2: 25 }],
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INCOMPLETE — prąd całkowity niepodany", () => {
    const result = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: 0,
      material: "Cu",
      galezie: [
        { id: "A", dlugoscM: 1, przekrojMm2: 25 },
        { id: "B", dlugoscM: 3, przekrojMm2: 25 },
      ],
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna długość gałęzi", () => {
    const result = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: 100,
      material: "Cu",
      galezie: [
        { id: "A", dlugoscM: -1, przekrojMm2: 25 },
        { id: "B", dlugoscM: 3, przekrojMm2: 25 },
      ],
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenie i assumptions zwracają i18nKey/kod, nie gotowy tekst", () => {
    const result = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: 100,
      material: "Cu",
      galezie: [
        { id: "A", dlugoscM: 1, przekrojMm2: 25 },
        { id: "B", dlugoscM: 3, przekrojMm2: 25 },
      ],
    })
    expect(result.warnings[0].i18nKey).toBe("ROZKLAD-PRADU")
    expect(result.warnings[0].params).toEqual({ odchylenie: "25.0" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([
      { kod: "MODEL-TOPOLOGIA-GWIAZDA" },
      { kod: "REZYSTANCJA-WZOR-M5E1" },
    ])

    const ujemna = calculateSzynyZbiorczeMiedzypakietowe({
      pradCalkowityA: 100,
      material: "Cu",
      galezie: [
        { id: "A", dlugoscM: -1, przekrojMm2: 25 },
        { id: "B", dlugoscM: 3, przekrojMm2: 25 },
      ],
    })
    expect(ujemna.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
  })
})
