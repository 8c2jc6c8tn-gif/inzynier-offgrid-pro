"use client"

import { useMemo } from "react"
import { calculatePorownanieTechnologii } from "@/lib/core/modules/baterie/porownanie-technologii/calculator"
import { CENA_STARTOWA_LABELS } from "@/lib/core/modules/baterie/porownanie-technologii/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type Tech = ReturnType<typeof calculatePorownanieTechnologii>["value"][number]

const KOLUMNY: Kolumna<Tech>[] = [
  { naglowek: "Technologia", render: (t) => <span className="font-medium">{t.label}</span> },
  { naglowek: "Cena startowa", render: (t) => CENA_STARTOWA_LABELS[t.cenaStartowa] },
  { naglowek: "Cykle (przy DoD)", render: (t) => t.cyklePrzyDodOpis },
  { naglowek: "Sprawność", render: (t) => (t.sprawnoscPct === null ? "—" : `${t.sprawnoscPct}%`) },
  { naglowek: "Waga/kWh", render: (t) => t.wagaKgPerKwhOpis },
  { naglowek: "Obsługa", render: (t) => t.obsluga },
  {
    naglowek: "Energia w cyklu życia",
    render: (t) => `${t.energiaCalkowitaKwh.toLocaleString("pl-PL")} kWh`,
    liczbowa: true,
  },
]

type FormularzStan = {
  pojemnoscKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscKwh: "",
}

export default function PorownanieTechnologiiMagazynowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("porownanie-technologii-magazynow", STAN_POCZATKOWY)
  const { pojemnoscKwh } = stan
  const setPojemnoscKwh = (a: string | ((p: string) => string)) =>
    setStan((prev) => ({ ...prev, pojemnoscKwh: typeof a === "function" ? a(prev.pojemnoscKwh) : a }))

  const result = useMemo(
    () =>
      calculatePorownanieTechnologii({
        pojemnoscKwh: pojemnoscKwh === "" ? undefined : Number(pojemnoscKwh),
      }),
    [pojemnoscKwh],
  )

  const isInvalid = result.status === "INVALID_INPUT"

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/porownanie-technologii-magazynow" />
      <NaglowekEkranu tytul="Porównanie technologii magazynów">
        Cena zakupu to nie to samo co koszt w całym cyklu życia — trzeba doliczyć wagę
        (konstrukcja podłogi), obsługę i realną liczbę cykli. Moduł 4, Ekran 30.
      </NaglowekEkranu>

      <Pole
        label="Planowana pojemność magazynu (opcjonalnie)"
        unit="kWh"
        type="number"
        inputMode="decimal"
        className="max-w-xs"
        placeholder="np. 45 — bez wpisania: porównanie na 1 kWh"
        value={pojemnoscKwh}
        onChange={(e) => setPojemnoscKwh(e.target.value)}
      />

      {isInvalid ? (
        <WerdyktPanel poziom="blad" etykieta={result.warnings[0]?.message} />
      ) : (
        <KartaPorownawcza kolumny={KOLUMNY} wiersze={result.value} minWidth={640} />
      )}

      {result.assumptions.length > 0 && (
        <ul className="text-small text-muted-foreground">
          {result.assumptions.map((a, i) => (
            <li key={typeof a === "string" ? a : a.kod + i}>Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}</li>
          ))}
        </ul>
      )}

      <p className="font-mono text-caption text-muted-foreground">{result.formula}</p>
    </main>
  )
}
