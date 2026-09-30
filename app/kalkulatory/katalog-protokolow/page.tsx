"use client"

import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import {
  KatalogKomponentow,
  stanPoczatkowyKatalogu,
  type KatalogKomponentowStan,
} from "@/components/wzorce/katalog-komponentow"
import { useTranslate } from "@/lib/i18n/language-context"

const STAN_POCZATKOWY = stanPoczatkowyKatalogu("protokoly")

export default function KatalogProtokolowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<KatalogKomponentowStan>("katalog-protokolow", STAN_POCZATKOWY)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/katalog-protokolow" />
      <NaglowekEkranu tytul={t("UI-M9-K3-TYTUL")} ekran="katalog-protokolow">
        {t("UI-M9-K3-OPIS")}
      </NaglowekEkranu>
      <KatalogKomponentow katalog="protokoly" stan={stan} setStan={setStan} />
    </main>
  )
}
