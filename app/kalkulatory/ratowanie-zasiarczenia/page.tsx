"use client"

import { ZALECENIE } from "@/lib/core/modules/montaz-baterii/ratowanie-zasiarczenia/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function RatowanieZasiarczeniaPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ratowanie-zasiarczenia" />
      <NaglowekEkranu tytul={t("UI-RATZAS-RATOWANIE-ZASIARCZONEGO-AKUM")} ekran="ratowanie-zasiarczenia">
        {t("UI-RATZAS-DOTYCZY-AKUMULATORA-ZDIAGNOZ")}
      </NaglowekEkranu>

      <div className="rounded-lg border p-4 text-small">{ZALECENIE}</div>

      
    </main>
  )
}
