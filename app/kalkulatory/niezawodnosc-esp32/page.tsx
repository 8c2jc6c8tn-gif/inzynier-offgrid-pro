"use client"

import { useMemo } from "react"
import { calculateNiezawodnoscEsp32 } from "@/lib/core/modules/esp32/niezawodnosc-esp32/calculator"
import type { NiezawodnoscEsp32Input } from "@/lib/core/modules/esp32/niezawodnosc-esp32/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const STAN_POCZATKOWY: NiezawodnoscEsp32Input = {
  kartaSd: false,
  rtc: false,
  podtrzymanieZasilania: false,
  watchdog: false,
  izolacjaGalwaniczna: false,
  ochronaPrzepieciowa: false,
  ota: false,
  redundancjaMasterSlave: false,
  otaPodpis: false,
  otaSumaKontrolna: false,
  otaRollback: false,
}

const FUNKCJE: { pole: keyof NiezawodnoscEsp32Input; label: string; hint: string }[] = [
  { pole: "kartaSd", label: "UI-NIEESP-KARTA", hint: "UI-NIEESP-LOKALNE-LOGOWANIE-DANYCH" },
  { pole: "rtc", label: "UI-NIEESP-ZEGAR-RTC", hint: "UI-NIEESP-CZAS-BEZ-INTERNETU" },
  { pole: "podtrzymanieZasilania", label: "UI-NIEESP-PODTRZYMANIE-ZASILANIA", hint: "UI-NIEESP-SUPERKONDENSATOR-AKUMULATOR-" },
  { pole: "watchdog", label: "UI-NIEESP-WATCHDOG", hint: "UI-NIEESP-AUTOMATYCZNY-RESET-ZAWIESZEN" },
  { pole: "izolacjaGalwaniczna", label: "UI-NIEESP-IZOLACJA-GALWANICZNA", hint: "UI-NIEESP-TRANSOPTORY-SYGNALACH-CYFROW" },
  { pole: "ochronaPrzepieciowa", label: "UI-NIEESP-OCHRONA-PRZEPIECIOWA-LINII", hint: "UI-NIEESP-DIODY-TVS-WARYSTORY" },
  { pole: "redundancjaMasterSlave", label: "UI-NIEESP-REDUNDANCJA-MASTER-SLAVE", hint: "UI-NIEESP-DRUGI-ESP32-PRZEJMUJE" },
  { pole: "ota", label: "UI-NIEESP-AKTUALIZACJA-OTA", hint: "UI-NIEESP-BEZPRZEWODOWA-AKTUALIZACJA-F" },
]

const OTA: { pole: keyof NiezawodnoscEsp32Input; label: string }[] = [
  { pole: "otaPodpis", label: "UI-NIEESP-OTA-WERYFIKUJE-PODPIS" },
  { pole: "otaSumaKontrolna", label: "UI-NIEESP-OTA-SPRAWDZA-SUME" },
  { pole: "otaRollback", label: "UI-NIEESP-OTA-UMOZLIWIA-POWROT" },
]

export default function NiezawodnoscEsp32Page() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<NiezawodnoscEsp32Input>("niezawodnosc-esp32", STAN_POCZATKOWY)
  const result = useMemo(() => calculateNiezawodnoscEsp32(stan), [stan])
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const przelacznik = ({ pole, label, hint }: { pole: keyof NiezawodnoscEsp32Input; label: string; hint?: string }) => (
    <PoleCheckbox
      key={pole}
      id={`niezawodnosc-${pole}`}
      label={t(label)}
      hint={hint === undefined ? undefined : t(hint)}
      checked={stan[pole]}
      onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
    />
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/niezawodnosc-esp32" />
      <NaglowekEkranu tytul={t("UI-NIEESP-NIEZAWODNOSC-STEROWNIKA-ESP3")} ekran="niezawodnosc-esp32" wynik={result}>
        {t("UI-NIEESP-SYSTEM-ODPORNOSCIOWY-ESP32")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        {FUNKCJE.map(przelacznik)}
        {stan.ota && OTA.map(przelacznik)}
      </div>

      <WerdyktPanel
        poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
        etykieta={hasCritical ? t("UI-NIEESP-NIEBEZPIECZNA-AKTUALIZACJA-O") : hasWarning ? t("UI-NIEESP-OTA-BEZ-PELNYCH") : t("UI-NIEESP-KONFIGURACJA-NIEZAWODNOSCI")}
      >
        <WynikGlowny>{t("UI-NIEESP-WLACZONE", { liczbaWlaczonych: result.value.liczbaWlaczonych, length: FUNKCJE.length })}</WynikGlowny>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
      </WerdyktPanel>
    </main>
  )
}
