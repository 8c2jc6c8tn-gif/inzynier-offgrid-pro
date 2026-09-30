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

const STAN_POCZATKOWY = stanPoczatkowyKatalogu("aktuatory")

export default function KatalogAktuatorowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<KatalogKomponentowStan>("katalog-aktuatorow", STAN_POCZATKOWY)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/katalog-aktuatorow" />
      <NaglowekEkranu tytul={t("UI-M9-K2-TYTUL")} ekran="katalog-aktuatorow">
        {t("UI-M9-K2-OPIS")}
      </NaglowekEkranu>
      <KatalogKomponentow katalog="aktuatory" stan={stan} setStan={setStan} />
    </main>
  )
}
