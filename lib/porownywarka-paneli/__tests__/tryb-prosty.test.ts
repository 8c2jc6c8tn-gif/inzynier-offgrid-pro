import { describe, expect, it } from "vitest"
import { efektywnyTryb, MIEJSCE_PUSTE, PANEL_PUSTY, STAN_POCZATKOWY } from "../stan"
import { azymutStrony, odczytajStrone, STRONY_SWIATA } from "../strona-swiata"

describe("strony świata", () => {
  it("south is 180°, north 0°, east 90°, west 270° (the convention of the whole app)", () => {
    expect(azymutStrony("S")).toBe(180)
    expect(azymutStrony("N")).toBe(0)
    expect(azymutStrony("E")).toBe(90)
    expect(azymutStrony("W")).toBe(270)
  })

  it("eight directions every 45°", () => {
    expect(STRONY_SWIATA.map((s) => s.azymut)).toEqual([0, 45, 90, 135, 180, 225, 270, 315])
  })

  it("reads an azimuth typed in the full mode back as a direction, 360° as north", () => {
    expect(odczytajStrone("180")).toEqual({ rodzaj: "strona", id: "S" })
    expect(odczytajStrone(" 225 ")).toEqual({ rodzaj: "strona", id: "SW" })
    expect(odczytajStrone("360")).toEqual({ rodzaj: "strona", id: "N" })
    expect(odczytajStrone("0")).toEqual({ rodzaj: "strona", id: "N" })
  })

  it("keeps an azimuth that is not one of the eight (also with a decimal comma) as its own value, never rounds it", () => {
    expect(odczytajStrone("170")).toEqual({ rodzaj: "wlasna", azymut: 170 })
    expect(odczytajStrone("172,5")).toEqual({ rodzaj: "wlasna", azymut: 172.5 })
  })

  it("empty or unreadable = nothing chosen", () => {
    expect(odczytajStrone("")).toEqual({ rodzaj: "brak" })
    expect(odczytajStrone("abc")).toEqual({ rodzaj: "brak" })
  })
})

describe("efektywnyTryb", () => {
  it("an empty form starts in the simple mode", () => {
    expect(efektywnyTryb(STAN_POCZATKOWY)).toBe("prosty")
  })
  it("a draft that already holds a panel or a place keeps the full mode it was made in", () => {
    expect(efektywnyTryb({ ...STAN_POCZATKOWY, panele: [{ ...PANEL_PUSTY("p1"), moc: "500" }] })).toBe("pelny")
    expect(efektywnyTryb({ ...STAN_POCZATKOWY, miejsca: [{ ...MIEJSCE_PUSTE("m1"), azymut: "180" }] })).toBe("pelny")
  })
  it("the saved choice always wins", () => {
    expect(efektywnyTryb({ ...STAN_POCZATKOWY, tryb: "pelny" })).toBe("pelny")
    expect(efektywnyTryb({ ...STAN_POCZATKOWY, tryb: "prosty", panele: [{ ...PANEL_PUSTY("p1"), moc: "500" }] })).toBe("prosty")
  })
})
