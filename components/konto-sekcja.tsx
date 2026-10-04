"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getAccountStatus } from "@/lib/adapters/supabase/get-account-status"
import { deleteAccount } from "@/lib/adapters/supabase/delete-account"
import { signOut } from "@/app/auth/signout/actions"
import { isSupabaseConfigured } from "@/lib/adapters/supabase/config"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * docs/standards/18-logowanie.md — widoczny status konta w Ustawieniach. Renderuje się na coś
 * tylko, gdy Supabase jest realnie skonfigurowany (`.env.local`) — inaczej apka jeszcze nie ma
 * konceptu "zalogowany", więc nie pokazujemy sekcji, która nic nie mogłaby zrobić.
 *
 * Status konta czytany przez Server Action (`getAccountStatus`), nie klienta przeglądarkowego —
 * ten projekt świadomie nie ma `createBrowserClient` (18.5, patrz `lib/adapters/supabase/config.ts`,
 * `sessionCookieOptions()`).
 */
export function KontoSekcja() {
  const t = useTranslate()
  const configured = isSupabaseConfigured()
  const [email, setEmail] = useState<string | null>(null)
  const [wczytano, setWczytano] = useState(!configured)

  useEffect(() => {
    if (!configured) return
    getAccountStatus().then(({ email }) => {
      setEmail(email)
      setWczytano(true)
    })
  }, [configured])

  if (!configured) return null
  if (!wczytano) return null

  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4">
      <h2 className="text-small font-semibold uppercase tracking-wide text-muted-foreground">{t("UI-KONSEK-KONTO")}</h2>
      {email ? (
        <>
          <p className="text-small">{t("UI-KONSEK-ZALOGOWANO-JAKO", { email })}</p>
          <div className="flex flex-wrap gap-2">
            <form action={signOut}>
              <Button type="submit" variant="outline">
                {t("UI-KONSEK-WYLOGUJ")}
              </Button>
            </form>
            <UsunKontoPrzycisk />
          </div>
        </>
      ) : (
        <p className="text-small text-muted-foreground">{t("UI-KONSEK-NIEZALOGOWANO")}</p>
      )}
    </section>
  )
}

/**
 * 18.8 — prawdziwy DELETE, nieodwracalny. Potwierdzenie przez `window.confirm` (proporcjonalne do
 * dzisiejszej skali apki — bez realnych kluczy service role i tak zawsze kończy się komunikatem
 * błędu, patrz `lib/adapters/supabase/delete-account.ts`).
 */
function UsunKontoPrzycisk() {
  const t = useTranslate()
  const [usuwam, setUsuwam] = useState(false)
  const [blad, setBlad] = useState<string | null>(null)

  async function usun() {
    if (!window.confirm(t("UI-KONSEK-PEWNO-CHCESZ-TRWALE"))) return
    setUsuwam(true)
    setBlad(null)
    const wynik = await deleteAccount()
    if (wynik?.errorKey || wynik?.error) {
      setBlad(wynik.errorKey ? t(wynik.errorKey) : (wynik.error ?? null))
      setUsuwam(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="destructive" onClick={usun} disabled={usuwam}>
        {usuwam ? t("UI-KONSEK-USUWANIE") : t("UI-KONSEK-USUN-KONTO")}
      </Button>
      {blad && <p className="text-small text-destructive">{blad}</p>}
    </div>
  )
}
