"use client"

import { useMemo } from "react"
import { calculateLokalizacja } from "@/lib/core/modules/lokalizacja/lokalizacja-i-klimat/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"
import { TEMPERATURA_MAX_C, TEMPERATURA_MIN_C } from "@/lib/core/modules/lokalizacja/lokalizacja-i-klimat/constants"

type FormularzStan = {
  adres: string
  szerokosc: string
  dlugosc: string
  temperaturaMin: string
}

const STAN_POCZATKOWY: FormularzStan = {
  adres: "",
  szerokosc: "",
  dlugosc: "",
  temperaturaMin: "",
}

export default function LokalizacjaIKlimatPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("lokalizacja-i-klimat", STAN_POCZATKOWY)
  const { adres, szerokosc, dlugosc, temperaturaMin } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setAdres = (a: string | ((p: string) => string)) => setPole("adres", a)
  const setSzerokosc = (a: string | ((p: string) => string)) => setPole("szerokosc", a)
  const setDlugosc = (a: string | ((p: string) => string)) => setPole("dlugosc", a)
  const setTemperaturaMin = (a: string | ((p: string) => string)) => setPole("temperaturaMin", a)

  const result = useMemo(
    () =>
      calculateLokalizacja({
        adres: adres || undefined,
        szerokoscGeograficzna: szerokosc === "" ? undefined : Number(szerokosc),
        dlugoscGeograficzna: dlugosc === "" ? undefined : Number(dlugosc),
        temperaturaMinimalnaC: temperaturaMin === "" ? undefined : Number(temperaturaMin),
      }),
    [adres, szerokosc, dlugosc, temperaturaMin],
  )

  const dodatki = (
    <>
      {result.assumptions.length > 0 && (
        <ul className="mt-2 text-small opacity-90">
          {result.assumptions.map((a, i) => (
            <li key={typeof a === "string" ? a : a.kod + i}>Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}</li>
          ))}
        </ul>
      )}

      {result.warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-small">
          {result.warnings.map((w) => (
            <li key={w.code}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
          ))}
        </ul>
      )}
    </>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/lokalizacja-i-klimat" />
      <NaglowekEkranu tytul="Lokalizacja i dane klimatyczne" ekran="lokalizacja-i-klimat" wynik={result}>
        Dane stąd zasilają niemal wszystkie pozostałe moduły — kąt padania słońca, strefę
        wiatrową i śniegową, minima temperaturowe do stress-testów zimowych. Moduł 1, Ekran 1.
        Tryb offline: wpisz dane ręcznie.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label="Adres / działka (opcjonalnie)" value={adres} onChange={(e) => setAdres(e.target.value)} pomoc={<PomocPola ekran="lokalizacja-i-klimat" pole="adres" />} />
        <Pole
          label="Szerokość geograficzna"
          unit="°"
          type="number"
          inputMode="decimal"
          value={szerokosc}
          onChange={(e) => setSzerokosc(e.target.value)}
          placeholder="np. 52.23"
          pomoc={<PomocPola ekran="lokalizacja-i-klimat" pole="szerokosc" />}
        />
        <Pole
          label="Długość geograficzna"
          unit="°"
          type="number"
          inputMode="decimal"
          value={dlugosc}
          onChange={(e) => setDlugosc(e.target.value)}
          placeholder="np. 21.01"
          pomoc={<PomocPola ekran="lokalizacja-i-klimat" pole="dlugosc" />}
        />
        <Pole
          label="Temperatura minimalna w lokalizacji"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaMin}
          onChange={(e) => setTemperaturaMin(e.target.value)}
          placeholder="np. -22"
          pomoc={<PomocPola ekran="lokalizacja-i-klimat" pole="temperaturaMin" params={{ tMin: TEMPERATURA_MIN_C, tMax: TEMPERATURA_MAX_C }} />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <StanPusty tytul="Uzupełnij współrzędne i temperaturę minimalną.">{dodatki}</StanPusty>
      ) : (
        <WerdyktPanel
          poziom={result.status === "INVALID_INPUT" ? "blad" : "ok"}
          etykieta={
            result.status === "INVALID_INPUT"
              ? "Sprawdź dane — jedna z wartości jest poza możliwym zakresem"
              : "Profil lokalizacji zapisany"
          }
        >
          {dodatki}
        </WerdyktPanel>
      )}
    </main>
  )
}
