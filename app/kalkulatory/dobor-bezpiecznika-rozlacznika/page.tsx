"use client"

import { useMemo } from "react"
import { calculateDoborBezpiecznikaRozlacznika } from "@/lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA } from "@/lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/constants"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pradZnamionowyA: number
  pradZwarciowyA: number
  aicBezpiecznikaA: number
}

const STAN_POCZATKOWY: FormularzStan = {
  pradZnamionowyA: 0,
  pradZwarciowyA: 0,
  aicBezpiecznikaA: 0,
}

export default function DoborBezpiecznikaRozlacznikaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-bezpiecznika-rozlacznika", STAN_POCZATKOWY)
  const { pradZnamionowyA, pradZwarciowyA, aicBezpiecznikaA } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPradZnamionowyA = (a: number | ((p: number) => number)) => setPole("pradZnamionowyA", a)
  const setPradZwarciowyA = (a: number | ((p: number) => number)) => setPole("pradZwarciowyA", a)
  const setAicBezpiecznikaA = (a: number | ((p: number) => number)) => setPole("aicBezpiecznikaA", a)

  const result = useMemo(
    () => calculateDoborBezpiecznikaRozlacznika({ pradZnamionowyA, pradZwarciowyA, aicBezpiecznikaA }),
    [pradZnamionowyA, pradZwarciowyA, aicBezpiecznikaA],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasCritical
          ? "blad"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? t("UI-DOBBEZROZ-POLICZYC-SPRAWDZ-WPISANE")
      : hasCritical
        ? t("UI-DOBBEZROZ-ZABRONIONA-KOMBINACJA-DOBIER")
        : t("UI-DOBBEZROZ-BEZPIECZNIK-DOBRANY")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-bezpiecznika-rozlacznika" />
      <NaglowekEkranu
        tytul={t("UI-DOBBEZROZ-DOBOR-BEZPIECZNIKOW-ROZLACZN")}
        ekran="dobor-bezpiecznika-rozlacznika"
        wynik={result}
        parametry={{ margines: WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA }}
      >
        {t("UI-DOBBEZROZ-BEZPIECZNIK-BEZPIECZNA-WKLAD")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-DOBBEZROZ-PRAD-ZNAMIONOWY-OBWODU")}
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={pradZnamionowyA || ""}
        onChange={(e) => setPradZnamionowyA(Number(e.target.value))}
        pomoc={<PomocPola ekran="dobor-bezpiecznika-rozlacznika" pole="prad" />}
      />

      <Pole
        label={t("UI-DOBBEZROZ-PRAD-ZWARCIOWY-TYM")}
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={pradZwarciowyA || ""}
        onChange={(e) => setPradZwarciowyA(Number(e.target.value))}
        pomoc={<PomocPola ekran="dobor-bezpiecznika-rozlacznika" pole="pradZwarcia" />}
      />

      <Pole
        label={t("UI-DOBBEZROZ-ZDOLNOSC-LACZENIOWA-AIC")}
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={aicBezpiecznikaA || ""}
        onChange={(e) => setAicBezpiecznikaA(Number(e.target.value))}
        pomoc={<PomocPola ekran="dobor-bezpiecznika-rozlacznika" pole="aic" />}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">{t("UI-DOBBEZROZ-WPISZ-PRAD-ZNAMIONOWY")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>{result.value.pradBezpiecznikaZalecanyA} A</WynikGlowny>
          <p className="text-small text-muted-foreground">{t("UI-DOBBEZROZ-ZALECANY-PRAD-ZNAMIONOWY")}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
