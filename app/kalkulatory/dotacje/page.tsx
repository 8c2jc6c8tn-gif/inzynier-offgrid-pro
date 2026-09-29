"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaDotacji } from "@/components/siec/lista-dotacji"
import { useTranslate } from "@/lib/i18n/language-context"

export default function DotacjePage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dotacje" />
      <NaglowekEkranu tytul={t("UI-DOT-TYTUL")} ekran="dotacje">
        {t("UI-DOT-OPIS")}
      </NaglowekEkranu>
      <ListaDotacji segment="dom" />
      <p className="text-small text-muted-foreground">
        {t("UI-DOT-UWAGA-KOLEJNOSC")}
      </p>
    </main>
  )
}
