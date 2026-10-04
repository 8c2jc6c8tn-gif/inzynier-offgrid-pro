"use client"

import { useMemo } from "react"
import { calculateSprawnoscInwertera } from "@/lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"
import { PROG_NISKIEGO_OBCIAZENIA_PCT, ZAKRES_OPTYMALNY_MAX_PCT, ZAKRES_OPTYMALNY_MIN_PCT } from "@/lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie/constants"

type FormularzStan = {
  zapotrzebowanieW: string
  mocFalownikaW: string
  sprawnoscPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieW: "",
  mocFalownikaW: "",
  sprawnoscPct: "",
}

export default function SprawnoscInwerteraPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("sprawnosc-inwertera-niskie-obciazenie", STAN_POCZATKOWY)
  const { zapotrzebowanieW, mocFalownikaW, sprawnoscPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieW = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieW", a)
  const setMocFalownikaW = (a: string | ((p: string) => string)) => setPole("mocFalownikaW", a)
  const setSprawnoscPct = (a: string | ((p: string) => string)) => setPole("sprawnoscPct", a)

  const result = useMemo(
    () =>
      calculateSprawnoscInwertera({
        zapotrzebowanieW: zapotrzebowanieW === "" ? 0 : Number(zapotrzebowanieW),
        mocFalownikaW: mocFalownikaW === "" ? 0 : Number(mocFalownikaW),
        sprawnoscPct: sprawnoscPct === "" ? 0 : Number(sprawnoscPct),
      }),
    [zapotrzebowanieW, mocFalownikaW, sprawnoscPct],
  )

  const poziom = result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sprawnosc-inwertera-niskie-obciazenie" />
      <NaglowekEkranu
        tytul={t("UI-SPRINWNISOBC-SPRAWNOSC-INWERTERA-NISKIM")}
        ekran="sprawnosc-inwertera-niskie-obciazenie"
        wynik={result}
        parametry={{ prog: PROG_NISKIEGO_OBCIAZENIA_PCT, optMin: ZAKRES_OPTYMALNY_MIN_PCT, optMax: ZAKRES_OPTYMALNY_MAX_PCT }}
      >
        {t("UI-SPRINWNISOBC-DUZY-FALOWNIK-WZGLEDEM")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-SPRINWNISOBC-BIEZACE-ZAPOTRZEBOWANIE")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieW}
          onChange={(e) => setZapotrzebowanieW(e.target.value)}
          pomoc={<PomocPola ekran="sprawnosc-inwertera-niskie-obciazenie" pole="zapotrzebowanie" />}
        />
        <Pole
          label={t("UI-SPRINWNISOBC-ZNAMIONOWA-MOC-FALOWNIKA")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocFalownikaW}
          onChange={(e) => setMocFalownikaW(e.target.value)}
          pomoc={<PomocPola ekran="sprawnosc-inwertera-niskie-obciazenie" pole="mocFalownika" />}
        />
        <Pole
          label={t("UI-SPRINWNISOBC-SPRAWNOSC-FALOWNIKA-TYM")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscPct}
          onChange={(e) => setSprawnoscPct(e.target.value)}
          pomoc={<PomocPola ekran="sprawnosc-inwertera-niskie-obciazenie" pole="sprawnosc" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-SPRINWNISOBC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-SPRINWNISOBC-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-SPRINWNISOBC-RZECZYWISTE-ZUZYCIE-BATERII")}>
          <WynikGlowny>{result.value.realneZuzycieW.toFixed(0)} W</WynikGlowny>
          <p className="mt-1 text-small text-muted-foreground">
            {t("UI-SPRINWNISOBC-OBCIAZENIE-FALOWNIKA-STRATA", { obciazenieFalownikaPct: result.value.obciazenieFalownikaPct.toFixed(1), strataPct: result.value.strataPct.toFixed(1) })}
          </p>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
