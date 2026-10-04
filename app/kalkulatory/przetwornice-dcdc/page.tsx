"use client"

import { useMemo } from "react"
import { calculatePrzetworniceDcdc } from "@/lib/core/modules/zapotrzebowanie/przetwornice-dcdc/calculator"
import { SPRAWNOSC_TYPOWA_MAX_PCT, SPRAWNOSC_TYPOWA_MIN_PCT } from "@/lib/core/modules/zapotrzebowanie/przetwornice-dcdc/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  zapotrzebowanieUrzadzeniaW: string
  zasilanieBezposrednie: boolean
  sprawnoscPrzetwornicyPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieUrzadzeniaW: "",
  zasilanieBezposrednie: false,
  sprawnoscPrzetwornicyPct: "",
}

export default function PrzetworniceDcdcPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("przetwornice-dcdc", STAN_POCZATKOWY)
  const { zapotrzebowanieUrzadzeniaW, zasilanieBezposrednie, sprawnoscPrzetwornicyPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieUrzadzeniaW = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieUrzadzeniaW", a)
  const setZasilanieBezposrednie = (a: boolean | ((p: boolean) => boolean)) => setPole("zasilanieBezposrednie", a)
  const setSprawnoscPrzetwornicyPct = (a: string | ((p: string) => string)) => setPole("sprawnoscPrzetwornicyPct", a)

  const result = useMemo(
    () =>
      calculatePrzetworniceDcdc({
        zapotrzebowanieUrzadzeniaW: zapotrzebowanieUrzadzeniaW === "" ? 0 : Number(zapotrzebowanieUrzadzeniaW),
        zasilanieBezposrednie,
        sprawnoscPrzetwornicyPct: sprawnoscPrzetwornicyPct === "" ? 0 : Number(sprawnoscPrzetwornicyPct),
      }),
    [zapotrzebowanieUrzadzeniaW, zasilanieBezposrednie, sprawnoscPrzetwornicyPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przetwornice-dcdc" />
      <NaglowekEkranu tytul={t("UI-PRZDCD-PRZETWORNICE")} ekran="przetwornice-dcdc" wynik={result}>
        {t("UI-PRZDCD-KAZDA-ZMIANA-NAPIECIA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-PRZDCD-ZAPOTRZEBOWANIE-MOCY-URZADZE")}
          unit="W"
          type="number"
          inputMode="decimal"
          value={zapotrzebowanieUrzadzeniaW}
          onChange={(e) => setZapotrzebowanieUrzadzeniaW(e.target.value)}
          pomoc={<PomocPola ekran="przetwornice-dcdc" pole="moc" />}
        />
        <PoleCheckbox
          id="zasilanie-bezposrednie"
          checked={zasilanieBezposrednie}
          onChange={(e) => setZasilanieBezposrednie(e.target.checked)}
          label={t("UI-PRZDCD-ZASILANIE-BEZPOSREDNIO-MAGIS")}
        />
        {!zasilanieBezposrednie && (
          <Pole
            label={t("UI-PRZDCD-SPRAWNOSC-PRZETWORNICY")}
            unit="%"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={sprawnoscPrzetwornicyPct}
            onChange={(e) => setSprawnoscPrzetwornicyPct(e.target.value)}
            pomoc={<PomocPola ekran="przetwornice-dcdc" pole="sprawnosc" params={{ min: SPRAWNOSC_TYPOWA_MIN_PCT, max: SPRAWNOSC_TYPOWA_MAX_PCT }} />}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-PRZDCD-WYPELNIJ-DANE-ZEBY")}
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PRZDCD-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-PRZDCD-REALNE-ZAPOTRZEBOWANIE-MOCY")}>
          <WynikGlowny>
            {result.value.zapotrzebowanieRealneW.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} W
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
