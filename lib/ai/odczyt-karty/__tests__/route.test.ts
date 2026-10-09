// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const create = vi.fn()
vi.mock("@/lib/adapters/ai/client", () => ({ createAnthropicClient: () => ({ messages: { create } }) }))

const ORIGINAL_ENV = { ...process.env }
const odpowiedzModelu = { stop_reason: "end_turn", content: [{ type: "text", text: "nie wywołano narzędzia" }] }

async function post(pola: Record<string, string | File>, naglowki: Record<string, string> = {}) {
  const { POST } = await import("@/app/api/odczyt-karty/route")
  const forma = new FormData()
  for (const [k, v] of Object.entries(pola)) forma.set(k, v)
  return POST(new NextRequest("http://localhost/api/odczyt-karty", { method: "POST", body: forma, headers: naglowki }))
}
const plik = (rozmiar = 10, typ = "image/jpeg") => new File([new Uint8Array(rozmiar).fill(65)], "karta.jpg", { type: typ })

beforeEach(() => {
  process.env.ANTHROPIC_API_KEY = "sk-ant-api03-realny-klucz"
  create.mockReset().mockResolvedValue(odpowiedzModelu)
  vi.resetModules()
})
afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
})

describe("POST /api/odczyt-karty", () => {
  it("bez klucza API: 503 i model nie jest wołany", async () => {
    delete process.env.ANTHROPIC_API_KEY
    const r = await post({ plik: plik(), zgoda: "tak" })
    expect(r.status).toBe(503)
    expect(await r.json()).toMatchObject({ ok: false, bladKey: "UI-PORP-OCR-BLAD-NIESKONFIGUROWANY" })
    expect(create).not.toHaveBeenCalled()
  })

  it("bez zgody użytkownika: 403 i plik nie jest wysyłany do modelu", async () => {
    const r = await post({ plik: plik() })
    expect(r.status).toBe(403)
    expect(await r.json()).toMatchObject({ bladKey: "UI-PORP-OCR-BLAD-BRAK-ZGODY" })
    expect((await post({ plik: plik(), zgoda: "nie" })).status).toBe(403)
    expect(create).not.toHaveBeenCalled()
  })

  it("brak pliku: 400, za duży plik: 413, zły typ: 415", async () => {
    expect((await post({ zgoda: "tak" })).status).toBe(400)
    expect((await post({ plik: plik(4 * 1024 * 1024), zgoda: "tak" })).status).toBe(413)
    expect((await post({ plik: plik(10, "image/svg+xml"), zgoda: "tak" })).status).toBe(415)
    expect(create).not.toHaveBeenCalled()
  })

  it("odpowiedź modelu bez narzędzia: 502 z kluczem błędu odczytu", async () => {
    const r = await post({ plik: plik(), zgoda: "tak", podpowiedz: "JA Solar", jezyk: "pl" })
    expect(r.status).toBe(502)
    expect(await r.json()).toMatchObject({ bladKey: "UI-PORP-OCR-BLAD-ZLY-ODCZYT" })
    expect(create).toHaveBeenCalledTimes(1)
  })

  it("błąd sieci do dostawcy: 502, ogólny komunikat bez szczegółów", async () => {
    create.mockRejectedValue(new Error("secret internal detail"))
    const r = await post({ plik: plik(), zgoda: "tak" })
    expect(r.status).toBe(502)
    const tekst = JSON.stringify(await r.json())
    expect(tekst).toContain("UI-PORP-OCR-BLAD-OGOLNY")
    expect(tekst).not.toContain("secret")
  })

  it("po wyczerpaniu limitu z jednego adresu: 429 z czasem ponowienia", async () => {
    const naglowki = { "x-forwarded-for": "9.9.9.9" }
    for (let i = 0; i < 10; i++) expect((await post({ plik: plik(), zgoda: "tak" }, naglowki)).status).toBe(502)
    const r = await post({ plik: plik(), zgoda: "tak" }, naglowki)
    expect(r.status).toBe(429)
    expect(await r.json()).toMatchObject({ bladKey: "UI-PORP-OCR-BLAD-LIMIT" })
    // another address is not affected
    expect((await post({ plik: plik(), zgoda: "tak" }, { "x-forwarded-for": "8.8.8.8" })).status).toBe(502)
  })
})
