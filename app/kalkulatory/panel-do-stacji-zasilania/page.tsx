"use client"

import { useMemo } from "react"
import { calculatePanelDoStacjiZasilania } from "@/lib/core/modules/kalkulator-mobilny/panel-do-stacji-zasilania/calculator"
import {
  BETA_TYPOWA_MAX_PCT_NA_C,
  BETA_TYPOWA_MIN_PCT_NA_C,
  TEMPERATURA_REFERENCYJNA_STC_C,
} from "@/lib/core/modules/pv/stress-test-mppt/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  vocStcV: string
  betaPctNaC: string
  tminC: string
  liczbaSzeregowo: string
  maxNapiecieWejsciaV: string
  iscA: string
  liczbaRownolegle: string
  maxPradWejsciaA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  vocStcV: "",
  betaPctNaC: "",
  tminC: "",
  liczbaSzeregowo: "",
  maxNapiecieWejsciaV: "",
  iscA: "",
  liczbaRownolegle: "",
  maxPradWejsciaA: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function PanelDoStacjiZasilaniaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("panel-do-stacji-zasilania", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculatePanelDoStacjiZasilania({
        vocStcV: liczba(stan.vocStcV),
        betaPctNaC: liczba(stan.betaPctNaC),
        tminC: stan.tminC === "" ? null : Number(stan.tminC),
        liczbaSzeregowo: liczba(stan.liczbaSzeregowo),
        maxNapiecieWejsciaV: liczba(stan.maxNapiecieWejsciaV),
        iscA: liczba(stan.iscA),
        liczbaRownolegle: liczba(stan.liczbaRownolegle),
        maxPradWejsciaA: liczba(stan.maxPradWejsciaA),
      }),
    [stan],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical")
    ? "blad"
    : result.warnings.some((w) => w.level === "warning")
      ? "uwaga"
      : "ok"
  const etykieta = { blad: "Przekroczony limit wejścia stacji", uwaga: "Na granicy — sprawdź", ok: "Można podłączyć" }[poziom]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/panel-do-stacji-zasilania" />
      <NaglowekEkranu
        tytul="Łączenie paneli ze stacją zasilania / powerbankiem"
        ekran="panel-do-stacji-zasilania"
        wynik={result}
        parametry={{ tStc: TEMPERATURA_REFERENCYJNA_STC_C }}
      >
        Stacje zasilania mają niższe limity wejścia niż profesjonalne regulatory MPPT — panel dobrany pod „dorosłą”
        instalację łatwo je uszkodzi, zwłaszcza w mrozie. Moduł 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label="Voc panelu (STC)" unit="V" type="number" inputMode="decimal" min={0} value={stan.vocStcV} onChange={ustaw("vocStcV")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="voc" />} />
        <Pole
          label="Współczynnik temperaturowy Voc (β)"
          unit="%/°C"
          type="number"
          inputMode="decimal"
          value={stan.betaPctNaC}
          onChange={ustaw("betaPctNaC")}
          pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="beta" params={{ betaMin: BETA_TYPOWA_MIN_PCT_NA_C, betaMax: BETA_TYPOWA_MAX_PCT_NA_C }} />}
        />
        <Pole label="Najniższa temperatura pracy" unit="°C" type="number" inputMode="decimal" value={stan.tminC} onChange={ustaw("tminC")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="tmin" />} />
        <Pole label="Paneli połączonych szeregowo" type="number" inputMode="numeric" min={0} value={stan.liczbaSzeregowo} onChange={ustaw("liczbaSzeregowo")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="szeregowo" />} />
        <Pole label="Max napięcie wejścia solarnego stacji" unit="V" type="number" inputMode="decimal" min={0} value={stan.maxNapiecieWejsciaV} onChange={ustaw("maxNapiecieWejsciaV")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="limitNapiecia" />} />
        <p className="text-small text-muted-foreground">Opcjonalnie — sprawdzenie prądu:</p>
        <Pole label="Prąd zwarciowy panelu (Isc)" unit="A" type="number" inputMode="decimal" min={0} value={stan.iscA} onChange={ustaw("iscA")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="isc" />} />
        <Pole label="Gałęzi równoległych" type="number" inputMode="numeric" min={0} value={stan.liczbaRownolegle} onChange={ustaw("liczbaRownolegle")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="rownolegle" />} />
        <Pole label="Max prąd wejścia solarnego stacji" unit="A" type="number" inputMode="decimal" min={0} value={stan.maxPradWejsciaA} onChange={ustaw("maxPradWejsciaA")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="limitPradu" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij pięć pierwszych pól, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>{f1(result.value.vocZimoweV)} V</WynikGlowny>
          <p className="mt-1 text-small">
            {f0(result.value.udzialLimituPct)}% limitu wejścia
            {result.value.pradZwarciowyA !== null && ` · prąd zwarciowy ${f1(result.value.pradZwarciowyA)} A`}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
