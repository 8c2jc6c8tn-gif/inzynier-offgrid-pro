"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { FormularzRachunku } from "@/components/siec/formularz-rachunku"
import { stawkiDoPomocy } from "@/components/siec/wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

export default function RachunekFirmaPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/rachunek-firma" />
      <NaglowekEkranu tytul={t("UI-RACFIR-MOJ-RACHUNEK-DZIS")} ekran="rachunek-firma" parametry={stawkiDoPomocy()}>
        {t("UI-RACFIR-RACHUNEK-FIRMY-NISKIM")}
      </NaglowekEkranu>
      <FormularzRachunku segment="firma" />
    </main>
  )
}
