"use client"

import { useMemo } from "react"
import { calculateNapiecieOdciecia } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/calculator"
import { LICZBA_OGNIW_SUGEROWANA } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KALIBRACJA_NAPIECIE_OGNIWO_MAX_V, KALIBRACJA_NAPIECIE_OGNIWO_MIN_V } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/constants"

type FormularzStan = {
  napiecieOdcieciaV: string
  liczbaOgniwSzeregowo: string
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieOdcieciaV: "",
  liczbaOgniwSzeregowo: String(LICZBA_OGNIW_SUGEROWANA),
}

export default function NapiecieOdcieciaAZywotnoscPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("napiecie-odciecia-a-zywotnosc", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: string) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const { napiecieOdcieciaV, liczbaOgniwSzeregowo } = stan

  const result = useMemo(
    () =>
      calculateNapiecieOdciecia({
        napiecieOdcieciaV: napiecieOdcieciaV === "" ? 0 : Number(napiecieOdcieciaV),
        liczbaOgniwSzeregowo: liczbaOgniwSzeregowo === "" ? 0 : Number(liczbaOgniwSzeregowo),
      }),
    [napiecieOdcieciaV, liczbaOgniwSzeregowo],
  )

  const poziom = result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/napiecie-odciecia-a-zywotnosc" />
      <NaglowekEkranu
        tytul="Napięcie odcięcia vs żywotność"
        ekran="napiecie-odciecia-a-zywotnosc"
        wynik={result}
        parametry={{ vMin: KALIBRACJA_NAPIECIE_OGNIWO_MIN_V, vMax: KALIBRACJA_NAPIECIE_OGNIWO_MAX_V }}
      >
        Nie wyciskaj baterii do ostatniej kropli — pozostawienie małego zapasu (wyższe napięcie
        odcięcia) radykalnie wydłuża jej życie, kosztem niewielkiej części dostępnej pojemności.
        Moduł 4, Ekran 31.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie odcięcia (ustawione na falowniku/BMS)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.napiecieOdcieciaV}
          onChange={(e) => setPole("napiecieOdcieciaV", e.target.value)}
          pomoc={<PomocPola ekran="napiecie-odciecia-a-zywotnosc" pole="napiecie" />}
        />
        <Pole
          label="Liczba ogniw połączonych szeregowo (S)"
          unit=""
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={stan.liczbaOgniwSzeregowo}
          onChange={(e) => setPole("liczbaOgniwSzeregowo", e.target.value)}
          pomoc={<PomocPola ekran="napiecie-odciecia-a-zywotnosc" pole="ogniwa" params={{ ogniwa: LICZBA_OGNIW_SUGEROWANA }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij oba pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={`DoD ~${result.value.dodPct.toFixed(0)}%`}>
          <WynikGlowny>~{result.value.cykleZycia.toLocaleString("pl-PL")} cykli</WynikGlowny>
          <p className="mt-1 text-small">
            {result.value.napiecieOgniwaV.toFixed(3)} V na ogniwo przy {stan.liczbaOgniwSzeregowo}S.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
