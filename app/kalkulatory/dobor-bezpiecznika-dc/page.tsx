"use client"

import { useMemo } from "react"
import { calculateDoborBezpiecznika } from "@/lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { MIN_AIC_LIFEPO4_A } from "@/lib/core/modules/baterie/dobor-bezpiecznika-dc/constants"

type FormularzStan = {
  napiecieBateriiV: string
  rezystancjaWewnetrznaOhm: string
  aicBezpiecznikaA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieBateriiV: "48",
  rezystancjaWewnetrznaOhm: "0.01",
  aicBezpiecznikaA: "20000",
}

export default function DoborBezpiecznikaDcPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-bezpiecznika-dc", STAN_POCZATKOWY)
  const { napiecieBateriiV, rezystancjaWewnetrznaOhm, aicBezpiecznikaA } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setNapiecieBateriiV = (a: string | ((p: string) => string)) => setPole("napiecieBateriiV", a)
  const setRezystancjaWewnetrznaOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaWewnetrznaOhm", a)
  const setAicBezpiecznikaA = (a: string | ((p: string) => string)) => setPole("aicBezpiecznikaA", a)

  const result = useMemo(
    () =>
      calculateDoborBezpiecznika({
        napiecieBateriiV: Number(napiecieBateriiV),
        rezystancjaWewnetrznaOhm: Number(rezystancjaWewnetrznaOhm),
        aicBezpiecznikaA: Number(aicBezpiecznikaA),
      }),
    [napiecieBateriiV, rezystancjaWewnetrznaOhm, aicBezpiecznikaA],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : hasCritical
        ? "red"
        : hasWarning
          ? "yellow"
          : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    red: "Zabronione",
    yellow: "Dopuszczalne, ale poniżej zalecanego minimum",
    green: "Zalecane",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-bezpiecznika-dc" />
      <NaglowekEkranu
        tytul="Dobór bezpiecznika DC"
        ekran="dobor-bezpiecznika-dc"
        wzor={result.formula}
        parametry={{ minAic: MIN_AIC_LIFEPO4_A }}
      >
        Bezpiecznik musi umieć ugasić pożar elektryczny, a nie tylko się przepalić — źle dobrany
        pod względem AIC sam staje się źródłem łuku elektrycznego. Moduł 4, Ekran 24.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie baterii"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieBateriiV}
          onChange={(e) => setNapiecieBateriiV(e.target.value)}
          pomoc={<PomocPola ekran="dobor-bezpiecznika-dc" pole="napiecie" />}
        />
        <Pole
          label="Rezystancja wewnętrzna pakietu"
          unit="Ω"
          type="number"
          inputMode="decimal"
          value={rezystancjaWewnetrznaOhm}
          onChange={(e) => setRezystancjaWewnetrznaOhm(e.target.value)}
          pomoc={<PomocPola ekran="dobor-bezpiecznika-dc" pole="rezystancja" />}
        />
        <Pole
          label="AIC wybranego bezpiecznika"
          unit="A"
          type="number"
          inputMode="decimal"
          value={aicBezpiecznikaA}
          onChange={(e) => setAicBezpiecznikaA(e.target.value)}
          pomoc={<PomocPola ekran="dobor-bezpiecznika-dc" pole="aic" params={{ minAic: MIN_AIC_LIFEPO4_A }} />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {result.status !== "INVALID_INPUT" && (
          <WynikGlowny>I_zw = {result.value.pradZwarciowyA.toLocaleString("pl-PL")} A</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
