"use client"

import { useMemo } from "react"
import { calculateKoniecLadowania } from "@/lib/core/modules/baterie/koniec-ladowania/calculator"
import { PRZYKLADOWY_PROG_KONCOWY_C } from "@/lib/core/modules/baterie/koniec-ladowania/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const ETYKIETY_FAZY: Record<string, string> = {
  CC: "Faza CC (stały prąd)",
  "CV-koncowka": "Faza CV — końcówka ładowania",
  zakonczone: "Ładowanie zakończone",
}

type FormularzStan = {
  pojemnoscAh: string
  napiecieAbsorpcjiV: string
  progKoncowyC: string
  aktualnyPradA: string
  aktualneNapiecieV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscAh: "",
  napiecieAbsorpcjiV: "",
  progKoncowyC: String(PRZYKLADOWY_PROG_KONCOWY_C),
  aktualnyPradA: "",
  aktualneNapiecieV: "",
}

export default function KoniecLadowaniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("koniec-ladowania", STAN_POCZATKOWY)
  const { pojemnoscAh, napiecieAbsorpcjiV, progKoncowyC, aktualnyPradA, aktualneNapiecieV } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscAh = (a: string | ((p: string) => string)) => setPole("pojemnoscAh", a)
  const setNapiecieAbsorpcjiV = (a: string | ((p: string) => string)) => setPole("napiecieAbsorpcjiV", a)
  const setProgKoncowyC = (a: string | ((p: string) => string)) => setPole("progKoncowyC", a)
  const setAktualnyPradA = (a: string | ((p: string) => string)) => setPole("aktualnyPradA", a)
  const setAktualneNapiecieV = (a: string | ((p: string) => string)) => setPole("aktualneNapiecieV", a)

  const result = useMemo(
    () =>
      calculateKoniecLadowania({
        pojemnoscAh: pojemnoscAh === "" ? 0 : Number(pojemnoscAh),
        napiecieAbsorpcjiV: napiecieAbsorpcjiV === "" ? 0 : Number(napiecieAbsorpcjiV),
        progKoncowyC: progKoncowyC === "" ? 0 : Number(progKoncowyC),
        aktualnyPradA: aktualnyPradA === "" ? null : Number(aktualnyPradA),
        aktualneNapiecieV: aktualneNapiecieV === "" ? null : Number(aktualneNapiecieV),
      }),
    [pojemnoscAh, napiecieAbsorpcjiV, progKoncowyC, aktualnyPradA, aktualneNapiecieV],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/koniec-ladowania" />
      <NaglowekEkranu tytul="Algorytm końca ładowania (Tail Current / Absorption)">
        To jak napełnianie butelki — ciśnienie już jest, ale trzeba chwilę odczekać, żeby woda
        dotarła do samego końca. Moduł 4, Ekran 13.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność baterii"
          unit="Ah"
          type="number"
          inputMode="decimal"
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
        />
        <Pole
          label="Napięcie absorpcji"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieAbsorpcjiV}
          onChange={(e) => setNapiecieAbsorpcjiV(e.target.value)}
        />
        <Pole
          label="Próg prądu końcowego"
          unit="C"
          type="number"
          inputMode="decimal"
          value={progKoncowyC}
          onChange={(e) => setProgKoncowyC(e.target.value)}
          hint={`Przykład ze źródła: ${PRZYKLADOWY_PROG_KONCOWY_C}C.`}
        />
        <Pole
          label="Aktualny prąd (live)"
          unit="A"
          type="number"
          inputMode="decimal"
          value={aktualnyPradA}
          onChange={(e) => setAktualnyPradA(e.target.value)}
        />
        <Pole
          label="Aktualne napięcie (live)"
          unit="V"
          type="number"
          inputMode="decimal"
          value={aktualneNapiecieV}
          onChange={(e) => setAktualneNapiecieV(e.target.value)}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć etap ładowania.
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel poziom={poziom} etykieta={ETYKIETY_FAZY[result.value.faza]}>
            <WynikGlowny>
              Próg prądu końcowego: {result.value.pradKoncowyA.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} A
            </WynikGlowny>
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-2 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
