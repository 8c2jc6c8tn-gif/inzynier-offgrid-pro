"use client"

import { useMemo } from "react"
import { calculateKoniecLadowania } from "@/lib/core/modules/baterie/koniec-ladowania/calculator"
import { PRZYKLADOWY_PROG_KONCOWY_C } from "@/lib/core/modules/baterie/koniec-ladowania/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const ETYKIETY_FAZY: Record<string, string> = {
  CC: "UI-KONLAD-FAZA-STALY-PRAD",
  "CV-koncowka": "UI-KONLAD-FAZA-KONCOWKA-LADOWANIA",
  zakonczone: "UI-KONLAD-LADOWANIE-ZAKONCZONE",
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
      <NaglowekEkranu
        tytul={t("UI-KONLAD-ALGORYTM-KONCA-LADOWANIA")}
        ekran="koniec-ladowania"
        wynik={result}
      >
        {t("UI-KONLAD-NAPELNIANIE-BUTELKI-CISNIENI")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-KONLAD-POJEMNOSC-BATERII")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
          pomoc={<PomocPola ekran="koniec-ladowania" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-KONLAD-NAPIECIE-ABSORPCJI")}
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieAbsorpcjiV}
          onChange={(e) => setNapiecieAbsorpcjiV(e.target.value)}
          pomoc={<PomocPola ekran="koniec-ladowania" pole="napiecieAbsorpcji" />}
        />
        <Pole
          label={t("UI-KONLAD-PROG-PRADU-KONCOWEGO-2")}
          unit="C"
          type="number"
          inputMode="decimal"
          value={progKoncowyC}
          onChange={(e) => setProgKoncowyC(e.target.value)}
          pomoc={<PomocPola ekran="koniec-ladowania" pole="progKoncowy" params={{ progC: PRZYKLADOWY_PROG_KONCOWY_C }} />}
        />
        <Pole
          label={t("UI-KONLAD-AKTUALNY-PRAD-LIVE")}
          unit="A"
          type="number"
          inputMode="decimal"
          value={aktualnyPradA}
          onChange={(e) => setAktualnyPradA(e.target.value)}
          pomoc={<PomocPola ekran="koniec-ladowania" pole="prad" />}
        />
        <Pole
          label={t("UI-KONLAD-AKTUALNE-NAPIECIE-LIVE")}
          unit="V"
          type="number"
          inputMode="decimal"
          value={aktualneNapiecieV}
          onChange={(e) => setAktualneNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="koniec-ladowania" pole="napiecie" />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-KONLAD-WYPELNIJ-DANE-ZEBY")}
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel poziom={poziom} etykieta={t(ETYKIETY_FAZY[result.value.faza]!)}>
            <WynikGlowny>
              {t("UI-KONLAD-PROG-PRADU-KONCOWEGO", { pradKoncowyA: result.value.pradKoncowyA.toLocaleString("pl-PL", { maximumFractionDigits: 1 }) })}
            </WynikGlowny>
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-2 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
