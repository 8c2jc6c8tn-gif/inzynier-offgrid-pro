"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { signInWithApple, signInWithGoogle, signInWithMagicLink } from "./actions"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * docs/standards/18-logowanie.md, 18.2 — trzej równorzędni dostawcy: magic link e-mail
 * (passwordless), Google, Apple. Żadnego pola hasła — magic link eliminuje "reset hasła"
 * jako kategorię w ogóle.
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
