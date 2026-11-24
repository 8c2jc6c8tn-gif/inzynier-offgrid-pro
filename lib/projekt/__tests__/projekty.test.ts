import { describe, expect, it } from "vitest"
import { ID_PIERWSZEGO, kluczProjektu, nalezyDoProjektu, noweId, parsujListe, zListaPoDodaniu, zListaPoUsunieciu } from "../projekty"
import { normalizujLiczbe, parsujWartosci, takaSamaLiczba, wartoscDoZapisu } from "../wielkosci"

describe("project key namespace", () => {
  it("project 1 keeps the keys from before projects existed, so nothing has to be migrated", () => {
    expect(kluczProjektu(ID_PIERWSZEGO, "draft.bojler-cwu")).toBe("offgrid.draft.bojler-cwu")
    expect(kluczProjektu("p2", "draft.bojler-cwu")).toBe("offgrid.p.p2.draft.bojler-cwu")
  })

  it("tells which keys belong to a project (and not shared data, nor another project)", () => {
    expect(nalezyDoProjektu("offgrid.draft.x", "p1")).toBe(true)
    expect(nalezyDoProjektu("offgrid.draftwaluta.x", "p1")).toBe(true)
    expect(nalezyDoProjektu("offgrid.profil-sprzetu.v1", "p1")).toBe(true)
    expect(nalezyDoProjektu("offgrid.pvgis-tmy.v1", "p1")).toBe(false)
    expect(nalezyDoProjektu("offgrid.p.p2.draft.x", "p1")).toBe(false)
    expect(nalezyDoProjektu("offgrid.p.p2.draft.x", "p2")).toBe(true)
    expect(nalezyDoProjektu("offgrid.p.p22.draft.x", "p2")).toBe(false)
  })
})

describe("project list", () => {
  it("missing or broken storage → one project, the first", () => {
    for (const raw of [null, "{", "[]", JSON.stringify({ projekty: [] })]) {
      expect(parsujListe(raw)).toEqual({ aktywnyId: "p1", projekty: [{ id: "p1", nazwa: "", utworzonoIso: "" }] })
    }
  })

  it("drops malformed and duplicated entries; an unknown active id falls back to the first project", () => {
    const raw = JSON.stringify({ aktywnyId: "zz", projekty: [{ id: "p2", nazwa: "Dom" }, { id: "p2" }, { id: "BAD ID" }, 5] })
    expect(parsujListe(raw)).toEqual({ aktywnyId: "p2", projekty: [{ id: "p2", nazwa: "Dom", utworzonoIso: "" }] })
  })

  it("new id, adding, removing (never the last one)", () => {
    const s = parsujListe(null)
    expect(noweId(s)).toBe("p2")
    const s2 = zListaPoDodaniu(s, { id: "p2", nazwa: "", utworzonoIso: "" }, true)
    expect(s2.aktywnyId).toBe("p2")
    expect(zListaPoUsunieciu(s2, "p2")).toEqual({ aktywnyId: "p1", projekty: [{ id: "p1", nazwa: "", utworzonoIso: "" }] })
    expect(zListaPoUsunieciu(s, "p1")).toBeNull()
    expect(zListaPoUsunieciu(s2, "p9")).toBeNull()
  })
})

describe("quantity values", () => {
  it("numbers: comma decimal, equality, range", () => {
    expect(normalizujLiczbe(" 2,50 ")).toBe("2.5")
    expect(normalizujLiczbe("")).toBeNull()
    expect(normalizujLiczbe("abc")).toBeNull()
    expect(takaSamaLiczba("48", 48)).toBe(true)
    expect(takaSamaLiczba("", "")).toBe(false)
    expect(wartoscDoZapisu("dodPct", "80")).toBe("80")
    expect(wartoscDoZapisu("dodPct", "120")).toBeNull()
    expect(wartoscDoZapisu("temperaturaMinC", "-25")).toBe("-25")
  })

  it("stored record: unknown quantities and malformed values are dropped, never guessed", () => {
    expect(
      parsujWartosci({ napiecieUkladuV: { v: "24", zrodlo: "x", iso: "i" }, nieznana: { v: "1" }, dodPct: { v: "abc" }, vocStcV: 5 }),
    ).toEqual({ napiecieUkladuV: { v: "24", zrodlo: "x", iso: "i" } })
    expect(parsujWartosci(null)).toEqual({})
  })
})
