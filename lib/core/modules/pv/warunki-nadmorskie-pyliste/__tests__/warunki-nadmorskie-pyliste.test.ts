import { describe, expect, it } from "vitest"
import { calculateWarunkiNadmorskiePyliste } from "../calculator"
import type { WarunkiNadmorskiePylisteInput } from "../input"

const nicNieMa: Omit<WarunkiNadmorskiePylisteInput, "typLokalizacji"> = {
  wilgotnoscWysoka: false,
  certyfikatIec61701: false,
  ramaAnodowana: false,
  zlaczkiMorskie: false,
  certyfikatAntyPid: false,
}
const kody = (input: WarunkiNadmorskiePylisteInput) => calculateWarunkiNadmorskiePyliste(input).warnings.map((w) => w.code)

describe("calculateWarunkiNadmorskiePyliste (M3/E25)", () => {
  it("nadmorska bez żadnego zabezpieczenia → 4 reguły niespełnione (IEC 61701, rama, złączki, anty-PID)", () => {
    const wynik = calculateWarunkiNadmorskiePyliste({ ...nicNieMa, typLokalizacji: "nadmorska" })
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.value.niespelnioneReguly).toBe(4)
    expect(wynik.warnings.map((w) => w.code)).toEqual([
      "NADMORSKA-BRAK-IEC-61701",
      "NADMORSKA-BRAK-RAMY-ANODOWANEJ",
      "NADMORSKA-ZLACZKI-MC4",
      "WARUNKI-BRAK-ANTY-PID",
    ])
    expect(wynik.warnings.every((w) => w.level === "warning")).toBe(true)
  })

  it("nadmorska z kompletem zabezpieczeń → VALID, tylko info", () => {
    const wynik = calculateWarunkiNadmorskiePyliste({
      typLokalizacji: "nadmorska",
      wilgotnoscWysoka: true,
      certyfikatIec61701: true,
      ramaAnodowana: true,
      zlaczkiMorskie: true,
      certyfikatAntyPid: true,
    })
    expect(wynik.status).toBe("VALID")
    expect(wynik.warnings.map((w) => [w.code, w.level])).toEqual([["WARUNKI-SRODOWISKOWE-SPELNIONE", "info"]])
  })

  it("pylista → informacja o rysowaniu szkła, bez reguł nadmorskich; VALID (info nie podnosi statusu)", () => {
    const wynik = calculateWarunkiNadmorskiePyliste({ ...nicNieMa, typLokalizacji: "pylista" })
    expect(wynik.status).toBe("VALID")
    expect(wynik.warnings.map((w) => w.code)).toEqual(["PYLISTA-RYSOWANIE-SZKLA", "WARUNKI-SRODOWISKOWE-SPELNIONE"])
  })

  it("standardowa + wysoka wilgotność bez anty-PID → tylko ostrzeżenie PID", () => {
    expect(kody({ ...nicNieMa, typLokalizacji: "standardowa", wilgotnoscWysoka: true })).toEqual(["WARUNKI-BRAK-ANTY-PID"])
  })

  it("standardowa, sucho → brak reguł do spełnienia", () => {
    expect(kody({ ...nicNieMa, typLokalizacji: "standardowa" })).toEqual(["WARUNKI-SRODOWISKOWE-SPELNIONE"])
  })

  it("certyfikaty morskie nie są wymagane poza lokalizacją nadmorską (pola ignorowane)", () => {
    expect(kody({ ...nicNieMa, typLokalizacji: "pylista", wilgotnoscWysoka: true, certyfikatAntyPid: true })).toEqual([
      "PYLISTA-RYSOWANIE-SZKLA",
      "WARUNKI-SRODOWISKOWE-SPELNIONE",
    ])
  })

  it("brak typu lokalizacji → INCOMPLETE, nigdy domyślne „standardowa”", () => {
    const wynik = calculateWarunkiNadmorskiePyliste({ ...nicNieMa, typLokalizacji: null })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.warnings).toEqual([])
  })
})
