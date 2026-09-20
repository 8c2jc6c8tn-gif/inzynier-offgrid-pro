"use client"

import type { CalcResult } from "@/lib/core/calc-result"
import type { KatalogUrzadzenInput, StandbyDeviceItem } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/input"
import type { KatalogUrzadzenResult } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/calculator"
import { KATALOG_URZADZEN_STANDBY } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/constants"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { StanPusty } from "@/components/ui/stany"

const INLINE_INPUT_KLASY =
  "w-24 min-h-11 rounded-md border border-input bg-background px-2 text-body outline-none transition-colors " +
  "hover:not-disabled:border-foreground/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"

export function KatalogTab({
  input,
  onChange,
  result,
}: {
  input: KatalogUrzadzenInput
  onChange: (items: StandbyDeviceItem[]) => void
  result: CalcResult<KatalogUrzadzenResult>
}) {
  function toggleSelected(id: string) {
    onChange(input.items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)))
  }

  function updatePower(id: string, powerW: number) {
    onChange(input.items.map((item) => (item.id === id ? { ...item, powerW } : item)))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        Zaznacz urządzenia, które w Twoim domu stale pobierają moc w trybie czuwania. Domyślne moce to środek
        zakresu ze źródła — edytuj, jeśli znasz realną wartość swojego modelu.
      </p>

      <ul className="flex flex-col gap-3">
        {input.items.map((item) => {
          const def = KATALOG_URZADZEN_STANDBY.find((d) => d.id === item.id)
          return (
            <li key={item.id} className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/60">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                checked={item.selected}
                onChange={() => toggleSelected(item.id)}
                id={`katalog-${item.id}`}
              />
              <label htmlFor={`katalog-${item.id}`} className="flex-1 text-small font-medium">
                {item.label}
                {def && (
                  <span className="block text-caption font-normal text-muted-foreground">
                    zakres źródła: {def.minPowerW}–{def.maxPowerW} W
                  </span>
                )}
              </label>
              <input
                type="number"
                inputMode="decimal"
                className={INLINE_INPUT_KLASY}
                value={item.powerW}
                disabled={!item.selected}
                onChange={(e) => updatePower(item.id, Number(e.target.value))}
                aria-label={`Moc czuwania — ${item.label}`}
              />
              <span className="w-4 text-caption text-muted-foreground">W</span>
            </li>
          )
        })}
      </ul>

      {result.status === "INCOMPLETE" ? (
        <StanPusty tytul="Zaznacz przynajmniej jedno urządzenie z katalogu." />
      ) : (
        <WerdyktPanel poziom={poziomZStatusu(result.status)}>
          <WynikGlowny>{result.value.sumaW.toFixed(1)} W</WynikGlowny>
          <p className="mt-1 text-small">
            {result.value.energiaDobowaKwh.toFixed(2)} kWh/dobę · {result.value.energiaRocznaKwh.toFixed(0)} kWh/rok
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </div>
  )
}
