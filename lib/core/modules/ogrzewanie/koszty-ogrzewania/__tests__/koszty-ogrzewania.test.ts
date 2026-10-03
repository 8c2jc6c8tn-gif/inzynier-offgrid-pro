import { describe, expect, it } from "vitest"
import { calculateKosztyOgrzewania } from "../calculator"
import type { KosztyOgrzewaniaInput, ZrodloCiepla } from "../input"

const PUSTE: Omit<ZrodloCiepla, "nazwa" | "rodzaj"> = {
  jednostka: "",
  cenaZl: null,
  wartoscOpalowaKwh: null,
  sprawnoscPct: null,
  mocGrzewczaKw: null,
  zuzyciePaliwaNaH: null,
  cop: null,
  poborPraduW: null,
  kosztInwestycjiZl: 0,
  kosztSerwisuRocznyZl: 0,
}
const zrodlo = (z: Partial<ZrodloCiepla> & Pick<ZrodloCiepla, "nazwa" | "rodzaj">): ZrodloCiepla => ({ ...PUSTE, ...z })

/**
 * Ceny i parametry dobrane w teście tak, żeby odtworzyć przykład źródła (Biblia §6.27.13): pompa 0,25,
 * kocioł elektryczny 0,80, pellet 0,35 zł/kWh ciepła i "pompa zwraca się po 5 latach vs kocioł
 * elektryczny" — założenia testu, NIE dane źródła.
 */
const pompa = zrodlo({ nazwa: "Pompa ciepła", rodzaj: "pompa-ciepla", cenaZl: 1, cop: 4, kosztInwestycjiZl: 31500 })
const kociol = zrodlo({ nazwa: "Kocioł elektryczny", rodzaj: "kociol-elektryczny", cenaZl: 0.8, kosztInwestycjiZl: 4000 })
const pellet = zrodlo({ nazwa: "Pellet", rodzaj: "pellet", jednostka: "kg", cenaZl: 1.4, wartoscOpalowaKwh: 5, sprawnoscPct: 80, kosztInwestycjiZl: 20000 })
const bazowe: KosztyOgrzewaniaInput = { zapotrzebowanieSezonKwh: 10000, liczbaLat: 10, zrodla: [pompa, kociol] }
const kody = (r: { warnings: { code: string }[] }) => r.warnings.map((w) => w.code)

describe("calculateKosztyOgrzewania (M6, dawne 5.39 + D28)", () => {
  it("koszt 1 kWh ciepła: prąd c/COP, paliwo c/(WO·η) — przykład źródła 0,25 / 0,80 / 0,35 zł/kWh", () => {
    const r = calculateKosztyOgrzewania({ ...bazowe, zrodla: [pompa, kociol, pellet] })
    const po = (n: string) => r.value!.ranking.find((w) => w.nazwa === n)!
    expect(po("Pompa ciepła").kosztKwhCieplaZl).toBeCloseTo(0.25, 12)
    expect(po("Kocioł elektryczny").kosztKwhCieplaZl).toBeCloseTo(0.8, 12)
    expect(po("Pellet").kosztKwhCieplaZl).toBeCloseTo(0.35, 12)
    expect(po("Pellet").iloscPaliwaSezon).toBeCloseTo(2500, 9)
    expect(po("Kocioł elektryczny").energiaElektrycznaSezonKwh).toBeCloseTo(10000, 9)
    expect(po("Pompa ciepła").energiaElektrycznaSezonKwh).toBeCloseTo(2500, 9)
  })

  it("zwrot względem najtańszego w zakupie: pompa vs kocioł elektryczny po 5 latach (jak w źródle)", () => {
    const v = calculateKosztyOgrzewania(bazowe).value!
    expect(v.najtanszeWZakupie).toBe(1)
    expect(v.ranking.find((w) => w.nazwa === "Pompa ciepła")!.zwrotLat).toBeCloseTo(5, 12)
    expect(v.ranking.find((w) => w.nazwa === "Kocioł elektryczny")!.zwrotLat).toBeNull()
  })

  it("ranking po koszcie całkowitym w okresie: inwestycja + lata × (paliwo + serwis)", () => {
    const v = calculateKosztyOgrzewania(bazowe).value!
    expect(v.ranking.map((w) => w.nazwa)).toEqual(["Pompa ciepła", "Kocioł elektryczny"])
    expect(v.ranking[0]!.kosztCalkowityZl).toBeCloseTo(31500 + 10 * 2500, 9)
    const krotko = calculateKosztyOgrzewania({ ...bazowe, liczbaLat: 4 }).value!
    expect(krotko.ranking[0]!.nazwa).toBe("Kocioł elektryczny")
  })

  it("nagrzewnica z karty (typu webasto): koszt = cena × zużycie / moc, godziny, paliwo i prąd pomocniczy; ostrzeżenia spalin i oleju", () => {
    const webasto = zrodlo({ nazwa: "Nagrzewnica", rodzaj: "nagrzewnica-paliwowa", jednostka: "l", cenaZl: 6, mocGrzewczaKw: 4, zuzyciePaliwaNaH: 0.5, poborPraduW: 40, kosztInwestycjiZl: 3000 })
    const r = calculateKosztyOgrzewania({ ...bazowe, zrodla: [webasto] })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    const w = r.value!.ranking[0]!
    expect(w.kosztKwhCieplaZl).toBeCloseTo(0.75, 12)
    expect(w.godzinyPracy).toBeCloseTo(2500, 9)
    expect(w.iloscPaliwaSezon).toBeCloseTo(1250, 9)
    expect(w.energiaElektrycznaSezonKwh).toBeCloseTo(100, 9)
    expect(kody(r)).toEqual(["KO-INWESTYCJA-I-PALIWO", "KO-NAGRZEWNICA-SPALINY-0", "KO-OLEJ-GESTNIEJE-0"])
    expect(r.assumptions).toContainEqual({ kod: "KO-ZALOZENIE-GODZINY-NOMINALNE" })
  })

  it("paliwa stałe → info bezpieczeństwa M8/E2; drewno → praca; > 100% sprawności → info; prąd → info off-grid", () => {
    const drewno = zrodlo({ nazwa: "Drewno", rodzaj: "drewno", jednostka: "mp", cenaZl: 300, wartoscOpalowaKwh: 1500, sprawnoscPct: 70 })
    const gaz = zrodlo({ nazwa: "Gaz", rodzaj: "gaz", jednostka: "m³", cenaZl: 3, wartoscOpalowaKwh: 10, sprawnoscPct: 105 })
    const r = calculateKosztyOgrzewania({ ...bazowe, zrodla: [drewno, gaz, kociol] })
    expect(r.status).toBe("VALID")
    expect(kody(r)).toEqual([
      "KO-INWESTYCJA-I-PALIWO",
      "KO-PALIWO-STALE-0",
      "KO-DREWNO-PRACA-0",
      "KO-SPRAWNOSC-POWYZEJ-100-1",
      "KO-PRAD-OFFGRID-2",
    ])
    expect(r.value!.ranking.find((w) => w.nazwa === "Drewno")!.energiaElektrycznaSezonKwh).toBeNull()
  })

  it("źródło z brakami pomijane z informacją, bez wartości domyślnych; wszystkie niekompletne → INCOMPLETE", () => {
    const bezCop = zrodlo({ nazwa: "Pompa bez COP", rodzaj: "pompa-ciepla", cenaZl: 1 })
    const r = calculateKosztyOgrzewania({ ...bazowe, zrodla: [kociol, bezCop] })
    expect(r.value!.niekompletne).toEqual([1])
    expect(kody(r)).toContain("KO-ZRODLO-NIEKOMPLETNE-1")
    expect(calculateKosztyOgrzewania({ ...bazowe, zrodla: [bezCop] }).status).toBe("INCOMPLETE")
    expect(calculateKosztyOgrzewania({ ...bazowe, zrodla: [{ ...kociol, kosztSerwisuRocznyZl: null }] }).status).toBe("INCOMPLETE")
    expect(calculateKosztyOgrzewania({ ...bazowe, zapotrzebowanieSezonKwh: null }).status).toBe("INCOMPLETE")
    expect(calculateKosztyOgrzewania({ ...bazowe, zrodla: [] }).status).toBe("INCOMPLETE")
  })

  it("wartości spoza dziedziny → INVALID_INPUT", () => {
    expect(calculateKosztyOgrzewania({ ...bazowe, liczbaLat: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateKosztyOgrzewania({ ...bazowe, zrodla: [{ ...pompa, cop: 0 }] }).status).toBe("INVALID_INPUT")
    const r = calculateKosztyOgrzewania({ ...bazowe, zrodla: [{ ...pellet, cenaZl: -1 }] })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.params).toEqual({ labelKey: "POLE-KO-CENA", zrodlo: "Pellet" })
  })
})
