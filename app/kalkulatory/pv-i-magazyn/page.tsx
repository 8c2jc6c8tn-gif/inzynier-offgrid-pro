"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranPvMagazynu } from "@/components/siec/pv-magazyn"
import { useTranslate } from "@/lib/i18n/language-context"

export default function PvIMagazynPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pv-i-magazyn" />
      <NaglowekEkranu tytul={t("UI-PVD-TYTUL")} ekran="pv-i-magazyn">
        {t("UI-PVD-OPIS")}
      </NaglowekEkranu>
      <EkranPvMagazynu segment="dom" />
    </main>
  )
}
