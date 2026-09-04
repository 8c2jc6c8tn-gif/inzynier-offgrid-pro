import { describe, expect, it } from "vitest"
import { calculateProfilAstronomiczny } from "../calculator"

describe("calculateProfilAstronomiczny", () => {
  it("Warszawa (52,2°), 21 grudnia (dzień 355) — ok. 7,5h dnia, zgodne z przykładem źródła 'ok. 8h dnia'", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 52.2,
      dzienRoku: 355,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.dlugoscDniaH).toBeCloseTo(7.466474986433175, 6)
    expect(result.value.dlugoscNocyH).toBeCloseTo(16.533525013566827, 6)
  })

  it("Warszawa (52,2°), 21 czerwca (dzień 172) — dzień dłuższy niż noc, symetryczny do grudnia", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 52.2,
      dzienRoku: 172,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.value.dlugoscDniaH).toBeCloseTo(16.533525013566827, 6)
  })

  it("równik (0°), równonoc (dzień 79) — dokładnie 12h dnia i 12h nocy", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 0,
      dzienRoku: 79,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.value.dlugoscDniaH).toBeCloseTo(12, 6)
    expect(result.value.dlugoscNocyH).toBeCloseTo(12, 6)
  })

  it("koło podbiegunowe (70°N), 21 grudnia — noc polarna (0h dnia), z ostrzeżeniem info", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 70,
      dzienRoku: 355,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.value.dlugoscDniaH).toBe(0)
    expect(result.warnings.some((w) => w.code === "NOC-DZIEN-POLARNY")).toBe(true)
  })

  it("koło podbiegunowe (70°N), 21 czerwca — dzień polarny (24h dnia)", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 70,
      dzienRoku: 172,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.value.dlugoscDniaH).toBe(24)
    expect(result.value.dlugoscNocyH).toBe(0)
  })

  it("z odbiornikiem nocnym: 50W przez 16,53h nocy -> ok. 0,827 kWh", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 52.2,
      dzienRoku: 355,
      mocOdbiornikaNocnegoW: 50,
    })
    expect(result.value.energiaNocnaKwh).toBeCloseTo((50 * 16.533525013566827) / 1000, 6)
  })

  it("INCOMPLETE — szerokość geograficzna jeszcze nie wpisana (null)", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: null,
      dzienRoku: 355,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — dzień roku poza zakresem", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 52.2,
      dzienRoku: 400,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — szerokość geograficzna poza zakresem", () => {
    const result = calculateProfilAstronomiczny({
      szerokoscGeograficzna: 95,
      dzienRoku: 355,
      mocOdbiornikaNocnegoW: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
