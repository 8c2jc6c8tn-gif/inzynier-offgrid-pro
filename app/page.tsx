"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { StanPusty } from "@/components/ui/stany"
import { KafleIkonySymbole } from "@/components/kafle-ikony/definicje-symboli"
import { KafelIkonaSvg, KAFLE_ZE_ZBUDOWANA_IKONA } from "@/components/kafle-ikony/ikona"
import { MASKOTKA_PO_ID_KAFLA } from "@/lib/pulpit/maskotki"
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
      <KafleIkonySymbole />
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-small">
        <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
          ☰ Inżynier Offgrid Pro
        </span>
        <nav className="flex items-center gap-1">
          <Link
            href="/moduly/1"
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            📍 Lokalizacja i teren
          </Link>
          <Link
            href="/moduly/13"
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            📡 Tryb Live
          </Link>
          <Link
            href={USTAWIENIA_KAFEL.href}
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {USTAWIENIA_KAFEL.ikona} Ustawienia
          </Link>
          <span
            className="px-1 text-muted-foreground"
            title="Brak powiadomień"
            aria-label="Brak powiadomień"
          >
            🔔
          </span>
          <ThemeToggle />
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-display font-semibold">Pulpit</h1>
          <p className="text-small text-muted-foreground">
            {widoczneKafle.length} z {KAFLE.length} modułów widocznych.{" "}
            <Link href={USTAWIENIA_KAFEL.href} className="underline decoration-muted-foreground/50 hover:decoration-foreground">
              Skonfiguruj pulpit
            </Link>
          </p>
        </div>

        {widoczneKafle.length === 0 ? (
          <StanPusty tytul="Wszystkie kafle są ukryte.">
            <Link href={USTAWIENIA_KAFEL.href} className="underline">
              Przywróć domyślne w ustawieniach
            </Link>
          </StanPusty>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {widoczneKafle.map((kafel) => (
              <li key={kafel.id}>
                <Link
                  href={`/moduly/${kafel.id}`}
                  className="flex min-h-28 flex-col justify-between gap-2 rounded-lg border p-4 transition-colors hover:border-foreground/20 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {MASKOTKA_PO_ID_KAFLA[kafel.id] ? (
                    <span className="block h-16 w-16 overflow-hidden rounded-md" aria-hidden="true">
                      <img
                        src={MASKOTKA_PO_ID_KAFLA[kafel.id]}
                        alt=""
                        className="h-full w-full object-cover object-top"
                      />
                    </span>
                  ) : KAFLE_ZE_ZBUDOWANA_IKONA.includes(kafel.id) ? (
                    <span className="block overflow-hidden rounded-md" aria-hidden="true">
                      <KafelIkonaSvg kafelId={kafel.id} />
                    </span>
                  ) : (
                    <span className="text-2xl" aria-hidden="true">
                      {kafel.ikona}
                    </span>
                  )}
                  <span className="text-small font-medium leading-tight">{kafel.nazwa}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
