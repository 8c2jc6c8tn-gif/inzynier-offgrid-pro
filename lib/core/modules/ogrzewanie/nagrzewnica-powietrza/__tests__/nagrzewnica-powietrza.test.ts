import { describe, expect, it } from "vitest"
import { calculateNagrzewnicaPowietrza } from "../calculator"
import type { NagrzewnicaPowietrzaInput } from "../input"

/**
 * Own test figures (NOT datasheet values): 2 kW at 0.25 l/h, fuel 6 zł/l → 0.125 l and 0.75 zł per kWh of heat;
 * own draw 20 W → 0.01 kWh of electricity per kWh of heat; electricity 1 zł/kWh.
 */
const BAZA: NagrzewnicaPowietrzaInput = {
  mocCieplnaKw: 2,
  zuzyciePaliwaLH: 0.25,
  cenaPaliwaZlL: 6,
  poborPraduW: 20,
  energiaRozruchuWh: 0,
  rozruchyNaDobe: 0,
  cenaPraduZlKwh: 1,
  copElektryczne: 0,
  zapotrzebowanieCieplaDobaKwh: 0,
  dniOgrzewania: 0,
  pojemnoscBateriiKwh: 0,
}
const kody = (r: { warnings: { code: string }[] }) => r.warnings.map((w) => w.code)

describe("calculateNagrzewnicaPowietrza (M6, D28 + decyzja 02.10.2026)", () => {
  it("koszt 1 kWh ciepła: paliwo 0,75 zł + prąd pomocniczy 0,01 zł = 0,76 zł; prąd oporowy 1,00 zł", () => {
    const w = calculateNagrzewnicaPowietrza(BAZA)
    const v = w.value!
    expect(v.paliwoNaKwhCieplaL).toBeCloseTo(0.125, 12)
    expect(v.kosztPaliwaNaKwhCieplaZl).toBeCloseTo(0.75, 12)
    expect(v.pradPomocniczyNaKwhCieplaKwh).toBeCloseTo(0.01, 12)
    expect(v.kosztPraduPomocniczegoNaKwhZl).toBeCloseTo(0.01, 12)
    expect(v.kosztCieplaNagrzewnicaZlKwh).toBeCloseTo(0.76, 12)
    expect(v.kosztCieplaElektrycznegoZlKwh).toBeCloseTo(1, 12)
    expect(v.taniej).toBe("nagrzewnica")
    expect(v.oszczednoscNaKwhZl).toBeCloseTo(0.24, 12)
  })

  it("cena prądu równowagi: przy niej nagrzewnica i prąd kosztują tyle samo", () => {
    const v = calculateNagrzewnicaPowietrza(BAZA).value!
    const cStar = v.cenaPraduRownowagiZlKwh!
    expect(cStar).toBeCloseTo(0.75 / 0.99, 12)
    const wRownowadze = calculateNagrzewnicaPowietrza({ ...BAZA, cenaPraduZlKwh: cStar }).value!
    expect(wRownowadze.kosztCieplaNagrzewnicaZlKwh).toBeCloseTo(wRownowadze.kosztCieplaElektrycznegoZlKwh!, 12)
  })

  it("doba: 20 kWh → 10 h, 2,5 l, 15 zł paliwa, 350 Wh prądu (200 Wh praca + 3 rozruchy × 50 Wh) = 3,5% baterii 10 kWh; prąd 200%", () => {
    const w = calculateNagrzewnicaPowietrza({
      ...BAZA,
      zapotrzebowanieCieplaDobaKwh: 20,
      energiaRozruchuWh: 50,
      rozruchyNaDobe: 3,
      pojemnoscBateriiKwh: 10,
      dniOgrzewania: 100,
    })
    const d = w.value!.doba!
    expect(d.godzinyPracy).toBeCloseTo(10, 12)
    expect(d.paliwoL).toBeCloseTo(2.5, 12)
    expect(d.kosztPaliwaZl).toBeCloseTo(15, 12)
    expect(d.energiaPomocniczaWh).toBeCloseTo(350, 9)
    expect(d.kosztPraduPomocniczegoZl).toBeCloseTo(0.35, 12)
    expect(d.kosztNagrzewnicaZl).toBeCloseTo(15.35, 12)
    expect(d.kosztElektrycznieZl).toBeCloseTo(20, 12)
    expect(d.procentBateriiNagrzewnica).toBeCloseTo(3.5, 9)
    expect(d.procentBateriiElektrycznie).toBeCloseTo(200, 9)
    const s = w.value!.sezon!
    expect(s.paliwoL).toBeCloseTo(250, 9)
    expect(s.kosztNagrzewnicaZl).toBeCloseTo(1535, 9)
    expect(s.energiaPomocniczaKwh).toBeCloseTo(35, 9)
  })

  it("ostrzeżenia D28 zawsze: spaliny/CO + montaż, gęstnienie oleju na mrozie", () => {
    expect(kody(calculateNagrzewnicaPowietrza(BAZA))).toEqual(expect.arrayContaining(["NP-SPALINY-CO", "NP-OLEJ-GESTNIEJE"]))
    expect(calculateNagrzewnicaPowietrza(BAZA).status).toBe("VALID_WITH_WARNINGS")
  })

  it("pompa ciepła COP 3 wychodzi taniej niż nagrzewnica — mówimy to wprost (info) i podajemy cenę równowagi", () => {
    const w = calculateNagrzewnicaPowietrza({ ...BAZA, copElektryczne: 3 })
    expect(w.value!.taniej).toBe("elektryczne")
    expect(kody(w)).toContain("NP-PRAD-TANSZY")
    expect(w.value!.cenaPraduRownowagiZlKwh).toBeCloseTo(0.75 / (1 / 3 - 0.01), 12)
  })

  it("pobór własny ≥ 1/COP → cena równowagi nie istnieje (null)", () => {
    expect(calculateNagrzewnicaPowietrza({ ...BAZA, poborPraduW: 2000 }).value!.cenaPraduRownowagiZlKwh).toBeNull()
  })

  it("bez ceny prądu: koszt tylko paliwa, bez porównania i bez kosztu prądu pomocniczego", () => {
    const w = calculateNagrzewnicaPowietrza({ ...BAZA, cenaPraduZlKwh: 0 })
    const v = w.value!
    expect(v.kosztCieplaNagrzewnicaZlKwh).toBeCloseTo(0.75, 12)
    expect(v.kosztCieplaElektrycznegoZlKwh).toBeNull()
    expect(v.taniej).toBeNull()
    expect(kody(w)).toContain("NP-BRAK-CENY-PRADU")
  })

  it("🟡 pobór pomocniczy ponad pojemność baterii oraz godziny ponad dobę", () => {
    const w = calculateNagrzewnicaPowietrza({ ...BAZA, zapotrzebowanieCieplaDobaKwh: 60, poborPraduW: 500, pojemnoscBateriiKwh: 1 })
    expect(kody(w)).toEqual(expect.arrayContaining(["NP-POBOR-PONAD-BATERIE", "NP-GODZINY-PONAD-DOBE"]))
  })

  it("brak mocy / zużycia / ceny paliwa → INCOMPLETE; ujemne → INVALID_INPUT", () => {
    expect(calculateNagrzewnicaPowietrza({ ...BAZA, mocCieplnaKw: 0 }).status).toBe("INCOMPLETE")
    expect(calculateNagrzewnicaPowietrza({ ...BAZA, zuzyciePaliwaLH: 0 }).value).toBeNull()
    expect(calculateNagrzewnicaPowietrza({ ...BAZA, cenaPaliwaZlL: 0 }).status).toBe("INCOMPLETE")
    const bad = calculateNagrzewnicaPowietrza({ ...BAZA, poborPraduW: -1 })
    expect(bad.status).toBe("INVALID_INPUT")
    expect(bad.warnings[0]!.code).toBe("NP-WARTOSC-UJEMNA")
  })

  it("spójność z koszty-ogrzewania: ten sam koszt paliwa na kWh (c × l/h ÷ kW)", async () => {
    const { calculateKosztyOgrzewania } = await import("@/lib/core/modules/ogrzewanie/koszty-ogrzewania/calculator")
    const r = calculateKosztyOgrzewania({
      zapotrzebowanieSezonKwh: 1000,
      liczbaLat: 1,
      zrodla: [
        {
          nazwa: "N",
          rodzaj: "nagrzewnica-paliwowa",
          jednostka: "l",
          cenaZl: 6,
          wartoscOpalowaKwh: null,
          sprawnoscPct: null,
          mocGrzewczaKw: 2,
          zuzyciePaliwaNaH: 0.25,
          cop: null,
          poborPraduW: null,
          kosztInwestycjiZl: 0,
          kosztSerwisuRocznyZl: 0,
        },
      ],
    })
    expect(r.value!.ranking[0]!.kosztKwhCieplaZl).toBeCloseTo(calculateNagrzewnicaPowietrza(BAZA).value!.kosztPaliwaNaKwhCieplaZl, 12)
  })
})
