import { describe, expect, it } from "vitest"
import type { Assumption } from "@/lib/core/calc-result"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { calculatePorownywarkaPaneli } from "../calculator"
import type { DanePanelu, PorownywarkaInput, WymiaryMiejsca } from "../input"
import { domyslnyWyborKryteriow } from "../kryteria"
import { pojemnoscMiejsca, wymiaryUzytkowe } from "../pakowanie"

/**
 * Rok syntetyczny jak w testach A1 (płaszczyzna pozioma: G_poa = G): styczeń G = 200 W/m² i −5 °C, lipiec G = 600 W/m² i 20 °C,
 * reszta 0. Referencje na JEDEN panel (policzone osobno w Pythonie w A1): panel 500 W / γ −0,29 / NOCT 45 → styczeń 79,5243,
 * lipiec 214,2999 kWh; panel 400 W / γ −0,35 / NOCT 45 → styczeń 64,4676, lipiec 169,9668 kWh.
 */
function rok(): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const g = m === 0 ? 200 : m === 6 ? 600 : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 20 }
  })
}

const A1_STY = 79.5243
const A1_LIP = 214.2999
const B1_STY = 64.4676
const B1_LIP = 169.9668

const panel = (p: Partial<DanePanelu> & { id: string }): DanePanelu => ({
  nazwa: `Panel ${p.id}`,
  pmaxW: 500,
  cenaBruttoZl: null,
  gammaPctNaC: -0.29,
  noctC: 45,
  sprawnoscWzglednaPrzy200WPct: null,
  degradacjaPierwszyRokPct: null,
  degradacjaLiniowaPctNaRok: null,
  dlugoscMm: 1762,
  szerokoscMm: 1134,
  masaKg: 22,
  bifacjalny: false,
  ...p,
})

const wejscie = (panele: DanePanelu[], reszta: Partial<PorownywarkaInput> = {}): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 1,
  panele,
  wycena: null,
  kryteria: domyslnyWyborKryteriow(),
  ...reszta,
})

/** Assumption codes (an assumption is a bare string or `{ kod, params }`). */
const kody = (a: Assumption[]) => a.map((x) => (typeof x === "string" ? x : x.kod))

const miejsce = (dlugoscM: number, szerokoscM: number, marginesM = 0): WymiaryMiejsca => ({ dlugoscM, szerokoscM, marginesM, montaz: "rownolegly" })

describe("pakowanie — ile paneli mieści się w miejscu (referencje ręczne)", () => {
  const p54 = panel({ id: "a" }) // 1762 × 1134 mm
  const p72 = panel({ id: "b", dlugoscMm: 2278, szerokoscMm: 1134 })

  it("2,268 × 1,762 m = dokładnie dwa panele obok siebie (2 × 1,134 m)", () => {
    expect(pojemnoscMiejsca(miejsce(2.268, 1.762), p54)!.liczba).toBe(2)
  })

  it("6 × 4 m: 1,762 × 1,134 → 5 × 2 = 10; 2,278 × 1,134 → 7 (2 × 3 + 1 w pasie 1,444 m)", () => {
    expect(pojemnoscMiejsca(miejsce(6, 4), p54)!.liczba).toBe(10)
    expect(pojemnoscMiejsca(miejsce(6, 4), p72)!.liczba).toBe(7)
  })

  it("margines odejmowany z obu stron: 2,068 × 1,562 m daje 1 panel, a margines 1 m zjada całe miejsce → 0", () => {
    expect(wymiaryUzytkowe(miejsce(2.268, 1.762, 0.1))).toEqual({ dlugoscM: 2.268 - 0.2, szerokoscM: 1.762 - 0.2 })
    expect(pojemnoscMiejsca(miejsce(2.268, 1.762, 0.1), p54)!.liczba).toBe(1)
    expect(wymiaryUzytkowe(miejsce(2, 1, 0.5))).toBeNull()
    expect(pojemnoscMiejsca(miejsce(2, 1, 0.5), p54)!.liczba).toBe(0)
  })

  it("brak wymiarów panelu na karcie → null, nie zgadujemy", () => {
    expect(pojemnoscMiejsca(miejsce(6, 4), panel({ id: "x", dlugoscMm: null }))).toBeNull()
  })
})

describe("calculatePorownywarkaPaneli — liczba paneli z wymiarów miejsca", () => {
  it("każdy panel dostaje własną liczbę sztuk; energia = liczba × energia jednego panelu", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie(
        [panel({ id: "A" }), panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.35, dlugoscMm: 2278 })],
        { liczbaPaneli: null, wymiaryMiejsca: miejsce(6, 4) },
      ),
    )
    const [a, b] = w.value.panele
    expect(a!.liczbaPaneli).toBe(10)
    expect(b!.liczbaPaneli).toBe(7)
    expect(a!.zrodloLiczby).toBe("z-wymiarow")
    expect(a!.miesiaceKwh[0]).toBeCloseTo(10 * A1_STY, 2)
    expect(b!.miesiaceKwh[6]).toBeCloseTo(7 * B1_LIP, 2)
    expect(a!.mocKwp).toBeCloseTo(5, 10)
    expect(b!.mocKwp).toBeCloseTo(2.8, 10)
    expect(a!.masaRazemKg).toBeCloseTo(220, 10)
    expect(kody(w.assumptions)).toContain("PORP-ZAL-LICZBA-Z-WYMIAROW")
    expect(kody(w.assumptions)).not.toContain("PORP-ZAL-TA-SAMA-LICZBA-PANELI")
  })

  it("brak wymiarów któregoś panelu przy liczeniu z miejsca → INCOMPLETE z nazwą panelu", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" }), panel({ id: "B", szerokoscMm: null })], { liczbaPaneli: null, wymiaryMiejsca: miejsce(6, 4) }))
    expect(w.status).toBe("INCOMPLETE")
    expect(w.warnings.map((x) => x.code)).toEqual(["PORP-BRAK-WYMIAROW-PANELU"])
  })

  describe("montaż pochylony na konstrukcji — liczba sztuk z odstępu rzędów", () => {
    const pochylone = (dlugoscM: number, szerokoscM: number, okno?: [number, number]): Partial<PorownywarkaInput> => ({
      liczbaPaneli: null,
      miejsce: { nachylenieDeg: 35, azymutDeg: 180, albedo: 0.2 },
      wymiaryMiejsca: {
        dlugoscM,
        szerokoscM,
        marginesM: 0,
        montaz: "pochylony-na-konstrukcji",
        ...(okno ? { oknoOdH: okno[0], oknoDoH: okno[1] } : {}),
      },
    })

    it("6 × 4 m, okno w południe: jeden rząd, stół 2 paneli w pionie, 5 stołów = 10 sztuk; odstęp ≈ L·(cosβ + sinβ/tgα) ≈ 3,06·L", () => {
      const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], pochylone(6, 4, [12, 12.1])))
      expect(w.status).not.toBe("INCOMPLETE")
      const a = w.value.panele[0]!
      expect(a.liczbaPaneli).toBe(10)
      expect(a.zrodloLiczby).toBe("z-wymiarow")
      expect(a.rozmieszczenie).toMatchObject({ rzedy: 1, panelowNaStole: 2, stolowWRzedzie: 5 })
      expect(a.rozmieszczenie!.odstepM / a.rozmieszczenie!.stolM).toBeGreaterThan(3.0)
      expect(a.rozmieszczenie!.odstepM / a.rozmieszczenie!.stolM).toBeLessThan(3.12)
    })

    it("duże miejsce: pochylone mieści mniej sztuk niż równoległe, a węższe okno (więcej rzędów) — więcej niż szersze", () => {
      const rownolegle = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { liczbaPaneli: null, wymiaryMiejsca: miejsce(20, 20) })).value.panele[0]!.liczbaPaneli
      const szerokie = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], pochylone(20, 20, [9, 15]))).value.panele[0]!.liczbaPaneli
      const waskie = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], pochylone(20, 20, [11, 13]))).value.panele[0]!.liczbaPaneli
      expect(szerokie).toBeGreaterThan(0)
      expect(szerokie).toBeLessThan(rownolegle)
      expect(waskie).toBeGreaterThan(szerokie)
      expect(waskie).toBeLessThan(rownolegle)
    })

    it("założenia: odstęp rzędów z oknem; okno domyślne tylko, gdy użytkownik go nie wpisał", () => {
      const domyslne = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], pochylone(20, 20)))
      expect(kody(domyslne.assumptions)).toContain("PORP-ZAL-ODSTEP-RZEDOW")
      expect(kody(domyslne.assumptions)).toContain("PORP-ZAL-OKNO-DOMYSLNE")
      expect(kody(domyslne.assumptions)).not.toContain("PORP-ZAL-PAKOWANIE-BEZ-SZCZELIN")
      const wpisane = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], pochylone(20, 20, [10, 14])))
      expect(kody(wpisane.assumptions)).not.toContain("PORP-ZAL-OKNO-DOMYSLNE")
      expect(wpisane.assumptions).toContainEqual({ kod: "PORP-ZAL-ODSTEP-RZEDOW", params: { odH: 10, doH: 14 } })
    })

    it("okno bez słońca (21 grudnia po zachodzie) → INCOMPLETE z prośbą o przesunięcie okna", () => {
      const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], pochylone(20, 20, [20, 22])))
      expect(w.status).toBe("INCOMPLETE")
      expect(w.warnings.map((x) => x.code)).toEqual(["PORP-ODSTEP-OKNO-BEZ-SLONCA"])
    })

    it("okno poza zakresem (początek po końcu) → INVALID_INPUT", () => {
      const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], pochylone(20, 20, [15, 9])))
      expect(w.status).toBe("INVALID_INPUT")
      expect(w.warnings.map((x) => x.code)).toContain("PORP-OKNO-ODSTEPU-POZA-ZAKRESEM")
    })

    it("wpisana liczba paneli przy montażu pochylonym: liczymy ją, a przekroczenie miejsca zgłasza ostrzeżenie", () => {
      const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { ...pochylone(6, 4, [12, 12.1]), liczbaPaneli: 30 }))
      expect(w.value.panele[0]!.liczbaPaneli).toBe(30)
      expect(w.warnings.map((x) => x.code)).toContain("PORP-LICZBA-PRZEKRACZA-MIEJSCE")
    })
  })

  it("ani liczby paneli, ani wymiarów miejsca → INCOMPLETE", () => {
    expect(calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { liczbaPaneli: null })).status).toBe("INCOMPLETE")
  })

  it("panel, który się nie mieści: 0 sztuk i ostrzeżenie, reszta zestawu liczona", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A" }), panel({ id: "B", dlugoscMm: 2384, szerokoscMm: 1303 })], { liczbaPaneli: null, wymiaryMiejsca: miejsce(1.2, 1.2) }),
    )
    expect(w.value.panele.map((x) => x.liczbaPaneli)).toEqual([0, 0])
    expect(w.warnings.filter((x) => x.code === "PORP-PANEL-SIE-NIE-MIESCI")).toHaveLength(2)
    expect(w.value.panele[0]!.rokKwh).toBe(0)
  })

  it("wpisana liczba większa niż się mieści → ostrzeżenie, ale liczymy to, co wpisał użytkownik (decyduje on, U24)", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { liczbaPaneli: 12, wymiaryMiejsca: miejsce(6, 4) }))
    expect(w.value.panele[0]!.liczbaPaneli).toBe(12)
    expect(w.value.panele[0]!.mieszcaSie).toBe(10)
    expect(w.warnings.map((x) => x.code)).toContain("PORP-LICZBA-PRZEKRACZA-MIEJSCE")
  })

  it("walidacja: wymiary miejsca ≤ 0, ujemny margines, zła długość zapotrzebowania", () => {
    const kody = (i: Partial<PorownywarkaInput>) => calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], i)).warnings.map((x) => x.code)
    expect(kody({ liczbaPaneli: null, wymiaryMiejsca: miejsce(0, 4) })).toContain("PORP-WYMIARY-MIEJSCA-POZA-ZAKRESEM")
    expect(kody({ liczbaPaneli: null, wymiaryMiejsca: miejsce(6, 4, -1) })).toContain("PORP-WARTOSC-UJEMNA")
    expect(kody({ zapotrzebowanieMiesiaceKwh: [1, 2, 3] })).toContain("PORP-ZAPOTRZEBOWANIE-POZA-ZAKRESEM")
  })
})

describe("calculatePorownywarkaPaneli — energia wykorzystana i nadwyżka (7.2)", () => {
  /** Zapotrzebowanie: styczeń 50 kWh, lipiec 100 kWh, reszta 0. Produkcja 1 panelu: 79,5243 / 214,2999. */
  const zap = [50, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0]

  it("Σ min(produkcja, zapotrzebowanie): użyteczna 150, w tym zimą 50; nadwyżka = produkcja − 150", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { zapotrzebowanieMiesiaceKwh: zap, wycena: { rodzaj: "reczna", zlKwh: 1 } }))
    const a = w.value.panele[0]!
    expect(w.value.zUzytecznoscia).toBe(true)
    expect(a.uzytecznaRokKwh).toBeCloseTo(150, 10)
    expect(a.uzytecznaZimaKwh).toBeCloseTo(50, 10)
    expect(a.nadwyzkaRokKwh).toBeCloseTo(A1_STY + A1_LIP - 150, 3)
    expect(a.nadwyzkaUlamek).toBeCloseTo((A1_STY + A1_LIP - 150) / (A1_STY + A1_LIP), 6)
    // do wyceny wchodzi tylko energia wykorzystana
    expect(a.wartoscRokZl).toBeCloseTo(150, 10)
    expect(a.wartoscZimaZl).toBeCloseTo(50, 10)
    expect(kody(w.assumptions)).toContain("PORP-ZAL-UZYTECZNA-MIESIECZNIE")
    expect(kody(w.assumptions)).not.toContain("PORP-ZAL-WYCENA-BEZ-UZYTECZNOSCI")
  })

  it("zapotrzebowanie większe niż produkcja → nadwyżka 0 i wartość = cała produkcja", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { zapotrzebowanieMiesiaceKwh: Array(12).fill(1000), wycena: { rodzaj: "reczna", zlKwh: 2 } }))
    const a = w.value.panele[0]!
    expect(a.nadwyzkaRokKwh).toBeCloseTo(0, 10)
    expect(a.wartoscRokZl).toBeCloseTo(2 * (A1_STY + A1_LIP), 3)
  })

  it("bez zapotrzebowania: tryb „suchy” — pola użyteczności puste, wartość = produkcja × stawka", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { wycena: { rodzaj: "reczna", zlKwh: 1 } }))
    const a = w.value.panele[0]!
    expect(w.value.zUzytecznoscia).toBe(false)
    expect(a.uzytecznaRokKwh).toBeNull()
    expect(a.nadwyzkaRokKwh).toBeNull()
    expect(a.wartoscRokZl).toBeCloseTo(A1_STY + A1_LIP, 3)
  })

  it("taryfa dzienna/nocna: energia taniej strefy skalowana jak produkcja miesiąca (okno 0–24 = cała energia po cenie nocnej)", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A" })], {
        zapotrzebowanieMiesiaceKwh: zap,
        wycena: { rodzaj: "dzienNoc", zlKwhDzien: 2, zlKwhNoc: 0.5, oknaTanie: [{ odH: 0, doH: 24 }] },
      }),
    )
    expect(w.value.panele[0]!.wartoscRokZl).toBeCloseTo(150 * 0.5, 6)
    expect(kody(w.assumptions)).toContain("PORP-ZAL-UZYTECZNA-PROPORCJA-STREF")
  })
})

describe("calculatePorownywarkaPaneli — scenariusz „tańszy panel = więcej paneli” (7.4, U10, U11)", () => {
  const droga = panel({ id: "A", cenaBruttoZl: 600 })
  const tania = panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.35, cenaBruttoZl: 400 })

  it("3 szt. każdego: oszczędność 600 zł = 1 dodatkowy panel tańszego; przewaga 56,265 kWh rocznie, 19,2975 zimą", () => {
    const w = calculatePorownywarkaPaneli(wejscie([droga, tania], { liczbaPaneli: 3 }))
    expect(w.value.scenariusze).toHaveLength(1)
    const s = w.value.scenariusze[0]!
    expect(s.drozszyId).toBe("A")
    expect(s.tanszyId).toBe("B")
    expect(s.oszczednoscZl).toBeCloseTo(600, 10)
    expect(s.dodatkowePanele).toBe(1)
    // wymiary miejsca nieznane → nie sprawdzono, czy się zmieści; wszystkie w „tym samym miejscu”
    expect(s.miejsceSprawdzone).toBe(false)
    expect(s.wTymSamymMiejscu).toBe(1)
    expect(s.naScianie).toBe(0)
    expect(s.dodatkoweRokKwh).toBeCloseTo(B1_STY + B1_LIP, 3)
    expect(s.dodatkoweZimaKwh).toBeCloseTo(B1_STY, 3)
    expect(s.przewagaRokKwh).toBeCloseTo(4 * (B1_STY + B1_LIP) - 3 * (A1_STY + A1_LIP), 3)
    expect(s.przewagaRokKwh).toBeCloseTo(56.265, 2)
    expect(s.przewagaZimaKwh).toBeCloseTo(19.2975, 3)
    expect(s.przewagaRokZl).toBeNull() // brak ceny kWh
    expect(kody(w.assumptions)).toEqual(expect.arrayContaining(["PORP-ZAL-SCENARIUSZ-BEZ-BOS", "PORP-ZAL-SCENARIUSZ-MIEJSCE-NIEZNANE"]))
  })

  it("z ceną kWh przewaga w złotówkach = przewaga w kWh × stawka", () => {
    const w = calculatePorownywarkaPaneli(wejscie([droga, tania], { liczbaPaneli: 3, wycena: { rodzaj: "reczna", zlKwh: 1.5 } }))
    const s = w.value.scenariusze[0]!
    expect(s.przewagaRokZl).toBeCloseTo(1.5 * 56.265, 2)
    expect(s.przewagaZimaZl).toBeCloseTo(1.5 * 19.2975, 3)
  })

  it("brak wolnego miejsca → dodatkowe panele na ścianie południowej, z uzyskiem pionowym z tego samego silnika", () => {
    // Miejsce na dokładnie 3 panele (2,268 × 1,762 m + 1,134 × 1,762): 3 × 1,134 m = 3,402 m w poprzek, 1,762 m wzdłuż.
    const m = miejsce(3.402, 1.762)
    const w = calculatePorownywarkaPaneli(wejscie([droga, tania], { liczbaPaneli: 3, wymiaryMiejsca: m }))
    const s = w.value.scenariusze[0]!
    expect(s.miejsceSprawdzone).toBe(true)
    expect(s.wTymSamymMiejscu).toBe(0)
    expect(s.naScianie).toBe(1)
    // Referencja: jeden panel B na płaszczyźnie 90°/180° liczony wprost tym samym silnikiem
    const sciana = calculatePorownywarkaPaneli(
      wejscie([tania], { liczbaPaneli: 1, miejsce: { nachylenieDeg: 90, azymutDeg: 180, albedo: 0.2 } }),
    ).value.panele[0]!
    expect(s.dodatkoweRokKwh).toBeCloseTo(sciana.rokKwh, 6)
    expect(s.dodatkoweZimaKwh).toBeCloseTo(sciana.zimaKwh, 6)
    expect(kody(w.assumptions)).toContain("PORP-ZAL-SCIANA-POLUDNIOWA")
  })

  it("część w miejscu, część na ścianie: wolne miejsce = pojemność − liczba sztuk tańszego", () => {
    // Pojemność 4 sztuk (2,268 × 3,524 m → 2 × 2). Tańszy ma 3 sztuki, więc 1 wolne; dokupić można 2 (800 zł oszczędności przy 4 szt.).
    const w = calculatePorownywarkaPaneli(wejscie([droga, tania], { liczbaPaneli: 4, wymiaryMiejsca: miejsce(2.268, 3.524) }))
    const s = w.value.scenariusze[0]!
    expect(s.oszczednoscZl).toBeCloseTo(800, 10)
    expect(s.dodatkowePanele).toBe(2)
    expect(s.wTymSamymMiejscu + s.naScianie).toBe(2)
    expect(s.wTymSamymMiejscu).toBe(0) // pojemność = 4 = liczba sztuk → brak wolnych
    expect(s.naScianie).toBe(2)
  })

  it("jeden panel albo brak cen → brak scenariuszy; równe koszty → brak", () => {
    expect(calculatePorownywarkaPaneli(wejscie([droga], { liczbaPaneli: 3 })).value.scenariusze).toEqual([])
    expect(calculatePorownywarkaPaneli(wejscie([panel({ id: "A" }), panel({ id: "B" })], { liczbaPaneli: 3 })).value.scenariusze).toEqual([])
    expect(calculatePorownywarkaPaneli(wejscie([droga, panel({ id: "C", cenaBruttoZl: 600 })], { liczbaPaneli: 3 })).value.scenariusze).toEqual([])
  })

  it("różna liczba sztuk z pakowania: oszczędność = różnica sum cen (N·cena), nie różnica cen jednego panelu", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie(
        [panel({ id: "A", cenaBruttoZl: 600 }), panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.35, cenaBruttoZl: 400, dlugoscMm: 2278 })],
        { liczbaPaneli: null, wymiaryMiejsca: miejsce(6, 4) },
      ),
    )
    // A: 10 szt. × 600 = 6000; B: 7 szt. × 400 = 2800; oszczędność 3200 → floor(3200 / 400) = 8
    const s = w.value.scenariusze[0]!
    expect(s.oszczednoscZl).toBeCloseTo(3200, 10)
    expect(s.dodatkowePanele).toBe(8)
    expect(s.wTymSamymMiejscu).toBe(0) // pojemność B = 7 = jego liczba sztuk
    expect(s.naScianie).toBe(8)
  })
})
