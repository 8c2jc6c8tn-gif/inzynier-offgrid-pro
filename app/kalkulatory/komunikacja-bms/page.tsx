"use client"

import { useMemo } from "react"
import { calculateKomunikacjaBms } from "@/lib/core/modules/baterie/komunikacja-bms/calculator"
import { PROTOKOLY } from "@/lib/core/modules/baterie/komunikacja-bms/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  protokolBms: string
  protokolFalownika: string
}

const STAN_POCZATKOWY: FormularzStan = {
  protokolBms: "",
  protokolFalownika: "",
}

export default function KomunikacjaBmsPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("komunikacja-bms", STAN_POCZATKOWY)
  const { protokolBms, protokolFalownika } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setProtokolBms = (a: string | ((p: string) => string)) => setPole("protokolBms", a)
  const setProtokolFalownika = (a: string | ((p: string) => string)) => setPole("protokolFalownika", a)

  const result = useMemo(
    () => calculateKomunikacjaBms({ protokolBms, protokolFalownika }),
    [protokolBms, protokolFalownika],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "VALID"
      ? "ok"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : result.status === "OUT_OF_SCOPE"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/komunikacja-bms" />
      <NaglowekEkranu tytul={t("UI-KOMBMS-KOMUNIKACJA-BMS-CAN")} ekran="komunikacja-bms">
        {t("UI-KOMBMS-BMS-FALOWNIK-MUSZA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-KOMBMS-PROTOKOL-BMS")}
          value={protokolBms}
          onChange={(e) => setProtokolBms(e.target.value)}
          pomoc={<PomocPola ekran="komunikacja-bms" pole="protokolBms" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {PROTOKOLY.map((p) => (
            <option key={p.id} value={p.id}>
              {t(`UI-STALEBAT-PROTOKOL-${p.id.toUpperCase()}`)}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-KOMBMS-PROTOKOL-FALOWNIKA-LADOWARKI")}
          value={protokolFalownika}
          onChange={(e) => setProtokolFalownika(e.target.value)}
          pomoc={<PomocPola ekran="komunikacja-bms" pole="protokolFalownika" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {PROTOKOLY.map((p) => (
            <option key={p.id} value={p.id}>
              {t(`UI-STALEBAT-PROTOKOL-${p.id.toUpperCase()}`)}
            </option>
          ))}
        </PoleSelect>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-KOMBMS-WYBIERZ-PROTOKOL-OBU")}
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={
              result.status === "OUT_OF_SCOPE"
                ? t("UI-KOMBMS-OCENIC-AUTOMATYCZNIE")
                : result.value.zgodne
                  ? t("UI-KOMBMS-ZGODNE-KOMUNIKACJA-BEZPOSRED")
                  : t("UI-KOMBMS-POTRZEBNY-KONWERTER-PROTOKOL")
            }
          >
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-1 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
