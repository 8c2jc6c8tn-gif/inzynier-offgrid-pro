import { describe, expect, it } from "vitest"
import { LOGO_MAKS_PLIK_BAJTOW, sprawdzPlikLogo, wymiaryLogo } from "../logo"
import { linieKontaktuFirmy, maDaneFirmy, PROFIL_FIRMY_PUSTY } from "../profil-firmy"

describe("wymiaryLogo", () => {
  it("scales a wide logo to the width limit and keeps the ratio (960×240 → 480×120)", () => {
    expect(wymiaryLogo(960, 240)).toEqual({ szer: 480, wys: 120 })
  })
  it("scales a tall logo to the height limit (200×600 → 80×240)", () => {
    expect(wymiaryLogo(200, 600)).toEqual({ szer: 80, wys: 240 })
  })
  it("does not enlarge a small logo", () => {
    expect(wymiaryLogo(100, 50)).toEqual({ szer: 100, wys: 50 })
  })
  it("returns zero for a degenerate picture", () => {
    expect(wymiaryLogo(0, 50)).toEqual({ szer: 0, wys: 0 })
  })
})

describe("sprawdzPlikLogo", () => {
  it("accepts png, jpeg, webp and svg", () => {
    for (const type of ["image/png", "image/jpeg", "image/webp", "image/svg+xml"]) expect(sprawdzPlikLogo({ type, size: 1000 })).toBeNull()
  })
  it("refuses other types and oversized files", () => {
    expect(sprawdzPlikLogo({ type: "application/pdf", size: 1000 })).toBe("typ")
    expect(sprawdzPlikLogo({ type: "image/png", size: LOGO_MAKS_PLIK_BAJTOW + 1 })).toBe("rozmiar")
  })
})

describe("dane firmy", () => {
  it("an empty profile has no data", () => {
    expect(maDaneFirmy(PROFIL_FIRMY_PUSTY)).toBe(false)
    expect(linieKontaktuFirmy(PROFIL_FIRMY_PUSTY, "NIP")).toEqual([])
  })
  it("a logo alone counts as data", () => {
    expect(maDaneFirmy({ ...PROFIL_FIRMY_PUSTY, logo: "data:image/png;base64,AAAA" })).toBe(true)
  })
  it("prints contact lines in order, dropping empty and blank ones, and prefixes the tax id", () => {
    const f = { ...PROFIL_FIRMY_PUSTY, adres: " ul. Słoneczna 1, Kielce ", nip: "123-456-78-90", telefon: "  ", email: "a@b.pl", www: "b.pl" }
    expect(linieKontaktuFirmy(f, "NIP")).toEqual(["ul. Słoneczna 1, Kielce", "NIP 123-456-78-90", "a@b.pl", "b.pl"])
  })
})
