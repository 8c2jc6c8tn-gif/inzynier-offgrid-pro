"use client"

import { useMemo } from "react"
import { calculatePowiadomieniaAlarmowe } from "@/lib/core/modules/bezpieczenstwo/powiadomienia-alarmowe/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type Flagi = "maSyrene" | "maKamery" | "autoWezwanieSluzb" | "zgodaNaWezwanieSluzb"
type FormularzStan = { liczbaKontaktow: string } & Record<Flagi, boolean>

// Zgoda na wezwanie służb domyślnie false — tylko wyraźna decyzja użytkownika.
const STAN_POCZATKOWY: FormularzStan = {
  liczbaKontaktow: "",
  maSyrene: false,
  maKamery: false,
  autoWezwanieSluzb: false,
  zgodaNaWezwanieSluzb: false,
}

const FLAGI: { pole: Flagi; label: string; hint?: string }[] = [
  { pole: "maSyrene", label: "UI-POWALA-SYRENA-SYGNALIZATOR-ZEWNETRZ" },
  { pole: "maKamery", label: "UI-POWALA-KAMERY-MONITORINGU-NAGRYWANI" },
  { pole: "autoWezwanieSluzb", label: "UI-POWALA-AUTOMATYCZNE-WEZWANIE-SLUZB" },
  {
    pole: "zgodaNaWezwanieSluzb",
    label: "UI-POWALA-WYRAZAM-WYRAZNA-ZGODE",
    hint: "UI-POWALA-BEZ-TEJ-ZGODY",
  },
]

export default function PowiadomieniaAlarmowePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("powiadomienia-alarmowe", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculatePowiadomieniaAlarmowe({
        ...stan,
        liczbaKontaktow: stan.liczbaKontaktow === "" ? null : Number(stan.liczbaKontaktow),
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/powiadomienia-alarmowe" />
      <NaglowekEkranu tytul={t("UI-POWALA-SYRENA-POWIADOMIENIA-SLUZBY")} ekran="powiadomienia-alarmowe" wynik={result}>
        {t("UI-POWALA-SYSTEM-TYLKO-WYKRYWA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-POWALA-KONTAKTY-ALARMOWE")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={stan.liczbaKontaktow}
          onChange={(e) => setStan((prev) => ({ ...prev, liczbaKontaktow: e.target.value }))}
          pomoc={<PomocPola ekran="powiadomienia-alarmowe" pole="kontakty" />}
        />
        {FLAGI.map(({ pole, label, hint }) => (
          <PoleCheckbox
            key={pole}
            id={`alarm-${pole}`}
            label={t(label)}
            hint={hint && t(hint)}
            checked={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-POWALA-OCENIC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-POWALA-WPISZ-LICZBE-KONTAKTOW")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-POWALA-WEZWANIE-SLUZB-BEZ") : hasWarning ? t("UI-POWALA-BRAKI-POWIADAMIANIU") : t("UI-POWALA-POWIADAMIANIE-SKONFIGUROWANE")}
        >
          <WynikGlowny>{result.value.autoWezwanieAktywne ? t("UI-POWALA-AUTO-WEZWANIE-SLUZB") : t("UI-POWALA-AUTO-WEZWANIE-SLUZB-2")}</WynikGlowny>
          <p className="mt-2 text-small">{t("UI-POWALA-BRAKI", { liczbaBrakow: result.value.liczbaBrakow })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
