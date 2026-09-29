"use client"

import { useMemo } from "react"
import { calculateGrzalkiBmsMroz } from "@/lib/core/modules/baterie/grzalki-bms-mroz/calculator"
import {
  PROG_SOC_WSTRZYMANIA_PCT,
  PROG_TEMPERATURY_GRZANIA_C,
  PRZYKLADY_BILANSU_GRZANIA,
} from "@/lib/core/modules/baterie/grzalki-bms-mroz/constants"
import type { ProdukcjaPv } from "@/lib/core/modules/baterie/grzalki-bms-mroz/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const ETYKIETY_ZRODLA: Record<string, string> = {
  "brak-potrzeby": "Grzanie niepotrzebne",
  pv: "Grzanie z PV",
  bateria: "Grzanie z baterii",
  wstrzymane: "Grzanie wstrzymane",
}

type FormularzStan = {
  temperaturaMinC: string
  socPct: string
  produkcjaPv: ProdukcjaPv
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaMinC: "",
  socPct: "",
  produkcjaPv: "",
}

export default function GrzalkiBmsMrozPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("grzalki-bms-mroz", STAN_POCZATKOWY)
  const { temperaturaMinC, socPct, produkcjaPv } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTemperaturaMinC = (a: string | ((p: string) => string)) => setPole("temperaturaMinC", a)
  const setSocPct = (a: string | ((p: string) => string)) => setPole("socPct", a)
  const setProdukcjaPv = (a: ProdukcjaPv | ((p: ProdukcjaPv) => ProdukcjaPv)) => setPole("produkcjaPv", a)

  const result = useMemo(
    () =>
      calculateGrzalkiBmsMroz({
        temperaturaMinC: temperaturaMinC === "" ? null : Number(temperaturaMinC),
        socPct: socPct === "" ? 0 : Number(socPct),
        produkcjaPv,
      }),
    [temperaturaMinC, socPct, produkcjaPv],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const werdykt =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : result.status === "OUT_OF_SCOPE"
          ? "out-of-scope"
          : hasCritical
            ? "red"
            : result.status === "VALID_WITH_WARNINGS"
              ? "yellow"
              : "green"

  const werdyktPoziom: Record<Exclude<typeof werdykt, "incomplete" | "out-of-scope">, WerdyktPoziom> = {
    invalid: "blad",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const werdyktEtykieta: Record<Exclude<typeof werdykt, "incomplete" | "out-of-scope">, string> = {
    invalid: "Nie da się ocenić — sprawdź wpisane dane",
    red: "Grzanie wstrzymane — ładowanie zablokowane",
    yellow: "Grzanie z baterii",
    green: ETYKIETY_ZRODLA[result.value.zrodloGrzania] ?? "Zalecane",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/grzalki-bms-mroz" />
      <NaglowekEkranu
        tytul="Grzałki BMS i ochrona przed mrozem"
        ekran="grzalki-bms-mroz"
        parametry={{ progTemp: PROG_TEMPERATURY_GRZANIA_C, progSoc: PROG_SOC_WSTRZYMANIA_PCT }}
      >
        Nie marnuj prądu z baterii na grzanie, jeśli za chwilę słońce zrobi to za darmo — system
        sam to policzy i wybierze mądrzejszy moment. Moduł 4, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Najniższa spodziewana temperatura przy baterii"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaMinC}
          onChange={(e) => setTemperaturaMinC(e.target.value)}
          pomoc={<PomocPola ekran="grzalki-bms-mroz" pole="temperatura" params={{ progTemp: PROG_TEMPERATURY_GRZANIA_C, progSoc: PROG_SOC_WSTRZYMANIA_PCT }} />}
        />
        <Pole
          label="Bieżący SoC baterii"
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={socPct}
          onChange={(e) => setSocPct(e.target.value)}
          pomoc={<PomocPola ekran="grzalki-bms-mroz" pole="soc" params={{ progTemp: PROG_TEMPERATURY_GRZANIA_C, progSoc: PROG_SOC_WSTRZYMANIA_PCT }} />}
        />
        <PoleSelect
          label="Czy w tej chwili jest produkcja PV"
          value={produkcjaPv}
          onChange={(e) => setProdukcjaPv(e.target.value as ProdukcjaPv)}
          pomoc={<PomocPola ekran="grzalki-bms-mroz" pole="pv" />}
        >
          <option value="">— wybierz —</option>
          <option value="tak">Tak</option>
          <option value="nie">Nie</option>
        </PoleSelect>
      </div>

      {werdykt === "incomplete" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć, skąd BMS weźmie prąd na grzanie.
        </p>
      ) : werdykt === "out-of-scope" ? (
        <WerdyktPanel poziom="uwaga" etykieta="Granica nierozstrzygnięta w źródle">
          <p className="text-small">
            Przy SoC dokładnie {PROG_SOC_WSTRZYMANIA_PCT}% źródło nie rozstrzyga, czy grzanie z
            baterii jest jeszcze dozwolone, czy już wstrzymane (podaje osobno „powyżej” i
            „poniżej” progu, nie „na progu”). Zmień SoC choć trochę w górę lub w dół, żeby
            zobaczyć jednoznaczną ocenę.
          </p>
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={werdyktPoziom[werdykt]} etykieta={werdyktEtykieta[werdykt]}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} warnings={[]} />
        </WerdyktPanel>
      )}

      <div className="rounded-lg border bg-muted/30 p-4 text-caption text-muted-foreground">
        <p className="font-medium text-foreground">
          Dodatkowy bilans energii na grzanie (nie liczony automatycznie)
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {PRZYKLADY_BILANSU_GRZANIA.map((tekst) => (
            <li key={tekst}>{tekst}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
