"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/adapters/supabase/client"
import { isSupabaseConfigured } from "@/lib/adapters/supabase/config"

/**
 * docs/standards/18-logowanie.md — widoczny status konta w Ustawieniach. Renderuje się na coś
 * tylko, gdy Supabase jest realnie skonfigurowany (`.env.local`) — inaczej apka jeszcze nie ma
 * konceptu "zalogowany", więc nie pokazujemy sekcji, która nic nie mogłaby zrobić.
 */
export function KontoSekcja() {
  const configured = isSupabaseConfigured()
  const [email, setEmail] = useState<string | null>(null)
  const [wczytano, setWczytano] = useState(!configured)

  useEffect(() => {
    if (!configured) return
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
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
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline">
              Wyloguj się
            </Button>
          </form>
        </>
      ) : (
        <p className="text-small text-muted-foreground">Niezalogowano.</p>
      )}
    </section>
  )
}
