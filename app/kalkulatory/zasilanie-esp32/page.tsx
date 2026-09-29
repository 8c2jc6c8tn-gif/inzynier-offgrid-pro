"use client"

import { useMemo } from "react"
import { calculateZasilanieEsp32 } from "@/lib/core/modules/esp32/zasilanie-esp32/calculator"
import type { SposobZasilania, ZasilanieEsp32Input } from "@/lib/core/modules/esp32/zasilanie-esp32/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PoleLiczbowe = Exclude<keyof ZasilanieEsp32Input, "sposob">
type FormularzStan = Record<PoleLiczbowe, string> & { sposob: SposobZasilania | "" }

const STAN_POCZATKOWY: FormularzStan = {
  sposob: "",
  napiecieMagistraliV: "",
  napiecieMagistraliMaxV: "",
  poborMocyW: "",
  napiecieWyjscioweV: "5",
  napiecieWejscioweMaxV: "",
  pradWyjsciowyMaxA: "",
  sprawnoscPct: "",
}

const POLA: { pole: PoleLiczbowe; label: string; unit: string }[] = [
  { pole: "napiecieMagistraliV", label: "Napięcie magistrali (nominalne)", unit: "V" },
  { pole: "napiecieMagistraliMaxV", label: "Najwyższe napięcie magistrali", unit: "V" },
  { pole: "poborMocyW", label: "Pobór ESP32 + czujników", unit: "W" },
  { pole: "napiecieWyjscioweV", label: "Napięcie wyjściowe przetwornicy", unit: "V" },
  { pole: "napiecieWejscioweMaxV", label: "Maks. napięcie wejściowe przetwornicy", unit: "V" },
  { pole: "pradWyjsciowyMaxA", label: "Maks. prąd wyjściowy przetwornicy", unit: "A" },
  { pole: "sprawnoscPct", label: "Sprawność przetwornicy", unit: "%" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

export default function ZasilanieEsp32Page() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zasilanie-esp32", STAN_POCZATKOWY)
  const result = useMemo(() => {
    const { sposob, ...liczby } = stan
    return calculateZasilanieEsp32({
      ...(Object.fromEntries(Object.entries(liczby).map(([k, v]) => [k, liczba(v)])) as Record<PoleLiczbowe, number | null>),
      sposob: sposob === "" ? null : sposob,
    })
  }, [stan])
  const { pradWyjsciowyA, pradWejsciowyA } = result.value
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zasilanie-esp32" />
      <NaglowekEkranu tytul="Zasilanie ESP32 z magistrali" ekran="zasilanie-esp32" wynik={result}>
        ESP32 potrzebuje 5 V albo 3,3 V — przetwornica to jego osobisty zasilacz, dopasowany do napięcia magistrali. Moduł 9,
        Ekran 2.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Jak zasilasz ESP32?"
          value={stan.sposob}
          onChange={(e) => setStan((prev) => ({ ...prev, sposob: e.target.value as FormularzStan["sposob"] }))}
          pomoc={<PomocPola ekran="zasilanie-esp32" pole="sposob" />}
        >
          <option value="">— wybierz —</option>
          <option value="przetwornica">Przez przetwornicę step-down</option>
          <option value="bezposrednio">Bezpośrednio z magistrali</option>
        </PoleSelect>
        {stan.sposob === "przetwornica" &&
          POLA.map(({ pole, label, unit }) => (
            <Pole
              key={pole}
              label={label}
              unit={unit}
              type="number"
              inputMode="decimal"
              min={0}
              value={stan[pole]}
              onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
              pomoc={<PomocPola ekran="zasilanie-esp32" pole={pole} />}
            />
          ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz sposób zasilania i wpisz dane magistrali oraz przetwornicy.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "ESP32 lub przetwornica zostanie uszkodzona" : hasWarning ? "Przetwornica za słaba" : "Zasilanie poprawne"}
        >
          {pradWejsciowyA !== null && <WynikGlowny>{f2(pradWejsciowyA)} A z magistrali</WynikGlowny>}
          {pradWyjsciowyA !== null && <p className="mt-2 text-small">Po stronie ESP32: {f2(pradWyjsciowyA)} A</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
