import { describe, expect, it } from "vitest"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { daneMrozuZSzkicu, ogrzewanieElektryczneZSzkicu, wejscieObciazenia, type SeedObciazenia } from "../draft-obciazenia-cieplnego"

const MIESIACE = ["-2", "0", "4", "8", "13", "17", "19", "18", "13", "8", "3", "-1"]

const SEED: SeedObciazenia = {
  przegrody: [{ nazwa: "Ściany", powierzchniaM2: "120", uWM2K: "0.25", zewnetrzna: true, temperaturaPoDrugiejStronieC: "" }],
  otwory: [
    { nazwa: "Okna", powierzchniaM2: "20", uWM2K: "1,1" },
    { nazwa: "Drzwi", powierzchniaM2: "", uWM2K: "" },
  ],
  temperaturaWewnetrznaC: "20",
  strefa: "3",
  kubaturaM3: "300",
  wymianyPowietrzaNaH: "0.5",
  sprawnoscOdzyskuPct: "",
  zrodlo: "prad",
  cop: "3",
  miesiace: MIESIACE,
}

describe("szkic obciążenia — okna i drzwi, odzysk, źródło ciepła", () => {
  it("otwory dołączają do przegród jako powietrze zewnętrzne, a pusty wiersz jest pomijany", () => {
    const w = wejscieObciazenia(SEED)
    expect(w.przegrody.map((p) => p.nazwa)).toEqual(["Ściany", "Okna"])
    expect(w.przegrody[1]).toMatchObject({ powierzchniaM2: 20, uWM2K: 1.1, zewnetrzna: true, temperaturaPoDrugiejStronieC: null })
    // 120·0,25 + 20·1,1 = 52 W/K → przy ΔT = 40 K: 2080 W przenikania.
    expect(calculateObciazenieCieplne(w).value!.strataPrzenikanieW).toBeCloseTo(2080, 9)
  })

  it("wiersz z samą powierzchnią (bez U) jest niekompletny, a nie pomijany — wynik czeka na dane", () => {
    const w = wejscieObciazenia({ ...SEED, otwory: [{ nazwa: "Okna", powierzchniaM2: "20", uWM2K: "" }] })
    expect(calculateObciazenieCieplne(w).status).toBe("INCOMPLETE")
  })

  it("szkic sprzed sekcji otworów (bez `otwory`) działa jak wcześniej", () => {
    const { otwory: _pominiete, ...stary } = SEED
    expect(wejscieObciazenia(stary).przegrody).toHaveLength(1)
  })

  it("odzysk i paliwo trafiają do wejścia; przy paliwie COP jest ignorowany", () => {
    const w = wejscieObciazenia({
      ...SEED,
      sprawnoscOdzyskuPct: "75",
      zrodlo: "paliwo",
      paliwoJednostka: " kg ",
      paliwoWartoscOpalowaKwh: "4,5",
      paliwoSprawnoscPct: "80",
      paliwoZapas: "2000",
    })
    expect(w.sprawnoscOdzyskuPct).toBe(75)
    expect(w.cop).toBeNull()
    expect(w.paliwo).toEqual({ jednostka: "kg", wartoscOpalowaKwh: 4.5, sprawnoscPct: 80, zapas: 2000 })
    expect(wejscieObciazenia(SEED).paliwo).toBeNull()
  })

  it("prąd do bilansu PV: 12 miesięcy ciepło ÷ COP, miesiące cieplejsze od 20 °C dają 0", () => {
    const o = ogrzewanieElektryczneZSzkicu(SEED)
    expect(o.stan).toBe("ok")
    if (o.stan !== "ok") return
    expect(o.miesiaceKwh).toHaveLength(12)
    // Każdy miesiąc to ciepło z silnika podzielone przez COP = 3.
    const ciepla = calculateObciazenieCieplne(wejscieObciazenia(SEED)).value!.miesiace!
    expect(o.miesiaceKwh[0]).toBeCloseTo(ciepla[0]!.cieploKwh / 3, 9)
    expect(o.rokKwh).toBeCloseTo(ciepla.reduce((a, m) => a + m.cieploKwh, 0) / 3, 9)
    expect(o.miesiaceKwh.every((x) => x >= 0)).toBe(true)
  })

  it("powody braku: brak szkicu, paliwo, brak COP, niepełne miesiące, niekompletne dane", () => {
    expect(ogrzewanieElektryczneZSzkicu(null)).toEqual({ stan: "brak-danych" })
    expect(ogrzewanieElektryczneZSzkicu({ ...SEED, zrodlo: "paliwo" })).toEqual({ stan: "paliwo" })
    expect(ogrzewanieElektryczneZSzkicu({ ...SEED, cop: "" })).toEqual({ stan: "brak-cop" })
    expect(ogrzewanieElektryczneZSzkicu({ ...SEED, miesiace: [...MIESIACE.slice(0, 11), ""] })).toEqual({ stan: "brak-miesiecy" })
    expect(ogrzewanieElektryczneZSzkicu({ ...SEED, strefa: "" })).toEqual({ stan: "brak-danych" })
  })
})

describe("dane budynku dla M7/E1 ze szkicu Ekranu 1", () => {
  it("H_zewn = 120·0,25 + 20·1,1 + H_V 50,25 = 102,25 W/K, brak przegród do gruntu → strumień stały 0, θi i COP ze szkicu", () => {
    const d = daneMrozuZSzkicu(SEED)!
    expect(d.budynek.wspolczynnikStratZewnetrznychWK).toBeCloseTo(102.25, 9)
    expect(d.budynek.stalyStrumienStratW).toBe(0)
    expect(d.budynek.temperaturaWewnetrznaC).toBe(20)
    expect(d.zrodlo).toBe("prad")
    expect(d.cop).toBe(3)
  })

  it("źródło na paliwo → zrodlo „paliwo” i brak COP; brak szkicu lub niekompletny szkic → null", () => {
    const d = daneMrozuZSzkicu({ ...SEED, zrodlo: "paliwo" })!
    expect(d.zrodlo).toBe("paliwo")
    expect(d.cop).toBeNull()
    expect(daneMrozuZSzkicu(null)).toBeNull()
    expect(daneMrozuZSzkicu({ ...SEED, temperaturaWewnetrznaC: "" })).toBeNull()
  })
})
