"use client"

import { useMemo } from "react"
import { calculateGrzalkiDachowe } from "@/lib/core/modules/stress-test/grzalki-dachowe/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  dlugoscKablaM: string
  mocNaMetrW: string
  godzinyPracyNaDobe: string
  mocPompyCieplaW: string
  zapasMocyW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dlugoscKablaM: "",
  mocNaMetrW: "",
  godzinyPracyNaDobe: "",
  mocPompyCieplaW: "",
  zapasMocyW: "",
}

const liczba = (v: string) => (v === "" ? null : Number(v))

export default function GrzalkiDachowePage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const f2 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("grzalki-dachowe", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateGrzalkiDachowe({
        dlugoscKablaM: liczba(stan.dlugoscKablaM),
        mocNaMetrW: liczba(stan.mocNaMetrW),
        godzinyPracyNaDobe: liczba(stan.godzinyPracyNaDobe),
        mocPompyCieplaW: liczba(stan.mocPompyCieplaW),
        zapasMocyW: liczba(stan.zapasMocyW),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/grzalki-dachowe" />
      <NaglowekEkranu tytul={t("UI-GRZDAC-GRZALKI-DACHOWE-RYNNOWE")} ekran="grzalki-dachowe" wynik={result}>
        {t("UI-GRZDAC-ILE-MOCY-ENERGII")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-GRZDAC-LACZNA-DLUGOSC-KABLA")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.dlugoscKablaM}
          onChange={ustaw("dlugoscKablaM")}
          pomoc={<PomocPola ekran="grzalki-dachowe" pole="dlugosc" />}
        />
        <Pole
          label={t("UI-GRZDAC-MOC-KABLA-METR")}
          unit="W/m"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocNaMetrW}
          onChange={ustaw("mocNaMetrW")}
          pomoc={<PomocPola ekran="grzalki-dachowe" pole="mocNaMetr" />}
        />
        <Pole
          label={t("UI-GRZDAC-CZAS-PRACY-DOBE")}
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={stan.godzinyPracyNaDobe}
          onChange={ustaw("godzinyPracyNaDobe")}
          pomoc={<PomocPola ekran="grzalki-dachowe" pole="czas" />}
        />
        <Pole
          label={t("UI-GRZDAC-MOC-ELEKTRYCZNA-POMPY")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocPompyCieplaW}
          onChange={ustaw("mocPompyCieplaW")}
          pomoc={<PomocPola ekran="grzalki-dachowe" pole="mocPompy" />}
        />
        <Pole
          label={t("UI-GRZDAC-WOLNY-ZAPAS-MOCY")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zapasMocyW}
          onChange={ustaw("zapasMocyW")}
          pomoc={<PomocPola ekran="grzalki-dachowe" pole="zapasFalownika" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-GRZDAC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-GRZDAC-WPISZ-DLUGOSC-KABLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasWarning ? "uwaga" : "ok"}
          etykieta={hasWarning ? t("UI-GRZDAC-GRZALKI-MOCNO-OBCIAZA") : t("UI-GRZDAC-OBCIAZENIE-GRZALEK")}
        >
          <WynikGlowny>{f0(result.value.mocW)} W</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-GRZDAC-KWH-DOBE-PRACY", { energiaKwhDoba: f2(result.value.energiaKwhDoba) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
