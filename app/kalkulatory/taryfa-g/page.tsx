"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownywarkaTaryf } from "@/components/siec/porownywarka-taryf"
import { useTranslate } from "@/lib/i18n/language-context"

export default function TaryfaGPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/taryfa-g" />
      <NaglowekEkranu tytul={t("UI-TARG-KTORA-TARYFA")} ekran="taryfa-g">
        {t("UI-TARG-POROWNAJ-ROCZNY-KOSZT")}
      </NaglowekEkranu>
      <PorownywarkaTaryf segment="dom" />
    </main>
  )
}
