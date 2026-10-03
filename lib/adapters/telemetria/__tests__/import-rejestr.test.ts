import { describe, expect, it } from "vitest"
import type { StorageAdapter } from "../../storage-adapter"
import { zapiszProfil, usunProfil, zapiszZrodlo, pustyRejestr, ProfilCsvSchema } from "@/lib/core/telemetria/rejestr"
import { importujCsv } from "../import-csv"
import { PamiecMagazynProbek } from "../magazyn-probek"
import { KLUCZ_REJESTRU, wczytajRejestr, zapiszRejestr } from "../rejestr-zrodel"

function pamiec(): StorageAdapter & { dane: Map<string, unknown> } {
  const dane = new Map<string, unknown>()
  return {
    dane,
    getItem: async <T,>(k: string) => (dane.has(k) ? (dane.get(k) as T) : null),
    setItem: async (k, v) => void dane.set(k, v),
    removeItem: async (k) => void dane.delete(k),
  } as StorageAdapter & { dane: Map<string, unknown> }
}

describe("rejestr źródeł", () => {
  it("round-trips through storage", async () => {
    const m = pamiec()
    let r = zapiszZrodlo(pustyRejestr(), { id: "a", nazwa: "ESP", typ: "http", ustawienia: { url: "http://x" }, demo: false })
    r = zapiszProfil(r, { id: "p", nazwa: "Pogodynka", profil: { kolumnaCzasu: 0, formatCzasu: "iso", bezNaglowka: true, kolumny: [{ kolumna: 1, kanal: "s", wielkosc: "temperatura", jednostka: "°C" }] } })
    await zapiszRejestr(m, r)
    expect(await wczytajRejestr(m)).toEqual({ rejestr: r, uszkodzony: false })
  })
  it("corrupt data gives an empty registry and a flag", async () => {
    const m = pamiec()
    m.dane.set(KLUCZ_REJESTRU, { wersja: 7 })
    const w = await wczytajRejestr(m)
    expect(w.uszkodzony).toBe(true)
    expect(w.rejestr.zrodla).toEqual([])
  })
  it("profile schema rejects unknown quantity", () => {
    expect(ProfilCsvSchema.safeParse({ kolumnaCzasu: 0, formatCzasu: "iso", kolumny: [{ kolumna: 1, kanal: "k", wielkosc: "xx", jednostka: "V" }] }).success).toBe(false)
  })
})

describe("import CSV", () => {
  it("stores samples, drops duplicates, reports errors and quality", async () => {
    const mag = new PamiecMagazynProbek()
    const tekst = "czas,U\n2026-01-01T00:00:00Z,50\n2026-01-01T00:00:00Z,50\nzly,1\n2026-01-01T00:10:00Z,51\n"
    const w = await importujCsv(tekst, { kolumnaCzasu: "czas", formatCzasu: "iso", kolumny: [{ kolumna: "U", kanal: "b", wielkosc: "napiecie", jednostka: "V" }] }, "z", 60_000, mag)
    expect(w.zapisane).toBe(2)
    expect(w.bledy).toHaveLength(1)
    expect(w.jakosc.duplikaty).toBe(1)
    expect(w.jakosc.luki).toHaveLength(1)
    expect(await mag.zakres("z", 0, Date.now())).toHaveLength(2)
  })
  it("saving a profile with the same id overwrites it, and deleting removes only that one", () => {
    const profil = (kanal: string) => ({ kolumnaCzasu: 0, formatCzasu: "iso" as const, kolumny: [{ kolumna: "t", kanal, wielkosc: "temperatura" as const, jednostka: "°C" }] })
    let r = zapiszProfil(pustyRejestr(), { id: "a", nazwa: "A", profil: profil("k1") })
    r = zapiszProfil(r, { id: "b", nazwa: "B", profil: profil("k2") })
    r = zapiszProfil(r, { id: "a", nazwa: "A", profil: profil("k3") })
    expect(r.profile).toHaveLength(2)
    expect(r.profile.find((x) => x.id === "a")?.profil.kolumny[0].kanal).toBe("k3")
    expect(usunProfil(r, "a").profile.map((x) => x.id)).toEqual(["b"])
    expect(usunProfil(r, "nie-ma").profile).toHaveLength(2)
  })
})
