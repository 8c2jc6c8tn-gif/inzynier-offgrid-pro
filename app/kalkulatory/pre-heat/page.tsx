"use client"

import { useMemo } from "react"
import { calculatePreHeat } from "@/lib/core/modules/stress-test/pre-heat/calculator"
import type { PreHeatInput, ZrodloEnergiiPreHeat } from "@/lib/core/modules/stress-test/pre-heat/input"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type PoleLiczbowe = Exclude<keyof PreHeatInput, "zrodloEnergii">
type FormularzStan = Record<PoleLiczbowe, string> & { zrodloEnergii: ZrodloEnergiiPreHeat | "" }

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscCieplnaKwhK: "",
  podniesienieTempDomuK: "",
  stratyCieplaKw: "",
  pojemnoscBojleraL: "",
  podniesienieTempBojleraK: "",
  cop: "",
  zrodloEnergii: "",
  nadwyzkaPvKwh: "",
}

const POLA: { pole: PoleLiczbowe; label: string; unit: string }[] = [
  { pole: "pojemnoscCieplnaKwhK", label: "UI-PREHEA-POJEMNOSC-CIEPLNA-BUDYNKU", unit: "kWh/K" },
  { pole: "podniesienieTempDomuK", label: "UI-PREHEA-ILE-PODNIESC-TEMPERATURE", unit: "K" },
  { pole: "stratyCieplaKw", label: "UI-PREHEA-STRATY-CIEPLA-NADCHODZACYM", unit: "kW" },
  { pole: "pojemnoscBojleraL", label: "UI-PREHEA-POJEMNOSC-BOJLERA-OPCJONALNI", unit: "l" },
  { pole: "podniesienieTempBojleraK", label: "UI-PREHEA-ILE-PODGRZAC-BOJLER", unit: "K" },
  { pole: "cop", label: "UI-PREHEA-COP-OGRZEWANIA", unit: "" },
  { pole: "nadwyzkaPvKwh", label: "UI-PREHEA-NADWYZKA-DNIU-PRZED", unit: "kWh" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))

export default function PreHeatPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pre-heat", STAN_POCZATKOWY)
  const result = useMemo(() => {
    const { zrodloEnergii, ...liczby } = stan
    return calculatePreHeat({
      ...(Object.fromEntries(Object.entries(liczby).map(([k, v]) => [k, liczba(v)])) as Record<PoleLiczbowe, number | null>),
      zrodloEnergii: zrodloEnergii === "" ? null : zrodloEnergii,
    })
  }, [stan])
  const { cieploDomuKwh, cieploBojleraKwh, energiaElektrycznaKwh, buforGodzin } = result.value
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pre-heat" />
      <NaglowekEkranu
        tytul={t("UI-PREHEA-PRE-HEAT-CIEPLO")}
        ekran="pre-heat"
        wynik={result}
        parametry={{ kwhNaLK: WSPOLCZYNNIK_KWH_NA_L_K.toFixed(6) }}
      >
        {t("UI-PREHEA-LADUJ-CIEPLO-ZANIM")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={t(label)}
            unit={unit || undefined}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="pre-heat" pole={pole} />}
          />
        ))}
        <PoleSelect
          label={t("UI-PREHEA-SKAD-ENERGIA-PRZEGRZANIE")}
          value={stan.zrodloEnergii}
          onChange={(e) => setStan((prev) => ({ ...prev, zrodloEnergii: e.target.value as FormularzStan["zrodloEnergii"] }))}
          pomoc={<PomocPola ekran="pre-heat" pole="zrodloEnergii" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="pv-dzien">{t("UI-PREHEA-NADWYZKA-DZIEN")}</option>
          <option value="agregat">{t("UI-PREHEA-AGREGAT")}</option>
          <option value="bateria-noc">{t("UI-PREHEA-BATERIA-NOCY")}</option>
        </PoleSelect>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PREHEA-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-PREHEA-WPISZ-POJEMNOSC-CIEPLNA")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-PREHEA-GRZEJ-NOCA-BATERII") : hasWarning ? t("UI-PREHEA-MALO-NADWYZKI") : t("UI-PREHEA-PLAN-PRZEGRZANIA")}
        >
          {buforGodzin !== null ? (
            <WynikGlowny>{t("UI-PREHEA-BUFORU-CIEPLNEGO", { buforGodzin: f1(buforGodzin) })}</WynikGlowny>
          ) : (
            cieploDomuKwh !== null && <WynikGlowny>{t("UI-PREHEA-KWH-CIEPLA-MASIE", { cieploDomuKwh: f1(cieploDomuKwh) })}</WynikGlowny>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {cieploDomuKwh !== null && <li>{t("UI-PREHEA-CIEPLO-MASIE-DOMU", { cieploDomuKwh: f1(cieploDomuKwh) })}</li>}
            {cieploBojleraKwh !== null && <li>{t("UI-PREHEA-CIEPLO-BOJLERZE-KWH", { cieploBojleraKwh: f1(cieploBojleraKwh) })}</li>}
            {energiaElektrycznaKwh !== null && <li>{t("UI-PREHEA-ZUZYJESZ-PRADU-KWH", { energiaElektrycznaKwh: f1(energiaElektrycznaKwh) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
