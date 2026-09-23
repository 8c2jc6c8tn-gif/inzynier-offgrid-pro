import { describe, expect, it } from "vitest"
import { odczytajOdpowiedzProxy, zapisPasuje, type ZapisTmy } from "../dane-tmy"

const zapis = { szerokosc: 52.23, dlugosc: 21.01, pobrano: "2026-09-24T00:00:00Z", dane: { rekordy: [], meta: {} } } as unknown as ZapisTmy

describe("zapisPasuje", () => {
  it("ten sam punkt i przesunięcie w granicy tolerancji → pasuje; dalej albo brak zapisu → nie", () => {
    expect(zapisPasuje(zapis, 52.23, 21.01)).toBe(true)
    expect(zapisPasuje(zapis, 52.235, 21.005)).toBe(true)
    expect(zapisPasuje(zapis, 52.25, 21.01)).toBe(false)
    expect(zapisPasuje(null, 52.23, 21.01)).toBe(false)
  })
})

describe("odczytajOdpowiedzProxy", () => {
  it("sukces → dane; znany kod błędu → ten kod; cokolwiek innego → NIEOCZEKIWANY-FORMAT", () => {
    expect(odczytajOdpowiedzProxy({ ok: true, dane: { rekordy: [], meta: {} } })).toMatchObject({ ok: true })
    expect(odczytajOdpowiedzProxy({ ok: false, kod: "PVGIS-ODRZUCIL-ZAPYTANIE", szczegoly: "sea" })).toEqual({
      ok: false,
      kod: "PVGIS-ODRZUCIL-ZAPYTANIE",
    })
    expect(odczytajOdpowiedzProxy({ ok: false, kod: "COS-INNEGO" })).toEqual({ ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT" })
    expect(odczytajOdpowiedzProxy("<html>")).toEqual({ ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT" })
  })
})
