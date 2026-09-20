"use client"

import { useMemo } from "react"
import { calculateSekwencjaMontazu } from "@/lib/core/modules/montaz-baterii/sekwencja-montazu/calculator"
import { PRESETY_LICZBY_OGNIW } from "@/lib/core/modules/montaz-baterii/sekwencja-montazu/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KrokZMedia } from "@/components/wzorce/krok-z-media"
import { StanPusty } from "@/components/ui/stany"

type FormularzStan = {
  preset: number
  wlasna: boolean
  liczbaOgniwWlasna: string
}

const STAN_POCZATKOWY: FormularzStan = {
  preset: 16,
  wlasna: false,
  liczbaOgniwWlasna: "",
}

export default function SekwencjaMontazuPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("sekwencja-montazu", STAN_POCZATKOWY)
  const { preset, wlasna, liczbaOgniwWlasna } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPreset = (a: number | ((p: number) => number)) => setPole("preset", a)
  const setWlasna = (a: boolean | ((p: boolean) => boolean)) => setPole("wlasna", a)
  const setLiczbaOgniwWlasna = (a: string | ((p: string) => string)) => setPole("liczbaOgniwWlasna", a)

  const liczbaOgniw = wlasna ? (liczbaOgniwWlasna === "" ? 0 : Number(liczbaOgniwWlasna)) : preset

  const result = useMemo(() => calculateSekwencjaMontazu({ liczbaOgniw }), [liczbaOgniw])

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "OUT_OF_SCOPE" || hasCritical ? "blad" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sekwencja-montazu" />
      <NaglowekEkranu tytul="Sekwencja montażu pakietu (busbary + BMS)">
        Dokładna, ponumerowana kolejność połączeń — dopasowana do liczby ogniw w Twoim pakiecie
        (4S/8S/16S lub inna parzysta liczba). Moduł 11, uzupełnienie A3/A4. Każdy krok ma miejsce
        na zdjęcie lub nagranie, gdy je dodasz.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Liczba ogniw w szeregu"
          value={wlasna ? "custom" : String(preset)}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setWlasna(true)
            } else {
              setWlasna(false)
              setPreset(Number(e.target.value))
            }
          }}
        >
          {PRESETY_LICZBY_OGNIW.map((n) => (
            <option key={n} value={n}>
              {n}S ({(n * 3.2).toFixed(1)} V nominalnie)
            </option>
          ))}
          <option value="custom">Inna liczba…</option>
        </PoleSelect>

        {wlasna && (
          <Pole
            label="Własna liczba ogniw"
            unit="szt."
            type="number"
            inputMode="numeric"
            min={0}
            value={liczbaOgniwWlasna}
            onChange={(e) => setLiczbaOgniwWlasna(e.target.value)}
            hint="Tylko parzysta liczba — układ dwurzędowy wymaga równego podziału."
          />
        )}
      </div>

      {result.status === "VALID" ? (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="text-small font-semibold text-muted-foreground">
              Krok 1 — Połączenia busbarów ({result.value.polaczeniaBusbarow.length})
            </h2>
            <ol className="flex flex-col gap-2">
              {result.value.polaczeniaBusbarow.map((p) => (
                <KrokZMedia
                  key={p.numer}
                  numer={p.numer}
                  tytul={`Plus ogniwa ${p.zOgniwa} → minus ogniwa ${p.doOgniwa}`}
                >
                  {p.miedzyRzedami && "Połączenie przechodzi między rzędami (dłuższy busbar)."}
                </KrokZMedia>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-small font-semibold text-muted-foreground">
              Krok 2 — Okablowanie BMS ({result.value.okablowanieBms.length} przewodów, w kolejności rosnącej)
            </h2>
            <ol className="flex flex-col gap-2">
              {result.value.okablowanieBms.map((w) => (
                <KrokZMedia key={w.numer} numer={w.numer} tytul={`${w.etykieta} → ${w.punkt}`}>
                  Napięcie nominalne względem B0: {w.napiecieNominalneV.toFixed(1)} V
                </KrokZMedia>
              ))}
            </ol>
          </div>
        </>
      ) : (
        <StanPusty tytul="Wybierz liczbę ogniw, żeby zobaczyć wygenerowaną sekwencję" />
      )}

      {poziom && (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            poziom === "ok"
              ? `Pakiet ${liczbaOgniw}S — ${result.value.napiecieCalkowiteNominalneV.toFixed(1)} V nominalnie`
              : undefined
          }
        >
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
