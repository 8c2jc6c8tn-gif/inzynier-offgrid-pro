import { describe, expect, it } from "vitest"
import { znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { calculatePorownywarkaPaneli } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { DanePanelu, PorownywarkaInput } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { domyslnyWyborKryteriow } from "@/lib/core/modules/pv/porownywarka-paneli/kryteria"
import { STAN_POCZATKOWY, type FormularzStan } from "../stan"
import { cenyOsprzetuZStanu, kluczUkladu, podsumujUrzadzenie, wylaczoneBos } from "../urzadzenie"

/** JA Solar 500 W, 12 sztuk po 400 zł, Tmin −20 °C, regulator Victron 150/35 przy 24 V — jak w teście dopasowania (układ 3 × 4 → 2 regulatory). */
const panel = (): DanePanelu => ({ ...znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!, cenaBruttoZl: 400 })
const rok = (): RekordGodzinowy[] => {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => ({ czasUtcMs: start + h * 3_600_000, ghi: 300, dni: 0, dhi: 300, tempC: 10 }))
}
const wejscie = (): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 35, azymutDeg: 180 },
  liczbaPaneli: 12,
  panele: [panel()],
  wycena: null,
  kryteria: domyslnyWyborKryteriow(),
  tminC: -20,
})
const stan = (zmiana: Partial<FormularzStan> = {}): FormularzStan => ({ ...STAN_POCZATKOWY, urzadzenieId: "victron-smartsolar-150-35", akumV: "24", trasaM: "15", ...zmiana })
const policz = (s: FormularzStan, kurs = 1) => {
  const w = wejscie()
  return podsumujUrzadzenie({ stan: s, panele: calculatePorownywarkaPaneli(w).value.panele, dane: w.panele, kurs })
}
const brutto = (netto: number) => netto * 1.23

describe("podsumujUrzadzenie (A4)", () => {
  it("bez wybranego urządzenia → null", () => {
    expect(policz(stan({ urzadzenieId: "" }))).toBeNull()
    expect(policz(stan({ urzadzenieId: "nie-ma-takiego" }))).toBeNull()
  })

  it("domyślnie układ proponowany 3 × 4; osprzęt i łączny koszt zgodne z ręcznym rachunkiem", () => {
    const p = policz(stan())!
    const x = p.panele[0]!
    expect(kluczUkladu(x.wybrany!)).toBe("3x4")
    expect(x.wybrany!.liczbaUrzadzen).toBe(2)
    // 4 stringi > 2 → zabezpieczenie stringów wymagane (z A3); 2 wejścia MPPT w użyciu (2 regulatory po jednym wejściu)
    expect(x.ochronaA3?.wymagana).toBe(true)
    const min = brutto(120 * 3.89 + 8 * 2.93 + 4 * 23.58 + 2 * 31.71 + 2 * 43.9 + 12 * 167)
    const max = brutto(120 * 4.6 + 8 * 2.93 + 4 * 23.58 + 2 * 216 + 2 * 43.9 + 12 * 225)
    expect(x.bos!.sumaMin).toBeCloseTo(min, 6)
    expect(x.bos!.sumaMax).toBeCloseTo(max, 6)
    expect(x.razemMin).toBeCloseTo(12 * 400 + min, 6)
    expect(x.razemMax).toBeCloseTo(12 * 400 + max, 6)
  })

  it("wybór innego układu zmienia ilości (2 × 6 → 3 regulatory, 6 stringów); cena urządzenia i kurs waluty wchodzą do sumy", () => {
    const p = policz(stan({ bosUklad: { [wejscie().panele[0]!.id]: "2x6" }, cenaUrzadzenia: "1000" }), 0.25)!
    const x = p.panele[0]!
    expect(kluczUkladu(x.wybrany!)).toBe("2x6")
    expect(x.wybrany!.liczbaUrzadzen).toBe(3)
    expect(x.kosztUrzadzen).toBe(3000)
    const ilosc = (id: string) => x.bos!.linie.find((l) => l.id === id)!.ilosc
    expect(ilosc("kabel-pv")).toBe(180)
    expect(ilosc("mc4")).toBe(12)
    expect(ilosc("bezpiecznik-dc")).toBe(6)
    expect(ilosc("rozlacznik-dc")).toBe(3)
    expect(x.bos!.linie.find((l) => l.id === "mc4")!.cenaMin).toBeCloseTo(brutto(2.93) * 0.25, 9)
    expect(x.razemMin).toBeCloseTo(12 * 400 + 3000 + x.bos!.sumaMin, 6)
  })

  it("układ spoza mieszczących się w limitach jest ignorowany (wraca propozycja)", () => {
    const p = policz(stan({ bosUklad: { [wejscie().panele[0]!.id]: "12x1" } }))!
    expect(kluczUkladu(p.panele[0]!.wybrany!)).toBe("3x4")
  })

  it("mikroinwerter: osprzętu DC nie wyceniamy (bos null), układ nadal oceniony", () => {
    const p = policz(stan({ urzadzenieId: "vevor-mikro-gt-800", akumV: "" }))!
    expect(p.mikro).toBe(true)
    expect(p.panele[0]!.bos).toBeNull()
    expect(p.panele[0]!.wybrany).not.toBeNull()
    expect(p.panele[0]!.razemMin).toBeNull()
  })

  it("brak najniższej temperatury → panel bez elektryki, więc brak pozycji w podsumowaniu", () => {
    const w = { ...wejscie(), tminC: null }
    const p = podsumujUrzadzenie({ stan: stan(), panele: calculatePorownywarkaPaneli(w).value.panele, dane: w.panele, kurs: 1 })!
    expect(p.panele).toEqual([])
  })
})

describe("pola formularza osprzętu", () => {
  it("domyślnie wyłączona jest rozdzielnia DC; własne ceny: puste i ujemne pomijane, przecinek dziesiętny rozumiany", () => {
    expect(wylaczoneBos({})).toEqual(["rozdzielnia-dc"])
    expect(wylaczoneBos({ bosWylaczone: [] })).toEqual([])
    expect(cenyOsprzetuZStanu({ bosCeny: { "kabel-pv": "5,5", mc4: "", "spd-dc": "-3", konstrukcja: "0" } })).toEqual({ "kabel-pv": 5.5, konstrukcja: 0 })
  })
})
