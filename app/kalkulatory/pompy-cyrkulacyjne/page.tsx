"use client"

import { useMemo } from "react"
import { calculatePompyCyrkulacyjne } from "@/lib/core/modules/ogrzewanie/pompy-cyrkulacyjne/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { GODZINY_PRACY_CIAGLEJ_H, MOC_ELEKTRONICZNEJ_MAX_W, MOC_ELEKTRONICZNEJ_MIN_W, MOC_STALOOBROTOWEJ_MAX_W, MOC_STALOOBROTOWEJ_MIN_W } from "@/lib/core/modules/ogrzewanie/pompy-cyrkulacyjne/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { SekcjaPrzeplyw } from "./sekcja-przeplyw"

type FormularzStan = {
  mocObecnejPompyW: string
  mocNowejPompyW: string
  godzinyPracyDobowoH: string
  /** Dokładka 2B (dawne 5.72) — szkice sprzed niej nie mają tych pól (scalSzkic uzupełnia z STAN_POCZATKOWY). */
  dniSezonu: string
  cenaZlKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocObecnejPompyW: "",
  mocNowejPompyW: "",
  godzinyPracyDobowoH: "",
  dniSezonu: "",
  cenaZlKwh: "",
}

export default function PompyCyrkulacyjnePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pompy-cyrkulacyjne", STAN_POCZATKOWY)
  const { mocObecnejPompyW, mocNowejPompyW, godzinyPracyDobowoH, dniSezonu, cenaZlKwh } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocObecnejPompyW = (a: string | ((p: string) => string)) => setPole("mocObecnejPompyW", a)
  const setMocNowejPompyW = (a: string | ((p: string) => string)) => setPole("mocNowejPompyW", a)
  const setGodzinyPracyDobowoH = (a: string | ((p: string) => string)) => setPole("godzinyPracyDobowoH", a)
  const setDniSezonu = (a: string | ((p: string) => string)) => setPole("dniSezonu", a)
  const setCenaZlKwh = (a: string | ((p: string) => string)) => setPole("cenaZlKwh", a)

  const result = useMemo(
    () =>
      calculatePompyCyrkulacyjne({
        mocObecnejPompyW: mocObecnejPompyW === "" ? 0 : Number(mocObecnejPompyW),
        mocNowejPompyW: mocNowejPompyW === "" ? 0 : Number(mocNowejPompyW),
        godzinyPracyDobowoH: godzinyPracyDobowoH === "" ? 0 : Number(godzinyPracyDobowoH),
        dniSezonu: dniSezonu === "" ? 0 : Number(dniSezonu),
        cenaZlKwh: cenaZlKwh === "" ? 0 : Number(cenaZlKwh),
      }),
    [mocObecnejPompyW, mocNowejPompyW, godzinyPracyDobowoH, dniSezonu, cenaZlKwh],
  )

  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pompy-cyrkulacyjne" />
      <NaglowekEkranu tytul={t("UI-POMCYR-POMPY-CYRKULACYJNE-DOBOR")} ekran="pompy-cyrkulacyjne" wynik={result}>
        {t("UI-POMCYR-OFF-GRIDZIE-POMPY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-POMCYR-MOC-OBECNEJ-POMPY")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocObecnejPompyW}
          onChange={(e) => setMocObecnejPompyW(e.target.value)}
          pomoc={<PomocPola ekran="pompy-cyrkulacyjne" pole="mocObecna" params={{ min: MOC_STALOOBROTOWEJ_MIN_W, max: MOC_STALOOBROTOWEJ_MAX_W }} />}
        />
        <Pole
          label={t("UI-POMCYR-MOC-ROZWAZANEJ-POMPY")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocNowejPompyW}
          onChange={(e) => setMocNowejPompyW(e.target.value)}
          pomoc={<PomocPola ekran="pompy-cyrkulacyjne" pole="mocNowa" params={{ min: MOC_ELEKTRONICZNEJ_MIN_W, max: MOC_ELEKTRONICZNEJ_MAX_W }} />}
        />
        <Pole
          label={t("UI-POMCYR-GODZINY-PRACY-DOBE")}
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={godzinyPracyDobowoH}
          onChange={(e) => setGodzinyPracyDobowoH(e.target.value)}
          pomoc={<PomocPola ekran="pompy-cyrkulacyjne" pole="godziny" params={{ h: GODZINY_PRACY_CIAGLEJ_H }} />}
        />
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-M6D-PCS-DNI")}
            unit={t("UI-M6D-J-DNI")}
            type="number"
            inputMode="decimal"
            min={0}
            value={dniSezonu}
            onChange={(e) => setDniSezonu(e.target.value)}
            pomoc={<PomocPola ekran="m6d-pompy-cyrkulacyjne-sezon" pole="dni" />}
          />
          <Pole
            label={t("UI-M6D-PCS-CENA")}
            unit={t("UI-J-ZL-KWH")}
            type="number"
            inputMode="decimal"
            min={0}
            value={cenaZlKwh}
            onChange={(e) => setCenaZlKwh(e.target.value)}
            pomoc={<PomocPola ekran="m6d-pompy-cyrkulacyjne-sezon" pole="cena" />}
          />
        </div>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-POMCYR-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-POMCYR-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t("UI-POMCYR-OSZCZEDNOSC-DOBOWA")}>
          <WynikGlowny>{result.value.oszczednoscKwh.toFixed(2)} kWh</WynikGlowny>
          <p className="mt-2 text-small">
            {t("UI-POMCYR-OBECNA-POMPA-KWH", { energiaObecnaKwh: result.value.energiaObecnaKwh.toFixed(2), energiaNowaKwh: result.value.energiaNowaKwh.toFixed(2), oszczednoscPct: result.value.oszczednoscPct.toFixed(0) })}
          </p>
          {result.value.energiaSezonObecnaKwh !== null && result.value.energiaSezonNowaKwh !== null && result.value.oszczednoscSezonKwh !== null && (
            <p className="mt-2 text-small">
              {t("UI-M6D-PCS-SEZON", {
                obecna: result.value.energiaSezonObecnaKwh.toFixed(0),
                nowa: result.value.energiaSezonNowaKwh.toFixed(0),
                oszczednosc: result.value.oszczednoscSezonKwh.toFixed(0),
              })}
            </p>
          )}
          {result.value.oszczednoscSezonZl !== null && (
            <p className="mt-1 text-small">{t("UI-M6D-PCS-ZL", { zl: result.value.oszczednoscSezonZl.toFixed(0) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <SekcjaPrzeplyw />
    </main>
  )
}
