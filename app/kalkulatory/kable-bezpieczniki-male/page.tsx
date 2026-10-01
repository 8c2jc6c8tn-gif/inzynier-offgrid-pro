"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranKabliMalejInstalacji } from "@/components/wzorce/ekran-kabli-malej-instalacji"
import { useTranslate } from "@/lib/i18n/language-context"

export default function KableBezpiecznikiMalePage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kable-bezpieczniki-male" />
      <NaglowekEkranu tytul={t("UI-KABBEZMAL-KABEL-BEZPIECZNIK-MALEJ")} ekran="kable-bezpieczniki-male">{t("UI-KABBEZMAL-NAWET-MALY-ZESTAW")}</NaglowekEkranu>
      <EkranKabliMalejInstalacji kluczSzkicu="kable-bezpieczniki-male" pojazd={false} />
    </main>
  )
}
