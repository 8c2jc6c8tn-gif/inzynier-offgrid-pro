"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaFaq } from "@/components/siec/lista-faq"
import { FAQ_FIRMA } from "@/components/siec/tresci-faq"
import { useTranslate } from "@/lib/i18n/language-context"

export default function FaqFirmaPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/faq-firma" />
      <NaglowekEkranu tytul={t("UI-FAQ-FIRMA-TYTUL")} ekran="faq-firma">
        {t("UI-FAQ-FIRMA-OPIS")}
      </NaglowekEkranu>
      <ListaFaq pytania={FAQ_FIRMA} />
    </main>
  )
}
