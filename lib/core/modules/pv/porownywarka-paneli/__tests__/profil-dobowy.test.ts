import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { bilansGodzinowy, znormalizujProfilDobowy, type WejscieBilansu } from "../bilans-godzinowy"
import { calculatePorownywarkaPaneli } from "../calculator"
import { domyslnyWyborKryteriow } from "../kryteria"
import type { DanePanelu, PorownywarkaInput } from "../input"

/** Doby jak w `bilans-godzinowy.test.ts`: panele dają 2 kWh w godz. 10–13 (8 kWh/dobę), zapotrzebowanie stycznia 24 kWh/dobę, wszystko w miesiącu 0. */
function doby(dni: number): Pick<WejscieBilansu, "produkcjaKwh" | "miesiac" | "godzinaLokalna" | "zapotrzebowanieMiesiaceKwh"> {
  const n = 24 * dni
  const produkcjaKwh = new Float64Array(n)
  const godzinaLokalna = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    godzinaLokalna[i] = i % 24
    if (godzinaLokalna[i]! >= 10 && godzinaLokalna[i]! <= 13) produkcjaKwh[i] = 2
  }
  return { produkcjaKwh, miesiac: new Uint8Array(n), godzinaLokalna, zapotrzebowanieMiesiaceKwh: [n, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
}
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const wGodzinach = (godziny: number[]) => Array.from({ length: 24 }, (_, h) => (godziny.includes(h) ? 1 : 0))

describe("profil dobowy zużycia w bilansie godzinowym — ręczny rachunek (spec 39)", () => {
  it("całe zużycie w godz. 10–13: 6 kWh/godz. wobec 2 kWh produkcji → bezpośrednio 16, brak 32, nic nie przepada (2 doby)", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 0, sprawnoscCyklu: null, profilDobowy: wGodzinach([10, 11, 12, 13]) })
    expect(suma(b.zuzycieMiesiaceKwh)).toBeCloseTo(48, 10)
    expect(suma(b.bezposrednioMiesiaceKwh)).toBeCloseTo(16, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(32, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(0, 10)
  })

  it("całe zużycie o godz. 0 bez baterii: nic nie pokrywają panele, brak 48, cała produkcja (16) przepada", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 0, sprawnoscCyklu: null, profilDobowy: wGodzinach([0]) })
    expect(suma(b.bezposrednioMiesiaceKwh)).toBe(0)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(48, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(16, 10)
  })

  it("całe zużycie o godz. 0 z baterią 10 kWh: bateria z dnia wcześniej daje 8 kWh rano każdego dnia (2 doby → 16), brak 32", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 10, sprawnoscCyklu: 1, profilDobowy: wGodzinach([0]) })
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(16, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(32, 10)
  })

  it("równe wagi dają to samo co brak profilu; skala wag nie ma znaczenia", () => {
    const wejscie = { ...doby(3), pojemnoscKwh: 5, sprawnoscCyklu: 0.9 }
    const bez = bilansGodzinowy(wejscie)
    const rowny = bilansGodzinowy({ ...wejscie, profilDobowy: new Array<number>(24).fill(1) })
    const skala = bilansGodzinowy({ ...wejscie, profilDobowy: wGodzinach([18, 19, 20, 21]).map((x) => x * 7) })
    const jednostkowa = bilansGodzinowy({ ...wejscie, profilDobowy: wGodzinach([18, 19, 20, 21]) })
    expect(suma(rowny.brakMiesiaceKwh)).toBeCloseTo(suma(bez.brakMiesiaceKwh), 9)
    expect(suma(rowny.zBateriiMiesiaceKwh)).toBeCloseTo(suma(bez.zBateriiMiesiaceKwh), 9)
    expect(suma(skala.brakMiesiaceKwh)).toBeCloseTo(suma(jednostkowa.brakMiesiaceKwh), 9)
  })

  it("zawsze: bezpośrednio + z baterii + brak = zużycie, a zużycie = zapotrzebowanie miesiąca niezależnie od profilu", () => {
    for (const profil of [wGodzinach([6, 7, 8]), wGodzinach([18, 19, 20, 21, 22]), Array.from({ length: 24 }, (_, h) => h + 1)]) {
      const b = bilansGodzinowy({ ...doby(4), pojemnoscKwh: 3, sprawnoscCyklu: 0.9, profilDobowy: profil })
      expect(suma(b.zuzycieMiesiaceKwh)).toBeCloseTo(96, 9)
      expect(suma(b.bezposrednioMiesiaceKwh) + suma(b.zBateriiMiesiaceKwh) + suma(b.brakMiesiaceKwh)).toBeCloseTo(96, 9)
    }
  })

  it("znormalizujProfilDobowy: brak, zła długość i suma 0 to null; reszta sumuje się do 1", () => {
    expect(znormalizujProfilDobowy(null)).toBeNull()
    expect(znormalizujProfilDobowy(undefined)).toBeNull()
    expect(znormalizujProfilDobowy([1, 2])).toBeNull()
    expect(znormalizujProfilDobowy(new Array<number>(24).fill(0))).toBeNull()
    expect(suma(znormalizujProfilDobowy(wGodzinach([1, 2, 3]).map((x) => x * 5))!)).toBeCloseTo(1, 12)
  })
})

/** Rok syntetyczny z `porownywarka-paneli.test.ts`: styczeń G = 200 W/m², lipiec 600, reszta 0 (płaszczyzna pozioma). */
function rok(): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const g = m === 0 ? 200 : m === 6 ? 600 : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 20 }
  })
}
const panel: DanePanelu = {
  id: "A",
  nazwa: "Panel A",
  pmaxW: 500,
  cenaBruttoZl: 600,
  gammaPctNaC: -0.29,
  noctC: 45,
  sprawnoscWzglednaPrzy200WPct: null,
  degradacjaPierwszyRokPct: null,
  degradacjaLiniowaPctNaRok: null,
  dlugoscMm: null,
  szerokoscMm: null,
  masaKg: null,
  bifacjalny: false,
}
const wejscie = (profilDobowy?: number[] | null): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 4,
  panele: [panel],
  wycena: { rodzaj: "siec", zlKwh: 1 },
  kryteria: domyslnyWyborKryteriow(),
  zapotrzebowanieMiesiaceKwh: Array.from({ length: 12 }, () => 100),
  bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: null, ...(profilDobowy === undefined ? {} : { profilDobowy }) },
})

const kody = (r: ReturnType<typeof calculatePorownywarkaPaneli>) => r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))

describe("profil dobowy w Porównywarce", () => {
  it("profil wieczorny pogarsza pokrycie wobec płaskiego (rok syntetyczny ma stałą moc w dobie, więc południowy nie różni się od płaskiego); założenie zmienia się z płaskiego na dobowe", () => {
    const plaski = calculatePorownywarkaPaneli(wejscie())
    const wieczor = calculatePorownywarkaPaneli(wejscie(wGodzinach([18, 19, 20, 21, 22])))
    const pokrycie = (r: typeof plaski) => r.value.panele[0]!.bilansGodzinowy!.pokrycieRokPct!
    expect(pokrycie(wieczor)).toBeLessThan(pokrycie(plaski))
    expect(kody(plaski)).toContain("PORP-ZAL-BIL-PROFIL-PLASKI")
    const kodyWieczor = kody(wieczor)
    expect(kodyWieczor).toContain("PORP-ZAL-BIL-PROFIL-DOBOWY")
    expect(kodyWieczor).not.toContain("PORP-ZAL-BIL-PROFIL-PLASKI")
  })

  it.each([[[1, 2, 3]], [new Array<number>(24).fill(0)], [[...new Array<number>(23).fill(1), -1]], [[...new Array<number>(23).fill(1), Number.NaN]]])(
    "zły profil %# jest błędem danych",
    (profil) => {
      const r = calculatePorownywarkaPaneli(wejscie(profil))
      expect(r.status).toBe("INVALID_INPUT")
      expect(r.warnings.map((e) => e.code)).toContain("PORP-PROFIL-DOBOWY-POZA-ZAKRESEM")
    },
  )
})
