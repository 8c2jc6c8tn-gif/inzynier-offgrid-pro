"use client"

import { useMemo } from "react"
import { calculateUpsKrytyczny } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/calculator"
import { DOMYSLNE_URZADZENIA_KRYTYCZNE } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/constants"
import type { UrzadzenieKrytyczne } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const initialItems: UrzadzenieKrytyczne[] = DOMYSLNE_URZADZENIA_KRYTYCZNE.map((def) => ({
  id: def.id,
  label: def.label,
  selected: false,
  powerW: 0,
}))

const INLINE_INPUT_KLASY =
  "w-24 min-h-11 rounded-md border border-input bg-background px-2 text-body outline-none transition-colors " +
  "hover:not-disabled:border-foreground/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"

type FormularzStan = {
  urzadzenia: UrzadzenieKrytyczne[]
  pojemnoscAh: string
  napiecieV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  urzadzenia: initialItems,
  pojemnoscAh: "",
  napiecieV: "",
}

export default function UpsKrytycznyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ups-krytyczny", STAN_POCZATKOWY)
  const { urzadzenia, pojemnoscAh, napiecieV } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setUrzadzenia = (a: UrzadzenieKrytyczne[] | ((p: UrzadzenieKrytyczne[]) => UrzadzenieKrytyczne[])) => setPole("urzadzenia", a)
  const setPojemnoscAh = (a: string | ((p: string) => string)) => setPole("pojemnoscAh", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)

  const result = useMemo(
    () =>
      calculateUpsKrytyczny({
        urzadzenia,
        pojemnoscAh: pojemnoscAh === "" ? 0 : Number(pojemnoscAh),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
      }),
    [urzadzenia, pojemnoscAh, napiecieV],
  )

  const hasWarning = result.warnings.some((w) => w.level === "warning")

  function toggleSelected(id: string) {
    setUrzadzenia((prev) => prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u)))
  }

  function updatePower(id: string, powerW: number) {
    setUrzadzenia((prev) => prev.map((u) => (u.id === id ? { ...u, powerW } : u)))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ups-krytyczny" />
      <NaglowekEkranu tytul={t("UI-UPSKRY-UPS-KRYTYCZNY-DOBOR")} ekran="ups-krytyczny" wynik={result}>
        {t("UI-UPSKRY-POZARZE-CZESTO-PADA")}
      </NaglowekEkranu>

      <ul className="flex flex-col gap-3">
        {urzadzenia.map((u) => (
          <li key={u.id} className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/60">
            <input
              type="checkbox"
              className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
              checked={u.selected}
              onChange={() => toggleSelected(u.id)}
              id={`urzadzenie-${u.id}`}
            />
            <label htmlFor={`urzadzenie-${u.id}`} className="flex-1 text-small font-medium">
              {u.label}
              <span className="block text-caption font-normal text-muted-foreground">
                {t("UI-UPSKRY-BRAK-WARTOSCI-DOMYSLNEJ")}
              </span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              className={INLINE_INPUT_KLASY}
              value={u.powerW}
              disabled={!u.selected}
              onChange={(e) => updatePower(u.id, Number(e.target.value))}
              aria-label={t("UI-UPSKRY-MOC", { label: u.label })}
            />
            <span className="w-4 text-caption text-muted-foreground">W</span>
            <PomocPola ekran="ups-krytyczny" pole="mocUrzadzenia" />
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-UPSKRY-POJEMNOSC-AKUMULATORA-UPS")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
          pomoc={<PomocPola ekran="ups-krytyczny" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-UPSKRY-NAPIECIE-SYSTEMU-UPS")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="ups-krytyczny" pole="napiecie" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-UPSKRY-POLICZYC-SPRAWDZ-ZAZNACZONE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-UPSKRY-ZAZNACZ-PRZYNAJMNIEJ-JEDNO")}
        </p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t("UI-UPSKRY-CZAS-PODTRZYMANIA")}>
          <WynikGlowny>{result.value.czasPodtrzymaniaH.toFixed(2)} h</WynikGlowny>
          <p className="mt-2 text-small">{t("UI-UPSKRY-LACZNY-POBOR-MOCY", { laczonyPoborW: result.value.laczonyPoborW.toFixed(0) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
