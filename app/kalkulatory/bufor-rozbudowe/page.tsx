"use client"

import { useMemo } from "react"
import { calculateBuforRozbudowy } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/calculator"
import { OPCJE_BUFORA_PCT } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/constants"
import type { BuforRozbudowyInput } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  zapotrzebowanieCalkowiteKwh: string
  buforPct: BuforRozbudowyInput["buforPct"]
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieCalkowiteKwh: "",
  buforPct: 0,
}

export default function BuforRozbudowyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bufor-rozbudowe", STAN_POCZATKOWY)
  const { zapotrzebowanieCalkowiteKwh, buforPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieCalkowiteKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieCalkowiteKwh", a)
  const setBuforPct = (
    a: BuforRozbudowyInput["buforPct"] | ((p: BuforRozbudowyInput["buforPct"]) => BuforRozbudowyInput["buforPct"]),
  ) => setPole("buforPct", a)

  const result = useMemo(
    () =>
      calculateBuforRozbudowy({
        zapotrzebowanieCalkowiteKwh: zapotrzebowanieCalkowiteKwh === "" ? 0 : Number(zapotrzebowanieCalkowiteKwh),
        buforPct,
      }),
    [zapotrzebowanieCalkowiteKwh, buforPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bufor-rozbudowe" />
      <NaglowekEkranu tytul={t("UI-BUFROZ-BUFOR-ROZBUDOWE")} ekran="bufor-rozbudowe" wynik={result}>
        {t("UI-BUFROZ-PROJEKTUJAC-SYSTEM-TYLKO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-BUFROZ-CALKOWITE-ZAPOTRZEBOWANIE-DO")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={zapotrzebowanieCalkowiteKwh}
          onChange={(e) => setZapotrzebowanieCalkowiteKwh(e.target.value)}
          pomoc={<PomocPola ekran="bufor-rozbudowe" pole="zapotrzebowanie" />}
        />
        <PoleSelect
          label={t("UI-BUFROZ-BUFOR-ROZBUDOWE")}
          value={buforPct}
          onChange={(e) => setBuforPct(Number(e.target.value) as BuforRozbudowyInput["buforPct"])}
          pomoc={<PomocPola ekran="bufor-rozbudowe" pole="bufor" params={{ opcje: OPCJE_BUFORA_PCT.join(", ") }} />}
        >
          {OPCJE_BUFORA_PCT.map((opcja) => (
            <option key={opcja} value={opcja}>
              {opcja}%
            </option>
          ))}
        </PoleSelect>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-BUFROZ-WPISZ-CALKOWITE-ZAPOTRZEBOWA")}
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-BUFROZ-ZAPOTRZEBOWANIE-MOZE-BYC")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-BUFROZ-ZAPOTRZEBOWANIE-BUFOREM")}>
          <WynikGlowny>
            {t("UI-BUFROZ-KWH-DOBE", { zapotrzebowanieZBuforemKwh: result.value.zapotrzebowanieZBuforemKwh.toLocaleString("pl-PL", { maximumFractionDigits: 1 }) })}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
