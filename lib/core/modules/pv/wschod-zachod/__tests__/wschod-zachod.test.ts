import { describe, expect, it } from "vitest"
import {
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { napromieniowanie, przygotujGodziny } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"
import { calculateWschodZachod, obliczDaneWschodZachod } from "../calculator"
import type { DaneWschodZachod } from "../input"
import { validateDane, validateInput } from "../validation"

const LAT = 52.23
/** Długość 0° — czas UTC ≈ słoneczny, rok symetryczny wokół południa (jak test M1/E4). */
const LON = 0

/** Syntetyczny rok godzinowy (NIE dane klimatyczne) — generator jak w teście M1/E4. */
function rokSyntetyczny(): RekordGodzinowy[] {
  const dane: RekordGodzinowy[] = []
  const start = Date.UTC(2026, 0, 1, 0, 30)
  for (let h = 0; h < 8760; h++) {
    const t = start + h * 3_600_000
    const p = pozycjaSlonca(LAT, LON, t)
    const nad = p.wysokoscDeg > 0
    const dni = nad ? 1000 * promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) : 0
    const dhi = nad ? 80 : 0
    dane.push({ czasUtcMs: t, dni, dhi, ghi: dni * Math.sin((p.wysokoscDeg * Math.PI) / 180) * (nad ? 1 : 0) + dhi })
  }
  return dane
}

const rekordy = rokSyntetyczny()
const ciezki = obliczDaneWschodZachod({
  szerokoscGeograficzna: LAT,
  dlugoscGeograficzna: LON,
  daneGodzinowe: rekordy,
  wschod: { nachylenieDeg: 30, azymutDeg: 90 },
  zachod: { nachylenieDeg: 30, azymutDeg: 270 },
})
const dane = ciezki.value as DaneWschodZachod
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

describe("obliczDaneWschodZachod (M3/E20, krok ciężki)", () => {
  it("K5 echo: suma miesięcy i suma doby = roczne z silnika M1 (połać wschodnia)", () => {
    const roczneM1 = napromieniowanie(przygotujGodziny(LAT, LON, rekordy), 30, 90, 0.2)
    expect(suma(dane.wschod.miesiace)).toBeCloseTo(roczneM1, 6)
    expect(suma(dane.wschod.doba)).toBeCloseTo(roczneM1, 6)
  })

  it("fizyka przy symetrycznym roku: wschód ≈ zachód rocznie (< 1%), południe pod najlepszym kątem > obu", () => {
    const e = suma(dane.wschod.miesiace)
    const w = suma(dane.zachod.miesiace)
    expect(Math.abs(e - w) / e).toBeLessThan(0.01)
    expect(suma(dane.poludnie.miesiace)).toBeGreaterThan(e)
    expect(dane.poludnie.azymutDeg).toBe(180)
  })

  it("brak danych → INCOMPLETE; azymut połaci poza zakresem → INVALID_INPUT", () => {
    const polacie = { wschod: { nachylenieDeg: 30, azymutDeg: 90 }, zachod: { nachylenieDeg: 30, azymutDeg: 270 } }
    expect(obliczDaneWschodZachod(polacie).status).toBe("INCOMPLETE")
    const zly = obliczDaneWschodZachod({ ...polacie, zachod: { nachylenieDeg: 30, azymutDeg: 400 } })
    expect(zly.status).toBe("INVALID_INPUT")
    expect(validateDane({ ...polacie, zachod: { nachylenieDeg: 95, azymutDeg: 270 } }).map((e) => e.code)).toEqual([
      "ZACHODNACHYLENIE-POZA-ZAKRESEM",
    ])
  })
})

describe("calculateWschodZachod (M3/E20, krok lekki)", () => {
  it("50/50: stosunek < 100%, wschód produkuje głównie rano, połączenie ≈ symetryczne jak południe", () => {
    const r = calculateWschodZachod({ dane, udzialWschodPct: 50 })
    expect(r.status === "VALID" || r.status === "VALID_WITH_WARNINGS").toBe(true)
    const v = r.value!
    expect(v.stosunekRocznyPct).toBeLessThan(100)
    expect(v.stosunekRocznyPct).toBeGreaterThan(50)
    expect(suma(v.dobaWzPct)).toBeCloseTo(100, 6)
    expect(Math.abs(v.udzialRanoWzPct - 50)).toBeLessThan(2)
    expect(Math.abs(v.udzialRanoPoludniePct - 50)).toBeLessThan(2)
    expect(v.nachylenieOdniesieniaDeg).toBe(dane.poludnie.nachylenieDeg)
  })

  it("100% na wschodzie → wynik = sama połać wschodnia, rano > 60%", () => {
    const v = calculateWschodZachod({ dane, udzialWschodPct: 100 }).value!
    expect(v.miesiaceWz).toEqual(dane.wschod.miesiace)
    expect(v.udzialRanoWzPct).toBeGreaterThan(60)
  })

  it("rozkład dobowy E-W jest szerszy niż południa: mniejszy udział szczytowej godziny", () => {
    const v = calculateWschodZachod({ dane, udzialWschodPct: 50 }).value!
    expect(Math.max(...v.dobaWzPct)).toBeLessThan(Math.max(...v.dobaPoludniePct))
  })

  it("stosunek poza typowym zakresem źródła (80–90%) → tylko info, status bez zmian", () => {
    const r = calculateWschodZachod({ dane, udzialWschodPct: 50 })
    for (const w of r.warnings) {
      expect(w.code).toBe("WZ-POZA-TYPOWYM-ZAKRESEM")
      expect(w.level).toBe("info")
    }
    expect(r.status).toBe("VALID")
  })

  it("brak udziału mocy albo danych → INCOMPLETE (bez domyślnego „po połowie”)", () => {
    expect(calculateWschodZachod({ dane, udzialWschodPct: null }).status).toBe("INCOMPLETE")
    expect(calculateWschodZachod({ dane: null, udzialWschodPct: 50 }).status).toBe("INCOMPLETE")
  })

  it("K3: udział > 100 → INVALID_INPUT; 0 i 100 poprawne", () => {
    expect(validateInput({ dane, udzialWschodPct: 120 }).map((e) => e.code)).toEqual(["UDZIALWSCHODPCT-POZA-ZAKRESEM"])
    expect(validateInput({ dane, udzialWschodPct: 0 })).toEqual([])
    expect(validateInput({ dane, udzialWschodPct: 100 })).toEqual([])
    expect(calculateWschodZachod({ dane, udzialWschodPct: -5 }).status).toBe("INVALID_INPUT")
  })
})

describe("rozkład dobowy — przypisanie rekordu do godzin (regresja 25.09.2026)", () => {
  it("rekordy przesunięte względem pełnej godziny (lon ≠ 0): południe nadal ≈ 50% rano (bez fałszywego zawyżenia poranka)", () => {
    const lon = 21.01
    const start = Date.UTC(2026, 0, 1, 0, 30)
    const przesuniete: RekordGodzinowy[] = []
    for (let h = 0; h < 8760; h++) {
      const t = start + h * 3_600_000
      const p = pozycjaSlonca(LAT, lon, t)
      const nad = p.wysokoscDeg > 0
      const dni = nad ? 1000 * promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) : 0
      const dhi = nad ? 80 : 0
      przesuniete.push({ czasUtcMs: t, dni, dhi, ghi: dni * Math.sin((p.wysokoscDeg * Math.PI) / 180) * (nad ? 1 : 0) + dhi })
    }
    const d = obliczDaneWschodZachod({
      szerokoscGeograficzna: LAT,
      dlugoscGeograficzna: lon,
      daneGodzinowe: przesuniete,
      wschod: { nachylenieDeg: 30, azymutDeg: 90 },
      zachod: { nachylenieDeg: 30, azymutDeg: 270 },
    }).value!
    const v = calculateWschodZachod({ dane: d, udzialWschodPct: 50 }).value!
    expect(Math.abs(v.udzialRanoPoludniePct - 50)).toBeLessThan(1.5)
  })
})

