"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranKabliMalejInstalacji } from "@/components/wzorce/ekran-kabli-malej-instalacji"
import { useTranslate } from "@/lib/i18n/language-context"

export default function KableBezpiecznikiKamperPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kable-bezpieczniki-kamper" />
      <NaglowekEkranu tytul={t("UI-KABBEZKAM-KABLE-BEZPIECZNIKI-KAMPERZE")} ekran="kable-bezpieczniki-kamper">{t("UI-KABBEZKAM-POJEZDZIE-PRAD-PLYNIE")}</NaglowekEkranu>
      <EkranKabliMalejInstalacji kluczSzkicu="kable-bezpieczniki-kamper" pojazd={true} />
    </main>
  )
}
