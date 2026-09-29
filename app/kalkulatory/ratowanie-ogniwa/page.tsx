"use client"

import { useMemo } from "react"
import { calculateRatowanieOgniwa } from "@/lib/core/modules/montaz-baterii/ratowanie-ogniwa/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { NAPIECIE_ZASILACZA_RATUNKOWEGO_V, PRAD_LADOWANIA_RATUNKOWEGO_A, PROG_BEZPIECZNEGO_RATUNKU_V } from "@/lib/core/modules/montaz-baterii/ratowanie-ogniwa/constants"

type FormularzStan = {
  napiecieOgniwaV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieOgniwaV: "",
}

export default function RatowanieOgniwaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ratowanie-ogniwa", STAN_POCZATKOWY)
  const { napiecieOgniwaV } = stan
  const setNapiecieOgniwaV = (a: string | ((p: string) => string)) =>
    setStan((prev) => ({ ...prev, napiecieOgniwaV: typeof a === "function" ? a(prev.napiecieOgniwaV) : a }))

  const result = useMemo(
    () => calculateRatowanieOgniwa({ napiecieOgniwaV: napiecieOgniwaV === "" ? null : Number(napiecieOgniwaV) }),
    [napiecieOgniwaV],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasWarning
          ? "uwaga"
          : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? "Nie da się policzyć — napięcie nie może być ujemne"
      : hasCritical
        ? "Nie ratuj — zalecana utylizacja"
        : hasWarning
          ? "Ratunek opcjonalny, nie zalecany"
          : "Ratunek standardową procedurą"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ratowanie-ogniwa" />
      <NaglowekEkranu
        tytul="Ratowanie głęboko rozładowanego ogniwa"
        ekran="ratowanie-ogniwa"
        parametry={{ progRatunku: PROG_BEZPIECZNEGO_RATUNKU_V, prad: PRAD_LADOWANIA_RATUNKOWEGO_A, napiecieZasilacza: NAPIECIE_ZASILACZA_RATUNKOWEGO_V }}
      >
        Głębokie rozładowanie to klinicznie „śmierć” ogniwa — czasem da się je obudzić, ale zwykle
        to już nieodwracalne uszkodzenie, i próba ratunku ma swoje realne ryzyko. Moduł 11, Ekran
        A9.
      </NaglowekEkranu>

      <Pole
        label="Zmierzone napięcie ogniwa"
        unit="V"
        type="number"
        inputMode="decimal"
        min={0}
        step="0.01"
        value={napiecieOgniwaV}
        onChange={(e) => setNapiecieOgniwaV(e.target.value)}
        pomoc={<PomocPola ekran="ratowanie-ogniwa" pole="napiecie" params={{ progRatunku: PROG_BEZPIECZNEGO_RATUNKU_V, prad: PRAD_LADOWANIA_RATUNKOWEGO_A, napiecieZasilacza: NAPIECIE_ZASILACZA_RATUNKOWEGO_V }} />}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz zmierzone napięcie, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
