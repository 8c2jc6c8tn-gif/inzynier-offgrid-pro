"use client"

import { useMemo } from "react"
import { calculateCopPompyCiepla } from "@/lib/core/modules/ogrzewanie/cop-pompy-ciepla/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"
import { COP_MAX, COP_MIN, MOC_CIEPLNA_KW_MAX } from "@/lib/core/modules/ogrzewanie/cop-pompy-ciepla/constants"

type FormularzStan = {
  mocCieplnaKw: string
  cop: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocCieplnaKw: "40",
  cop: "2.8",
}

export default function CopPompyCieplaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("cop-pompy-ciepla", STAN_POCZATKOWY)
  const { mocCieplnaKw, cop } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocCieplnaKw = (a: string | ((p: string) => string)) => setPole("mocCieplnaKw", a)
  const setCop = (a: string | ((p: string) => string)) => setPole("cop", a)

  const result = useMemo(
    () => calculateCopPompyCiepla({ mocCieplnaKw: Number(mocCieplnaKw), cop: Number(cop) }),
    [mocCieplnaKw, cop],
  )

  const poziom: WerdyktPoziom =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/cop-pompy-ciepla" />
      <NaglowekEkranu tytul="Pompa ciepła — COP w funkcji temperatury" ekran="cop-pompy-ciepla" wynik={result}>
        COP to „mnożnik” — pompa ciepła nie produkuje ciepła z niczego, tylko przenosi je z
        zewnątrz, zużywając mniej prądu niż grzałka elektryczna. Moduł 6, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zapotrzebowanie na moc cieplną"
          unit="kW"
          type="number"
          inputMode="decimal"
          value={mocCieplnaKw}
          onChange={(e) => setMocCieplnaKw(e.target.value)}
          pomoc={<PomocPola ekran="cop-pompy-ciepla" pole="moc" params={{ mocMax: MOC_CIEPLNA_KW_MAX }} />}
        />
        <Pole
          label="COP przy aktualnej temperaturze"
          unit="-"
          type="number"
          inputMode="decimal"
          value={cop}
          onChange={(e) => setCop(e.target.value)}
          pomoc={<PomocPola ekran="cop-pompy-ciepla" pole="cop" params={{ min: COP_MIN, max: COP_MAX }} />}
        />
      </div>

      <WerdyktPanel poziom={poziom}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe powyżej.</p>
        ) : (
          <p className="mt-1 text-h1 font-semibold">
            {result.value.toFixed(2)} {result.unit}
          </p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-small opacity-90">
            {result.assumptions.map((a, i) => (
              <li key={typeof a === "string" ? a : a.kod + i}>Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}</li>
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

        <p className="mt-3 font-mono text-caption opacity-70">{result.formula}</p>
      </WerdyktPanel>
    </main>
  )
}
