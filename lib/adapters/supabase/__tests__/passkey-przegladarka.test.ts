import { afterEach, describe, expect, it, vi } from "vitest"
import {
  potwierdzLogowanieKluczem,
  przegladarkaObslugujeKlucze,
  utworzKluczNaUrzadzeniu,
} from "../passkey-przegladarka"

function wlaczWebAuthn(credentials: { get?: unknown; create?: unknown }) {
  vi.stubGlobal(
    "PublicKeyCredential",
    Object.assign(function () {}, {
      parseRequestOptionsFromJSON: (o: unknown) => ({ rozparsowane: o }),
      parseCreationOptionsFromJSON: (o: unknown) => ({ rozparsowane: o }),
    }),
  )
  Object.defineProperty(navigator, "credentials", { value: credentials, configurable: true })
}

afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(navigator, "credentials")
})

describe("przegladarkaObslugujeKlucze", () => {
  it("false bez WebAuthn", () => {
    expect(przegladarkaObslugujeKlucze()).toBe(false)
  })

  it("false, gdy brak natywnych metod JSON (starsza przeglądarka)", () => {
    vi.stubGlobal("PublicKeyCredential", function () {})
    Object.defineProperty(navigator, "credentials", { value: {}, configurable: true })
    expect(przegladarkaObslugujeKlucze()).toBe(false)
  })

  it("true z pełnym API", () => {
    wlaczWebAuthn({})
    expect(przegladarkaObslugujeKlucze()).toBe(true)
  })
})

describe("potwierdzLogowanieKluczem / utworzKluczNaUrzadzeniu", () => {
  it("bez obsługi zwraca komunikat o braku wsparcia", async () => {
    expect(await potwierdzLogowanieKluczem({})).toEqual({ ok: false, errorKey: "UI-BLAD-PASSKEY-NIEOBSLUGIWANE" })
    expect(await utworzKluczNaUrzadzeniu({})).toEqual({ ok: false, errorKey: "UI-BLAD-PASSKEY-NIEOBSLUGIWANE" })
  })

  it("zwraca odpowiedź w postaci JSON, gotową do wysłania na serwer", async () => {
    const get = vi.fn().mockResolvedValue({ toJSON: () => ({ id: "a", type: "public-key" }) })
    const create = vi.fn().mockResolvedValue({ toJSON: () => ({ id: "b", type: "public-key" }) })
    wlaczWebAuthn({ get, create })
    expect(await potwierdzLogowanieKluczem({ challenge: "x" })).toEqual({ ok: true, credential: { id: "a", type: "public-key" } })
    expect(get).toHaveBeenCalledWith({ publicKey: { rozparsowane: { challenge: "x" } } })
    expect(await utworzKluczNaUrzadzeniu({ challenge: "y" })).toEqual({ ok: true, credential: { id: "b", type: "public-key" } })
    expect(create).toHaveBeenCalledWith({ publicKey: { rozparsowane: { challenge: "y" } } })
  })

  it("anulowanie okna przez użytkownika nie jest awarią", async () => {
    wlaczWebAuthn({ get: vi.fn().mockRejectedValue(new DOMException("anulowano", "NotAllowedError")) })
    expect(await potwierdzLogowanieKluczem({})).toEqual({ ok: false, errorKey: "UI-BLAD-PASSKEY-ANULOWANO" })
  })

  it("inny błąd urządzenia daje ogólny komunikat", async () => {
    wlaczWebAuthn({ create: vi.fn().mockRejectedValue(new DOMException("x", "InvalidStateError")) })
    expect(await utworzKluczNaUrzadzeniu({})).toEqual({ ok: false, errorKey: "UI-BLAD-PASSKEY-CEREMONIA" })
  })

  it("brak wyniku z przeglądarki traktowany jak anulowanie", async () => {
    wlaczWebAuthn({ get: vi.fn().mockResolvedValue(null) })
    expect(await potwierdzLogowanieKluczem({})).toEqual({ ok: false, errorKey: "UI-BLAD-PASSKEY-ANULOWANO" })
  })
})
