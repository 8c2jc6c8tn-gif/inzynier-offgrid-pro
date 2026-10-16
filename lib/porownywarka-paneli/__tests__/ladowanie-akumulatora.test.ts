import { describe, expect, it } from "vitest"
import type { UrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import type { LimityWejsciaPv } from "@/lib/core/modules/pv/porownywarka-paneli/dopasowanie-urzadzenia"
import { ladowanieAkumulatoraPaneli, type PanelDoLadowania } from "../ladowanie-akumulatora"

const urz = (z: Partial<UrzadzeniePv> = {}) => ({ rodzaj: "regulator-mppt", napieciaAkumulatoraV: [12, 24], pradLadowaniaMaxA: 30, ...z }) as UrzadzeniePv
const limity = (z: Partial<LimityWejsciaPv> = {}) => ({ maWejsciePv: true, mocLimitW: 400, ...z }) as LimityWejsciaPv
const panel = (z: Partial<PanelDoLadowania> = {}): PanelDoLadowania => ({ id: "A", nazwa: "Panel A", liczbaPaneli: 1, mocKwp: 0.4, liczbaUrzadzen: 1, ...z })
const baza = { urzadzenie: urz(), limity: limity(), akumV: 12, pojemnoscAh: null, maksPradAkumulatoraA: null, panele: [panel()] }

describe("ladowanieAkumulatoraPaneli", () => {
  it("400 W / 12 V przez regulator 30 A z wejściem PV 400 W: 33,3 A z paneli, 30 A po limicie regulatora", () => {
    const w = ladowanieAkumulatoraPaneli(baza)!
    expect(w.napiecieV).toBe(12)
    expect(w.wiersze[0]!.wynik.pradZPaneliA).toBeCloseTo(400 / 12, 6)
    expect(w.wiersze[0]!.wynik.pradLadowaniaA).toBeCloseTo(30, 6)
    expect(w.wiersze[0]!.wynik.ograniczenie).toBe("regulator")
  })

  it("limit akumulatora z karty użytkownika ogranicza prąd; z pojemnością jest C-rate", () => {
    const w = ladowanieAkumulatoraPaneli({ ...baza, maksPradAkumulatoraA: 20, pojemnoscAh: 100 })!
    expect(w.wiersze[0]!.wynik.pradLadowaniaA).toBe(20)
    expect(w.wiersze[0]!.wynik.ograniczenie).toBe("akumulator")
    expect(w.wiersze[0]!.wynik.cRate).toBeCloseTo(0.2, 9)
  })

  it("zestaw wymagający 2 urządzeń: limity prądu i mocy wejścia rosną razy 2 (urządzenia w równoległym ładowaniu)", () => {
    const w = ladowanieAkumulatoraPaneli({ ...baza, panele: [panel({ mocKwp: 0.8, liczbaUrzadzen: 2 })] })!
    expect(w.wiersze[0]!.wynik.mocPrzyjetaW).toBeCloseTo(800, 6)
    expect(w.wiersze[0]!.wynik.pradZPaneliA).toBeCloseTo(800 / 12, 6)
    // 2 × 30 A = 60 A < 66,7 A z paneli → ogranicza regulator
    expect(w.wiersze[0]!.wynik.pradLadowaniaA).toBeCloseTo(60, 6)
    expect(w.wiersze[0]!.wynik.ograniczenie).toBe("regulator")
  })

  it("brak limitu na karcie = limit nieznany: prąd z paneli bez obcięcia", () => {
    const w = ladowanieAkumulatoraPaneli({ ...baza, urzadzenie: urz({ pradLadowaniaMaxA: null }), limity: limity({ mocLimitW: null }) })!
    expect(w.wiersze[0]!.wynik.pradLadowaniaA).toBeCloseTo(400 / 12, 6)
  })

  it("nic do pokazania: mikroinwerter, brak wejścia PV, brak napięcia akumulatora, zestaw bez układu", () => {
    expect(ladowanieAkumulatoraPaneli({ ...baza, urzadzenie: urz({ rodzaj: "mikroinwerter-sieciowy" }) })).toBeNull()
    expect(ladowanieAkumulatoraPaneli({ ...baza, limity: limity({ maWejsciePv: false }) })).toBeNull()
    expect(ladowanieAkumulatoraPaneli({ ...baza, akumV: null })).toBeNull()
    expect(ladowanieAkumulatoraPaneli({ ...baza, panele: [panel({ liczbaUrzadzen: null })] })).toBeNull()
    expect(ladowanieAkumulatoraPaneli({ ...baza, urzadzenie: undefined })).toBeNull()
  })

  it("urządzenie z jednym napięciem akumulatora podpowiada je samo", () => {
    const w = ladowanieAkumulatoraPaneli({ ...baza, urzadzenie: urz({ napieciaAkumulatoraV: [24] }), akumV: null })!
    expect(w.napiecieV).toBe(24)
  })
})
