"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { KAFLE, USTAWIENIA_KAFEL, znajdzKafel } from "@/lib/pulpit/registry"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/pulpit/storage"

export default function PulpitPage() {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const widoczneKafle = stan.order
    .filter((id) => !stan.hiddenIds.includes(id))
    .map((id) => znajdzKafel(id))
    .filter((k): k is NonNullable<typeof k> => k !== undefined)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          ☰ Inżynier Offgrid Pro
        </span>
        <nav className="flex items-center gap-4">
          <Link href="/moduly/1" className="hover:underline">
            📍 Lokalizacja i teren
          </Link>
          <Link href="/moduly/13" className="hover:underline">
            📡 Tryb Live
          </Link>
          <Link href={USTAWIENIA_KAFEL.href} className="hover:underline">
            {USTAWIENIA_KAFEL.ikona} Ustawienia
          </Link>
          <span className="text-muted-foreground" title="Brak powiadomień">
            🔔
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Pulpit</h1>
          <p className="text-sm text-muted-foreground">
            {widoczneKafle.length} z {KAFLE.length} modułów widocznych.{" "}
            <Link href={USTAWIENIA_KAFEL.href} className="underline">
              Skonfiguruj pulpit
            </Link>
          </p>
        </div>

        {widoczneKafle.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Wszystkie kafle są ukryte.{" "}
            <Link href={USTAWIENIA_KAFEL.href} className="underline">
              Przywróć domyślne w ustawieniach
            </Link>
            .
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {widoczneKafle.map((kafel) => (
              <li key={kafel.id}>
                <Link
                  href={`/moduly/${kafel.id}`}
                  className="flex min-h-28 flex-col justify-between gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
                >
                  <span className="text-2xl">{kafel.ikona}</span>
                  <span className="text-sm font-medium leading-tight">{kafel.nazwa}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
