"use client"

/**
 * „My project” card on the dashboard (owner decision 24.11.2026): the open project's name and its key numbers, missing ones as
 * „—”, with a link to the project list and comparison. Read-only — numbers get into the project from the screens' save bar.
 */
import Link from "next/link"
import { useFormatLiczby, useTranslate } from "@/lib/i18n/language-context"
import { useAktywnyProjekt, useListaProjektow, useWartosciProjektu } from "@/lib/projekt/use-projekt"
import { WIELKOSCI, type WielkoscId } from "@/lib/projekt/wielkosci"
import { nazwaProjektu } from "./nazwa-projektu"

const KLUCZOWE: WielkoscId[] = ["zapotrzebowanieDoboweKwh", "mocPvKwp", "pojemnoscUzytecznaKwh", "napiecieUkladuV", "mocFalownikaW", "temperaturaMinC"]

export function KartaProjektu() {
  const t = useTranslate()
  const f = useFormatLiczby()
  const lista = useListaProjektow()
  const projekt = useAktywnyProjekt()
  const wartosci = useWartosciProjektu(projekt?.id ?? null)
  if (!lista || !projekt) return null
  return (
    <section aria-label={t("UI-PRJ-KARTA-TYTUL")} data-karta className="mb-6 flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="mr-auto text-h3 font-semibold">
          {t("UI-PRJ-KARTA-TYTUL")}: {nazwaProjektu(projekt, lista, t)}
        </h2>
        <Link href="/projekty" className="text-small underline decoration-muted-foreground/50 hover:decoration-foreground">
          {t("UI-PRJ-KARTA-LINK")}
        </Link>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        {KLUCZOWE.map((id) => {
          const v = wartosci?.[id]?.v
          return (
            <div key={id} className="flex flex-col">
              <dt className="text-caption text-muted-foreground">{t(WIELKOSCI[id].etykieta)}</dt>
              <dd className="font-medium tabular-nums">{v === undefined ? "—" : `${f(Number(v), { maximumFractionDigits: 3 })} ${WIELKOSCI[id].jednostka}`.trim()}</dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
