"use client"

import { useMemo } from "react"
import { calculateDniAutonomii } from "@/lib/core/modules/zapotrzebowanie/dni-autonomii/calculator"
import { OPCJE_DNI_AUTONOMII } from "@/lib/core/modules/zapotrzebowanie/dni-autonomii/constants"
import type { DniAutonomiiInput } from "@/lib/core/modules/zapotrzebowanie/dni-autonomii/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  dniAutonomii: DniAutonomiiInput["dniAutonomii"]
  zapotrzebowanieDoboweKwh: string
  sprawnoscFalownikaPct: string
  dodPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dniAutonomii: 0,
  zapotrzebowanieDoboweKwh: "",
  sprawnoscFalownikaPct: "",
  dodPct: "",
}

export default function DniAutonomiiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dni-autonomii", STAN_POCZATKOWY)
  const { dniAutonomii, zapotrzebowanieDoboweKwh, sprawnoscFalownikaPct, dodPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDniAutonomii = (
    a: DniAutonomiiInput["dniAutonomii"] | ((p: DniAutonomiiInput["dniAutonomii"]) => DniAutonomiiInput["dniAutonomii"]),
  ) => setPole("dniAutonomii", a)
  const setZapotrzebowanieDoboweKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieDoboweKwh", a)
  const setSprawnoscFalownikaPct = (a: string | ((p: string) => string)) => setPole("sprawnoscFalownikaPct", a)
  const setDodPct = (a: string | ((p: string) => string)) => setPole("dodPct", a)

  const result = useMemo(
    () =>
      calculateDniAutonomii({
        dniAutonomii,
        zapotrzebowanieDoboweKwh: zapotrzebowanieDoboweKwh === "" ? 0 : Number(zapotrzebowanieDoboweKwh),
        sprawnoscFalownikaPct: sprawnoscFalownikaPct === "" ? 0 : Number(sprawnoscFalownikaPct),
        dodPct: dodPct === "" ? 0 : Number(dodPct),
      }),
    [dniAutonomii, zapotrzebowanieDoboweKwh, sprawnoscFalownikaPct, dodPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dni-autonomii" />
      <NaglowekEkranu tytul="Dni autonomii">
        Im więcej dni bez słońca system ma wytrzymać wyłącznie na baterii, tym większy (i droższy)
        musi być magazyn energii. Wartość stąd docelowo zasila Moduł 4, Ekran 1 (dobór pojemności
        baterii). Moduł 2, Ekran 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Dni autonomii"
          value={dniAutonomii}
          onChange={(e) => setDniAutonomii(Number(e.target.value) as DniAutonomiiInput["dniAutonomii"])}
        >
          <option value={0}>— wybierz —</option>
          {OPCJE_DNI_AUTONOMII.map((opcja) => (
            <option key={opcja} value={opcja}>
              {opcja} {opcja === 1 ? "dzień" : "dni"}
            </option>
          ))}
        </PoleSelect>

        <p className="text-small text-muted-foreground">
          Opcjonalnie — podgląd na żywo szacunkowego wpływu na wielkość magazynu (te same dane co
          Moduł 4, Ekran 1):
        </p>
        <Pole
          label="Zapotrzebowanie dobowe"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieDoboweKwh}
          onChange={(e) => setZapotrzebowanieDoboweKwh(e.target.value)}
        />
        <Pole
          label="Sprawność falownika"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscFalownikaPct}
          onChange={(e) => setSprawnoscFalownikaPct(e.target.value)}
        />
        <Pole
          label="DoD (głębokość rozładowania)"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={dodPct}
          onChange={(e) => setDodPct(e.target.value)}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz dni autonomii, żeby zobaczyć wynik.</p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">Sprawdź wpisane opcjonalne dane — coś jest poza zakresem.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Wybrane dni autonomii">
          <WynikGlowny>
            {result.value.dniAutonomii} {result.value.dniAutonomii === 1 ? "dzień" : "dni"}
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
