import { afterEach, describe, expect, it, vi } from "vitest"
import type { KonfiguracjaZrodla, StatusPolaczenia } from "@/lib/core/telemetria/zrodlo"
import type { ProbkaTelemetrii } from "@/lib/core/telemetria/probka"
import { PamiecMagazynProbek } from "../magazyn-probek"
import { utworzZrodlo, ZrodloHttp, ZrodloSymulator, ZrodloWebBluetooth, ZrodloWebSerial } from "../zrodla"

const kfg = (typ: KonfiguracjaZrodla["typ"], ustawienia: KonfiguracjaZrodla["ustawienia"] = {}): KonfiguracjaZrodla => ({
  id: "z1", nazwa: "t", typ, ustawienia, demo: typ === "symulator",
})
const koperta = JSON.stringify({ s: 1, d: "e", t: 5, c: [{ k: "bms", w: "soc", v: 55, u: "%" }] })

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("magazyn próbek (pamięć)", () => {
  const p = (czas: number, z = "a"): ProbkaTelemetrii => ({ zrodloId: z, kanal: "k", czas, wielkosc: "moc", wartosc: czas, jakosc: "ok" })
  it("de-duplicates by key, filters range, deletes per source", async () => {
    const m = new PamiecMagazynProbek()
    await m.dodaj([p(3), p(1), p(1), p(2, "b")])
    expect((await m.zakres("a", 0, 10)).map((x) => x.czas)).toEqual([1, 3])
    expect(await m.zakres("a", 2, 10)).toHaveLength(1)
    await m.usunZrodlo("a")
    expect(await m.zakres("a", 0, 10)).toHaveLength(0)
    expect(await m.zakres("b", 0, 10)).toHaveLength(1)
  })
})

describe("źródła", () => {
  it("factory maps types; csv/mqtt have no live adapter", () => {
    expect(utworzZrodlo(kfg("http"))).toBeInstanceOf(ZrodloHttp)
    expect(utworzZrodlo(kfg("csv"))).toBeNull()
  })

  it("simulator emits samples through the port and stops", async () => {
    vi.useFakeTimers()
    const got: ProbkaTelemetrii[] = []
    const z = new ZrodloSymulator(kfg("symulator", { krokMs: 1000 }))
    await z.polacz({ naProbki: (p) => got.push(...p), naStatus: () => {} })
    vi.advanceTimersByTime(2500)
    expect(got.length).toBeGreaterThan(0)
    expect(z.ostatniaProbka()).not.toBeNull()
    await z.rozlacz()
    const n = got.length
    vi.advanceTimersByTime(3000)
    expect(got.length).toBe(n)
    expect(z.status()).toBe("rozlaczone")
  })

  it("http source parses the envelope and reports errors via status", async () => {
    const got: ProbkaTelemetrii[] = []
    const st: [StatusPolaczenia, string | undefined][] = []
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: true, text: async () => koperta }).mockResolvedValue({ ok: false, status: 500 }))
    vi.useFakeTimers()
    const z = new ZrodloHttp(kfg("http", { url: "http://x/y", coMs: 1000 }))
    await z.polacz({ naProbki: (p) => got.push(...p), naStatus: (s, d) => st.push([s, d]) })
    expect(got[0]).toMatchObject({ wielkosc: "soc", wartosc: 55, czas: 5000 })
    expect(z.status()).toBe("polaczone")
    await vi.advanceTimersByTimeAsync(1100)
    expect(z.status()).toBe("blad")
    await z.rozlacz()
  })

  it("http source without url reports an error, no fetch", async () => {
    const z = new ZrodloHttp(kfg("http"))
    await z.polacz({ naProbki: () => {}, naStatus: () => {} })
    expect(z.status()).toBe("blad")
  })

  it("serial/BLE report unsupported browsers instead of throwing", async () => {
    vi.stubGlobal("navigator", {})
    const a = new ZrodloWebSerial(kfg("web-serial"))
    await a.polacz({ naProbki: () => {}, naStatus: () => {} })
    expect(a.status()).toBe("blad")
    const b = new ZrodloWebBluetooth(kfg("web-bluetooth", { uuidUslugi: "a", uuidCharakterystyki: "b" }))
    await b.polacz({ naProbki: () => {}, naStatus: () => {} })
    expect(b.status()).toBe("blad")
  })

  it("serial reads NDJSON split across chunks", async () => {
    const enc = new TextEncoder()
    const linia = koperta + "\n"
    const chunks = [enc.encode(linia.slice(0, 20)), enc.encode(linia.slice(20))]
    const port = {
      open: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      readable: new ReadableStream<Uint8Array>({ start(c) { chunks.forEach((x) => c.enqueue(x)); c.close() } }),
    }
    vi.stubGlobal("navigator", { serial: { requestPort: async () => port } })
    const got: ProbkaTelemetrii[] = []
    const z = new ZrodloWebSerial(kfg("web-serial"))
    await z.polacz({ naProbki: (p) => got.push(...p), naStatus: () => {} })
    await vi.waitFor(() => expect(got).toHaveLength(1))
    expect(got[0].wartosc).toBe(55)
  })
})
