"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { signInWithApple, signInWithGoogle, signInWithMagicLink } from "./actions"
import { useTranslate } from "@/lib/i18n/language-context"
import { rozpocznijLogowanieKluczem, zakonczLogowanieKluczem } from "@/lib/adapters/supabase/passkey-actions"
import { potwierdzLogowanieKluczem, przegladarkaObslugujeKlucze } from "@/lib/adapters/supabase/passkey-przegladarka"

/**
 * docs/standards/18-logowanie.md, 18.2 — trzej równorzędni dostawcy: magic link e-mail
 * (passwordless), Google, Apple. Żadnego pola hasła — magic link eliminuje "reset hasła"
 * jako kategorię w ogóle. Do tego klucz dostępu (passkey, D89): twarz, odcisk palca albo PIN
 * urządzenia; przycisk pokazujemy tylko w przeglądarce, która go obsługuje, a klucz zakłada się
 * w Ustawieniach po pierwszym zalogowaniu inną metodą.
 *
 * `useSearchParams` wymaga granicy Suspense przy prerenderingu (Next.js) — LoginPage niżej
 * jest tylko tym wrapperem, cała treść żyje w LoginForm.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const t = useTranslate()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/"

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  // Wykrycie po zamontowaniu, żeby HTML z serwera i pierwszy render w przeglądarce były zgodne.
  const [kluczeDostepne, setKluczeDostepne] = useState(false)
  const [kluczBlad, setKluczBlad] = useState<string | null>(null)
  const [kluczTrwa, setKluczTrwa] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- wynik zależy od API przeglądarki, niedostępnego przy renderze serwerowym
    setKluczeDostepne(przegladarkaObslugujeKlucze())
  }, [])

  async function handlePasskey() {
    setKluczTrwa(true)
    setKluczBlad(null)
    const start = await rozpocznijLogowanieKluczem()
    if ("errorKey" in start) {
      setKluczBlad(start.errorKey)
      setKluczTrwa(false)
      return
    }
    const ceremonia = await potwierdzLogowanieKluczem(start.options)
    if (!ceremonia.ok) {
      setKluczBlad(ceremonia.errorKey)
      setKluczTrwa(false)
      return
    }
    // Sukces kończy się przekierowaniem z poziomu Server Action; wracamy tu tylko z błędem.
    const wynik = await zakonczLogowanieKluczem(start.challengeId, ceremonia.credential, next)
    if (wynik?.errorKey) setKluczBlad(wynik.errorKey)
    setKluczTrwa(false)
  }

  async function handleMagicLink(formData: FormData) {
    setStatus("sending")
    setError(null)
    const origin = window.location.origin
    const result = await signInWithMagicLink(origin, next, formData)
    if (result?.error) {
      setStatus("error")
      setError(result.error)
      return
    }
    setStatus("sent")
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 p-6">
      <NaglowekEkranu tytul={t("UI-LOG-ZALOGUJ")}>
        {t("UI-LOG-KONTO-WYMAGANE-PIERWSZEGO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        {kluczeDostepne && (
          <div className="flex flex-col gap-1">
            <Button size="lg" onClick={handlePasskey} disabled={kluczTrwa}>
              {kluczTrwa ? t("UI-LOG-KLUCZ-OCZEKIWANIE") : t("UI-LOG-ZALOGUJ-KLUCZEM")}
            </Button>
            {kluczBlad && <p className="text-small text-destructive">{t(kluczBlad)}</p>}
          </div>
        )}
        <Button
          variant="outline"
          size="lg"
          onClick={() => signInWithGoogle(window.location.origin, next)}
        >
          {t("UI-LOG-ZALOGUJ-GOOGLE")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => signInWithApple(window.location.origin, next)}
        >
          {t("UI-LOG-ZALOGUJ-APPLE")}
        </Button>
      </div>

      <div className="flex items-center gap-3 text-caption text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t("UI-LOG-ALBO-MAILEM-BEZ")}
        <span className="h-px flex-1 bg-border" />
      </div>

      {status === "sent" ? (
        <p className="text-small">
          {t("UI-LOG-SPRAWDZ-SKRZYNKE")} <strong>{email}</strong> {t("UI-LOG-WYSLALISMY-LINK-ZALOGOWANIA")}
        </p>
      ) : (
        <form action={handleMagicLink} className="flex flex-col gap-3">
          <Pole
            label={t("UI-LOG-ADRES-MAIL")}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-small text-destructive">{error}</p>}
          <Button type="submit" size="lg" disabled={status === "sending"}>
            {status === "sending" ? t("UI-LOG-WYSYLANIE") : t("UI-LOG-WYSLIJ-LINK-ZALOGOWANIA")}
          </Button>
        </form>
      )}
    </main>
  )
}
