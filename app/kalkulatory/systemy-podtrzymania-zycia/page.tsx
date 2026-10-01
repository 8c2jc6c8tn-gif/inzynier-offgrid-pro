"use client"

import { useMemo } from "react"
import { calculateSurvivalCore } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/calculator"
import { DEFAULT_CRITICAL_LOADS } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/constants"
import type { CriticalLoadItem } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { StanPusty } from "@/components/ui/stany"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"

const initialItems: CriticalLoadItem[] = DEFAULT_CRITICAL_LOADS.map((def) => ({
  id: def.id,
  label: def.label,
  selected: false,
  powerW: def.defaultPowerW ?? 0,
}))

/** Pole liczbowe w rzędzie listy — świadomie nie `Pole` (bez etykiety/wrappera, bo etykieta jest
 * już w <label> checkboxa po lewej), ale te same tokeny stanu co components/ui/pole.tsx. */
const INLINE_INPUT_KLASY =
  "w-24 min-h-11 rounded-md border border-input bg-background px-2 text-body outline-none transition-colors " +
  "hover:not-disabled:border-foreground/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"

type FormularzStan = { items: CriticalLoadItem[] }
const STAN_POCZATKOWY: FormularzStan = { items: initialItems }

export default function SystemyPodtrzymaniaZyciaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("systemy-podtrzymania-zycia", STAN_POCZATKOWY)
  const { items } = stan
  const setItems = (a: CriticalLoadItem[] | ((p: CriticalLoadItem[]) => CriticalLoadItem[])) =>
    setStan((prev) => ({
      ...prev,
      items: typeof a === "function" ? (a as (p: CriticalLoadItem[]) => CriticalLoadItem[])(prev.items) : a,
    }))

  const result = useMemo(() => calculateSurvivalCore({ items }), [items])

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : "ok"

  function toggleSelected(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    )
  }

  function updatePower(id: string, powerW: number) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, powerW } : item)))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/systemy-podtrzymania-zycia" />
      <NaglowekEkranu tytul={t("UI-SYSPODZYC-SYSTEMY-PODTRZYMANIA-ZYCIA")} ekran="systemy-podtrzymania-zycia" wynik={result}>
        {t("UI-SYSPODZYC-LISTA-RZECZY-BEZ")}
      </NaglowekEkranu>

      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const def = DEFAULT_CRITICAL_LOADS.find((d) => d.id === item.id)
          return (
            <li key={item.id} className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/60">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                checked={item.selected}
                onChange={() => toggleSelected(item.id)}
                id={`item-${item.id}`}
              />
              <label htmlFor={`item-${item.id}`} className="flex-1 text-small font-medium">
                {item.label}
                {def?.defaultPowerW === null && (
                  <span className="block text-caption font-normal text-muted-foreground">
                    {t("UI-SYSPODZYC-BRAK-WARTOSCI-DOMYSLNEJ")}
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
                aria-label={t("UI-SYSPODZYC-MOC", { label: item.label })}
              />
              <span className="w-4 text-caption text-muted-foreground">W</span>
              <PomocPola ekran="systemy-podtrzymania-zycia" pole="moc" />
            </li>
          )
        })}
      </ul>

      {(() => {
        const dodatki = (
          <>
            {result.assumptions.length > 0 && (
              <ul className="mt-2 text-small opacity-90">
                {result.assumptions.map((a, i) => (
                  <li key={typeof a === "string" ? a : a.kod + i}>{t("UI-SYSPODZYC-ZALOZENIE")} {typeof a === "string" ? a : t(a.kod, a.params)}</li>
                ))}
              </ul>
            )}

            {result.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-small">
                {result.warnings.map((w) => (
                  <li key={w.code}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
                ))}
              </ul>
            )}
          </>
        )

        if (poziom === null) {
          return <StanPusty tytul={t("UI-SYSPODZYC-ZAZNACZ-PRZYNAJMNIEJ-JEDEN")}>{dodatki}</StanPusty>
        }
        return (
          <WerdyktPanel
            poziom={poziom}
            etykieta={poziom === "blad" ? t("UI-SYSPODZYC-POLICZYC-SPRAWDZ-ZAZNACZONE") : undefined}
          >
            {poziom !== "blad" && (
              <p className="mt-1 text-h1 font-semibold">
                {result.value.toFixed(0)} {result.unit}
              </p>
            )}
            {dodatki}
          </WerdyktPanel>
        )
      })()}
    </main>
  )
}
