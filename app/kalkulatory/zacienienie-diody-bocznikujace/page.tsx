"use client"

import { useMemo } from "react"
import { calculateZacienienieDiodyBocznikujace } from "@/lib/core/modules/pv/zacienienie-diody-bocznikujace/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH } from "@/lib/core/modules/pv/zacienienie-diody-bocznikujace/constants"

type FormularzStan = {
  mocPaneluNominalnaW: string
  liczbaZacienionychSekcji: string
  liczbaPaneliWStringu: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocPaneluNominalnaW: "",
  liczbaZacienionychSekcji: "0",
  liczbaPaneliWStringu: "",
}

export default function ZacienienieDiodyBocznikujacePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zacienienie-diody-bocznikujace", STAN_POCZATKOWY)
  const { mocPaneluNominalnaW, liczbaZacienionychSekcji, liczbaPaneliWStringu } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocPaneluNominalnaW = (a: string | ((p: string) => string)) => setPole("mocPaneluNominalnaW", a)
  const setLiczbaZacienionychSekcji = (a: string | ((p: string) => string)) => setPole("liczbaZacienionychSekcji", a)
  const setLiczbaPaneliWStringu = (a: string | ((p: string) => string)) => setPole("liczbaPaneliWStringu", a)

  const result = useMemo(
    () =>
      calculateZacienienieDiodyBocznikujace({
        mocPaneluNominalnaW: mocPaneluNominalnaW === "" ? 0 : Number(mocPaneluNominalnaW),
        liczbaZacienionychSekcji: liczbaZacienionychSekcji === "" ? 0 : Number(liczbaZacienionychSekcji),
        liczbaPaneliWStringu: liczbaPaneliWStringu === "" ? 0 : Number(liczbaPaneliWStringu),
      }),
    [mocPaneluNominalnaW, liczbaZacienionychSekcji, liczbaPaneliWStringu],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zacienienie-diody-bocznikujace" />
      <NaglowekEkranu
        tytul="Zacienienie i diody bocznikujące"
        ekran="zacienienie-diody-bocznikujace"
        wynik={result}
      >
        Jeden cień potrafi „położyć” cały string, nie tylko zacieniony panel — to jak korek na
        jednym pasie, który spowalnia cały ruch, nie tylko ten jeden samochód. Moduł 3, Ekran 13.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc znamionowa panelu (STC)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPaneluNominalnaW}
          onChange={(e) => setMocPaneluNominalnaW(e.target.value)}
          pomoc={<PomocPola ekran="zacienienie-diody-bocznikujace" pole="moc" />}
        />
        <Pole
          label="Liczba zacienionych sekcji panelu"
          unit="/ 3"
          type="number"
          inputMode="numeric"
          min={0}
          max={3}
          step={1}
          value={liczbaZacienionychSekcji}
          onChange={(e) => setLiczbaZacienionychSekcji(e.target.value)}
          pomoc={<PomocPola ekran="zacienienie-diody-bocznikujace" pole="sekcje" params={{ sekcje: LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH }} />}
        />
        <Pole
          label="Liczba paneli w stringu (szeregowo)"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaPaneliWStringu}
          onChange={(e) => setLiczbaPaneliWStringu(e.target.value)}
          pomoc={<PomocPola ekran="zacienienie-diody-bocznikujace" pole="liczbaPaneli" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta="Strata mocy zacienionego panelu">
          <WynikGlowny>{result.value.strataPaneluPct.toFixed(1)}%</WynikGlowny>
          <p className="mt-2 text-small">
            Moc rzeczywista panelu: {result.value.mocPaneluRzeczywistaW.toFixed(0)} W (z{" "}
            {Number(mocPaneluNominalnaW || 0).toFixed(0)} W znamionowej).
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
