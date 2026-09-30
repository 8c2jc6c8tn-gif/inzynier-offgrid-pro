"use client"

import { useMemo } from "react"
import { calculateProfilAstronomiczny } from "@/lib/core/modules/zapotrzebowanie/profil-astronomiczny/calculator"
import {
  DEKLINACJA_AMPLITUDA_DEG,
  DEKLINACJA_PRZESUNIECIE_DNI,
  DNI_W_ROKU,
} from "@/lib/core/modules/zapotrzebowanie/profil-astronomiczny/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  szerokoscGeograficzna: string
  dzienRoku: string
  mocOdbiornikaNocnegoW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  szerokoscGeograficzna: "",
  dzienRoku: "",
  mocOdbiornikaNocnegoW: "",
}

export default function ProfilAstronomicznyPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("profil-astronomiczny", STAN_POCZATKOWY)
  const { szerokoscGeograficzna, dzienRoku, mocOdbiornikaNocnegoW } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setSzerokoscGeograficzna = (a: string | ((p: string) => string)) => setPole("szerokoscGeograficzna", a)
  const setDzienRoku = (a: string | ((p: string) => string)) => setPole("dzienRoku", a)
  const setMocOdbiornikaNocnegoW = (a: string | ((p: string) => string)) => setPole("mocOdbiornikaNocnegoW", a)

  const result = useMemo(
    () =>
      calculateProfilAstronomiczny({
        szerokoscGeograficzna: szerokoscGeograficzna === "" ? null : Number(szerokoscGeograficzna),
        dzienRoku: dzienRoku === "" ? 0 : Number(dzienRoku),
        mocOdbiornikaNocnegoW: mocOdbiornikaNocnegoW === "" ? 0 : Number(mocOdbiornikaNocnegoW),
      }),
    [szerokoscGeograficzna, dzienRoku, mocOdbiornikaNocnegoW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/profil-astronomiczny" />
      <NaglowekEkranu
        tytul="Profil dobowy + astronomiczny dzień/noc"
        ekran="profil-astronomiczny"
        wynik={result}
        parametry={{
          amplituda: DEKLINACJA_AMPLITUDA_DEG,
          przesuniecie: DEKLINACJA_PRZESUNIECIE_DNI,
          dniRoku: DNI_W_ROKU,
        }}
      >
        Profil dobowy to nie tylko „kiedy używasz najwięcej prądu” — to też kiedy jest ciemno, bo
        od tego zależy, jak długo pracują urządzenia świecące, a to zmienia się drastycznie między
        latem a zimą. Moduł 2, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Szerokość geograficzna"
          unit="°"
          type="number"
          inputMode="decimal"
          min={-90}
          max={90}
          value={szerokoscGeograficzna}
          onChange={(e) => setSzerokoscGeograficzna(e.target.value)}
          pomoc={<PomocPola ekran="profil-astronomiczny" pole="szerokosc" />}
        />
        <Pole
          label="Dzień roku"
          unit="1-365"
          type="number"
          inputMode="numeric"
          min={1}
          max={365}
          value={dzienRoku}
          onChange={(e) => setDzienRoku(e.target.value)}
          pomoc={<PomocPola ekran="profil-astronomiczny" pole="dzienRoku" />}
        />
        <Pole
          label="Moc odbiornika działającego tylko w ciemności (opcjonalnie)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocOdbiornikaNocnegoW}
          onChange={(e) => setMocOdbiornikaNocnegoW(e.target.value)}
          pomoc={<PomocPola ekran="profil-astronomiczny" pole="moc" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij szerokość geograficzną i dzień roku.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Długość dnia i nocy">
          <WynikGlowny>
            {result.value.dlugoscDniaH.toFixed(1)} h dnia / {result.value.dlugoscNocyH.toFixed(1)} h nocy
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
