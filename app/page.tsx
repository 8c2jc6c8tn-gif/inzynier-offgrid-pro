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
import { useTranslate } from "@/lib/i18n/language-context"
import { NazwaKafla, OpisKafla } from "@/components/tekst-rejestru"

export default function PulpitPage() {
  const t = useTranslate()
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const widoczneKafle = stan.order
    .filter((id) => !stan.hiddenIds.includes(id))
    .map((id) => znajdzKafel(id))
    .filter((k): k is NonNullable<typeof k> => k !== undefined)

  return (
    // data-pulpit: the only screen where an appearance style's background may move (D67, Płynny gradient).
    <div data-pulpit className="min-h-screen bg-background text-foreground">
      <KafleIkonySymbole />
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-small">
        <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
          {t("UI-PUL-INZYNIER-OFFGRID-PRO")}
        </span>
        <nav className="flex items-center gap-1">
          <Link
            href="/moduly/1"
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {t("UI-PUL-LOKALIZACJA-TEREN")}
          </Link>
          <Link
            href="/moduly/13"
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {t("UI-PUL-TRYB-LIVE")}
          </Link>
          <Link
            href={USTAWIENIA_KAFEL.href}
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {t("UI-PUL-USTAWIENIA", { ikona: USTAWIENIA_KAFEL.ikona })}
          </Link>
          <span
            className="px-1 text-muted-foreground"
            title={t("UI-PUL-BRAK-POWIADOMIEN")}
            aria-label={t("UI-PUL-BRAK-POWIADOMIEN")}
          >
            🔔
          </span>
          <ThemeToggle />
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-display font-semibold">{t("UI-PUL-PULPIT")}</h1>
          <p className="text-small text-muted-foreground">
            {t("UI-PUL-MODULOW-WIDOCZNYCH", { length: widoczneKafle.length, length2: KAFLE.length })}{" "}
            <Link href={USTAWIENIA_KAFEL.href} className="underline decoration-muted-foreground/50 hover:decoration-foreground">
              {t("UI-PUL-SKONFIGURUJ-PULPIT")}
            </Link>
          </p>
        </div>

        {widoczneKafle.length === 0 ? (
          <StanPusty tytul={t("UI-PUL-WSZYSTKIE-KAFLE-UKRYTE")}>
            <Link href={USTAWIENIA_KAFEL.href} className="underline">
              {t("UI-PUL-PRZYWROC-DOMYSLNE-USTAWIENIA")}
            </Link>
          </StanPusty>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {widoczneKafle.map((kafel) => (
              <li key={kafel.id} className={kafel.duzy ? "col-span-2" : undefined}>
                <Link
                  href={`/moduly/${kafel.id}`}
                  data-karta
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
                  <span className="text-small font-medium leading-tight"><NazwaKafla kafel={kafel} /></span>
                  {kafel.duzy ? <span className="text-caption text-muted-foreground"><OpisKafla kafel={kafel} /></span> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
