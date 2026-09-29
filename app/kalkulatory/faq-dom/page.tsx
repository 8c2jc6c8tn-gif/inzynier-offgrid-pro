"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaFaq } from "@/components/siec/lista-faq"
import { FAQ_DOM } from "@/components/siec/tresci-faq"
import { useTranslate } from "@/lib/i18n/language-context"

export default function FaqDomPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/faq-dom" />
      <NaglowekEkranu tytul={t("UI-FAQ-DOM-TYTUL")} ekran="faq-dom">
        {t("UI-FAQ-DOM-OPIS")}
      </NaglowekEkranu>
      <ListaFaq pytania={FAQ_DOM} />
    </main>
  )
}
