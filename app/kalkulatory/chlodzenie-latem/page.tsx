"use client"

import { useMemo } from "react"
import { calculateChlodzenieLatem } from "@/lib/core/modules/baterie/chlodzenie-latem/calculator"
import { ZAKRES_PRACY_MAX_C, ZAKRES_PRACY_MIN_C } from "@/lib/core/modules/baterie/chlodzenie-latem/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  temperaturaOgniwC: string
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaOgniwC: "",
}

export default function ChlodzenieLatemPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("chlodzenie-latem", STAN_POCZATKOWY)
  const { temperaturaOgniwC } = stan
  const setTemperaturaOgniwC = (a: string | ((p: string) => string)) =>
    setStan((prev) => ({
      ...prev,
      temperaturaOgniwC: typeof a === "function" ? (a as (p: string) => string)(prev.temperaturaOgniwC) : a,
    }))

  const result = useMemo(
    () =>
      calculateChlodzenieLatem({
        temperaturaOgniwC: temperaturaOgniwC === "" ? null : Number(temperaturaOgniwC),
      }),
    [temperaturaOgniwC],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : hasCritical
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/chlodzenie-latem" />
      <NaglowekEkranu
        tytul={t("UI-CHLLAT-CHLODZENIE-BATERII-LATEM")}
        ekran="chlodzenie-latem" wynik={result}
        parametry={{ tMin: ZAKRES_PRACY_MIN_C, tMax: ZAKRES_PRACY_MAX_C }}
      >
        {t("UI-CHLLAT-BATERIA-PIEC-WYSOKA")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-CHLLAT-TEMPERATURA-OGNIW")}
        unit="°C"
        type="number"
        inputMode="decimal"
        value={temperaturaOgniwC}
        onChange={(e) => setTemperaturaOgniwC(e.target.value)}
        pomoc={<PomocPola ekran="chlodzenie-latem" pole="temperatura" params={{ tMin: ZAKRES_PRACY_MIN_C, tMax: ZAKRES_PRACY_MAX_C }} />}
      />

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-CHLLAT-WPISZ-TEMPERATURE-OGNIW")}
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={
              poziom === "ok"
                ? t("UI-CHLLAT-DOPUSZCZALNYM-ZAKRESIE")
                : hasCritical
                  ? t("UI-CHLLAT-POWYZEJ-DOPUSZCZALNEJ-TEMPER")
                  : t("UI-CHLLAT-PONIZEJ-DOPUSZCZALNEGO-ZAKRE")
            }
          >
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-1 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} warnings={[]} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
