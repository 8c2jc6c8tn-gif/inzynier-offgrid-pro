"use client"

import { useMemo } from "react"
import { calculateKalibracjaSoc } from "@/lib/core/modules/baterie/kalibracja-soc/calculator"
import { PROG_KALIBRACJI_DNI } from "@/lib/core/modules/baterie/kalibracja-soc/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  dni: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dni: "",
}

export default function KalibracjaSocPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("kalibracja-soc", STAN_POCZATKOWY)
  const { dni } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDni = (a: string | ((p: string) => string)) => setPole("dni", a)

  const result = useMemo(
    () => calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: dni === "" ? null : Number(dni) }),
    [dni],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kalibracja-soc" />
      <NaglowekEkranu
        tytul={t("UI-KALSOC-KALIBRACJA-DOKLADNOSC-SOC")}
        ekran="kalibracja-soc"
        parametry={{ progDni: PROG_KALIBRACJI_DNI }}
      >
        {t("UI-KALSOC-LICZENIE-PRADU-BMS")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-KALSOC-DNI-OSTATNIEGO-PELNEGO")}
        unit={t("UI-J-DNI")}
        type="number"
        inputMode="numeric"
        min={0}
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        pomoc={<PomocPola ekran="kalibracja-soc" pole="dni" params={{ progDni: PROG_KALIBRACJI_DNI }} />}
      />

      {result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-KALSOC-LICZBA-DNI-MOZE")}</p>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-KALSOC-WPISZ-LICZBE-DNI")}</p>
      ) : (
        <WerdyktPanel
          poziom={result.value.kalibracjaRekomendowana ? "uwaga" : "ok"}
          etykieta={result.value.kalibracjaRekomendowana ? t("UI-KALSOC-REKOMENDOWANA-KALIBRACJA") : t("UI-KALSOC-KALIBRACJA-NIEPOTRZEBNA")}
        >
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
