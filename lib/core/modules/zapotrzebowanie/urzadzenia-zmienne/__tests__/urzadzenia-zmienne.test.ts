import { describe, expect, it } from "vitest"
import { calculateUrzadzeniaZmienne } from "../calculator"

const poz = (id: string, mocW: number, czasMin: number, klasa: "nowoczesne" | "standardowe" | "stare" = "standardowe") => ({
  id,
  wybrane: true,
  mocW,
  czasMin,
  klasa,
})

describe("calculateUrzadzeniaZmienne", () => {
  it("pralka standardowa, 1250W przez 60 min -> 1250 Wh (mnożnik 1,0)", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [poz("pralka", 1250, 60, "standardowe")],
      plytaIndukcyjnaWybrana: false,
      plytaIndukcyjnaMocW: 0,
      plytaIndukcyjnaCzasMin: 0,
    })
    expect(result.value.energiaWh).toBeCloseTo(1250, 6)
    expect(result.status).toBe("VALID")
  })

  it("lodówka nowoczesna, 100W przez 60 min -> 80 Wh (mnożnik 0,8)", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [poz("lodowka-230v", 100, 60, "nowoczesne")],
      plytaIndukcyjnaWybrana: false,
      plytaIndukcyjnaMocW: 0,
      plytaIndukcyjnaCzasMin: 0,
    })
    expect(result.value.energiaWh).toBeCloseTo(80, 6)
  })

  it("lodówka stara, 100W przez 60 min -> 140 Wh (mnożnik 1,4), sugestia wymiany", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [poz("lodowka-230v", 100, 60, "stare")],
      plytaIndukcyjnaWybrana: false,
      plytaIndukcyjnaMocW: 0,
      plytaIndukcyjnaCzasMin: 0,
    })
    expect(result.value.energiaWh).toBeCloseTo(140, 6)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    const w = result.warnings[0]
    expect(w.code).toBe("SUGEROWANA-WYMIANA-STARYCH-URZADZEN")
    expect(w.params).toEqual({ urzadzenia: "Lodówka 230V AC" })
    expect(w.message).toBeUndefined()
  })

  it("płyta indukcyjna 7000W przez 30 min -> 3500 Wh, bez mnożnika klasy", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [],
      plytaIndukcyjnaWybrana: true,
      plytaIndukcyjnaMocW: 7000,
      plytaIndukcyjnaCzasMin: 30,
    })
    expect(result.value.plytaIndukcyjnaEnergiaWh).toBeCloseTo(3500, 6)
    expect(result.value.energiaWh).toBe(0)
    expect(result.status).toBe("VALID")
  })

  it("kilka urządzeń naraz sumuje się poprawnie", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [poz("czajnik", 1850, 10, "standardowe"), poz("laptop", 68, 180, "nowoczesne")],
      plytaIndukcyjnaWybrana: false,
      plytaIndukcyjnaMocW: 0,
      plytaIndukcyjnaCzasMin: 0,
    })
    // czajnik: 1850*10/60=308.333..., laptop: 68*180/60*0.8=163.2
    expect(result.value.energiaWh).toBeCloseTo(308.3333333333333 + 163.2, 6)
  })

  it("nic nie zaznaczone i płyta niewybrana -> INCOMPLETE, BRAK-ZAZNACZONYCH", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [{ id: "pralka", wybrane: false, mocW: 0, czasMin: 0, klasa: "standardowe" }],
      plytaIndukcyjnaWybrana: false,
      plytaIndukcyjnaMocW: 0,
      plytaIndukcyjnaCzasMin: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings[0].code).toBe("BRAK-ZAZNACZONYCH")
  })

  it("zaznaczona pozycja z mocą 0 -> INVALID_INPUT, POZYCJA-NIEDODATNIA bez message", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [poz("pralka", 0, 60, "standardowe")],
      plytaIndukcyjnaWybrana: false,
      plytaIndukcyjnaMocW: 0,
      plytaIndukcyjnaCzasMin: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
    const w = result.warnings[0]
    expect(w.i18nKey).toBe("POZYCJA-NIEDODATNIA")
    expect(w.message).toBeUndefined()
  })

  it("płyta wybrana z czasem 0 -> INVALID_INPUT", () => {
    const result = calculateUrzadzeniaZmienne({
      urzadzenia: [],
      plytaIndukcyjnaWybrana: true,
      plytaIndukcyjnaMocW: 7000,
      plytaIndukcyjnaCzasMin: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
