/**
 * Strona przeglądarkowa kluczy dostępu (WebAuthn): otwiera systemowe okno (twarz, odcisk palca, PIN
 * urządzenia albo klucz sprzętowy) i zwraca odpowiedź w postaci JSON, gotową do wysłania do
 * Server Action (`passkey-actions.ts`). Plik nie importuje żadnego klienta Supabase — 18.5.
 *
 * Używa wyłącznie natywnych metod JSON z WebAuthn poziomu 3 (`parse…OptionsFromJSON`, `toJSON`),
 * więc nie zawiera własnej konwersji base64url. Przeglądarka bez nich traktowana jest jak
 * nieobsługująca kluczy dostępu (zostaje logowanie linkiem e-mail albo Google/Apple).
 */

export type WynikCeremonii =
  | { ok: true; credential: unknown }
  | { ok: false; errorKey: "UI-BLAD-PASSKEY-NIEOBSLUGIWANE" | "UI-BLAD-PASSKEY-ANULOWANO" | "UI-BLAD-PASSKEY-CEREMONIA" }

type PublicKeyCredentialStatyczne = {
  parseRequestOptionsFromJSON?: (opcje: unknown) => PublicKeyCredentialRequestOptions
  parseCreationOptionsFromJSON?: (opcje: unknown) => PublicKeyCredentialCreationOptions
}

function interfejsKluczy(): PublicKeyCredentialStatyczne | null {
  if (typeof window === "undefined" || typeof navigator === "undefined") return null
  if (typeof PublicKeyCredential === "undefined" || !navigator.credentials) return null
  return PublicKeyCredential as unknown as PublicKeyCredentialStatyczne
}

export function przegladarkaObslugujeKlucze(): boolean {
  const api = interfejsKluczy()
  return Boolean(api?.parseRequestOptionsFromJSON && api.parseCreationOptionsFromJSON)
}

/** Anulowanie okna przez użytkownika (albo brak zgody) to `NotAllowedError` — nie jest awarią. */
function bladCeremonii(e: unknown): WynikCeremonii {
  const nazwa = e instanceof DOMException ? e.name : ""
  if (nazwa === "NotAllowedError" || nazwa === "AbortError") {
    return { ok: false, errorKey: "UI-BLAD-PASSKEY-ANULOWANO" }
  }
  return { ok: false, errorKey: "UI-BLAD-PASSKEY-CEREMONIA" }
}

export async function potwierdzLogowanieKluczem(opcje: unknown): Promise<WynikCeremonii> {
  const api = interfejsKluczy()
  if (!api?.parseRequestOptionsFromJSON) return { ok: false, errorKey: "UI-BLAD-PASSKEY-NIEOBSLUGIWANE" }
  try {
    const publicKey = api.parseRequestOptionsFromJSON(opcje)
    const wynik = await navigator.credentials.get({ publicKey })
    if (!wynik) return { ok: false, errorKey: "UI-BLAD-PASSKEY-ANULOWANO" }
    return { ok: true, credential: (wynik as PublicKeyCredential).toJSON() }
  } catch (e) {
    return bladCeremonii(e)
  }
}

export async function utworzKluczNaUrzadzeniu(opcje: unknown): Promise<WynikCeremonii> {
  const api = interfejsKluczy()
  if (!api?.parseCreationOptionsFromJSON) return { ok: false, errorKey: "UI-BLAD-PASSKEY-NIEOBSLUGIWANE" }
  try {
    const publicKey = api.parseCreationOptionsFromJSON(opcje)
    const wynik = await navigator.credentials.create({ publicKey })
    if (!wynik) return { ok: false, errorKey: "UI-BLAD-PASSKEY-ANULOWANO" }
    return { ok: true, credential: (wynik as PublicKeyCredential).toJSON() }
  } catch (e) {
    return bladCeremonii(e)
  }
}
