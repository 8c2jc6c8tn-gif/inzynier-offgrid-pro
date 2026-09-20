"use client"

import { useMemo } from "react"
import { calculatePoborWlasnyBms } from "@/lib/core/modules/baterie/pobor-wlasny-bms/calculator"
import {
  POBOR_CIAGLE_TYPOWY_MAX_W,
  POBOR_CIAGLE_TYPOWY_MIN_W,
  POBOR_USPIENIE_TYPOWY_MAX_W,
  POBOR_USPIENIE_TYPOWY_MIN_W,
} from "@/lib/core/modules/baterie/pobor-wlasny-bms/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  poborCiagleW: string
  poborUspienieW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  poborCiagleW: "",
  poborUspienieW: "",
}

export default function PoborWlasnyBmsPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pobor-wlasny-bms", STAN_POCZATKOWY)
  const { poborCiagleW, poborUspienieW } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPoborCiagleW = (a: string | ((p: string) => string)) => setPole("poborCiagleW", a)
  const setPoborUspienieW = (a: string | ((p: string) => string)) => setPole("poborUspienieW", a)

  const result = useMemo(
    () =>
      calculatePoborWlasnyBms({
        poborCiagleW: poborCiagleW === "" ? 0 : Number(poborCiagleW),
        poborUspienieW: poborUspienieW === "" ? 0 : Number(poborUspienieW),
      }),
    [poborCiagleW, poborUspienieW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pobor-wlasny-bms" />
      <NaglowekEkranu tytul="Pobór własny BMS i tryb uśpienia">
        BMS to też odbiornik prądu, nawet gdy „nic nie robi” — w małych off-gridach ten stały
        pobór potrafi być zaskakująco dużą częścią bilansu. Moduł 4, Ekran 22.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pobór w trybie pracy ciągłej"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={poborCiagleW}
          onChange={(e) => setPoborCiagleW(e.target.value)}
          hint={`Typowo ${POBOR_CIAGLE_TYPOWY_MIN_W}–${POBOR_CIAGLE_TYPOWY_MAX_W}W.`}
        />
        <Pole
          label="Pobór w trybie uśpienia (deep sleep)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={poborUspienieW}
          onChange={(e) => setPoborUspienieW(e.target.value)}
          hint={`Typowo ${POBOR_USPIENIE_TYPOWY_MIN_W}–${POBOR_USPIENIE_TYPOWY_MAX_W}W.`}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij oba pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Roczna strata przy pracy ciągłej">
          <WynikGlowny>{result.value.strataRocznaCiagleKwh.toLocaleString("pl-PL")} kWh</WynikGlowny>
          <p className="mt-1 text-small">
            W trybie uśpienia: {result.value.strataDoboweUspienieKwh.toLocaleString("pl-PL")} kWh/dobę
            (ok. {result.value.strataRocznaUspienieKwh.toLocaleString("pl-PL")} kWh/rok) — oszczędność ok.{" "}
            {result.value.oszczednoscRocznaKwh.toLocaleString("pl-PL")} kWh/rok.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
