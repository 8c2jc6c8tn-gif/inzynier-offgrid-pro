import { describe, expect, it } from "vitest"
import { pozycjaSlonca, promieniowanieBezposrednieCzysteNiebo, cosKataPadania } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { profilNaslonecznienia, godzinaLokalnaPl } from "@/lib/core/modules/pv/porownywarka-paneli/uzysk"
import { calculateTorSlonca, pozycjaLokalna, type TorSloncaResult } from "../calculator"
import { ROK_ODNIESIENIA } from "../constants"
import type { TorSloncaInput } from "../input"

const WARSZAWA = { lat: 52.2297, lon: 21.0122 }
const NACHYLENIE_OSI_ZIEMI = 23.44

const baza: TorSloncaInput = {
  szerokoscGeograficzna: WARSZAWA.lat,
  dlugoscGeograficzna: WARSZAWA.lon,
  miesiac: 6,
  nachylenieDeg: null,
  azymutDeg: null,
  mocKwp: null,
  pr: null,
}

const pelne: TorSloncaInput = { ...baza, nachylenieDeg: 35, azymutDeg: 180, mocKwp: 5, pr: 0.8 }

function wartosc(input: TorSloncaInput): TorSloncaResult {
  const r = calculateTorSlonca(input)
  expect(r.value).not.toBeNull()
  return r.value!
}

/** Syntetyczny TMY: co godzinę całego roku ta sama jasność w ciągu dnia (UTC 5–17), poza tym zero — liczy się struktura, nie fizyka pogody. */
function rokSyntetyczny(ghi: number, dni: number, dhi: number): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const jasno = h % 24 >= 5 && h % 24 <= 17
    return { czasUtcMs: start + h * 3_600_000 + 10 * 60_000, ghi: jasno ? ghi : 0, dni: jasno ? dni : 0, dhi: jasno ? dhi : 0 }
  })
}

describe("łuki toru słońca — Warszawa", () => {
  const v = wartosc(baza)
  const luk = (id: string) => v.luki.find((l) => l.id === id)!

  it("maksymalna wysokość słońca = 90° − φ ± 23,44° (przesilenia) i 90° − φ (równonoc)", () => {
    expect(luk("lato").maksWysokoscDeg).toBeCloseTo(90 - WARSZAWA.lat + NACHYLENIE_OSI_ZIEMI, 0)
    expect(luk("zima").maksWysokoscDeg).toBeCloseTo(90 - WARSZAWA.lat - NACHYLENIE_OSI_ZIEMI, 0)
    expect(luk("rownonoc").maksWysokoscDeg).toBeCloseTo(90 - WARSZAWA.lat, 0)
  })

  it("w górowaniu słońce stoi prawie dokładnie na południu", () => {
    const g = luk("lato").punkty.reduce((a, b) => (b.wysokoscDeg > a.wysokoscDeg ? b : a))
    expect(Math.abs(g.azymutDeg - 180)).toBeLessThan(1.5)
  })

  it("górowanie 21 VI w Warszawie wypada ok. 12:38 czasu urzędowego (λ = 21° → 84 min przed UTC, CEST = UTC+2)", () => {
    expect(luk("lato").gorowanieH!).toBeGreaterThan(12.4)
    expect(luk("lato").gorowanieH!).toBeLessThan(12.9)
  })

  it("długość dnia: lato 16,3–16,8 h, zima 7,4–8,0 h", () => {
    expect(luk("lato").dlugoscDniaH).toBeGreaterThan(16.3)
    expect(luk("lato").dlugoscDniaH).toBeLessThan(16.8)
    expect(luk("zima").dlugoscDniaH).toBeGreaterThan(7.4)
    expect(luk("zima").dlugoscDniaH).toBeLessThan(8.0)
  })

  it("wschód jest przed zachodem, a azymut rośnie od wschodu przez południe do zachodu", () => {
    const l = luk("rownonoc")
    expect(l.wschodH!).toBeLessThan(l.zachodH!)
    expect(l.punkty[0]!.azymutDeg).toBeLessThan(120)
    expect(l.punkty[l.punkty.length - 1]!.azymutDeg).toBeGreaterThan(240)
  })

  it("znaczniki to pełne godziny nad horyzontem", () => {
    for (const z of luk("zima").znaczniki) {
      expect(Number.isInteger(z.godzinaH)).toBe(true)
      expect(z.wysokoscDeg).toBeGreaterThan(0)
    }
  })

  it("czas urzędowy: godzina 12:00 to 10:00 UTC latem i 11:00 UTC zimą", () => {
    const lato = pozycjaLokalna(WARSZAWA.lat, WARSZAWA.lon, 6, 21, 12)
    const wzorLato = pozycjaSlonca(WARSZAWA.lat, WARSZAWA.lon, Date.UTC(ROK_ODNIESIENIA, 5, 21, 10))
    expect(lato.wysokoscDeg).toBeCloseTo(wzorLato.wysokoscDeg, 6)
    const zima = pozycjaLokalna(WARSZAWA.lat, WARSZAWA.lon, 12, 21, 12)
    const wzorZima = pozycjaSlonca(WARSZAWA.lat, WARSZAWA.lon, Date.UTC(ROK_ODNIESIENIA, 11, 21, 11))
    expect(zima.azymutDeg).toBeCloseTo(wzorZima.azymutDeg, 6)
  })

  it("wybrany łuk to 15. dzień wybranego miesiąca", () => {
    const w = wartosc({ ...baza, miesiac: 3 }).luki.find((l) => l.id === "wybrany")!
    expect(w.miesiac).toBe(3)
    expect(w.dzien).toBe(15)
    expect(w.maksWysokoscDeg).toBeGreaterThan(30)
    expect(w.maksWysokoscDeg).toBeLessThan(40)
  })

  it("zakres azymutów obejmuje wszystkie łuki", () => {
    expect(v.zakresAzymutuDeg!.od).toBeLessThan(55)
    expect(v.zakresAzymutuDeg!.do).toBeGreaterThan(305)
  })
})

describe("energia PV", () => {
  it("bez nachylenia, azymutu, mocy i PR liczy sam tor i mówi o tym (info)", () => {
    const r = calculateTorSlonca(baza)
    expect(r.value!.energia).toBeNull()
    expect(r.warnings.map((w) => w.code)).toContain("TORS-BEZ-DANYCH-PV")
    expect(r.status).toBe("VALID")
  })

  it("czyste niebo: południe 21 VI, 35° na południe, 1 kWp, PR 1 ≈ 0,9 kWh w godzinie górowania", () => {
    const e = wartosc({ ...pelne, miesiac: 6, mocKwp: 1, pr: 1 }).energia!
    const naj = Math.max(...e.godziny.map((g) => g.czysteNiebo))
    expect(naj).toBeGreaterThan(0.8)
    expect(naj).toBeLessThan(1.0)
  })

  it("czyste niebo jest liniowe w mocy i w PR", () => {
    const a = wartosc({ ...pelne, mocKwp: 2, pr: 0.5 }).energia!.czysteNiebo
    const b = wartosc({ ...pelne, mocKwp: 4, pr: 0.5 }).energia!.czysteNiebo
    const c = wartosc({ ...pelne, mocKwp: 2, pr: 1 }).energia!.czysteNiebo
    expect(b).toBeCloseTo(2 * a, 9)
    expect(c).toBeCloseTo(2 * a, 9)
  })

  it("czyste niebo: noc ma zero, a energia jest tylko w godzinach dnia", () => {
    const e = wartosc(pelne).energia!
    expect(e.godziny).toHaveLength(24)
    expect(e.godziny[0]!.czysteNiebo).toBe(0)
    expect(e.godziny[23]!.czysteNiebo).toBe(0)
    expect(e.godziny[12]!.czysteNiebo).toBeGreaterThan(0)
  })

  it("bez TMY: brak typowego dnia i ostrzeżenie info; z TMY — typowa doba i serie miesięczne", () => {
    const bez = calculateTorSlonca(pelne)
    expect(bez.value!.energia!.typowaDobaKwh).toBeNull()
    expect(bez.value!.energia!.godziny.every((g) => g.typowaKwh === null)).toBe(true)
    expect(bez.warnings.map((w) => w.code)).toContain("TORS-BEZ-TMY")
    const z = calculateTorSlonca({ ...pelne, daneGodzinowe: rokSyntetyczny(500, 700, 100) })
    expect(z.value!.energia!.typowaDobaKwh).toBeGreaterThan(0)
    expect(z.value!.energia!.miesiacamiKwhNaDobe).toHaveLength(12)
    expect(z.warnings.map((w) => w.code)).not.toContain("TORS-BEZ-TMY")
  })

  it("typowy dzień = średnia godzinowa z TMY dla miesiąca, grupowana wg godziny czasu urzędowego", () => {
    const dane = rokSyntetyczny(500, 700, 100)
    const e = wartosc({ ...pelne, miesiac: 6, daneGodzinowe: dane }).energia!
    const profil = profilNaslonecznienia(WARSZAWA.lat, WARSZAWA.lon, dane, { nachylenieDeg: 35, azymutDeg: 180 })
    for (const h of [8, 12, 15]) {
      let s = 0
      let n = 0
      for (let i = 0; i < dane.length; i++) {
        if (profil.miesiac[i] === 5 && godzinaLokalnaPl(dane[i]!.czasUtcMs) === h) {
          s += profil.gPoa[i]!
          n++
        }
      }
      expect(e.godziny[h]!.typowaKwh!).toBeCloseTo(((s / n) / 1000) * 5 * 0.8, 9)
    }
    // Suma doby = pozycja miesiąca w serii miesięcznej.
    expect(e.miesiacamiKwhNaDobe![5]!).toBeCloseTo(e.typowaDobaKwh!, 9)
  })

  it("szczyt typowego dnia jest godziną o największej energii", () => {
    const e = wartosc({ ...pelne, daneGodzinowe: rokSyntetyczny(500, 700, 100) }).energia!
    const maks = Math.max(...e.godziny.map((g) => g.typowaKwh!))
    expect(e.godziny[e.szczytTypowyH!]!.typowaKwh).toBe(maks)
  })

  it("panel zwrócony północą w grudniu: słońce od tyłu cały dzień → zero i ostrzeżenie", () => {
    const r = calculateTorSlonca({ ...pelne, miesiac: 12, nachylenieDeg: 90, azymutDeg: 0 })
    expect(r.value!.energia!.czysteNiebo).toBe(0)
    expect(r.warnings.map((w) => w.code)).toContain("TORS-PANEL-TYLEM")
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("zgodność z silnikiem: godzina czystego nieba = średnia z podgodzin ze wzoru Meinela × cos θ", () => {
    const e = wartosc({ ...pelne, mocKwp: 1, pr: 1, miesiac: 6 }).energia!
    // 21 VI to nie 15 VI — liczymy dla 15 czerwca, tak jak wybrany łuk.
    const poczatek = Date.UTC(ROK_ODNIESIENIA, 5, 15) - 2 * 3_600_000
    let s = 0
    for (let i = 0; i < 4; i++) {
      const p = pozycjaSlonca(WARSZAWA.lat, WARSZAWA.lon, poczatek + (12 + (i + 0.5) / 4) * 3_600_000)
      s += promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) * Math.max(0, cosKataPadania(p.wysokoscDeg, p.azymutDeg, 35, 180))
    }
    expect(e.godziny[12]!.czysteNiebo).toBeCloseTo(s / 4, 9)
  })
})

describe("walidacja i kompletność", () => {
  it("szerokość poza zakresem → INVALID_INPUT, kod krytyczny", () => {
    const r = calculateTorSlonca({ ...baza, szerokoscGeograficzna: 91 })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.code).toBe("TORS-SZEROKOSC-POZA-ZAKRESEM")
    expect(r.warnings[0]!.level).toBe("critical")
  })

  it.each([
    ["TORS-DLUGOSC-POZA-ZAKRESEM", { dlugoscGeograficzna: 181 }],
    ["TORS-MIESIAC-POZA-ZAKRESEM", { miesiac: 13 }],
    ["TORS-NACHYLENIE-POZA-ZAKRESEM", { nachylenieDeg: 91 }],
    ["TORS-AZYMUT-POZA-ZAKRESEM", { azymutDeg: 361 }],
    ["TORS-MOC-POZA-ZAKRESEM", { mocKwp: 0 }],
    ["TORS-PR-POZA-ZAKRESEM", { pr: 1.2 }],
    ["TORS-ALBEDO-POZA-ZAKRESEM", { albedo: 2 }],
  ] as const)("%s", (kod, pole) => {
    const r = calculateTorSlonca({ ...pelne, ...pole })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings.map((w) => w.code)).toContain(kod)
  })

  it("brak współrzędnych albo miesiąca → INCOMPLETE bez wyniku", () => {
    expect(calculateTorSlonca({ ...baza, szerokoscGeograficzna: null }).status).toBe("INCOMPLETE")
    expect(calculateTorSlonca({ ...baza, miesiac: null }).status).toBe("INCOMPLETE")
    expect(calculateTorSlonca({ ...baza, miesiac: null }).value).toBeNull()
  })

  it("noc polarna: słońce nie wschodzi w wybranym dniu → info, łuk pusty", () => {
    const r = calculateTorSlonca({ ...baza, szerokoscGeograficzna: 80, miesiac: 12 })
    expect(r.value!.luki.find((l) => l.id === "wybrany")!.dlugoscDniaH).toBe(0)
    expect(r.warnings.map((w) => w.code)).toContain("TORS-SLONCE-POD-HORYZONTEM")
    expect(r.value!.luki.find((l) => l.id === "wybrany")!.gorowanieH).toBeNull()
  })

  it("wersja i założenia: pozycja, wschód; PR i czyste niebo przy energii", () => {
    const r = calculateTorSlonca(pelne)
    expect(r.calculatorVersion).toBe("1.0.0")
    const kody = r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))
    expect(kody).toEqual(expect.arrayContaining(["TORS-ZAL-POZYCJA", "TORS-ZAL-WSCHOD", "TORS-ZAL-PR", "TORS-ZAL-CZYSTE-NIEBO"]))
  })
})
