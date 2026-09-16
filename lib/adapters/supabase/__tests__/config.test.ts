import { afterEach, describe, expect, it, vi } from "vitest"
import {
  isServiceRoleConfigured,
  isSupabaseConfigured,
  sessionCookieOptions,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "../config"

const ORIGINAL_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
})

describe("isSupabaseConfigured", () => {
  it("false gdy brak zmiennych", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(isSupabaseConfigured()).toBe(false)
  })

  it("false dla placeholdera z .env.example", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://TWOJ-PROJEKT.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "twoj-anon-key"
    expect(isSupabaseConfigured()).toBe(false)
  })

  it("true dla realnie wypełnionych wartości", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abcdefgh.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "realny-klucz"
    expect(isSupabaseConfigured()).toBe(true)
  })
})

describe("isServiceRoleConfigured", () => {
  it("false gdy brak zmiennej", () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    expect(isServiceRoleConfigured()).toBe(false)
  })

  it("false dla placeholdera z .env.example", () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "twoj-service-role-key"
    expect(isServiceRoleConfigured()).toBe(false)
  })

  it("true dla realnie wypełnionej wartości", () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "realny-klucz-service-role"
    expect(isServiceRoleConfigured()).toBe(true)
  })
})

describe("supabaseUrl / supabaseAnonKey / supabaseServiceRoleKey", () => {
  it("zwracają pusty string, gdy zmienna nie istnieje", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    expect(supabaseUrl()).toBe("")
    expect(supabaseAnonKey()).toBe("")
    expect(supabaseServiceRoleKey()).toBe("")
  })
})

describe("sessionCookieOptions", () => {
  it("httpOnly zawsze true (18.5)", () => {
    expect(sessionCookieOptions().httpOnly).toBe(true)
  })

  it("sameSite=lax (18.5)", () => {
    expect(sessionCookieOptions().sameSite).toBe("lax")
  })

  it("secure zależny od NODE_ENV (localhost bez HTTPS w dev)", () => {
    vi.stubEnv("NODE_ENV", "production")
    expect(sessionCookieOptions().secure).toBe(true)
    vi.stubEnv("NODE_ENV", "development")
    expect(sessionCookieOptions().secure).toBe(false)
    vi.unstubAllEnvs()
  })
})
