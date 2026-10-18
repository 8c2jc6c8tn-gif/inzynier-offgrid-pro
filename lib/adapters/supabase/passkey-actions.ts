"use server"

/**
 * Klucze dostępu (passkey, WebAuthn) — dodatkowa metoda logowania obok magic linku/Google/Apple
 * (docs/standards/18-logowanie.md, 18.2; decyzja D89). Weryfikacją i trzymaniem kluczy publicznych
 * zajmuje się Supabase Auth (18.4) — tu nie ma własnej kryptografii ani własnej tabeli kluczy.
 *
 * Dwuetapowy interfejs `auth.passkey.*` jest wołany WYŁĄCZNIE po stronie serwera, a okno systemowe
 * (twarz / odcisk palca) otwiera przeglądarka osobno (`passkey-przegladarka.ts`). Dzięki temu nadal
 * nie ma klienta Supabase w przeglądarce, a sesja po zalogowaniu kluczem ląduje w `HttpOnly`
 * cookie, tak jak przy magic linku (18.5, `sessionCookieOptions()`).
 *
 * Rejestracja klucza wymaga już zalogowanego konta (inna metoda przy pierwszym logowaniu): klucz
 * jest więc dodatkiem do konta, nie osobnym sposobem jego założenia.
 */
import { redirect } from "next/navigation"
import { z } from "zod"
import type { VerifyPasskeyAuthenticationParams, VerifyPasskeyRegistrationParams } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "./server"
import { isSupabaseConfigured } from "./config"
import { safeNextPath } from "./safe-redirect"

type OpcjeWebAuthn = Record<string, unknown>

export type WynikBledu = { errorKey: string }

export type KluczDostepu = {
  id: string
  nazwa: string | null
  utworzono: string
  ostatnieUzycie: string | null
}

const NIESKONFIGUROWANE: WynikBledu = { errorKey: "UI-BLAD-PASSKEY-NIESKONFIGUROWANE" }

// Odpowiedź przeglądarki (`PublicKeyCredential.toJSON()`) jest nieufnym wejściem: sprawdzamy tylko
// kształt koperty, a kryptograficzną ważność ocenia serwer Supabase Auth.
const identyfikatorWyzwania = z.string().min(1).max(200)
const odpowiedzPrzegladarki = z
  .object({ id: z.string().min(1).max(1024), type: z.literal("public-key") })
  .passthrough()
const identyfikatorKlucza = z.string().uuid()

/** Mapuje błąd Supabase Auth na klucz tłumaczenia; szczegóły techniczne nie trafiają do użytkownika. */
function kluczBledu(error: { code?: string } | null | undefined, domyslny: string): string {
  switch (error?.code) {
    case "too_many_passkeys":
      return "UI-BLAD-PASSKEY-LIMIT"
    case "passkey_not_enabled":
    case "feature_disabled":
      return "UI-BLAD-PASSKEY-WYLACZONE"
    default:
      return domyslny
  }
}

export async function rozpocznijLogowanieKluczem(): Promise<
  { challengeId: string; options: OpcjeWebAuthn } | WynikBledu
> {
  if (!isSupabaseConfigured()) return NIESKONFIGUROWANE

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.passkey.startAuthentication()
  if (error || !data) return { errorKey: kluczBledu(error, "UI-BLAD-PASSKEY-LOGOWANIE") }

  return { challengeId: data.challenge_id, options: data.options as unknown as OpcjeWebAuthn }
}

/**
 * Sukces kończy się `redirect()` (jak przy logowaniu Google/Apple) — cookie sesji zapisane przez
 * `@supabase/ssr` w tej samej odpowiedzi, więc następne żądanie jest już zalogowane. Błąd wraca
 * jako klucz tłumaczenia. `next` przechodzi przez `safeNextPath` (18.2, open redirect).
 */
export async function zakonczLogowanieKluczem(
  challengeId: unknown,
  credential: unknown,
  next: string,
): Promise<WynikBledu | void> {
  if (!isSupabaseConfigured()) return NIESKONFIGUROWANE

  const id = identyfikatorWyzwania.safeParse(challengeId)
  const odpowiedz = odpowiedzPrzegladarki.safeParse(credential)
  if (!id.success || !odpowiedz.success) return { errorKey: "UI-BLAD-PASSKEY-LOGOWANIE" }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.passkey.verifyAuthentication({
    challengeId: id.data,
    credential: odpowiedz.data as unknown as VerifyPasskeyAuthenticationParams["credential"],
  })
  if (error || !data?.session) return { errorKey: kluczBledu(error, "UI-BLAD-PASSKEY-LOGOWANIE") }

  redirect(safeNextPath(next))
}

export async function rozpocznijRejestracjeKlucza(): Promise<
  { challengeId: string; options: OpcjeWebAuthn } | WynikBledu
> {
  if (!isSupabaseConfigured()) return NIESKONFIGUROWANE

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.passkey.startRegistration()
  if (error || !data) return { errorKey: kluczBledu(error, "UI-BLAD-PASSKEY-REJESTRACJA") }

  return { challengeId: data.challenge_id, options: data.options as unknown as OpcjeWebAuthn }
}

export async function zakonczRejestracjeKlucza(
  challengeId: unknown,
  credential: unknown,
): Promise<{ ok: true } | WynikBledu> {
  if (!isSupabaseConfigured()) return NIESKONFIGUROWANE

  const id = identyfikatorWyzwania.safeParse(challengeId)
  const odpowiedz = odpowiedzPrzegladarki.safeParse(credential)
  if (!id.success || !odpowiedz.success) return { errorKey: "UI-BLAD-PASSKEY-REJESTRACJA" }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.passkey.verifyRegistration({
    challengeId: id.data,
    credential: odpowiedz.data as unknown as VerifyPasskeyRegistrationParams["credential"],
  })
  if (error) return { errorKey: kluczBledu(error, "UI-BLAD-PASSKEY-REJESTRACJA") }

  return { ok: true }
}

export async function pobierzKlucze(): Promise<{ klucze: KluczDostepu[] } | WynikBledu> {
  if (!isSupabaseConfigured()) return NIESKONFIGUROWANE

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.passkey.list()
  if (error || !data) return { errorKey: kluczBledu(error, "UI-BLAD-PASSKEY-LISTA") }

  return {
    klucze: data.map((k) => ({
      id: k.id,
      nazwa: k.friendly_name ?? null,
      utworzono: k.created_at,
      ostatnieUzycie: k.last_used_at ?? null,
    })),
  }
}

export async function usunKlucz(passkeyId: unknown): Promise<{ ok: true } | WynikBledu> {
  if (!isSupabaseConfigured()) return NIESKONFIGUROWANE

  const id = identyfikatorKlucza.safeParse(passkeyId)
  if (!id.success) return { errorKey: "UI-BLAD-PASSKEY-USUWANIE" }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.passkey.delete({ passkeyId: id.data })
  if (error) return { errorKey: kluczBledu(error, "UI-BLAD-PASSKEY-USUWANIE") }

  return { ok: true }
}
