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

const STAN_POCZATKOWY = stanPoczatkowyKatalogu("interfejs-lokalny")

export default function KatalogInterfejsuLokalnegoPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<KatalogKomponentowStan>("katalog-interfejsu-lokalnego", STAN_POCZATKOWY)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/katalog-interfejsu-lokalnego" />
      <NaglowekEkranu tytul={t("UI-M9-K4-TYTUL")} ekran="katalog-interfejsu-lokalnego">
        {t("UI-M9-K4-OPIS")}
      </NaglowekEkranu>
      <KatalogKomponentow katalog="interfejs-lokalny" stan={stan} setStan={setStan} />
    </main>
  )
}
