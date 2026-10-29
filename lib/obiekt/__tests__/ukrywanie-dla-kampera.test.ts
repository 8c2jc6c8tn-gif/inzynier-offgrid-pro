import { describe, expect, it } from "vitest"
import { KAFLE } from "@/lib/pulpit/registry"
import { EKRANY_BUDYNKOWE_UKRYTE_DLA_KAMPERA, czyUkryjPolaBudynku, ekranyWidoczneDlaObiektu } from "../ukrywanie-dla-kampera"

describe("ukrywanie dla kampera", () => {
  it("hides building fields only for a camper (not for a shed, a garage, a building or no choice)", () => {
    expect(czyUkryjPolaBudynku("kamper")).toBe(true)
    for (const r of ["altana-rod", "garaz", "budynek", "", undefined] as const) expect(czyUkryjPolaBudynku(r)).toBe(false)
  })

  it("every hidden screen exists in the registry (a renamed address would silently stop hiding it)", () => {
    const adresy = KAFLE.flatMap((k) => k.ekrany.map((e) => e.href))
    for (const href of EKRANY_BUDYNKOWE_UKRYTE_DLA_KAMPERA) expect(adresy).toContain(href)
  })

  it("removes the four building screens for a camper and keeps the order of the rest", () => {
    const m8 = KAFLE.find((k) => k.id === 8)!
    const widoczne = ekranyWidoczneDlaObiektu(m8.ekrany, "kamper")
    expect(widoczne.map((e) => e.href)).not.toContain("/kalkulatory/klapy-pozarowe")
    expect(widoczne.map((e) => e.href)).toEqual(m8.ekrany.map((e) => e.href).filter((h) => !EKRANY_BUDYNKOWE_UKRYTE_DLA_KAMPERA.includes(h)))
    expect(widoczne.length).toBe(m8.ekrany.length - 3)
  })

  it("keeps every screen for any other kind of site", () => {
    const m8 = KAFLE.find((k) => k.id === 8)!
    for (const r of ["altana-rod", "garaz", "budynek", ""] as const) expect(ekranyWidoczneDlaObiektu(m8.ekrany, r)).toEqual(m8.ekrany)
  })
})
