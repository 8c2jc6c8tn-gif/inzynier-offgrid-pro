"use client"

import Link from "next/link"
import { EtykietaEkranu } from "@/components/tekst-rejestru"
import { useTranslate } from "@/lib/i18n/language-context"
import { ekranyWidoczneDlaObiektu } from "@/lib/obiekt/ukrywanie-dla-kampera"
import { useRodzajObiektu } from "@/lib/obiekt/use-rodzaj-obiektu"
import { znajdzKafel } from "@/lib/pulpit/registry"

/** Screens of a module; for a camper the building screens are left out and a short note says so (they still open from the search). */
export function ListaEkranowModulu({ kafelId }: { kafelId: number }) {
  const t = useTranslate()
  const rodzaj = useRodzajObiektu()
  const kafel = znajdzKafel(kafelId)
  if (!kafel) return null
  const widoczne = ekranyWidoczneDlaObiektu(kafel.ekrany, rodzaj)
  return (
    <>
      <ul className="flex flex-col gap-2">
        {widoczne.map((ekran) => (
          <li key={ekran.href}>
            <Link
              href={ekran.href}
              className="flex min-h-11 items-center justify-between rounded-md border p-3 text-small font-medium transition-colors hover:border-foreground/20 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <EtykietaEkranu kafel={kafel} ekran={ekran} />
              <span aria-hidden="true" className="text-muted-foreground">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {widoczne.length < kafel.ekrany.length && (
        <p className="text-small text-muted-foreground">
          {t("UI-OBIEKT-UKRYTO-EKRANY")}{" "}
          <Link href="/ustawienia" className="underline">
            {t("UI-OBIEKT-UKRYTO-USTAWIENIA")}
          </Link>
        </p>
      )}
    </>
  )
}
