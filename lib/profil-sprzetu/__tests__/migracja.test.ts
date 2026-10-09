import { describe, expect, it } from "vitest"
import { migrujProfil, WERSJA_PROFILU_SPRZETU } from "../types"

describe("migrujProfil (wersja 1 → 2)", () => {
  it("zapis sprzed 08.10.2026 (tylko bateria, bez numeru wersji) przechodzi bez zmian danych i dostaje wersję 2", () => {
    const v1 = { bateria: { pojemnoscUzytecznaDzisKwh: 12.5, buforHoryzontLata: 10 } }
    expect(migrujProfil(v1)).toEqual({ ...v1, schemaVersion: WERSJA_PROFILU_SPRZETU })
    expect(WERSJA_PROFILU_SPRZETU).toBe(2)
  })

  it("pusty zapis i zapis z panelem: sekcje zachowane, wersja ustawiona; migracja jest idempotentna", () => {
    expect(migrujProfil({})).toEqual({ schemaVersion: 2 })
    const z = { schemaVersion: 2, panel: { podstawowy: { id: "x", nazwa: "X", pmaxW: 500, gammaPctNaC: null, noctC: null, sprawnoscWzglednaPrzy200WPct: null, degradacjaPierwszyRokPct: null, degradacjaLiniowaPctNaRok: null, dlugoscMm: null, szerokoscMm: null, masaKg: null, bifacjalny: false }, katalogId: null, zapisanoIso: "2026-10-08T12:00:00.000Z" } }
    expect(migrujProfil(migrujProfil(z))).toEqual(z)
  })
})
