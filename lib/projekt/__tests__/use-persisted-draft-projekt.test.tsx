import { act, cleanup, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// In-memory IndexedDB stand-in (the real adapter needs a browser).
const magazyn = new Map<string, unknown>()
vi.mock("@/lib/adapters/indexeddb-storage-adapter", () => ({
  indexedDbStorageAdapter: {
    getItem: async (k: string) => (magazyn.has(k) ? structuredClone(magazyn.get(k)) : null),
    setItem: async (k: string, v: unknown) => void magazyn.set(k, structuredClone(v)),
    removeItem: async (k: string) => void magazyn.delete(k),
    listKeys: async (p: string) => [...magazyn.keys()].filter((k) => k.startsWith(p)),
  },
}))

import { usePersistedDraft, useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { _resetMagazynuWartosci, zapiszWartosci } from "../magazyn-wartosci"
import { KLUCZ_LISTY_PROJEKTOW, zapiszListe } from "../projekty"

type Stan = { napiecieV: string; inne: string }
const POCZ: Stan = { napiecieV: "", inne: "" }

beforeEach(() => {
  magazyn.clear()
  _resetMagazynuWartosci()
  window.localStorage.removeItem(KLUCZ_LISTY_PROJEKTOW)
  window.localStorage.removeItem("offgrid.waluta.v1")
})
afterEach(cleanup)

describe("usePersistedDraft — leaving the screen (audit 3.1)", () => {
  it("a change typed less than 0.5 s before the screen closes is written anyway", async () => {
    const { result, unmount } = renderHook(() => usePersistedDraft<Stan>("ekran-a", POCZ))
    await waitFor(() => expect(result.current[3]).toBe(true))
    act(() => result.current[1]((p) => ({ ...p, inne: "42" })))
    unmount()
    await waitFor(() => expect(magazyn.get("offgrid.draft.ekran-a")).toEqual({ napiecieV: "", inne: "42" }))
  })
})

describe("usePersistedDraft — filled from the project", () => {
  it("an empty linked field shows the project value; an own value is kept and offered for saving", async () => {
    await zapiszWartosci("p1", { napiecieUkladuV: "24" }, "napiecie-systemowe")
    const { result } = renderHook(() => usePersistedDraft<Stan>("ekran-b", POCZ, { projekt: { napiecieV: "napiecieUkladuV" } }))
    await waitFor(() => expect(result.current[0].napiecieV).toBe("24"))
    expect(result.current[4].pole("napiecieV")?.status.rodzaj).toBe("projekt")
    act(() => result.current[1]((p) => ({ ...p, napiecieV: "48" })))
    expect(result.current[4].pole("napiecieV")?.status).toEqual({ rodzaj: "wlasna", wProjekcie: "24" })
    // A later project change (saved on another screen) does not overwrite the own value…
    await act(() => zapiszWartosci("p1", { napiecieUkladuV: "12" }, "inny"))
    expect(result.current[0].napiecieV).toBe("48")
    // …and ↺ brings the project value back.
    act(() => result.current[4].pole("napiecieV")!.przywroc())
    expect(result.current[0].napiecieV).toBe("12")
  })

  it("switching the project loads that project's draft (an empty project starts from the initial state)", async () => {
    magazyn.set("offgrid.draft.ekran-c", { napiecieV: "", inne: "z projektu 1" })
    const { result } = renderHook(() => usePersistedDraft<Stan>("ekran-c", POCZ))
    await waitFor(() => expect(result.current[0].inne).toBe("z projektu 1"))
    act(() => zapiszListe({ aktywnyId: "p2", projekty: [{ id: "p1", nazwa: "", utworzonoIso: "" }, { id: "p2", nazwa: "B", utworzonoIso: "" }] }))
    await waitFor(() => expect(result.current[0].inne).toBe(""))
    act(() => result.current[1]((p) => ({ ...p, inne: "projekt 2" })))
    await waitFor(() => expect(magazyn.get("offgrid.p.p2.draft.ekran-c")).toEqual({ napiecieV: "", inne: "projekt 2" }))
    expect(magazyn.get("offgrid.draft.ekran-c")).toEqual({ napiecieV: "", inne: "z projektu 1" })
  })
})

describe("useOdczytDraftu — amounts of another screen (audit 3.2)", () => {
  it("an amount saved in EUR is converted to PLN for a Polish-market reader", async () => {
    magazyn.set("offgrid.draft.oplacalnosc-magazynu", { cenaBateriiZl: "1000", inne: "x" })
    magazyn.set("offgrid.draftwaluta.oplacalnosc-magazynu", { kod: "EUR", kurs: 0.25, dataEcb: null, reczny: true, narzutProc: 0 })
    const { result } = renderHook(() => useOdczytDraftu<{ cenaBateriiZl: string }>("oplacalnosc-magazynu", { kwoty: ["cenaBateriiZl"], waluta: "pln" }))
    await waitFor(() => expect(result.current.wczytano).toBe(true))
    expect(result.current.dane?.cenaBateriiZl).toBe("4000")
  })
})

describe("usePersistedDraft — the quiet bar", () => {
  it("a value typed into a linked field that the project does not have yet is offered for saving", async () => {
    const { wpisyPaska } = await import("../pasek")
    const { result } = renderHook(() => usePersistedDraft<Stan>("ekran-d", POCZ, { projekt: { napiecieV: "napiecieUkladuV" } }))
    await waitFor(() => expect(result.current[3]).toBe(true))
    act(() => result.current[1]((p) => ({ ...p, napiecieV: "24" })))
    await waitFor(() => expect(wpisyPaska().flatMap((w) => w.kandydaci)).toEqual([{ wielkosc: "napiecieUkladuV", wartosc: "24", wProjekcie: null, pole: "napiecieV" }]))
    await act(() => wpisyPaska()[0]!.zapisz())
    await waitFor(() => expect(wpisyPaska()).toEqual([]))
    expect(result.current[4].pole("napiecieV")?.status.rodzaj).toBe("projekt")
  })
})

describe("useOdczytDraftu — another screen's draft seen with the project values (M14)", () => {
  const opcje = { projekt: { mapa: { moc: "mocPvKwp" as const }, poczatkowy: { moc: "", inne: "" } } }

  it("a never-opened owner screen still gives the project value; nothing in the project = no data", async () => {
    const pusty = renderHook(() => useOdczytDraftu<{ moc: string; inne: string }>("siec-pv-dom", opcje))
    await waitFor(() => expect(pusty.result.current.wczytano).toBe(true))
    expect(pusty.result.current.dane).toBeNull()
    pusty.unmount()
    await zapiszWartosci("p1", { mocPvKwp: "5.5" }, "liczba-paneli")
    const { result } = renderHook(() => useOdczytDraftu<{ moc: string; inne: string }>("siec-pv-dom", opcje))
    await waitFor(() => expect(result.current.dane).toEqual({ moc: "5.5", inne: "" }))
  })

  it("an own value typed on the owner screen wins over the project", async () => {
    await zapiszWartosci("p1", { mocPvKwp: "5.5" }, "liczba-paneli")
    magazyn.set("offgrid.draft.siec-pv-firma", { moc: "8", inne: "x" })
    magazyn.set("offgrid.draftprojekt.siec-pv-firma", { moc: "wlasna" })
    const { result } = renderHook(() => useOdczytDraftu<{ moc: string; inne: string }>("siec-pv-firma", opcje))
    await waitFor(() => expect(result.current.dane).toEqual({ moc: "8", inne: "x" }))
  })
})
