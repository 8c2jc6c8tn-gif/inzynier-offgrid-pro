import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  _resetZdarzenWersjiBazy,
  indexedDbStorageAdapter,
  naZdarzenieWersjiBazy,
  type ZdarzenieWersjiBazy,
} from "../indexeddb-storage-adapter"

// Minimal stand-in for indexedDB.open(): the test fires the request callbacks by hand.
type Zadanie = {
  result: { onversionchange: (() => void) | null; close: ReturnType<typeof vi.fn> }
  error: { name: string } | null
  onupgradeneeded: (() => void) | null
  onblocked: (() => void) | null
  onsuccess: (() => void) | null
  onerror: (() => void) | null
}

function atrapaIndexedDb() {
  const zadania: Zadanie[] = []
  vi.stubGlobal("indexedDB", {
    open: () => {
      const z: Zadanie = {
        result: { onversionchange: null, close: vi.fn() },
        error: null,
        onupgradeneeded: null,
        onblocked: null,
        onsuccess: null,
        onerror: null,
      }
      zadania.push(z)
      return z
    },
  })
  return zadania
}

// The adapter awaits openDb() after a synchronous persist request; let the open() call happen.
const tik = () => new Promise((r) => setTimeout(r, 0))

describe("IndexedDB version collisions between tabs (standard 5.11)", () => {
  let zdarzenia: ZdarzenieWersjiBazy[]
  let zadania: Zadanie[]

  beforeEach(() => {
    _resetZdarzenWersjiBazy()
    zadania = atrapaIndexedDb()
    zdarzenia = []
    naZdarzenieWersjiBazy((z) => zdarzenia.push(z))
  })
  afterEach(() => vi.unstubAllGlobals())

  it("VersionError (database newer than this code) → reload needed, and the write still rejects", async () => {
    const zapis = indexedDbStorageAdapter.getItem("x")
    await tik()
    zadania[0].error = { name: "VersionError" }
    zadania[0].onerror?.()
    await expect(zapis).rejects.toEqual({ name: "VersionError" })
    expect(zdarzenia).toEqual(["baza-nowsza-niz-kod"])
  })

  it("another tab upgrades → this tab closes its connection and asks for a reload", async () => {
    indexedDbStorageAdapter.getItem("x").catch(() => {})
    await tik()
    zadania[0].onsuccess?.()
    zadania[0].result.onversionchange?.()
    expect(zadania[0].result.close).toHaveBeenCalled()
    expect(zdarzenia).toEqual(["nowsza-wersja-w-innej-karcie"])
  })

  it("blocked upgrade is informational and not replayed to late subscribers", async () => {
    indexedDbStorageAdapter.getItem("x").catch(() => {})
    await tik()
    zadania[0].onblocked?.()
    expect(zdarzenia).toEqual(["upgrade-zablokowany"])
    const pozne: ZdarzenieWersjiBazy[] = []
    naZdarzenieWersjiBazy((z) => pozne.push(z))
    expect(pozne).toEqual([])
  })

  it("'reload needed' is replayed to a subscriber that mounts later (toast host mounts after the first read)", async () => {
    const odczyt = indexedDbStorageAdapter.getItem("x")
    await tik()
    zadania[0].error = { name: "VersionError" }
    zadania[0].onerror?.()
    await odczyt.catch(() => {})
    const pozne: ZdarzenieWersjiBazy[] = []
    naZdarzenieWersjiBazy((z) => pozne.push(z))
    expect(pozne).toEqual(["baza-nowsza-niz-kod"])
  })

  it("other open errors do not ask for a reload", async () => {
    const odczyt = indexedDbStorageAdapter.getItem("x")
    await tik()
    zadania[0].error = { name: "QuotaExceededError" }
    zadania[0].onerror?.()
    await odczyt.catch(() => {})
    expect(zdarzenia).toEqual([])
  })
})
