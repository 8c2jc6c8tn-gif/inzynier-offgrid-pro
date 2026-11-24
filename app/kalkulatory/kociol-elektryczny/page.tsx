"use client"

import { useMemo } from "react"
import { calculateKociolElektryczny } from "@/lib/core/modules/ogrzewanie/kociol-elektryczny/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { RozbicieKwot, useSymbolWaluty } from "@/components/waluta-pola"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  zapotrzebowanieCieplneKwh: string
  copPompy: string
  cenaZaKwhZl: string
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieCieplneKwh: "",
  copPompy: "",
  cenaZaKwhZl: "",
}

export default function KociolElektrycznyPage() {
  const t = useTranslate()
  const symbol = useSymbolWaluty()
  const [stan, setStan, waluty] = usePersistedDraft<FormularzStan>("kociol-elektryczny", STAN_POCZATKOWY, { kwoty: ["cenaZaKwhZl"] })
  const { zapotrzebowanieCieplneKwh, copPompy, cenaZaKwhZl } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieCieplneKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieCieplneKwh", a)
  const setCopPompy = (a: string | ((p: string) => string)) => setPole("copPompy", a)
  const setCenaZaKwhZl = (a: string | ((p: string) => string)) => setPole("cenaZaKwhZl", a)

  // The price typed in another currency is converted to the working currency (NBP) for the calculator.
  const cenaRobocza = waluty.stanRoboczy.cenaZaKwhZl
  const wCeny = waluty.pole("cenaZaKwhZl")

  const result = useMemo(
    () =>
      calculateKociolElektryczny({
        zapotrzebowanieCieplneKwh: zapotrzebowanieCieplneKwh === "" ? 0 : Number(zapotrzebowanieCieplneKwh),
        copPompy: copPompy === "" ? 0 : Number(copPompy),
        cenaZaKwhZl: cenaRobocza === "" ? 0 : Number(cenaRobocza),
      }),
    [zapotrzebowanieCieplneKwh, copPompy, cenaRobocza],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kociol-elektryczny" />
      <NaglowekEkranu tytul={t("UI-KOCELE-KOCIOL-ELEKTRYCZNY-POMPA")} ekran="kociol-elektryczny" wynik={result}>
        {t("UI-KOCELE-KOCIOL-ELEKTRYCZNY-SPRAWNOSC")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-KOCELE-ZAPOTRZEBOWANIE-CIEPLO-POKRY")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieCieplneKwh}
          onChange={(e) => setZapotrzebowanieCieplneKwh(e.target.value)}
          pomoc={<PomocPola ekran="kociol-elektryczny" pole="zapotrzebowanie" />}
        />
        <Pole
          label={t("UI-KOCELE-COP-POMPY-CIEPLA")}
          unit="-"
          type="number"
          inputMode="decimal"
          min={0}
          value={copPompy}
          onChange={(e) => setCopPompy(e.target.value)}
          pomoc={<PomocPola ekran="kociol-elektryczny" pole="cop" />}
        />
        <Pole
          label={t("UI-KOCELE-CENA-ENERGII-ELEKTRYCZNEJ")}
          unit={t("UI-J-ZL-KWH", { waluta: symbol(wCeny.kod) })}
          type="number"
          inputMode="decimal"
          min={0}
          value={cenaZaKwhZl}
          waluta={wCeny}
          onChange={(e) => setCenaZaKwhZl(e.target.value)}
          pomoc={<PomocPola ekran="kociol-elektryczny" pole="cena" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-KOCELE-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-KOCELE-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-KOCELE-OSZCZEDNOSC-POMPY-CIEPLA")}>
          <WynikGlowny>{t("UI-KOCELE-ZL", { oszczednoscZl: result.value.oszczednoscZl.toFixed(2) })}</WynikGlowny>
          <p className="mt-2 text-small">
            {t("UI-KOCELE-POMPA-KWH-KOCIOL", { energiaPompyKwh: result.value.energiaPompyKwh.toFixed(1), kosztPompyZl: result.value.kosztPompyZl.toFixed(2), energiaKotlaKwh: result.value.energiaKotlaKwh.toFixed(1), kosztKotlaZl: result.value.kosztKotlaZl.toFixed(2), mnoznikZuzycia: result.value.mnoznikZuzycia.toFixed(1) })}
          </p>
          <RozbicieKwot rozbicie={waluty.rozbicie} />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
