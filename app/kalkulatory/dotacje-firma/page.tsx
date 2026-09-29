"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaDotacji } from "@/components/siec/lista-dotacji"
import { useTranslate } from "@/lib/i18n/language-context"

export default function DotacjeFirmaPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dotacje-firma" />
      <NaglowekEkranu tytul={t("UI-DOT-FIRMA-TYTUL")} ekran="dotacje-firma">
        {t("UI-DOT-FIRMA-OPIS")}
      </NaglowekEkranu>
      <ListaDotacji segment="firma" />
      <section className="flex flex-col gap-2 rounded-lg border p-3">
        <h2 className="font-semibold">{t("UI-DOT-PODATKI")}</h2>
        <p className="text-small">
          {t("UI-DOT-PODATKI-OPIS")}
        </p>
      </section>
    </main>
  )
}
