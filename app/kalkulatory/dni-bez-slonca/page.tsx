"use client"

import { useMemo } from "react"
import { calculateDniBezSlonca } from "@/lib/core/modules/kalkulator-mobilny/dni-bez-slonca/calculator"
import {
  DOD_LIFEPO4_TYPOWY_MAX_PCT,
  DOD_LIFEPO4_TYPOWY_MIN_PCT,
  SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT,
} from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  pojemnoscAh: string
  napiecieV: string
  dodPct: string
  sprawnoscPct: string
  zuzycieDoboweWh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscAh: "",
  napiecieV: "",
  dodPct: "",
  sprawnoscPct: "",
  zuzycieDoboweWh: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function DniBezSloncaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dni-bez-slonca", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateDniBezSlonca({
        pojemnoscAh: liczba(stan.pojemnoscAh),
        napiecieV: liczba(stan.napiecieV),
        dodPct: liczba(stan.dodPct),
        sprawnoscPct: liczba(stan.sprawnoscPct),
        zuzycieDoboweWh: liczba(stan.zuzycieDoboweWh),
      }),
    [stan],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dni-bez-slonca" />
      <NaglowekEkranu tytul="Ile dni pracy bez słońca — mały zestaw" ekran="dni-bez-slonca" wynik={result}>
        Na ile pochmurnych dni starczy akumulator, który już masz — bez żadnego doładowania. Moduł 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność akumulatora"
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pojemnoscAh}
          onChange={ustaw("pojemnoscAh")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="pojemnosc" />}
        />
        <Pole
          label="Napięcie akumulatora"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.napiecieV}
          onChange={ustaw("napiecieV")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="napiecie" />}
        />
        <Pole
          label="Dopuszczalne rozładowanie (DoD)"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.dodPct}
          onChange={ustaw("dodPct")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="dod" params={{ dodMin: DOD_LIFEPO4_TYPOWY_MIN_PCT, dodMax: DOD_LIFEPO4_TYPOWY_MAX_PCT }} />}
        />
        <Pole
          label="Sprawność przetwornicy"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.sprawnoscPct}
          onChange={ustaw("sprawnoscPct")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="sprawnosc" params={{ sprawnosc: SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT }} />}
        />
        <Pole
          label="Zużycie na dobę"
          unit="Wh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zuzycieDoboweWh}
          onChange={ustaw("zuzycieDoboweWh")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="zuzycie" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Praca bez doładowania">
          <WynikGlowny>{f1(result.value.dni)} dni</WynikGlowny>
          <p className="mt-1 text-small">
            Pełnych dób: {f0(result.value.pelneDoby)} · energia do wykorzystania: {f0(result.value.energiaDostepnaWh)} Wh
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
