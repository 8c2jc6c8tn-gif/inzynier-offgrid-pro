import { describe, expect, it } from "vitest"
import { zbudujProfil, type FormularzProfilu } from "./profil-formularza"

const baza: FormularzProfilu = {
  bezNaglowka: false,
  kolumnaCzasu: "time",
  formatCzasu: "iso",
  kolumnaGodziny: "",
  przesuniecieMin: "",
  znaczniki: "",
  kolumny: [{ kolumna: "u", kanal: "bat", wielkosc: "napiecie", jednostka: "V" }],
}

describe("zbudujProfil", () => {
  it("builds a header-addressed profile", () => {
    const r = zbudujProfil(baza)
    expect(r.ok && r.profil.kolumnaCzasu).toBe("time")
    expect(r.ok && r.profil.kolumny[0].kolumna).toBe("u")
  })

  it("addresses columns by position without a header", () => {
    const r = zbudujProfil({ ...baza, bezNaglowka: true, kolumnaCzasu: "0", kolumny: [{ ...baza.kolumny[0], kolumna: "2" }] })
    expect(r.ok && r.profil.kolumnaCzasu).toBe(0)
    expect(r.ok && r.profil.kolumny[0].kolumna).toBe(2)
  })

  it("parses markers and the clock offset", () => {
    const r = zbudujProfil({ ...baza, znaczniki: "-999, ///", przesuniecieMin: "60" })
    expect(r.ok && r.profil.znacznikiBraku).toEqual(["-999", "///"])
    expect(r.ok && r.profil.przesuniecieMin).toBe(60)
  })

  it("rejects an incomplete mapping", () => {
    expect(zbudujProfil({ ...baza, kolumnaCzasu: "" }).ok).toBe(false)
    expect(zbudujProfil({ ...baza, kolumny: [] }).ok).toBe(false)
    expect(zbudujProfil({ ...baza, kolumny: [{ ...baza.kolumny[0], jednostka: "" }] }).ok).toBe(false)
    expect(zbudujProfil({ ...baza, przesuniecieMin: "9999" }).ok).toBe(false)
  })

  it("requires the hour column for the date+hour format", () => {
    expect(zbudujProfil({ ...baza, formatCzasu: "data-godzina" }).ok).toBe(false)
    expect(zbudujProfil({ ...baza, formatCzasu: "data-godzina", kolumnaGodziny: "godz" }).ok).toBe(true)
  })
})
