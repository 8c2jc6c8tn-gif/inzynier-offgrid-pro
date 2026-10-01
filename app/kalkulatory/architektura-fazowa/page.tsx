"use client"

import { useMemo } from "react"
import { calculateArchitekturaFazowa } from "@/lib/core/modules/zapotrzebowanie/architektura-fazowa/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  mocL1W: string
  mocL2W: string
  mocL3W: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocL1W: "",
  mocL2W: "",
  mocL3W: "",
}

export default function ArchitekturaFazowaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("architektura-fazowa", STAN_POCZATKOWY)
  const { mocL1W, mocL2W, mocL3W } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocL1W = (a: string | ((p: string) => string)) => setPole("mocL1W", a)
  const setMocL2W = (a: string | ((p: string) => string)) => setPole("mocL2W", a)
  const setMocL3W = (a: string | ((p: string) => string)) => setPole("mocL3W", a)

  const result = useMemo(
    () =>
      calculateArchitekturaFazowa({
        mocL1W: mocL1W === "" ? 0 : Number(mocL1W),
        mocL2W: mocL2W === "" ? 0 : Number(mocL2W),
        mocL3W: mocL3W === "" ? 0 : Number(mocL3W),
      }),
    [mocL1W, mocL2W, mocL3W],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/architektura-fazowa" />
      <NaglowekEkranu tytul={t("UI-ARCFAZ-ARCHITEKTURA-FAZOWA-FAZOWA")} ekran="architektura-fazowa" wynik={result}>
        {t("UI-ARCFAZ-SYSTEMIE-FAZOWYM-LICZY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-ARCFAZ-OBCIAZENIE")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL1W}
          onChange={(e) => setMocL1W(e.target.value)}
          pomoc={<PomocPola ekran="architektura-fazowa" pole="l1" />}
        />
        <Pole
          label={t("UI-ARCFAZ-OBCIAZENIE-2")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL2W}
          onChange={(e) => setMocL2W(e.target.value)}
          pomoc={<PomocPola ekran="architektura-fazowa" pole="l2" />}
        />
        <Pole
          label={t("UI-ARCFAZ-OBCIAZENIE-3")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL3W}
          onChange={(e) => setMocL3W(e.target.value)}
          pomoc={<PomocPola ekran="architektura-fazowa" pole="l3" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-ARCFAZ-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-ARCFAZ-WPISZ-OBCIAZENIE-PRZYNAJMNIE")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-ARCFAZ-ROZKLAD-OBCIAZENIA-FAZ")}>
          <p className="text-h1 font-semibold">{t("UI-ARCFAZ-LACZNIE", { sumaW: result.value.sumaW.toFixed(0) })}</p>
          <p className="mt-1 text-small text-muted-foreground">
            {t("UI-ARCFAZ-NAJBARDZIEJ-OBCIAZONA-FAZA", { maxFazaW: result.value.maxFazaW.toFixed(0), minFazaW: result.value.minFazaW.toFixed(0), asymetriaPct: result.value.asymetriaPct.toFixed(1) })}
          </p>
          <p className="mt-2 text-small text-muted-foreground">
            {t("UI-ARCFAZ-ZRODLO-PODAJE-LICZBOWEGO")}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
