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
  { pole: "kartaSd", label: "Karta SD", hint: "Lokalne logowanie danych w CSV." },
  { pole: "rtc", label: "Zegar RTC", hint: "Czas bez internetu — np. DS3231 z baterią." },
  { pole: "podtrzymanieZasilania", label: "Podtrzymanie zasilania", hint: "Superkondensator lub akumulator — czas na zapis przy zaniku." },
  { pole: "watchdog", label: "Watchdog", hint: "Automatyczny reset przy zawieszeniu (programowy + sprzętowy)." },
  { pole: "izolacjaGalwaniczna", label: "Izolacja galwaniczna", hint: "Transoptory na sygnałach cyfrowych." },
  { pole: "ochronaPrzepieciowa", label: "Ochrona przepięciowa linii sygnałowych", hint: "Diody TVS lub warystory." },
  { pole: "redundancjaMasterSlave", label: "Redundancja master/slave", hint: "Drugi ESP32 przejmuje sterowanie." },
  { pole: "ota", label: "Aktualizacja OTA", hint: "Bezprzewodowa aktualizacja firmware." },
]

const OTA: { pole: keyof NiezawodnoscEsp32Input; label: string }[] = [
  { pole: "otaPodpis", label: "OTA weryfikuje podpis cyfrowy" },
  { pole: "otaSumaKontrolna", label: "OTA sprawdza sumę kontrolną" },
  { pole: "otaRollback", label: "OTA umożliwia powrót do poprzedniej wersji" },
]

export default function NiezawodnoscEsp32Page() {
  const [stan, setStan] = usePersistedDraft<NiezawodnoscEsp32Input>("niezawodnosc-esp32", STAN_POCZATKOWY)
  const result = useMemo(() => calculateNiezawodnoscEsp32(stan), [stan])
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const przelacznik = ({ pole, label, hint }: { pole: keyof NiezawodnoscEsp32Input; label: string; hint?: string }) => (
    <PoleCheckbox
      key={pole}
      id={`niezawodnosc-${pole}`}
      label={label}
      hint={hint}
      checked={stan[pole]}
      onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
    />
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/niezawodnosc-esp32" />
      <NaglowekEkranu tytul="Niezawodność sterownika ESP32">
        „System odpornościowy” ESP32: żeby nie stracił danych przy zaniku prądu, nie zawiesił się na trwałe, nie oberwał
        przepięciem i dało się go bezpiecznie aktualizować. Moduł 9, Ekran 6.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        {FUNKCJE.map(przelacznik)}
        {stan.ota && OTA.map(przelacznik)}
      </div>

      <WerdyktPanel
        poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
        etykieta={hasCritical ? "Niebezpieczna aktualizacja OTA" : hasWarning ? "OTA bez pełnych zabezpieczeń" : "Konfiguracja niezawodności"}
      >
        <WynikGlowny>Włączone: {result.value.liczbaWlaczonych} z {FUNKCJE.length}</WynikGlowny>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
