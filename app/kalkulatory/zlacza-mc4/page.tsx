"use client"

import { useMemo } from "react"
import { calculateZlaczaMc4 } from "@/lib/core/modules/okablowanie/zlacza-mc4/calculator"
import { PRODUCENCI_MC4 } from "@/lib/core/modules/okablowanie/zlacza-mc4/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  producentZenski: string
  producentMeski: string
}

const STAN_POCZATKOWY: FormularzStan = { producentZenski: "", producentMeski: "" }

export default function ZlaczaMc4Page() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zlacza-mc4", STAN_POCZATKOWY)
  const { producentZenski, producentMeski } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const result = useMemo(
    () => calculateZlaczaMc4({ producentZenski, producentMeski }),
    [producentZenski, producentMeski],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wybierz producenta po obu stronach",
    red: "Zabronione — ryzyko łukowania i pożaru",
    green: result.value.zgodne ? "Złącza zgodne" : "Zgodności nie da się potwierdzić",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zlacza-mc4" />
      <NaglowekEkranu tytul="Złącza MC4">
        MC4 wygląda uniwersalnie, ale styki różnych producentów nie zawsze pasują idealnie — luźny
        styk pod prądem robi łuk elektryczny, a to już realny pożar. Moduł 5, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Złączka żeńska — producent/rodzina"
          value={producentZenski}
          onChange={(e) => setPole("producentZenski", e.target.value)}
        >
          <option value="">— wybierz —</option>
          {PRODUCENCI_MC4.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label="Złączka męska — producent/rodzina"
          value={producentMeski}
          onChange={(e) => setPole("producentMeski", e.target.value)}
        >
          <option value="">— wybierz —</option>
          {PRODUCENCI_MC4.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </PoleSelect>
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>{result.value.zgodne ? "Komplet od jednego producenta" : "Nie łącz różnych producentów"}</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
