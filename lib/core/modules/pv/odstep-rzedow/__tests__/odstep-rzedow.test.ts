import { describe, expect, it } from "vitest"
import type { Assumption } from "@/lib/core/calc-result"
import { pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { calculateOdstepRzedow } from "../calculator"
import { czescZacieniona, odstepWymaganyM, probkiOkna, tangensProfilu, wspolczynnikCienia } from "../geometria"
import type { OdstepRzedowInput } from "../input"

const RAD = Math.PI / 180
const kody = (a: Assumption[]) => a.map((x) => (typeof x === "string" ? x : x.kod))

/** Synthetic clear year: beam 600 W/m², diffuse 80 W/m² whenever the sun is above the horizon, nothing at night. */
function rokSyntetyczny(lat: number, lon: number): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const alt = pozycjaSlonca(lat, lon, czasUtcMs).wysokoscDeg
    if (alt <= 0) return { czasUtcMs, ghi: 0, dni: 0, dhi: 0 }
    return { czasUtcMs, ghi: 600 * Math.sin(alt * RAD) + 80, dni: 600, dhi: 80 }
  })
}

const baza: OdstepRzedowInput = {
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  nachylenieDeg: 35,
  azymutDeg: 180,
  dlugoscWzdluzSpaduM: 2.278,
  oknoOdH: 9,
  oknoDoH: 15,
  odstepM: null,
  docelowaStrataZimaPct: null,
  liczbaRzedow: null,
}

describe("geometria cienia", () => {
  it("ręczny przykład: β = 30°, L = 2 m, słońce w płaszczyźnie przekroju na 20° — rzędy stykające się zacieniają 61,3% stołu, odstęp d + h/tanα zero", () => {
    const tp = Math.tan(20 * RAD)
    const d = 2 * Math.cos(30 * RAD)
    expect(czescZacieniona(2, 30, d, tp)).toBeCloseTo(1 / (0.5 + Math.cos(30 * RAD) * tp) / 2, 6)
    expect(czescZacieniona(2, 30, d, tp)).toBeCloseTo(0.6134, 3)
    expect(czescZacieniona(2, 30, d + 1 / tp, tp)).toBeCloseTo(0, 9)
    expect(czescZacieniona(2, 30, d + 1 / tp + 5, tp)).toBe(0)
  })

  it("im większy odstęp, tym mniejszy cień (malejąco); stół poziomy nigdy nie zacienia", () => {
    const tp = Math.tan(12 * RAD)
    let poprzednia = 1
    for (let p = 1.8; p < 12; p += 0.5) {
      const c = czescZacieniona(2, 30, p, tp)
      expect(c).toBeLessThanOrEqual(poprzednia + 1e-12)
      poprzednia = c
    }
    expect(czescZacieniona(2, 0, 2, tp)).toBe(0)
  })

  it("tangens profilu: słońce pod horyzontem albo za panelami = null; poza osią dzielony przez cosΔ", () => {
    expect(tangensProfilu(-1, 180, 180)).toBeNull()
    expect(tangensProfilu(20, 0, 180)).toBeNull()
    expect(tangensProfilu(20, 270, 180)).toBeNull()
    expect(tangensProfilu(20, 180, 180)).toBeCloseTo(Math.tan(20 * RAD), 9)
    expect(tangensProfilu(20, 240, 180)).toBeCloseTo(Math.tan(20 * RAD) / 0.5, 9)
  })

  it("wysokość słońca w południe 21 grudnia na 52,2°N ≈ 14,3° (90° − φ − 23,44°, plus refrakcja); próbki co 10 min, oba końce okna", () => {
    const p = probkiOkna(52.2, 21, 9, 15)
    expect(p).toHaveLength(37)
    const poludnie = p.find((x) => x.czasSlonecznyH === 12)!
    expect(poludnie.wysokoscDeg).toBeGreaterThan(14.0)
    expect(poludnie.wysokoscDeg).toBeLessThan(14.8)
    expect(Math.abs(poludnie.azymutDeg - 180)).toBeLessThan(2)
  })

  it("współczynnik cienia = max cosΔ/tanα; odstęp wymagany = L(cosβ + sinβ·F)", () => {
    const w = wspolczynnikCienia(
      [
        { czasSlonecznyH: 12, wysokoscDeg: 14.56, azymutDeg: 180 },
        { czasSlonecznyH: 9, wysokoscDeg: 5, azymutDeg: 140 },
        { czasSlonecznyH: 8, wysokoscDeg: -2, azymutDeg: 125 },
      ],
      180,
    )!
    expect(w.nadHoryzontem).toBe(2)
    expect(w.f).toBeCloseTo(Math.cos(40 * RAD) / Math.tan(5 * RAD), 9)
    expect(w.probka!.czasSlonecznyH).toBe(9)
    expect(odstepWymaganyM(2, 30, w.f)).toBeCloseTo(2 * (Math.cos(30 * RAD) + 0.5 * w.f), 9)
    expect(wspolczynnikCienia([{ czasSlonecznyH: 1, wysokoscDeg: -5, azymutDeg: 0 }], 180)).toBeNull()
  })
})

describe("calculateOdstepRzedow — odstęp bez cienia w oknie", () => {
  it("decyduje brzeg okna (niskie słońce), odstęp rośnie z kątem i z szerokością okna; zakładki geometrii w założeniach", () => {
    const r = calculateOdstepRzedow(baza)
    expect(r.status).toBe("VALID")
    const v = r.value!
    expect([9, 15]).toContain(v.decydujaca!.czasSlonecznyH)
    expect(v.odstepWymaganyM).toBeCloseTo(2.278 * (Math.cos(35 * RAD) + Math.sin(35 * RAD) * v.wspolczynnikCienia), 9)
    expect(v.przerwaWymaganaM).toBeCloseTo(v.odstepWymaganyM - v.rzutPoziomyM, 9)
    expect(v.wspolczynnikZabudowy).toBeCloseTo(2.278 / v.odstepWymaganyM, 9)
    expect(kody(r.assumptions)).toContain("ODRZ-ZAL-GEOMETRIA")
    const waskie = calculateOdstepRzedow({ ...baza, oknoOdH: 10, oknoDoH: 14 }).value!
    const poludnie = calculateOdstepRzedow({ ...baza, oknoOdH: 11, oknoDoH: 13 }).value!
    expect(waskie.odstepWymaganyM).toBeLessThan(v.odstepWymaganyM)
    expect(poludnie.odstepWymaganyM).toBeLessThan(waskie.odstepWymaganyM)
    const katy = v.tabelaKatow.map((w) => w.odstepWymaganyM)
    expect(katy).toEqual([...katy].sort((a, b) => a - b))
    expect(v.tabelaKatow.some((w) => w.katDeg === 35)).toBe(true)
  })

  it("panele poziome: odstęp = długość stołu; panele patrzące na północ: słońce zza paneli, odstęp = rzut poziomy", () => {
    const poziome = calculateOdstepRzedow({ ...baza, nachylenieDeg: 0 })
    expect(poziome.value!.odstepWymaganyM).toBeCloseTo(2.278, 9)
    expect(poziome.warnings.map((w) => w.code)).toContain("ODRZ-PANELE-POZIOME")
    const polnoc = calculateOdstepRzedow({ ...baza, azymutDeg: 0 })
    expect(polnoc.value!.wspolczynnikCienia).toBe(0)
    expect(polnoc.value!.odstepWymaganyM).toBeCloseTo(polnoc.value!.rzutPoziomyM, 9)
    expect(polnoc.warnings.map((w) => w.code)).toContain("ODRZ-SLONCE-ZA-PANELAMI")
  })

  it("noc polarna w oknie → INCOMPLETE; część okna przed świtem → informacja i próbki pominięte", () => {
    const polarna = calculateOdstepRzedow({ ...baza, szerokoscGeograficzna: 80 })
    expect(polarna.status).toBe("INCOMPLETE")
    expect(polarna.warnings.map((w) => w.code)).toContain("ODRZ-OKNO-BEZ-SLONCA")
    const szerokie = calculateOdstepRzedow({ ...baza, oknoOdH: 5, oknoDoH: 12 })
    expect(szerokie.warnings.map((w) => w.code)).toContain("ODRZ-CZESC-OKNA-POD-HORYZONTEM")
  })

  it("walidacja: zakresy, odstęp mniejszy niż rzut, brak danych → INCOMPLETE", () => {
    expect(calculateOdstepRzedow({ ...baza, nachylenieDeg: 95 }).status).toBe("INVALID_INPUT")
    expect(calculateOdstepRzedow({ ...baza, oknoOdH: 15, oknoDoH: 9 }).status).toBe("INVALID_INPUT")
    expect(calculateOdstepRzedow({ ...baza, dlugoscWzdluzSpaduM: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateOdstepRzedow({ ...baza, liczbaRzedow: 0 }).status).toBe("INVALID_INPUT")
    const za = calculateOdstepRzedow({ ...baza, odstepM: 1.5 })
    expect(za.status).toBe("INVALID_INPUT")
    expect(za.warnings[0]!.code).toBe("ODRZ-ODSTEP-MNIEJSZY-NIZ-RZUT")
    expect(calculateOdstepRzedow({ ...baza, nachylenieDeg: null }).status).toBe("INCOMPLETE")
  })

  it("podany odstęp: cień w oknie znika dokładnie od odstępu wymaganego", () => {
    const wym = calculateOdstepRzedow(baza).value!.odstepWymaganyM
    const rowny = calculateOdstepRzedow({ ...baza, odstepM: wym + 1e-6 }).value!.zadanyOdstep!
    expect(rowny.bezCieniaWOknie).toBe(true)
    expect(rowny.maksCzescZacieniona).toBe(0)
    const mniejszy = calculateOdstepRzedow({ ...baza, odstepM: wym - 0.5 }).value!.zadanyOdstep!
    expect(mniejszy.bezCieniaWOknie).toBe(false)
    expect([9, 15]).toContain(mniejszy.czasMaksH)
    expect(mniejszy.strata).toBeNull()
  })
})

describe("calculateOdstepRzedow — strata energii z danymi godzinowymi", () => {
  const dane = rokSyntetyczny(52.2, 21)
  const z = (extra: Partial<OdstepRzedowInput>) => calculateOdstepRzedow({ ...baza, daneGodzinowe: dane, ...extra })

  it("strata maleje z odstępem: rzędy stykające się > krzywa > 0 przy odstępie z okna > 0 poza oknem; bardzo duży odstęp = 0", () => {
    const v = z({}).value!
    const dotykajace = z({ odstepM: v.rzutPoziomyM }).value!.zadanyOdstep!.strata!
    const wOknie = z({ odstepM: v.odstepWymaganyM }).value!.zadanyOdstep!.strata!
    const duzo = z({ odstepM: 400 }).value!.zadanyOdstep!.strata!
    expect(dotykajace.zimaPct).toBeGreaterThan(wOknie.zimaPct)
    expect(wOknie.zimaPct).toBeGreaterThan(0)
    // Even 400 m leaves a trace: the sun a fraction of a degree above the horizon throws shadows over hundreds of metres.
    expect(duzo.zimaPct).toBeLessThan(0.1)
    expect(duzo.zimaPct).toBeLessThan(wOknie.zimaPct / 10)
    expect(dotykajace.zimaPoCieniuKwhM2).toBeLessThan(dotykajace.zimaBezCieniaKwhM2)
    const krzywa = v.krzywaStrat!
    expect(krzywa).toHaveLength(6)
    expect(krzywa.at(-1)!.odstepM).toBeCloseTo(v.odstepWymaganyM, 9)
    for (let i = 1; i < krzywa.length; i++) expect(krzywa[i]!.strata.zimaPct).toBeLessThanOrEqual(krzywa[i - 1]!.strata.zimaPct + 1e-9)
  })

  it("odstęp dla zadanej straty: strata mieści się w celu, a odstęp o 5 cm mniejszy już nie", () => {
    const v = z({ docelowaStrataZimaPct: 3 }).value!
    const d = v.odstepDlaStraty!
    expect(d.strata.zimaPct).toBeLessThanOrEqual(3 + 1e-9)
    const mniejszy = z({ odstepM: d.odstepM - 0.05 }).value!.zadanyOdstep!.strata!
    expect(mniejszy.zimaPct).toBeGreaterThan(3)
    expect(d.przerwaM).toBeCloseTo(d.odstepM - v.rzutPoziomyM, 9)
    // A loose target is met even with touching rows.
    const luzny = z({ docelowaStrataZimaPct: 99 }).value!.odstepDlaStraty!
    expect(luzny.odstepM).toBeCloseTo(v.rzutPoziomyM, 6)
  })

  it("liczba rzędów: pierwszy rząd bez cienia — waga (n − 1)/n obniża zimę na m² gruntu", () => {
    const wielkiR = z({ odstepM: 4 })
    const dwaR = z({ odstepM: 4, liczbaRzedow: 2 })
    const wielki = wielkiR.value!
    const dwa = dwaR.value!
    expect(wielki.wagaRzedowZacienianych).toBe(1)
    expect(dwa.wagaRzedowZacienianych).toBe(0.5)
    expect(dwa.zadanyOdstep!.zimaNaM2GruntuKwh!).toBeGreaterThan(wielki.zadanyOdstep!.zimaNaM2GruntuKwh!)
    expect(kody(dwaR.assumptions)).toContain("ODRZ-ZAL-RZEDY")
    expect(kody(wielkiR.assumptions)).toContain("ODRZ-ZAL-RZEDY-NIEZNANE")
  })

  it("tabela kątów: przy stałym odstępie rzędów za małe odstępy dla stromych kątów są oznaczone, a energia na m² gruntu policzona; wskazany najlepszy kąt", () => {
    const v = z({ odstepM: 3 }).value!
    const strome = v.tabelaKatow.find((w) => w.katDeg === 60)!
    expect(strome.odstepZaMaly).toBe(false)
    expect(strome.strata!.zimaPct).toBeGreaterThan(v.tabelaKatow.find((w) => w.katDeg === 10)!.strata!.zimaPct)
    const wszystkie = v.tabelaKatow.filter((w) => w.zimaNaM2GruntuKwh !== null)
    expect(wszystkie.length).toBeGreaterThan(5)
    const maks = Math.max(...wszystkie.map((w) => w.zimaNaM2GruntuKwh!))
    expect(v.tabelaKatow.find((w) => w.katDeg === v.najlepszyKatNaGruncieDeg)!.zimaNaM2GruntuKwh).toBe(maks)
    const ciasne = z({ odstepM: 2.0 }).value!
    expect(ciasne.tabelaKatow.find((w) => w.katDeg === 10)!.odstepZaMaly).toBe(true)
    expect(ciasne.tabelaKatow.find((w) => w.katDeg === 10)!.strata).toBeNull()
  })

  it("bez danych godzinowych: tylko geometria (bez strat, krzywej i kolumn energii)", () => {
    const v = calculateOdstepRzedow({ ...baza, odstepM: 5, docelowaStrataZimaPct: 3 }).value!
    expect(v.krzywaStrat).toBeNull()
    expect(v.odstepDlaStraty).toBeNull()
    expect(v.zadanyOdstep!.strata).toBeNull()
    expect(v.najlepszyKatNaGruncieDeg).toBeNull()
    expect(v.tabelaKatow.every((w) => w.strata === null)).toBe(true)
  })
})
