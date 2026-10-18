"use client"

import { useMemo } from "react"
import { calculateTrybUproszczony } from "@/lib/core/modules/kalkulator-mobilny/tryb-uproszczony/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { Pole } from "@/components/ui/pole"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"
import { PomocPola } from "@/components/ui/pomoc"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscAh: string
  napiecieV: string
  mocOdbiornikaW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscAh: "100",
  napiecieV: "12",
  mocOdbiornikaW: "50",
}

export default function TrybUproszczonyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("tryb-uproszczony", STAN_POCZATKOWY)
  const { pojemnoscAh, napiecieV, mocOdbiornikaW } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscAh = (a: string | ((p: string) => string)) => setPole("pojemnoscAh", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)
  const setMocOdbiornikaW = (a: string | ((p: string) => string)) => setPole("mocOdbiornikaW", a)

  const result = useMemo(
    () =>
      calculateTrybUproszczony({
        pojemnoscAh: Number(pojemnoscAh),
        napiecieV: Number(napiecieV),
        mocOdbiornikaW: Number(mocOdbiornikaW),
      }),
    [pojemnoscAh, napiecieV, mocOdbiornikaW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tryb-uproszczony" />
      <NaglowekEkranu tytul={t("UI-TRYUPR-TRYB-UPROSZCZONY")} ekran="tryb-uproszczony" wynik={result}>
        {t("UI-TRYUPR-WEJSCIE-KOGOS-KTO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-TRYUPR-POJEMNOSC-AKUMULATORA")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
          pomoc={<PomocPola ekran="tryb-uproszczony" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-TRYUPR-NAPIECIE")}
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="tryb-uproszczony" pole="napiecie" />}
        />
        <NapiecieZProfilu aktualne={napiecieV} onUzyj={setNapiecieV} />
        <Pole
          label={t("UI-TRYUPR-MOC-ODBIORNIKA")}
          unit="W"
          type="number"
          inputMode="decimal"
          value={mocOdbiornikaW}
          onChange={(e) => setMocOdbiornikaW(e.target.value)}
          pomoc={<PomocPola ekran="tryb-uproszczony" pole="moc" />}
        />
      </div>

      <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "ok"}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">{t("UI-TRYUPR-POLICZYC-SPRAWDZ-DANE")}</p>
        ) : (
          <p className="mt-1 text-h1 font-semibold">
            {result.value.toFixed(1)} {result.unit}
          </p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-small opacity-90">
            {result.assumptions.map((a, i) => (
              <li key={typeof a === "string" ? a : a.kod + i}>{t("UI-TRYUPR-ZALOZENIE")} {typeof a === "string" ? a : t(a.kod, a.params)}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 font-mono text-caption opacity-70">{result.formulaKey ? t(result.formulaKey, result.formulaParams) : result.formula}</p>
      </WerdyktPanel>
    </main>
  )
}
