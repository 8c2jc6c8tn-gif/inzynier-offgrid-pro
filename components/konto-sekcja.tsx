"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getAccountStatus } from "@/lib/adapters/supabase/get-account-status"
import { deleteAccount } from "@/lib/adapters/supabase/delete-account"
import { signOut } from "@/app/auth/signout/actions"
import { isSupabaseConfigured } from "@/lib/adapters/supabase/config"

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
      <h2 className="text-small font-semibold uppercase tracking-wide text-muted-foreground">Konto</h2>
      {email ? (
        <>
          <p className="text-small">Zalogowano jako {email}</p>
          <div className="flex flex-wrap gap-2">
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Wyloguj się
              </Button>
            </form>
            <UsunKontoPrzycisk />
          </div>
        </>
      ) : (
        <p className="text-small text-muted-foreground">Niezalogowano.</p>
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
  const [usuwam, setUsuwam] = useState(false)
  const [blad, setBlad] = useState<string | null>(null)

  async function usun() {
    if (!window.confirm("Na pewno chcesz trwale usunąć konto? Tej operacji nie można cofnąć.")) return
    setUsuwam(true)
    setBlad(null)
    const wynik = await deleteAccount()
    if (wynik?.error) {
      setBlad(wynik.error)
      setUsuwam(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="destructive" onClick={usun} disabled={usuwam}>
        {usuwam ? "Usuwanie…" : "Usuń konto"}
      </Button>
      {blad && <p className="text-small text-destructive">{blad}</p>}
    </div>
  )
}
