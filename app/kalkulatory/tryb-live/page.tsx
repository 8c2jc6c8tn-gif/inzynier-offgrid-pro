"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

export default function TrybLivePage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tryb-live" />
      <NaglowekEkranu tytul={t("UI-TRYLIV-TRYB-LIVE")} ekran="tryb-live">
        {t("UI-TRYLIV-PRZELACZNIK-MIEDZY-TRYBEM")}
      </NaglowekEkranu>

      <StanPusty tytul={t("UI-TRYLIV-BRAK-POLACZENIA-TELEMETRIA")}>
        <p>
          {t("UI-TRYLIV-TRYB-LIVE-CZERPIE")}
        </p>
      </StanPusty>

      <p className="text-small text-muted-foreground">
        {t("UI-TRYLIV-CZASU-PODLACZENIA-TELEMETRII")}
      </p>
    </main>
  )
}
