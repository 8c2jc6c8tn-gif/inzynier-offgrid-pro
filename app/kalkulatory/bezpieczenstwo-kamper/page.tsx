"use client"

import { calculateBezpieczenstwoKamper } from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/calculator"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranChecklistyChemii } from "@/components/wzorce/ekran-checklisty-chemii"
import { useTranslate } from "@/lib/i18n/language-context"

export default function BezpieczenstwoKamperPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bezpieczenstwo-kamper" />
      <NaglowekEkranu tytul={t("UI-BEZKAM-BEZPIECZENSTWO-KAMPERZE")} ekran="bezpieczenstwo-kamper">{t("UI-BEZKAM-AKUMULATOR-CIEZKI-NIEBEZPIEC")}</NaglowekEkranu>
      <EkranChecklistyChemii kluczSzkicu="bezpieczenstwo-kamper" oblicz={calculateBezpieczenstwoKamper} etykietaGotowe={t("UI-BEZKAM-AKUMULATOR-BEZPIECZNIE-ZAMON")} />
    </main>
  )
}
