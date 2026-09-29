"use client"

import { useMemo } from "react"
import { calculateAwariaStringaZima } from "@/lib/core/modules/stress-test/awaria-stringa-zima/calculator"
import type { AwariaStringaZimaInput } from "@/lib/core/modules/stress-test/awaria-stringa-zima/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof AwariaStringaZimaInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  produkcjaCalkowitaKwhDoba: "",
  produkcjaStringuKwhDoba: "",
  zapotrzebowanieKwhDoba: "",
  pojemnoscBateriiKwh: "",
  dodPct: "",
  sprawnoscFalownikaPct: "",
}

const POLA: { pole: keyof AwariaStringaZimaInput; label: string; unit: string }[] = [
  { pole: "produkcjaCalkowitaKwhDoba", label: "Produkcja instalacji w najgorszym miesiącu", unit: "kWh/dobę" },
  { pole: "produkcjaStringuKwhDoba", label: "Produkcja stringu, który ulega awarii", unit: "kWh/dobę" },
  { pole: "zapotrzebowanieKwhDoba", label: "Zapotrzebowanie w tym miesiącu", unit: "kWh/dobę" },
  { pole: "pojemnoscBateriiKwh", label: "Pojemność baterii (opcjonalnie)", unit: "kWh" },
  { pole: "dodPct", label: "Użyteczna głębokość rozładowania", unit: "%" },
  { pole: "sprawnoscFalownikaPct", label: "Sprawność falownika", unit: "%" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function AwariaStringaZimaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("awaria-stringa-zima", STAN_POCZATKOWY)
  const result = useMemo(
    () => calculateAwariaStringaZima(Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as AwariaStringaZimaInput),
    [stan],
  )
  const { produkcjaPoAwariiKwhDoba, deficytDobowyKwh, dniNaBaterii } = result.value
  const deficyt = deficytDobowyKwh !== null && deficytDobowyKwh > 0

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/awaria-stringa-zima" />
      <NaglowekEkranu tytul="Awaria stringa PV zimą" ekran="awaria-stringa-zima" wzor={result.formula}>
        Jeden chory string, który latem byłby drobnym problemem, w styczniu może oznaczać, że dom nie przetrwa nocy bez
        agregatu. Moduł 7, Ekran 26.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={label}
            unit={unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="awaria-stringa-zima" pole={pole} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz produkcję instalacji, stringu i zapotrzebowanie.</p>
      ) : (
        <WerdyktPanel poziom={deficyt ? "uwaga" : "ok"} etykieta={deficyt ? "Bez agregatu system nie przetrwa" : "Pozostałe stringi wystarczą"}>
          {deficytDobowyKwh !== null && (
            <WynikGlowny>{deficyt ? `Deficyt ${f1(deficytDobowyKwh)} kWh/dobę` : `Zapas ${f1(-deficytDobowyKwh)} kWh/dobę`}</WynikGlowny>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {produkcjaPoAwariiKwhDoba !== null && <li>Produkcja po awarii: {f1(produkcjaPoAwariiKwhDoba)} kWh/dobę</li>}
            {dniNaBaterii !== null && <li>Bateria wystarczy na: {f1(dniNaBaterii)} dnia</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
