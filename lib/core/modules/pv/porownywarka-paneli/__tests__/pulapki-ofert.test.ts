import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { calculatePorownywarkaPaneli, pulapkiOfert, type WynikPanelu } from "../calculator"
import { domyslnyWyborKryteriow } from "../kryteria"
import type { DanePanelu, PorownywarkaInput } from "../input"

/** Same synthetic year as porownywarka-paneli.test.ts: January 200 W/m² at −5 °C, July 600 W/m² at 20 °C, flat plane. */
function rok(): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const g = m === 0 ? 200 : m === 6 ? 600 : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 20 }
  })
}
const panel = (p: Partial<DanePanelu> & { id: string }): DanePanelu => ({
  nazwa: `Panel ${p.id}`,
  pmaxW: 500,
  cenaBruttoZl: null,
  gammaPctNaC: -0.29,
  noctC: 45,
  sprawnoscWzglednaPrzy200WPct: null,
  degradacjaPierwszyRokPct: null,
  degradacjaLiniowaPctNaRok: null,
  dlugoscMm: null,
  szerokoscMm: null,
  masaKg: null,
  bifacjalny: false,
  ...p,
})
const wejscie = (panele: DanePanelu[]): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 1,
  panele,
  wycena: null,
  kryteria: domyslnyWyborKryteriow(),
})

/** Minimal result row — only the fields `pulapkiOfert` reads. */
const wiersz = (p: Partial<WynikPanelu> & { id: string }): WynikPanelu =>
  ({ nazwa: `Panel ${p.id}`, liczbaPaneli: 1, mocKwp: 0.5, zimaKwh: 100, cenaZaWpZl: null, kosztZimowejKwhZl: null, ...p }) as WynikPanelu

describe("pulapkiOfert — moc STC a zima", () => {
  it("silnik: panel 500 W (γ −0,29) ma najwyższą moc, ale zimą z 1 kWp więcej daje panel 400 W (γ −0,35) — o 1%", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" }), panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.35 })]))
    // referencje ręczne z porownywarka-paneli.test.ts: A 79,5243 kWh / 0,5 kWp = 159,05; B 64,4676 kWh / 0,4 kWp = 161,17 → +1,33%
    const o = w.warnings.find((x) => x.code === "PORP-PULAPKA-MOC-STC-ZIMA")!
    expect(o.level).toBe("info")
    expect(o.params).toEqual({ nazwaMoc: "Panel A", nazwaZima: "Panel B", roznica: 1 })
  })

  it("ten sam panel wygrywa moc i zimę → brak ostrzeżenia", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A", gammaPctNaC: -0.35 }), panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.29 })]))
    expect(w.warnings.some((x) => x.code === "PORP-PULAPKA-MOC-STC-ZIMA")).toBe(false)
  })

  it("różnica poniżej 1% (po zaokrągleniu 0%) → brak ostrzeżenia", () => {
    const w = pulapkiOfert([wiersz({ id: "A", mocKwp: 0.5, zimaKwh: 100 }), wiersz({ id: "B", mocKwp: 0.4, zimaKwh: 80.3 })])
    expect(w).toEqual([])
  })

  it("jeden panel → brak ostrzeżeń", () => {
    expect(pulapkiOfert([wiersz({ id: "A" })])).toEqual([])
  })

  it("moc panelu to moc jednej sztuki, nie zestawu: 3 × 400 W nie wygrywa z 1 × 500 W", () => {
    const w = pulapkiOfert([
      wiersz({ id: "A", liczbaPaneli: 1, mocKwp: 0.5, zimaKwh: 100 }),
      wiersz({ id: "B", liczbaPaneli: 3, mocKwp: 1.2, zimaKwh: 260 }),
    ])
    // A: 200 kWh/kWp, B: 216,67 kWh/kWp, najsilniejszy panel to A (500 > 400) → ostrzeżenie o +8%
    expect(w).toHaveLength(1)
    expect(w[0]!.params).toEqual({ nazwaMoc: "Panel A", nazwaZima: "Panel B", roznica: 8 })
  })
})

describe("pulapkiOfert — cena za Wp a zimowa kWh", () => {
  it("najtańszy za Wp (A) ma droższą zimową kWh niż B o 25%", () => {
    const w = pulapkiOfert([
      wiersz({ id: "A", cenaZaWpZl: 1.0, kosztZimowejKwhZl: 5 }),
      wiersz({ id: "B", cenaZaWpZl: 1.2, kosztZimowejKwhZl: 4 }),
    ])
    const o = w.find((x) => x.code === "PORP-PULAPKA-CENA-WP-ZIMA")!
    expect(o.params).toEqual({ nazwaTanszaWp: "Panel A", nazwaTanszaKwh: "Panel B", roznica: 25 })
  })

  it("ten sam panel tani za Wp i za kWh → brak ostrzeżenia; bez cen → brak ostrzeżenia", () => {
    expect(
      pulapkiOfert([
        wiersz({ id: "A", cenaZaWpZl: 1.0, kosztZimowejKwhZl: 4 }),
        wiersz({ id: "B", cenaZaWpZl: 1.2, kosztZimowejKwhZl: 5 }),
      ]).some((x) => x.code === "PORP-PULAPKA-CENA-WP-ZIMA"),
    ).toBe(false)
    expect(pulapkiOfert([wiersz({ id: "A" }), wiersz({ id: "B" })]).some((x) => x.code === "PORP-PULAPKA-CENA-WP-ZIMA")).toBe(false)
  })
})
