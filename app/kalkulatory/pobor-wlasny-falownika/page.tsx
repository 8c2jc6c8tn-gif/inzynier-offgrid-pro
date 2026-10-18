"use client"

import { useMemo } from "react"
import { calculatePoborWlasnyFalownika } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/calculator"
import { DOMYSLNY_POBOR_JALOWY_W } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = { poborJalowyW: string }
const STAN_POCZATKOWY: FormularzStan = { poborJalowyW: "" }

export default function PoborWlasnyFalownikaPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pobor-wlasny-falownika", STAN_POCZATKOWY)
  const { poborJalowyW } = stan
  const setPoborJalowyW = (a: string | ((p: string) => string)) =>
    setStan((prev) => ({
      ...prev,
      poborJalowyW: typeof a === "function" ? (a as (p: string) => string)(prev.poborJalowyW) : a,
    }))

  const result = useMemo(
    () => calculatePoborWlasnyFalownika({ poborJalowyW: poborJalowyW === "" ? 0 : Number(poborJalowyW) }),
    [poborJalowyW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pobor-wlasny-falownika" />
      <NaglowekEkranu tytul={t("UI-POBWLAFAL-POBOR-WLASNY-FALOWNIKA")} ekran="pobor-wlasny-falownika" wynik={result}>
        {t("UI-POBWLAFAL-FALOWNIK-SAM-SOBIE")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-POBWLAFAL-POBOR-STANIE-JALOWYM")}
        unit="W"
        type="number"
        inputMode="decimal"
        value={poborJalowyW}
        onChange={(e) => setPoborJalowyW(e.target.value)}
        pomoc={<PomocPola ekran="pobor-wlasny-falownika" pole="pobor" params={{ domyslny: DOMYSLNY_POBOR_JALOWY_W }} />}
      />

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-POBWLAFAL-WPISZ-POBOR-JALOWY")}
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-POBWLAFAL-POBOR-MOZE-BYC")}</p>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-POBWLAFAL-STALY-KOSZT-BILANSU")}>
          <WynikGlowny>
            {t("UI-POBWLAFAL-KWH-DOBE", { strataDobowaKwh: formatLiczbe(result.value.strataDobowaKwh, { maximumFractionDigits: 2 }) })}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
