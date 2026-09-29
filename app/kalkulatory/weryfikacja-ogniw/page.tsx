"use client"

import { useMemo } from "react"
import { calculateWeryfikacjaOgniw } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/calculator"
import { CHECKLIST_ITEMS, OCZEKIWANA_LICZBA_OGNIW } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/constants"
import type { NapiecieSystemu } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/input"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { MAX_ROZNICA_NAPIEC_V } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/constants"

type FormularzStan = {
  napiecieSystemu: NapiecieSystemu
  napieciaOgniwV: number[]
  bmsMaBalancer: boolean
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieSystemu: 48,
  napieciaOgniwV: Array(OCZEKIWANA_LICZBA_OGNIW[48]).fill(0),
  bmsMaBalancer: false,
  potwierdzoneIds: [],
}

export default function WeryfikacjaOgniwPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("weryfikacja-ogniw", STAN_POCZATKOWY)
  const { napiecieSystemu, napieciaOgniwV, bmsMaBalancer, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setNapiecieSystemu = (a: NapiecieSystemu | ((p: NapiecieSystemu) => NapiecieSystemu)) => setPole("napiecieSystemu", a)
  const setNapieciaOgniwV = (a: number[] | ((p: number[]) => number[])) => setPole("napieciaOgniwV", a)
  const setBmsMaBalancer = (a: boolean | ((p: boolean) => boolean)) => setPole("bmsMaBalancer", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () => calculateWeryfikacjaOgniw({ napiecieSystemu, napieciaOgniwV, bmsMaBalancer, potwierdzoneIds }),
    [napiecieSystemu, napieciaOgniwV, bmsMaBalancer, potwierdzoneIds],
  )

  function zmienNapiecieSystemu(value: NapiecieSystemu) {
    setNapiecieSystemu(value)
    setNapieciaOgniwV(Array(OCZEKIWANA_LICZBA_OGNIW[value]).fill(0))
  }

  function zmienLiczbeOgniw(liczba: number) {
    const bezpiecznaLiczba = Math.max(0, Math.min(24, Math.round(liczba)))
    setNapieciaOgniwV((prev) => {
      const nowa = prev.slice(0, bezpiecznaLiczba)
      while (nowa.length < bezpiecznaLiczba) nowa.push(0)
      return nowa
    })
  }

  function zmienNapiecieOgniwa(index: number, value: number) {
    setNapieciaOgniwV((prev) => prev.map((v, i) => (i === index ? value : v)))
  }

  function toggleChecklist(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

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
      ? "Nie da się policzyć — sprawdź wpisane napięcia"
      : hasCritical
        ? "Zabronione — nie łącz ogniw w pakiet"
        : hasWarning
          ? "Dopuszczalne, sprawdź ostrzeżenia"
          : "Gotowe do montażu"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/weryfikacja-ogniw" />
      <NaglowekEkranu
        tytul="Weryfikacja kompletności i kontrola wstępna ogniw"
        ekran="weryfikacja-ogniw" wynik={result}
        parametry={{ maxRoznica: MAX_ROZNICA_NAPIEC_V }}
      >
        Zanim ogniwa trafią do wspólnego pakietu, muszą przejść tę kontrolę — złe dobranie liczby
        ogniw albo zbyt duża różnica napięć między nimi to najczęstsza przyczyna problemów przy
        budowie własnego pakietu LiFePO4. Moduł 11, Ekran A1.
      </NaglowekEkranu>

      <PoleSelect
        label="Napięcie systemu"
        value={napiecieSystemu}
        onChange={(e) => zmienNapiecieSystemu(Number(e.target.value) as NapiecieSystemu)}
        pomoc={<PomocPola ekran="weryfikacja-ogniw" pole="napiecieSystemu" />}
      >
        <option value={12}>12 V (4S)</option>
        <option value={24}>24 V (8S)</option>
        <option value={48}>48 V (16S)</option>
      </PoleSelect>

      <Pole
        label="Liczba ogniw w pakiecie"
        type="number"
        inputMode="numeric"
        min={0}
        max={24}
        value={napieciaOgniwV.length}
        onChange={(e) => zmienLiczbeOgniw(Number(e.target.value))}
        pomoc={<PomocPola ekran="weryfikacja-ogniw" pole="liczbaOgniw" />}
      />

      {napieciaOgniwV.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-small font-medium">Napięcie każdego ogniwa</span>
          <div className="grid grid-cols-4 gap-2">
            {napieciaOgniwV.map((v, i) => (
              <Pole
                key={i}
                label={`#${i + 1}`}
                unit="V"
                type="number"
                inputMode="decimal"
                step="0.001"
                value={v || ""}
                onChange={(e) => zmienNapiecieOgniwa(i, Number(e.target.value))}
                pomoc={<PomocPola ekran="weryfikacja-ogniw" pole="napiecieOgniwa" params={{ maxRoznica: MAX_ROZNICA_NAPIEC_V }} />}
              />
            ))}
          </div>
        </div>
      )}

      <PoleCheckbox
        id="bms-balancer"
        label="BMS ma przewody balansujące (balancer)"
        checked={bmsMaBalancer}
        onChange={(e) => setBmsMaBalancer(e.target.checked)}
      />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggleChecklist}
        renderLabel={(item) => item.element}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz napięcia wszystkich ogniw, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          {result.status !== "INVALID_INPUT" && result.value.liczbaOgniw > 0 && (
            <p className="mt-1 text-small">
              Rozstęp napięć: {result.value.minNapiecieV.toFixed(3)}–{result.value.maxNapiecieV.toFixed(3)} V
              (różnica {result.value.roznicaNapiecV.toFixed(3)} V)
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
