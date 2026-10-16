"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { StanPusty } from "@/components/ui/stany"
import { KafleIkonySymbole } from "@/components/kafle-ikony/definicje-symboli"
import { KafelIkonaSvg, KAFLE_ZE_ZBUDOWANA_IKONA } from "@/components/kafle-ikony/ikona"
import { tierKafla } from "@/lib/dostep/tier"
import { MASKOTKA_PO_ID_KAFLA } from "@/lib/pulpit/maskotki"
import { KAFLE, USTAWIENIA_KAFEL, znajdzKafel, type KafelEntry } from "@/lib/pulpit/registry"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/pulpit/storage"
import { useTranslate } from "@/lib/i18n/language-context"
import { NazwaKafla } from "@/components/tekst-rejestru"

/** Kafel 14 (Ustawienia): zawsze widoczny jako ostatni w siatce, poza kolejnością i ukrywaniem (D85). */
const USTAWIENIA_WPIS: KafelEntry = {
  id: USTAWIENIA_KAFEL.id,
  nazwa: USTAWIENIA_KAFEL.nazwa,
  opis: "",
  ikona: USTAWIENIA_KAFEL.ikona,
  ekrany: [],
}

const KAFLE_SIECI = [15, 16]

export default function PulpitPage() {
  const t = useTranslate()
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const widoczneKafle = stan.order
    .filter((id) => !stan.hiddenIds.includes(id))
    .map((id) => znajdzKafel(id))
    .filter((k): k is NonNullable<typeof k> => k !== undefined)
  // Tiles 15/16 (Dom – sieć, Firma – sieć) form their own group below a separator; Settings closes the main group (D85, D86).
  const kafleSieci = widoczneKafle.filter((k) => KAFLE_SIECI.includes(k.id))
  const kafleGlowne = [...widoczneKafle.filter((k) => !KAFLE_SIECI.includes(k.id)), USTAWIENIA_WPIS]

  const renderKafel = (kafel: KafelEntry) => (
    <li key={kafel.id}>
      <Link
        href={kafel.id === USTAWIENIA_KAFEL.id ? USTAWIENIA_KAFEL.href : `/moduly/${kafel.id}`}
        data-karta
        className="flex h-full min-h-28 flex-col items-center justify-start gap-1.5 rounded-lg border p-2.5 text-center transition-colors hover:border-foreground/20 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {MASKOTKA_PO_ID_KAFLA[kafel.id] ? (
          <span className="block aspect-square w-full max-w-(--ikona-kafel) overflow-hidden rounded-md" aria-hidden="true">
            <img
              src={MASKOTKA_PO_ID_KAFLA[kafel.id]}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </span>
        ) : KAFLE_ZE_ZBUDOWANA_IKONA.includes(kafel.id) ? (
          <span className="block w-full max-w-(--ikona-kafel) overflow-hidden rounded-md" aria-hidden="true">
            <KafelIkonaSvg kafelId={kafel.id} />
          </span>
        ) : (
          <span className="text-2xl" aria-hidden="true">
            {kafel.ikona}
          </span>
        )}
        {/* Stałe pole na dwie linie: ikony w rzędzie zawsze na jednej wysokości, krótka nazwa centruje się w polu (D83). */}
        <span className="flex min-h-[2.5em] items-center justify-center text-small font-medium leading-tight">
          {kafel.id === USTAWIENIA_KAFEL.id ? t("UI-PUL-USTAWIENIA-KAFEL") : <NazwaKafla kafel={kafel} />}
        </span>
        {tierKafla(kafel.id) === "PRO" ? (
          <span
            className="rounded border px-1.5 text-caption font-medium text-muted-foreground"
            title={t("UI-PUL-PLAKIETKA-PRO-OPIS")}
          >
            {t("UI-PUL-PLAKIETKA-PRO")}
          </span>
        ) : null}
      </Link>
    </li>
  )

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
          <>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{kafleGlowne.map(renderKafel)}</ul>
            {kafleSieci.length > 0 ? (
              <>
                <div className="pulpit-separator" role="separator" />
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{kafleSieci.map(renderKafel)}</ul>
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  )
}
