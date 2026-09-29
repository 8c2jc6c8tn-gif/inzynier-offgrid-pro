import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { _resetTrwalyMagazyn, KLUCZ_ODMOWY, poprosOTrwalyMagazyn } from "../trwaly-magazyn"

function ustawMagazyn(opcje: { persisted: boolean; persist?: boolean }) {
  const magazyn = {
    persisted: vi.fn(async () => opcje.persisted),
    persist: vi.fn(async () => opcje.persist ?? false),
  }
  vi.stubGlobal("navigator", { ...navigator, storage: magazyn })
  return magazyn
}

describe("poprosOTrwalyMagazyn (standard 5.10)", () => {
  beforeEach(() => {
    _resetTrwalyMagazyn()
    localStorage.clear()
  })
  afterEach(() => vi.unstubAllGlobals())

  it("already persistent: does not ask again", async () => {
    const m = ustawMagazyn({ persisted: true })
    expect(await poprosOTrwalyMagazyn()).toBe(true)
    expect(m.persist).not.toHaveBeenCalled()
  })

  it("refusal is remembered — the next page load does not ask the browser (no Firefox prompt every start)", async () => {
    const m = ustawMagazyn({ persisted: false, persist: false })
    expect(await poprosOTrwalyMagazyn()).toBe(false)
    expect(localStorage.getItem(KLUCZ_ODMOWY)).toBe("1")
    _resetTrwalyMagazyn()
    expect(await poprosOTrwalyMagazyn()).toBe(false)
    expect(m.persist).toHaveBeenCalledTimes(1)
  })

  it("grant is not stored — persisted() reports it by itself", async () => {
    ustawMagazyn({ persisted: false, persist: true })
    expect(await poprosOTrwalyMagazyn()).toBe(true)
    expect(localStorage.getItem(KLUCZ_ODMOWY)).toBeNull()
  })

  it("asks at most once per page load, even with many writes", async () => {
    const m = ustawMagazyn({ persisted: false, persist: true })
    await Promise.all([poprosOTrwalyMagazyn(), poprosOTrwalyMagazyn(), poprosOTrwalyMagazyn()])
    expect(m.persisted).toHaveBeenCalledTimes(1)
  })

  it("no Storage API: null, nothing thrown", async () => {
    vi.stubGlobal("navigator", { ...navigator, storage: undefined })
    expect(await poprosOTrwalyMagazyn()).toBeNull()
  })
})
