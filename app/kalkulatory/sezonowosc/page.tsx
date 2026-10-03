"use client"

import { useMemo } from "react"
import { calculateSezonowosc } from "@/lib/core/modules/zapotrzebowanie/sezonowosc/calculator"
import type { TypSezonowosci } from "@/lib/core/modules/zapotrzebowanie/sezonowosc/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const ETYKIETY_TYPU: Record<TypSezonowosci, string> = {
  caloroczny: "UI-SEZ-CALOROCZNY",
  sezonowy: "UI-SEZ-SEZONOWY-TYLKO-WYBRANYCH",
  weekendowy: "UI-SEZ-WEEKENDOWY",
}

type FormularzStan = {
  zapotrzebowanieKwhDoba: string
  typ: TypSezonowosci
  miesiacOd: string
  miesiacDo: string
  aktualnyMiesiac: string
  czyWeekend: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieKwhDoba: "",
  typ: "caloroczny",
  miesiacOd: "",
  miesiacDo: "",
  aktualnyMiesiac: "",
  czyWeekend: false,
}

export default function SezonowoscPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("sezonowosc", STAN_POCZATKOWY)
  const { zapotrzebowanieKwhDoba, typ, miesiacOd, miesiacDo, aktualnyMiesiac, czyWeekend } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieKwhDoba = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieKwhDoba", a)
  const setTyp = (a: TypSezonowosci | ((p: TypSezonowosci) => TypSezonowosci)) => setPole("typ", a)
  const setMiesiacOd = (a: string | ((p: string) => string)) => setPole("miesiacOd", a)
  const setMiesiacDo = (a: string | ((p: string) => string)) => setPole("miesiacDo", a)
  const setAktualnyMiesiac = (a: string | ((p: string) => string)) => setPole("aktualnyMiesiac", a)
  const setCzyWeekend = (a: boolean | ((p: boolean) => boolean)) => setPole("czyWeekend", a)

  const result = useMemo(
    () =>
      calculateSezonowosc({
        zapotrzebowanieKwhDoba: zapotrzebowanieKwhDoba === "" ? 0 : Number(zapotrzebowanieKwhDoba),
        typ,
        miesiacOd: miesiacOd === "" ? 0 : Number(miesiacOd),
        miesiacDo: miesiacDo === "" ? 0 : Number(miesiacDo),
        aktualnyMiesiac: aktualnyMiesiac === "" ? 0 : Number(aktualnyMiesiac),
        czyWeekend,
      }),
    [zapotrzebowanieKwhDoba, typ, miesiacOd, miesiacDo, aktualnyMiesiac, czyWeekend],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sezonowosc" />
      <NaglowekEkranu tytul={t("UI-SEZ-SEZONOWOSC-TRYB-WAKACYJNY")} ekran="sezonowosc" wynik={result}>
        {t("UI-SEZ-KAZDE-URZADZENIE-PRACUJE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-SEZ-ZAPOTRZEBOWANIE-URZADZENIA-O")}
          unit={t("UI-J-KWH-DOBA")}
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieKwhDoba}
          onChange={(e) => setZapotrzebowanieKwhDoba(e.target.value)}
          pomoc={<PomocPola ekran="sezonowosc" pole="energia" />}
        />
        <PoleSelect
          label={t("UI-SEZ-TYP-SEZONOWOSCI")}
          value={typ}
          onChange={(e) => setTyp(e.target.value as TypSezonowosci)}
          pomoc={<PomocPola ekran="sezonowosc" pole="typ" />}
        >
          {(Object.keys(ETYKIETY_TYPU) as TypSezonowosci[]).map((typSez) => (
            <option key={typSez} value={typSez}>
              {t(ETYKIETY_TYPU[typSez])}
            </option>
          ))}
        </PoleSelect>

        {typ === "sezonowy" && (
          <>
            <Pole
              label={t("UI-SEZ-MIESIAC-POCZATKU-SEZONU")}
              unit="1-12"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              value={miesiacOd}
              onChange={(e) => setMiesiacOd(e.target.value)}
              pomoc={<PomocPola ekran="sezonowosc" pole="miesiacOd" />}
            />
            <Pole
              label={t("UI-SEZ-MIESIAC-KONCA-SEZONU")}
              unit="1-12"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              value={miesiacDo}
              onChange={(e) => setMiesiacDo(e.target.value)}
              pomoc={<PomocPola ekran="sezonowosc" pole="miesiacDo" />}
            />
            <Pole
              label={t("UI-SEZ-SPRAWDZANY-MIESIAC")}
              unit="1-12"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              value={aktualnyMiesiac}
              onChange={(e) => setAktualnyMiesiac(e.target.value)}
              pomoc={<PomocPola ekran="sezonowosc" pole="miesiac" />}
            />
          </>
        )}

        {typ === "weekendowy" && (
          <PoleCheckbox
            id="czy-weekend"
            label={t("UI-SEZ-SPRAWDZANY-DZIEN-WEEKEND")}
            checked={czyWeekend}
            onChange={(e) => setCzyWeekend(e.target.checked)}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-SEZ-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-SEZ-SPRAWDZ-WPISANE-DANE")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={result.value.aktywne ? t("UI-SEZ-AKTYWNE-TYM-OKRESIE") : t("UI-SEZ-NIEAKTYWNE-TYM-OKRESIE")}>
          <WynikGlowny>{t("UI-SEZ-KWH-DOBE", { zapotrzebowanieWliczoneKwhDoba: result.value.zapotrzebowanieWliczoneKwhDoba.toFixed(2) })}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
