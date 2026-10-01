"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownywarkaTaryf } from "@/components/siec/porownywarka-taryf"
import { useTranslate } from "@/lib/i18n/language-context"

export default function TaryfyCPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/taryfy-c" />
      <NaglowekEkranu tytul={t("UI-TARC-POROWNYWARKA-TARYF")} ekran="taryfy-c">
        {t("UI-TARC-ROCZNY-KOSZT-TARYFACH")}
      </NaglowekEkranu>
      <PorownywarkaTaryf segment="firma" />
    </main>
  )
}
