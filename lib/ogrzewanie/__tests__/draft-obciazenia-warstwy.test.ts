import { describe, expect, it } from "vitest"
import { podgladUZWarstw, uPrzegrodySeed, wejscieObciazenia, type PrzegrodaSeed, type SeedObciazenia } from "../draft-obciazenia-cieplnego"

const SCIANA: PrzegrodaSeed = {
  nazwa: "Ściana",
  powierzchniaM2: "120",
  uWM2K: "",
  zewnetrzna: true,
  temperaturaPoDrugiejStronieC: "",
  kierunek: "poziomo",
  warstwy: [
    { nazwa: "OSB", gruboscMm: "12", lambdaWmK: "0,13", oporM2KW: "" },
    { nazwa: "Wełna", gruboscMm: "145", lambdaWmK: "0.038", oporM2KW: "" },
    { nazwa: "GK", gruboscMm: "12.5", lambdaWmK: "0.25", oporM2KW: "" },
  ],
}

const SEED = (p: PrzegrodaSeed): SeedObciazenia => ({
  przegrody: [p],
  temperaturaWewnetrznaC: "20",
  strefa: "3",
  kubaturaM3: "300",
  wymianyPowietrzaNaH: "0",
  cop: "",
  miesiace: [],
})

describe("szkic obciążenia cieplnego — warstwy przegrody", () => {
  it("mapuje warstwy i kierunek na wejście kalkulatora; puste pola → null", () => {
    const p = wejscieObciazenia(SEED(SCIANA)).przegrody[0]!
    expect(p.uWM2K).toBeNull()
    expect(p.kierunekStrumienia).toBe("poziomo")
    expect(p.warstwy).toEqual([
      { nazwa: "OSB", gruboscMm: 12, lambdaWmK: 0.13, oporM2KW: null },
      { nazwa: "Wełna", gruboscMm: 145, lambdaWmK: 0.038, oporM2KW: null },
      { nazwa: "GK", gruboscMm: 12.5, lambdaWmK: 0.25, oporM2KW: null },
    ])
  })

  it("stary szkic bez warstw i kierunku nadal działa (brak pól = puste)", () => {
    const stary: PrzegrodaSeed = { nazwa: "Dach", powierzchniaM2: "100", uWM2K: "0.18", zewnetrzna: true, temperaturaPoDrugiejStronieC: "" }
    const p = wejscieObciazenia(SEED(stary)).przegrody[0]!
    expect(p.warstwy).toEqual([])
    expect(p.kierunekStrumienia).toBeNull()
    expect(uPrzegrodySeed(stary)).toBe("0.18")
  })

  it("U efektywne (dla ekranów zależnych) i podgląd U z warstw", () => {
    expect(Number(uPrzegrodySeed(SCIANA))).toBeCloseTo(0.24224236004864466, 12)
    expect(podgladUZWarstw(SCIANA)!.oporCalkowityM2KW).toBeCloseTo(4.128097166, 9)
    // The typed U wins in the effective value, the preview still shows the layers.
    expect(uPrzegrodySeed({ ...SCIANA, uWM2K: "0.3" })).toBe("0.3")
    expect(podgladUZWarstw({ ...SCIANA, uWM2K: "0.3" })).not.toBeNull()
  })

  it("brak kierunku albo niepełna warstwa → brak U i brak podglądu", () => {
    expect(uPrzegrodySeed({ ...SCIANA, kierunek: "" })).toBe("")
    expect(podgladUZWarstw({ ...SCIANA, kierunek: "" })).toBeNull()
    expect(podgladUZWarstw({ ...SCIANA, warstwy: [...SCIANA.warstwy!, { nazwa: "?", gruboscMm: "20", lambdaWmK: "", oporM2KW: "" }] })).toBeNull()
  })
})
