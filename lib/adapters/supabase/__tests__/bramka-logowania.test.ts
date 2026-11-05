// @vitest-environment node
/**
 * Bramka logowania na atrapach Supabase (docs/standards/18-logowanie.md, 18.1/18.2/18.5):
 * `proxy.ts` (przekierowanie niezalogowanych, CSP na każdej ścieżce, wyłączenie bez kluczy),
 * trasa `/auth/callback` (wymiana kodu, ochrona przed open redirect), akcje logowania i wylogowania.
 * Nic tu nie woła prawdziwego Supabase — usługa jest atrapą, więc test przechodzi bez bazy
 * i po podłączeniu bazy zostaje bez zmian jako kontrakt zachowania aplikacji.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const sesja = {
  user: null as { id: string } | null,
  getUser: vi.fn(),
  signInWithOtp: vi.fn(),
  signInWithOAuth: vi.fn(),
  exchangeCodeForSession: vi.fn(),
  signOut: vi.fn(),
}
const auth = {
  getUser: () => sesja.getUser(),
  signInWithOtp: (...a: unknown[]) => sesja.signInWithOtp(...a),
  signInWithOAuth: (...a: unknown[]) => sesja.signInWithOAuth(...a),
  exchangeCodeForSession: (...a: unknown[]) => sesja.exchangeCodeForSession(...a),
  signOut: (...a: unknown[]) => sesja.signOut(...a),
}

vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({ auth }) }))
vi.mock("../server", () => ({ createSupabaseServerClient: async () => ({ auth }) }))
const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`)
})
vi.mock("next/navigation", () => ({ redirect: (url: string) => redirectMock(url) }))

import { proxy, config } from "@/proxy"
import { GET as callbackGet } from "@/app/auth/callback/route"
import { signInWithApple, signInWithGoogle, signInWithMagicLink } from "@/app/auth/login/actions"
import { signOut } from "@/app/auth/signout/actions"

const ORIGIN = "https://offgrid.test"
const req = (path: string) => new NextRequest(`${ORIGIN}${path}`)

function ustawKlucze(wlaczone: boolean) {
  if (wlaczone) {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key")
  } else {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  sesja.getUser.mockImplementation(async () => ({ data: { user: sesja.user } }))
  sesja.user = null
})
afterEach(() => vi.unstubAllEnvs())

describe("proxy — bez kluczy Supabase (bramka wyłączona)", () => {
  it("przepuszcza każdą ścieżkę, nie pyta usługi o użytkownika i dokłada CSP z nonce", async () => {
    ustawKlucze(false)
    const res = await proxy(req("/kalkulatory/tor-slonca"))
    expect(res.status).toBe(200)
    expect(res.headers.get("location")).toBeNull()
    expect(sesja.getUser).not.toHaveBeenCalled()
    const nonce = res.headers.get("x-nonce")
    expect(nonce).toBeTruthy()
    // poza produkcją (vitest = NODE_ENV test) CSP jest poluzowane dla HMR — nonce jest w nagłówku x-nonce
    expect(res.headers.get("Content-Security-Policy")).toContain("default-src 'self'")
  })

  it("w produkcji script-src dopuszcza wyłącznie 'self' i nonce tego żądania", async () => {
    ustawKlucze(false)
    vi.stubEnv("NODE_ENV", "production")
    vi.resetModules()
    const { proxy: proxyProd } = await import("@/proxy")
    const res = await proxyProd(req("/"))
    const nonce = res.headers.get("x-nonce")
    const csp = res.headers.get("Content-Security-Policy")!
    expect(csp).toContain(`script-src 'self' 'nonce-${nonce}'`)
    expect(csp).not.toContain("unsafe-eval")
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it("placeholder z .env.example (TWOJ-PROJEKT) też zostawia bramkę wyłączoną", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://TWOJ-PROJEKT.supabase.co")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "cokolwiek")
    const res = await proxy(req("/"))
    expect(res.status).toBe(200)
    expect(sesja.getUser).not.toHaveBeenCalled()
  })
})

describe("proxy — z kluczami Supabase (bramka włączona)", () => {
  beforeEach(() => ustawKlucze(true))

  it("niezalogowany na stronie aplikacji dostaje przekierowanie na logowanie z ścieżką powrotu", async () => {
    const res = await proxy(req("/kalkulatory/tor-slonca"))
    expect(res.status).toBe(307)
    const loc = new URL(res.headers.get("location")!)
    expect(loc.pathname).toBe("/auth/login")
    expect(loc.searchParams.get("next")).toBe("/kalkulatory/tor-slonca")
    // także przekierowanie niesie CSP — żadna odpowiedź nie omija nagłówka
    expect(res.headers.get("Content-Security-Policy")).toContain("default-src 'self'")
  })

  it("niezalogowany może wejść na /auth/* (inaczej pętla przekierowań)", async () => {
    for (const p of ["/auth/login", "/auth/callback", "/auth/signout"]) {
      const res = await proxy(req(p))
      expect(res.status, p).toBe(200)
      expect(res.headers.get("location"), p).toBeNull()
    }
  })

  it("zalogowany przechodzi dalej", async () => {
    sesja.user = { id: "u1" }
    const res = await proxy(req("/ustawienia"))
    expect(res.status).toBe(200)
    expect(res.headers.get("location")).toBeNull()
    expect(res.headers.get("x-nonce")).toBeTruthy()
  })

  it("nonce jest inny przy każdym żądaniu", async () => {
    sesja.user = { id: "u1" }
    const a = await proxy(req("/"))
    const b = await proxy(req("/"))
    expect(a.headers.get("x-nonce")).not.toBe(b.headers.get("x-nonce"))
  })

  it("używa getUser() (weryfikacja tokenu na serwerze), nie odczytu niezweryfikowanej sesji", async () => {
    await proxy(req("/"))
    expect(sesja.getUser).toHaveBeenCalledTimes(1)
  })
})

describe("proxy — matcher omija pliki PWA i statyczne", () => {
  const wzorzec = new RegExp(`^${config.matcher[0]}$`)
  it.each(["/sw.js", "/manifest.webmanifest", "/_next/static/chunk.js", "/ikona.png", "/maskotki-bob/a.webp", "/favicon.ico"])(
    "%s nie przechodzi przez bramkę (niezalogowana przeglądarka musi pobrać Service Worker)",
    (p) => expect(wzorzec.test(p)).toBe(false),
  )
  it.each(["/", "/kalkulatory/tor-slonca", "/auth/login", "/ustawienia"])("%s przechodzi przez proxy", (p) =>
    expect(wzorzec.test(p)).toBe(true),
  )
})

describe("trasa /auth/callback", () => {
  const wywolaj = (qs: string) => callbackGet(req(`/auth/callback${qs}`))

  it("poprawny kod → wymiana na sesję i powrót na bezpieczną ścieżkę", async () => {
    sesja.exchangeCodeForSession.mockResolvedValue({ error: null })
    const res = await wywolaj("?code=abc&next=%2Fustawienia")
    expect(sesja.exchangeCodeForSession).toHaveBeenCalledWith("abc")
    expect(res.headers.get("location")).toBe(`${ORIGIN}/ustawienia`)
  })

  it("brak parametru next → strona główna", async () => {
    sesja.exchangeCodeForSession.mockResolvedValue({ error: null })
    const res = await wywolaj("?code=abc")
    expect(res.headers.get("location")).toBe(`${ORIGIN}/`)
  })

  it.each(["//evil.example", "https://evil.example", "javascript:alert(1)", "evil"])(
    "next=%s (open redirect) → strona główna, nigdy obcy host",
    async (next) => {
      sesja.exchangeCodeForSession.mockResolvedValue({ error: null })
      const res = await wywolaj(`?code=abc&next=${encodeURIComponent(next)}`)
      expect(res.headers.get("location")).toBe(`${ORIGIN}/`)
    },
  )

  it("błąd wymiany kodu → ekran logowania z komunikatem", async () => {
    sesja.exchangeCodeForSession.mockResolvedValue({ error: { message: "expired" } })
    const res = await wywolaj("?code=zly")
    expect(res.headers.get("location")).toBe(`${ORIGIN}/auth/login?error=logowanie-nie-powiodlo-sie`)
  })

  it("brak kodu → ekran logowania, usługa nie jest pytana", async () => {
    const res = await wywolaj("")
    expect(sesja.exchangeCodeForSession).not.toHaveBeenCalled()
    expect(res.headers.get("location")).toBe(`${ORIGIN}/auth/login?error=logowanie-nie-powiodlo-sie`)
  })
})

describe("akcje logowania", () => {
  it("link e-mail: pusty adres nie woła usługi", async () => {
    const fd = new FormData()
    fd.set("email", "   ")
    expect(await signInWithMagicLink(ORIGIN, "/", fd)).toEqual({ error: expect.any(String) })
    expect(sesja.signInWithOtp).not.toHaveBeenCalled()
  })

  it("link e-mail: wysyła z adresem powrotnym przez /auth/callback i bezpiecznym next", async () => {
    sesja.signInWithOtp.mockResolvedValue({ error: null })
    const fd = new FormData()
    fd.set("email", " jan@example.com ")
    expect(await signInWithMagicLink(ORIGIN, "//evil.example", fd)).toEqual({ sent: true })
    expect(sesja.signInWithOtp).toHaveBeenCalledWith({
      email: "jan@example.com",
      options: { emailRedirectTo: `${ORIGIN}/auth/callback?next=%2F` },
    })
  })

  it("link e-mail: błąd usługi wraca jako błąd, bez 'sent'", async () => {
    sesja.signInWithOtp.mockResolvedValue({ error: { message: "rate limit" } })
    const fd = new FormData()
    fd.set("email", "jan@example.com")
    const wynik = await signInWithMagicLink(ORIGIN, "/", fd)
    expect(wynik).toHaveProperty("error")
    expect(wynik).not.toHaveProperty("sent")
  })

  it.each([
    ["google", signInWithGoogle],
    ["apple", signInWithApple],
  ] as const)("%s: przekierowuje na adres dostawcy z poprawnym powrotem", async (provider, akcja) => {
    sesja.signInWithOAuth.mockResolvedValue({ data: { url: `https://${provider}.example/oauth` }, error: null })
    await expect(akcja(ORIGIN, "/ustawienia")).rejects.toThrow(`NEXT_REDIRECT:https://${provider}.example/oauth`)
    expect(sesja.signInWithOAuth).toHaveBeenCalledWith({
      provider,
      options: { redirectTo: `${ORIGIN}/auth/callback?next=%2Fustawienia` },
    })
  })

  it.each([
    ["google", signInWithGoogle],
    ["apple", signInWithApple],
  ] as const)("%s: dostawca nieskonfigurowany → błąd zamiast przekierowania", async (provider, akcja) => {
    sesja.signInWithOAuth.mockResolvedValue({ data: { url: null }, error: null })
    expect(await akcja(ORIGIN, "/")).toEqual({ error: expect.any(String) })
    expect(redirectMock).not.toHaveBeenCalled()
    expect(provider).toBeTruthy()
  })

  it("wylogowanie kończy sesję i wraca na ekran logowania", async () => {
    sesja.signOut.mockResolvedValue({ error: null })
    await expect(signOut()).rejects.toThrow("NEXT_REDIRECT:/auth/login")
    expect(sesja.signOut).toHaveBeenCalledTimes(1)
  })
})
