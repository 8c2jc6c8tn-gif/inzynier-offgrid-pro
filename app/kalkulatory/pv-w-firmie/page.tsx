"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranPvMagazynu } from "@/components/siec/pv-magazyn"
import { useTranslate } from "@/lib/i18n/language-context"

export default function PvWFirmiePage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pv-w-firmie" />
      <NaglowekEkranu tytul={t("UI-PVF-TYTUL")} ekran="pv-w-firmie">
        {t("UI-PVF-OPIS")}
      </NaglowekEkranu>
      <EkranPvMagazynu segment="firma" />
    </main>
  )
}
