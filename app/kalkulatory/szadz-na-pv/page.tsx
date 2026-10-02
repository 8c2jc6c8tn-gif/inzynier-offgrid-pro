"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateOsadNaPv } from "@/lib/core/modules/stress-test/osad-na-pv/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaProdukcjiIWlasne,
  SekcjaCoZTymZrobic,
  STAN_OSADU,
  TabelaCoJesli,
  wejscieOsaduZeStanu,
  type StanOsadu,
} from "@/components/wzorce/osad-na-pv"

const r2 = (x: number) => Math.round(x * 100) / 100

/** Ekran 14, Moduł 7 — rime case of the shared deposit engine (Screen 7). */
export default function SzadzNaPvPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<StanOsadu>("szadz-na-pv", STAN_OSADU)

  const result = useMemo(
    () => calculateOsadNaPv({ ...wejscieOsaduZeStanu(stan), rodzaj: "szadz", katDeg: null, nierownoStringi: false }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szadz-na-pv" />
      <NaglowekEkranu tytul={t("UI-M7-SZADZ-TYTUL")} ekran="szadz-na-pv" wynik={result}>
        {t("UI-M7-SZADZ-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PolaProdukcjiIWlasne ekran="szadz-na-pv" stan={stan} setStan={setStan} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-OSAD-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-SZADZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-M7-OSAD-W-UWAGA")}>
          <WynikGlowny>{t("UI-M7-OSAD-WYNIK", { kwh: r2(v.utrataNaDobeKwh) })}</WynikGlowny>
          <TabelaCoJesli wynik={result} szadz />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <SekcjaCoZTymZrobic ekran="szadz-na-pv" stan={stan} setStan={setStan} wynik={result} />

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/snieg-na-pv" className="text-small underline">
          {t("UI-M7-OSAD-TYTUL")} →
        </Link>
        <Link href="/kalkulatory/blackout" className="text-small underline">
          {t("UI-M7-OSAD-LINK-BLACKOUT")}
        </Link>
      </div>
    </main>
  )
}
