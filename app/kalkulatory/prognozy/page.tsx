"use client"

import { calculatePrognozy } from "@/lib/core/modules/ai/prognozy/calculator"
import { SAMPLE_PROGNOZA_24H } from "@/lib/core/modules/ai/prognozy/constants"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import { useTranslate } from "@/lib/i18n/language-context"

// Client Component: screen text goes through useTranslate() (D58) — the language lives in the
// browser (docs/standards/17-i18n.md 17.4, offline-first correction), so the server cannot render it.
export default function PrognozyPage() {
  const t = useTranslate()
  const result = calculatePrognozy(SAMPLE_PROGNOZA_24H)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/prognozy" />
      <NaglowekEkranu tytul={t("UI-PRO-PROGNOZY")} ekran="prognozy" wynik={result}>
        {t("UI-PRO-POGODA-SYSTEMU-ENERGETYCZNEG")}
      </NaglowekEkranu>

      <WerdyktPanel poziom="ok">
        <p className="mt-1 text-h1 font-semibold">
          {t("UI-PRO-BILANS-DOBOWY-KWH", { bilansKwh: result.value.bilansKwh.toFixed(1) })}
        </p>
        <p className="mt-1 text-small">
          {t("UI-PRO-PRODUKCJA-KWH-ZUZYCIE", { produkcjaLacznaKwh: result.value.produkcjaLacznaKwh.toFixed(1), zuzycieLaczneKwh: result.value.zuzycieLaczneKwh.toFixed(1), godzinaSzczytuZuzycia: result.value.godzinaSzczytuZuzycia })}
        </p>
      </WerdyktPanel>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-small">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-2 font-medium">{t("UI-PRO-GODZINA")}</th>
              <th className="p-2 font-medium">{t("UI-PRO-PRODUKCJA")}</th>
              <th className="p-2 font-medium">{t("UI-PRO-ZUZYCIE")}</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_PROGNOZA_24H.map((p) => (
              <tr key={p.godzina} className="border-b last:border-0">
                <td className="p-2">{p.godzina}:00</td>
                <td className="p-2">{p.produkcjaKw.toFixed(1)}</td>
                <td className="p-2">{p.zuzycieKw.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ZalozeniaLista assumptions={result.assumptions} />
    </main>
  )
}
