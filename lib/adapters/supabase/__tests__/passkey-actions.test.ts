import { beforeEach, describe, expect, it, vi } from "vitest"

const passkey = {
  startAuthentication: vi.fn(),
  verifyAuthentication: vi.fn(),
  startRegistration: vi.fn(),
  verifyRegistration: vi.fn(),
  list: vi.fn(),
  delete: vi.fn(),
}
const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`)
})
let skonfigurowane = true

vi.mock("next/navigation", () => ({ redirect: (url: string) => redirect(url) }))
vi.mock("../server", () => ({ createSupabaseServerClient: async () => ({ auth: { passkey } }) }))
vi.mock("../config", () => ({ isSupabaseConfigured: () => skonfigurowane }))

import {
  pobierzKlucze,
  rozpocznijLogowanieKluczem,
  rozpocznijRejestracjeKlucza,
  usunKlucz,
  zakonczLogowanieKluczem,
  zakonczRejestracjeKlucza,
} from "../passkey-actions"

const poprawnaOdpowiedz = { id: "abc", rawId: "abc", type: "public-key", response: {} }

beforeEach(() => {
  skonfigurowane = true
  vi.clearAllMocks()
})

describe("klucze dostępu — bez skonfigurowanego Supabase", () => {
  it("każda akcja zwraca bezpieczny błąd i nie woła usługi", async () => {
    skonfigurowane = false
    expect(await rozpocznijLogowanieKluczem()).toEqual({ errorKey: "UI-BLAD-PASSKEY-NIESKONFIGUROWANE" })
    expect(await zakonczLogowanieKluczem("c", poprawnaOdpowiedz, "/")).toEqual({ errorKey: "UI-BLAD-PASSKEY-NIESKONFIGUROWANE" })
    expect(await rozpocznijRejestracjeKlucza()).toEqual({ errorKey: "UI-BLAD-PASSKEY-NIESKONFIGUROWANE" })
    expect(await zakonczRejestracjeKlucza("c", poprawnaOdpowiedz)).toEqual({ errorKey: "UI-BLAD-PASSKEY-NIESKONFIGUROWANE" })
    expect(await pobierzKlucze()).toEqual({ errorKey: "UI-BLAD-PASSKEY-NIESKONFIGUROWANE" })
    expect(await usunKlucz("d3b07384-d9a0-4c9b-8a0e-5b9c3f1e2a10")).toEqual({ errorKey: "UI-BLAD-PASSKEY-NIESKONFIGUROWANE" })
    for (const f of Object.values(passkey)) expect(f).not.toHaveBeenCalled()
  })
})

describe("logowanie kluczem", () => {
  it("zwraca wyzwanie i opcje dla przeglądarki", async () => {
    passkey.startAuthentication.mockResolvedValue({ data: { challenge_id: "w1", options: { challenge: "xyz" } }, error: null })
    expect(await rozpocznijLogowanieKluczem()).toEqual({ challengeId: "w1", options: { challenge: "xyz" } })
  })

  it("błąd usługi daje klucz tłumaczenia, nie surowy komunikat", async () => {
    passkey.startAuthentication.mockResolvedValue({ data: null, error: { code: "unexpected", message: "tajny szczegół" } })
    expect(await rozpocznijLogowanieKluczem()).toEqual({ errorKey: "UI-BLAD-PASSKEY-LOGOWANIE" })
  })

  it("odrzuca odpowiedź o złym kształcie bez pytania usługi", async () => {
    expect(await zakonczLogowanieKluczem("w1", { id: "abc" }, "/")).toEqual({ errorKey: "UI-BLAD-PASSKEY-LOGOWANIE" })
    expect(await zakonczLogowanieKluczem("", poprawnaOdpowiedz, "/")).toEqual({ errorKey: "UI-BLAD-PASSKEY-LOGOWANIE" })
    expect(passkey.verifyAuthentication).not.toHaveBeenCalled()
  })

  it("po udanej weryfikacji przekierowuje na bezpieczną ścieżkę", async () => {
    passkey.verifyAuthentication.mockResolvedValue({ data: { session: { access_token: "t" }, user: {} }, error: null })
    await expect(zakonczLogowanieKluczem("w1", poprawnaOdpowiedz, "/kalkulatory/x")).rejects.toThrow("NEXT_REDIRECT:/kalkulatory/x")
    expect(passkey.verifyAuthentication).toHaveBeenCalledWith({ challengeId: "w1", credential: poprawnaOdpowiedz })
  })

  it("nie przekierowuje poza aplikację (open redirect)", async () => {
    passkey.verifyAuthentication.mockResolvedValue({ data: { session: { access_token: "t" }, user: {} }, error: null })
    await expect(zakonczLogowanieKluczem("w1", poprawnaOdpowiedz, "//zly.example")).rejects.toThrow("NEXT_REDIRECT:/")
    await expect(zakonczLogowanieKluczem("w1", poprawnaOdpowiedz, "https://zly.example")).rejects.toThrow("NEXT_REDIRECT:/")
  })

  it("brak sesji w odpowiedzi albo błąd usługi nie loguje", async () => {
    passkey.verifyAuthentication.mockResolvedValue({ data: { session: null, user: null }, error: null })
    expect(await zakonczLogowanieKluczem("w1", poprawnaOdpowiedz, "/")).toEqual({ errorKey: "UI-BLAD-PASSKEY-LOGOWANIE" })
    passkey.verifyAuthentication.mockResolvedValue({ data: null, error: { code: "x", message: "m" } })
    expect(await zakonczLogowanieKluczem("w1", poprawnaOdpowiedz, "/")).toEqual({ errorKey: "UI-BLAD-PASSKEY-LOGOWANIE" })
    expect(redirect).not.toHaveBeenCalled()
  })
})

describe("rejestracja i zarządzanie kluczami", () => {
  it("limit kluczy na koncie ma osobny komunikat", async () => {
    passkey.verifyRegistration.mockResolvedValue({ data: null, error: { code: "too_many_passkeys", message: "m" } })
    expect(await zakonczRejestracjeKlucza("w1", poprawnaOdpowiedz)).toEqual({ errorKey: "UI-BLAD-PASSKEY-LIMIT" })
  })

  it("wyłączona funkcja po stronie usługi ma osobny komunikat", async () => {
    passkey.startRegistration.mockResolvedValue({ data: null, error: { code: "feature_disabled", message: "m" } })
    expect(await rozpocznijRejestracjeKlucza()).toEqual({ errorKey: "UI-BLAD-PASSKEY-WYLACZONE" })
  })

  it("udana rejestracja", async () => {
    passkey.verifyRegistration.mockResolvedValue({ data: { id: "k1", created_at: "2026-10-18T00:00:00Z" }, error: null })
    expect(await zakonczRejestracjeKlucza("w1", poprawnaOdpowiedz)).toEqual({ ok: true })
  })

  it("lista mapuje pola usługi na pola ekranu", async () => {
    passkey.list.mockResolvedValue({
      data: [
        { id: "k1", friendly_name: "Telefon", created_at: "2026-10-01T00:00:00Z", last_used_at: "2026-10-10T00:00:00Z" },
        { id: "k2", created_at: "2026-10-02T00:00:00Z" },
      ],
      error: null,
    })
    expect(await pobierzKlucze()).toEqual({
      klucze: [
        { id: "k1", nazwa: "Telefon", utworzono: "2026-10-01T00:00:00Z", ostatnieUzycie: "2026-10-10T00:00:00Z" },
        { id: "k2", nazwa: null, utworzono: "2026-10-02T00:00:00Z", ostatnieUzycie: null },
      ],
    })
  })

  it("usunięcie sprawdza identyfikator klucza", async () => {
    expect(await usunKlucz("nie-uuid")).toEqual({ errorKey: "UI-BLAD-PASSKEY-USUWANIE" })
    expect(passkey.delete).not.toHaveBeenCalled()
    passkey.delete.mockResolvedValue({ data: null, error: null })
    expect(await usunKlucz("d3b07384-d9a0-4c9b-8a0e-5b9c3f1e2a10")).toEqual({ ok: true })
    expect(passkey.delete).toHaveBeenCalledWith({ passkeyId: "d3b07384-d9a0-4c9b-8a0e-5b9c3f1e2a10" })
  })
})
