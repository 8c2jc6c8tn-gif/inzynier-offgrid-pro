import { describe, expect, it } from "vitest"
import { calculateObciazenieCieplne } from "../calculator"
import type { ObciazenieCieplneInput } from "../input"
import { oporWarstwy, uZWarstw, type WarstwaPrzegrody } from "../u-z-warstw"

const MIESIACE_PUSTE: (number | null)[] = Array(12).fill(null)

// Reference values computed independently in Python before implementation (Directive #3).
const DOM: ObciazenieCieplneInput = {
  przegrody: [
    { nazwa: "Ściany", powierzchniaM2: 120, uWM2K: 0.25, zewnetrzna: true, temperaturaPoDrugiejStronieC: null },
    { nazwa: "Okna", powierzchniaM2: 20, uWM2K: 1.1, zewnetrzna: true, temperaturaPoDrugiejStronieC: null },
    { nazwa: "Dach", powierzchniaM2: 100, uWM2K: 0.18, zewnetrzna: true, temperaturaPoDrugiejStronieC: null },
    { nazwa: "Podłoga na gruncie", powierzchniaM2: 100, uWM2K: 0.3, zewnetrzna: false, temperaturaPoDrugiejStronieC: 8 },
  ],
  temperaturaWewnetrznaC: 20,
  strefaKlimatyczna: 3,
  kubaturaM3: 300,
  wymianyPowietrzaNaH: 0.5,
  cop: null,
  srednieTemperaturyMiesieczneC: MIESIACE_PUSTE,
}

describe("calculateObciazenieCieplne (M6/E1, dawne 5.1)", () => {
  it("strefa III → θe = −20 °C; przenikanie 3160 W + wentylacja 2010 W = 5170 W, 124,08 kWh/dobę", () => {
    const r = calculateObciazenieCieplne(DOM)
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    const v = r.value!
    expect(v.temperaturaZewnetrznaC).toBe(-20)
    expect(v.przegrody.map((p) => p.strataW)).toEqual([1200, 880, 720, 360])
    expect(v.strataPrzenikanieW).toBeCloseTo(3160, 9)
    expect(v.hvWK).toBeCloseTo(50.25, 9)
    expect(v.strataWentylacjaW).toBeCloseTo(2010, 9)
    expect(v.obciazenieW).toBeCloseTo(5170, 9)
    expect(v.cieploDobaObliczeniowaKwh).toBeCloseTo(124.08, 9)
    expect(v.przegrody[1]!.udzialPct).toBeCloseTo(17.02127659574468, 9)
    expect(v.energiaElektrycznaDobaKwh).toBeNull()
    expect(v.miesiace).toBeNull()
  })

  it("przykład źródła: 8 kW przy −20 °C → 192 kWh/dobę; COP 3 → 64 kWh (źródło podaje 60 — rozbieżność udokumentowana)", () => {
    const r = calculateObciazenieCieplne({
      ...DOM,
      przegrody: [{ nazwa: "Przegrody razem", powierzchniaM2: 200, uWM2K: 1, zewnetrzna: true, temperaturaPoDrugiejStronieC: null }],
      wymianyPowietrzaNaH: 0,
      cop: 3,
    })
    expect(r.value!.obciazenieW).toBe(8000)
    expect(r.value!.cieploDobaObliczeniowaKwh).toBe(192)
    expect(r.value!.energiaElektrycznaDobaKwh).toBe(64)
    expect(r.assumptions).toContainEqual({ kod: "OC-ZALOZENIE-COP", params: { cop: 3 } })
  })

  it("miesiące ze średnich: styczeń −2 °C → 2236,092 kWh, lipiec 18 °C → 446,772 kWh, sierpień 21 °C (≥ θi) → 0", () => {
    const temp = [...MIESIACE_PUSTE]
    temp[0] = -2
    temp[6] = 18
    temp[7] = 21
    const r = calculateObciazenieCieplne({ ...DOM, srednieTemperaturyMiesieczneC: temp })
    const m = r.value!.miesiace!
    expect(m.map((x) => x.miesiac)).toEqual([1, 7, 8])
    expect(m[0]!.cieploKwh).toBeCloseTo(2236.092, 9)
    expect(m[1]!.cieploKwh).toBeCloseTo(446.772, 9)
    expect(m[2]!.cieploKwh).toBe(0)
    expect(r.value!.cieploSumaMiesiecyKwh).toBeCloseTo(2682.864, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["OC-BEZ-PN-EN-12831", "OC-MIESIACE-ZE-SREDNICH"])
  })

  it("zawsze ostrzeżenie o braku PN-EN 12831-1 (mostki, grunt, zyski) — poziom warning, nie info", () => {
    const w = calculateObciazenieCieplne(DOM).warnings.find((x) => x.code === "OC-BEZ-PN-EN-12831")
    expect(w?.level).toBe("warning")
  })

  it("INCOMPLETE bez zgadywania: brak strefy, pusta lista albo przegroda bez U", () => {
    expect(calculateObciazenieCieplne({ ...DOM, strefaKlimatyczna: null }).status).toBe("INCOMPLETE")
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: [] }).status).toBe("INCOMPLETE")
    const bezU = DOM.przegrody.map((p, i) => (i === 1 ? { ...p, uWM2K: null } : p))
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: bezU }).status).toBe("INCOMPLETE")
    // Ground partition without the other-side temperature must not fall back to outdoor air.
    const gruntBezTemp = DOM.przegrody.map((p, i) => (i === 3 ? { ...p, temperaturaPoDrugiejStronieC: null } : p))
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: gruntBezTemp }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: θi ≤ θe (twardy błąd danych), U poza zakresem, ujemna kubatura", () => {
    const zimno = calculateObciazenieCieplne({ ...DOM, temperaturaWewnetrznaC: -25 })
    expect(zimno.status).toBe("INVALID_INPUT")
    expect(zimno.warnings[0]!.code).toBe("OC-TEMP-WEWN-NIE-WYZSZA")
    const zleU = DOM.przegrody.map((p, i) => (i === 0 ? { ...p, uWM2K: 12 } : p))
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: zleU }).status).toBe("INVALID_INPUT")
    expect(calculateObciazenieCieplne({ ...DOM, kubaturaM3: -1 }).status).toBe("INVALID_INPUT")
  })

  it("strefy I–V: −16/−18/−20/−22/−24 °C (PN-82/B-02403 Tablica 1 = zał. krajowy PN-EN 12831 wg Purmo)", () => {
    const te = ([1, 2, 3, 4, 5] as const).map((s) => calculateObciazenieCieplne({ ...DOM, strefaKlimatyczna: s }).value!.temperaturaZewnetrznaC)
    expect(te).toEqual([-16, -18, -20, -22, -24])
  })
})

// Wall OSB 12 mm (λ 0.13) + wool 145 mm (λ 0.038) + plasterboard 12.5 mm (λ 0.25): ΣR = 3.958097166 (Python, independent of the code).
const SCIANA_WARSTWY: WarstwaPrzegrody[] = [
  { nazwa: "OSB", gruboscMm: 12, lambdaWmK: 0.13, oporM2KW: null },
  { nazwa: "Wełna", gruboscMm: 145, lambdaWmK: 0.038, oporM2KW: null },
  { nazwa: "Płyta GK", gruboscMm: 12.5, lambdaWmK: 0.25, oporM2KW: null },
]

describe("U z warstw (PN-EN ISO 6946, model prosty, bez mostków)", () => {
  it("ściana: Rsi 0,13 + ΣR 3,958097 + Rse 0,04 → U = 0,242242", () => {
    const u = uZWarstw(SCIANA_WARSTWY, "poziomo")!
    expect(u.oporWarstwM2KW).toBeCloseTo(3.9580971659919024, 12)
    expect(u.oporCalkowityM2KW).toBeCloseTo(4.128097166, 9)
    expect(u.uWM2K).toBeCloseTo(0.24224236004864466, 12)
  })

  it("kierunek strumienia wybiera Rsi: w górę 0,10, w dół 0,17", () => {
    expect(uZWarstw(SCIANA_WARSTWY, "w-gore")!.uWM2K).toBeCloseTo(0.24401568813411975, 12)
    expect(uZWarstw(SCIANA_WARSTWY, "w-dol")!.uWM2K).toBeCloseTo(0.23991763151760045, 12)
  })

  it("warstwa podana gotowym oporem R zamiast grubości i λ (np. szczelina z karty producenta)", () => {
    const u = uZWarstw([{ nazwa: "Szczelina", gruboscMm: null, lambdaWmK: null, oporM2KW: 0.18 }], "poziomo")!
    expect(u.oporCalkowityM2KW).toBeCloseTo(0.35, 12)
    expect(u.uWM2K).toBeCloseTo(1 / 0.35, 12)
  })

  it("niepełna warstwa albo pusta lista → null (brakująca warstwa po cichu zaniżyłaby R)", () => {
    expect(uZWarstw([], "poziomo")).toBeNull()
    expect(uZWarstw([...SCIANA_WARSTWY, { nazwa: "?", gruboscMm: 50, lambdaWmK: null, oporM2KW: null }], "poziomo")).toBeNull()
    expect(oporWarstwy({ nazwa: "zero", gruboscMm: 0, lambdaWmK: 0.04, oporM2KW: null })).toBeNull()
    expect(oporWarstwy({ nazwa: "R<=0", gruboscMm: null, lambdaWmK: null, oporM2KW: 0 })).toBeNull()
  })

  it("kalkulator: przegroda bez U, ale z warstwami → U z warstw (120 m² × 0,242242 × 40 K = 1162,763 W) + założenie", () => {
    const przegrody = DOM.przegrody.map((p, i) =>
      i === 0 ? { ...p, uWM2K: null, warstwy: SCIANA_WARSTWY, kierunekStrumienia: "poziomo" as const } : p,
    )
    const r = calculateObciazenieCieplne({ ...DOM, przegrody })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value!.przegrody[0]!.strataW).toBeCloseTo(1162.7633282334943, 9)
    expect(r.value!.przegrody[1]!.strataW).toBe(880)
    expect(r.assumptions).toContainEqual({ kod: "OC-ZALOZENIE-U-Z-WARSTW" })
    expect(r.inputs.przegroda1U).toBeCloseTo(0.24224236004864466, 12)
  })

  it("wpisane U wygrywa z warstwami; bez warstw wynik i założenia jak dotąd", () => {
    const przegrody = DOM.przegrody.map((p, i) => (i === 0 ? { ...p, warstwy: SCIANA_WARSTWY, kierunekStrumienia: "poziomo" as const } : p))
    const r = calculateObciazenieCieplne({ ...DOM, przegrody })
    expect(r.value!.przegrody[0]!.strataW).toBe(1200)
    expect(r.assumptions).not.toContainEqual({ kod: "OC-ZALOZENIE-U-Z-WARSTW" })
    expect(calculateObciazenieCieplne(DOM).assumptions).not.toContainEqual({ kod: "OC-ZALOZENIE-U-Z-WARSTW" })
  })

  it("INCOMPLETE: warstwy bez kierunku strumienia albo z niepełną warstwą — bez zgadywania", () => {
    const bezKierunku = DOM.przegrody.map((p, i) => (i === 0 ? { ...p, uWM2K: null, warstwy: SCIANA_WARSTWY } : p))
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: bezKierunku }).status).toBe("INCOMPLETE")
    const niepelna = DOM.przegrody.map((p, i) =>
      i === 0
        ? { ...p, uWM2K: null, kierunekStrumienia: "poziomo" as const, warstwy: [...SCIANA_WARSTWY, { nazwa: "?", gruboscMm: 30, lambdaWmK: null, oporM2KW: null }] }
        : p,
    )
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: niepelna }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: grubość, λ albo opór warstwy ≤ 0", () => {
    for (const zla of [
      { nazwa: "x", gruboscMm: -5, lambdaWmK: 0.04, oporM2KW: null },
      { nazwa: "x", gruboscMm: 50, lambdaWmK: 0, oporM2KW: null },
      { nazwa: "x", gruboscMm: null, lambdaWmK: null, oporM2KW: -1 },
    ]) {
      const przegrody = DOM.przegrody.map((p, i) =>
        i === 0 ? { ...p, uWM2K: null, kierunekStrumienia: "poziomo" as const, warstwy: [...SCIANA_WARSTWY, zla] } : p,
      )
      expect(calculateObciazenieCieplne({ ...DOM, przegrody }).status).toBe("INVALID_INPUT")
    }
  })
})

describe("odzysk ciepła z wentylacji i zapas paliwa (silnik 1.2.0)", () => {
  it("odzysk 80% zmniejsza stratę wentylacyjną do 20%: H_V 50,25 → 10,05 W/K, 402 W, razem 3562 W", () => {
    const r = calculateObciazenieCieplne({ ...DOM, sprawnoscOdzyskuPct: 80 })
    const v = r.value!
    expect(v.hvWK).toBeCloseTo(10.05, 9)
    expect(v.strataWentylacjaW).toBeCloseTo(402, 9)
    expect(v.obciazenieW).toBeCloseTo(3562, 9)
    expect(v.odzyskWentylacjiPct).toBe(80)
    expect(r.assumptions).toContainEqual({ kod: "OC-ZALOZENIE-ODZYSK-WENTYLACJI", params: { eta: 80 } })
  })

  it("bez wpisanego odzysku wynik jest taki jak przed dodaniem pola", () => {
    const v = calculateObciazenieCieplne(DOM).value!
    expect(v.hvWK).toBeCloseTo(50.25, 9)
    expect(v.odzyskWentylacjiPct).toBe(0)
    expect(v.paliwo).toBeNull()
  })

  it("odzysk poza 0–100% i niedodatnie dane paliwa są błędem wejścia", () => {
    expect(calculateObciazenieCieplne({ ...DOM, sprawnoscOdzyskuPct: 120 }).status).toBe("INVALID_INPUT")
    expect(calculateObciazenieCieplne({ ...DOM, sprawnoscOdzyskuPct: -5 }).status).toBe("INVALID_INPUT")
    expect(calculateObciazenieCieplne({ ...DOM, paliwo: { jednostka: "kg", wartoscOpalowaKwh: 0, sprawnoscPct: 80, zapas: 10 } }).status).toBe("INVALID_INPUT")
    expect(calculateObciazenieCieplne({ ...DOM, paliwo: { jednostka: "kg", wartoscOpalowaKwh: 5, sprawnoscPct: 0, zapas: 10 } }).status).toBe("INVALID_INPUT")
    expect(calculateObciazenieCieplne({ ...DOM, paliwo: { jednostka: "kg", wartoscOpalowaKwh: 5, sprawnoscPct: 80, zapas: -1 } }).status).toBe("INVALID_INPUT")
  })

  const styczen = (() => {
    const temp = [...MIESIACE_PUSTE]
    temp[0] = -2
    return temp
  })()

  it("zapas paliwa: 1000 kg × 5 kWh/kg × 80% = 4000 kWh; doba 124,08 kWh → 31,02 kg/dobę i ok. 32,2 dnia; rok (tu tylko styczeń 2236,092 kWh) = 559,023 kg", () => {
    const v = calculateObciazenieCieplne({
      ...DOM,
      srednieTemperaturyMiesieczneC: styczen,
      paliwo: { jednostka: "kg", wartoscOpalowaKwh: 5, sprawnoscPct: 80, zapas: 1000 },
    }).value!
    const p = v.paliwo!
    expect(p.zapasCieplaKwh).toBeCloseTo(4000, 9)
    expect(p.zuzycieDobaObliczeniowaJedn).toBeCloseTo(124.08 / 4, 9)
    expect(p.dniPrzyTemperaturzeObliczeniowej).toBeCloseTo(4000 / 124.08, 9)
    expect(p.zuzycieRokJedn).toBeCloseTo(2236.092 / 4, 6)
    expect(p.pokrycieRokuPct).toBe(100)
    expect(p.brakJedn).toBe(0)
  })

  it("za mały zapas: 400 kg pokrywa 1600/2236,092 = 71,55% ciepła, brakuje 159,023 kg", () => {
    const p = calculateObciazenieCieplne({
      ...DOM,
      srednieTemperaturyMiesieczneC: styczen,
      paliwo: { jednostka: "kg", wartoscOpalowaKwh: 5, sprawnoscPct: 80, zapas: 400 },
    }).value!.paliwo!
    expect(p.pokrycieRokuPct).toBeCloseTo((100 * 1600) / 2236.092, 6)
    expect(p.brakJedn).toBeCloseTo(2236.092 / 4 - 400, 6)
  })

  it("bez temperatur miesięcznych jest tylko wynik dla doby obliczeniowej; niepełne dane paliwa dają brak wyniku", () => {
    const bezMiesiecy = calculateObciazenieCieplne({ ...DOM, paliwo: { jednostka: "kg", wartoscOpalowaKwh: 5, sprawnoscPct: 80, zapas: 1000 } }).value!.paliwo!
    expect(bezMiesiecy.zuzycieRokJedn).toBeNull()
    expect(bezMiesiecy.pokrycieRokuPct).toBeNull()
    expect(bezMiesiecy.brakJedn).toBeNull()
    expect(calculateObciazenieCieplne({ ...DOM, paliwo: { jednostka: "kg", wartoscOpalowaKwh: 5, sprawnoscPct: null, zapas: 1000 } }).value!.paliwo).toBeNull()
  })
})
