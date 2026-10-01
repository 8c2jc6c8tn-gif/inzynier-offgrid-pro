"use client"

import { useMemo } from "react"
import { calculateCentralaSsp } from "@/lib/core/modules/bezpieczenstwo/centrala-ssp/calculator"
import type { InterfejsCentrali, StanCentrali } from "@/lib/core/modules/bezpieczenstwo/centrala-ssp/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type Flagi = "odbieraAlarm" | "odbieraAwarie" | "odbieraRozbrojenie" | "logujeZdarzenia"
type FormularzStan = { interfejs: InterfejsCentrali | ""; stanCentrali: StanCentrali | "" } & Record<Flagi, boolean>

const STAN_POCZATKOWY: FormularzStan = {
  interfejs: "",
  stanCentrali: "",
  odbieraAlarm: false,
  odbieraAwarie: false,
  odbieraRozbrojenie: false,
  logujeZdarzenia: false,
}

const FLAGI: { pole: Flagi; label: string }[] = [
  { pole: "odbieraAlarm", label: "UI-CENSSP-STEROWNIK-ODBIERA-SYGNAL" },
  { pole: "odbieraAwarie", label: "UI-CENSSP-STEROWNIK-ODBIERA-SYGNAL-2" },
  { pole: "odbieraRozbrojenie", label: "UI-CENSSP-STEROWNIK-ODBIERA-SYGNAL-3" },
  { pole: "logujeZdarzenia", label: "UI-CENSSP-ZDARZENIA-LOGOWANE" },
]

export default function CentralaSspPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("centrala-ssp", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateCentralaSsp({
        ...stan,
        interfejs: stan.interfejs === "" ? null : stan.interfejs,
        stanCentrali: stan.stanCentrali === "" ? null : stan.stanCentrali,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/centrala-ssp" />
      <NaglowekEkranu tytul={t("UI-CENSSP-CENTRALA-SYGNALIZACJI-POZARU")} ekran="centrala-ssp" wynik={result}>
        {t("UI-CENSSP-CENTRALA-POZAROWA-SERCE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-CENSSP-POLACZENIE-CENTRALA")}
          value={stan.interfejs}
          onChange={(e) => setStan((prev) => ({ ...prev, interfejs: e.target.value as FormularzStan["interfejs"] }))}
          pomoc={<PomocPola ekran="centrala-ssp" pole="polaczenie" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="styki">{t("UI-CENSSP-STYKI-BEZPOTENCJALOWE")}</option>
          <option value="rs485">RS485</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-CENSSP-STAN-CENTRALI")}
          value={stan.stanCentrali}
          onChange={(e) => setStan((prev) => ({ ...prev, stanCentrali: e.target.value as FormularzStan["stanCentrali"] }))}
          pomoc={<PomocPola ekran="centrala-ssp" pole="stan" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="dozor">{t("UI-CENSSP-DOZOR-SPRAWNA")}</option>
          <option value="awaria">{t("UI-CENSSP-ZGLASZA-AWARIE")}</option>
        </PoleSelect>
        {FLAGI.map(({ pole, label }) => (
          <PoleCheckbox
            key={pole}
            id={`ssp-${pole}`}
            label={t(label)}
            checked={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
          />
        ))}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-CENSSP-WYBIERZ-POLACZENIE-STAN")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-CENSSP-CENTRALA-NIESPRAWNA") : hasWarning ? t("UI-CENSSP-SYSTEM-MOZE-DOWIEDZIEC") : t("UI-CENSSP-INTEGRACJA-KOMPLETNA")}
        >
          <WynikGlowny>{t("UI-CENSSP-BRAKI", { liczbaBrakow: result.value.liczbaBrakow })}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
