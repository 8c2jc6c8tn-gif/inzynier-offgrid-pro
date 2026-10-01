"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { FormularzRachunku } from "@/components/siec/formularz-rachunku"
import { useTranslate } from "@/lib/i18n/language-context"

export default function RachunekDomPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/rachunek-dom" />
      <NaglowekEkranu tytul={t("UI-RACDOM-MOJ-RACHUNEK-DZIS")} ekran="rachunek-dom">
        {t("UI-RACDOM-CZEGO-SKLADA-RACHUNEK")}
      </NaglowekEkranu>
      <FormularzRachunku segment="dom" />
    </main>
  )
}
