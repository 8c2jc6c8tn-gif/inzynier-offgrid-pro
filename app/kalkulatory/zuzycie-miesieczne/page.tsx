"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBilansMiesieczny } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  KLUCZE_MIESIECY,
  POCZATKOWY_ZUZYCIA,
  PolaZuzycia,
  type StanZuzycia,
  kluczZuzycia,
  zuzycieZeSzkicu,
} from "@/components/siec/zuzycie-miesieczne"
import { useTranslate } from "@/lib/i18n/language-context"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

/** M14 — D3 „Moje zużycie miesięcznie” (pochodny, Wzorzec D). Owner of `siec-zuzycie-dom`. */
export default function ZuzycieMiesiecznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<StanZuzycia>(kluczZuzycia("dom"), POCZATKOWY_ZUZYCIA)
  const zuzycie = zuzycieZeSzkicu(stan)
  // Echo of the balance without PV: shortfall = consumption, so the engine gives the sum, the winter part and the peak month.
  const result = useMemo(
    () =>
      zuzycie
        ? calculateBilansMiesieczny({
            tryb: "siec",
            zuzycieMiesieczneKwh: zuzycie,
            uzyskMiesiecznyKwhNaKwp: Array(12).fill(0),
            mocPvKwp: 0,
            autokonsumpcjaBezposrednia: null,
            pojemnoscMagazynuKwh: 0,
            sprawnoscMagazynu: null,
          })
        : null,
    [zuzycie],
  )
  const v = result?.value ?? null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zuzycie-miesieczne" />
      <NaglowekEkranu tytul={t("UI-ZUZ-TYTUL")} ekran="zuzycie-miesieczne">
        {t("UI-ZUZ-OPIS")}
      </NaglowekEkranu>
      <PolaZuzycia stan={stan} onChange={setStan} />
      <p className="text-small text-muted-foreground">
        {t("UI-ZUZ-FAKTURA")}
      </p>
      {!v || !result ? (
        <StanPusty tytul={t("UI-ZUZ-WPISZ-12")} />
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PV-SPRAWDZ-DANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-ZUZ-ROCZNE")}>
          <WynikGlowny>{t("UI-ZUZ-KWH-ROK", { kwh: f0(v.zuzycieRokKwh) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-ZUZ-NAJWIECEJ", {
              miesiac: v.najgorszyMiesiac === null ? "—" : t(KLUCZE_MIESIECY[v.najgorszyMiesiac]),
              zima: f0(v.niedoborZimaKwh),
              procent: Math.round((v.niedoborZimaKwh / v.zuzycieRokKwh) * 100),
            })}
          </p>
          <p className="mt-2 text-small">
            {t("UI-ZUZ-DALEJ")}{" "}
            <Link className="underline" href="/kalkulatory/rachunek-dom">
              {t("UI-ZUZ-L-RACHUNEK")}
            </Link>{" "}
            ·{" "}
            <Link className="underline" href="/kalkulatory/pv-i-magazyn">
              {t("UI-SIEC-LINK-PV-DOM")}
            </Link>
          </p>
        </WerdyktPanel>
      )}
    </main>
  )
}
