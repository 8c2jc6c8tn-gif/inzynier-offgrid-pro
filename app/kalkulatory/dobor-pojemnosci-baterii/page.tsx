"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { calculateDoborPojemnosci } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import {
  DOD_LIFEPO4_TYPOWY_MAX_PCT,
  DOD_LIFEPO4_TYPOWY_MIN_PCT,
  SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT,
} from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { useProfilSprzetu } from "@/lib/profil-sprzetu/use-profil-sprzetu"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  zapotrzebowanieDoboweKwh: string
  dniAutonomii: string
  sprawnoscFalownikaPct: string
  dodPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieDoboweKwh: "",
  dniAutonomii: "",
  sprawnoscFalownikaPct: String(SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT),
  dodPct: "",
}

export default function DoborPojemnosciBateriiPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-pojemnosci-baterii", STAN_POCZATKOWY)
  const { zapotrzebowanieDoboweKwh, dniAutonomii, sprawnoscFalownikaPct, dodPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieDoboweKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieDoboweKwh", a)
  const setDniAutonomii = (a: string | ((p: string) => string)) => setPole("dniAutonomii", a)
  const setSprawnoscFalownikaPct = (a: string | ((p: string) => string)) => setPole("sprawnoscFalownikaPct", a)
  const setDodPct = (a: string | ((p: string) => string)) => setPole("dodPct", a)

  const result = useMemo(
    () =>
      calculateDoborPojemnosci({
        zapotrzebowanieDoboweKwh: zapotrzebowanieDoboweKwh === "" ? 0 : Number(zapotrzebowanieDoboweKwh),
        dniAutonomii: dniAutonomii === "" ? 0 : Number(dniAutonomii),
        sprawnoscFalownikaPct: sprawnoscFalownikaPct === "" ? 0 : Number(sprawnoscFalownikaPct),
        dodPct: dodPct === "" ? 0 : Number(dodPct),
      }),
    [zapotrzebowanieDoboweKwh, dniAutonomii, sprawnoscFalownikaPct, dodPct],
  )

  // Profil sprzętu (docs/zrodla/Zasady_UX_Doradca_v2_1.md, §10) — wynik tego ekranu zasila
  // domyślne wypełnienie Ekranu 6 (starzenie-degradacja), a jego bufor starzeniowy wraca tutaj
  // jako uzupełnienie rekomendacji (assumption BUFOR-STARZENIOWY-NIE-DOLICZONY poniżej).
  const { profil, zapiszBaterie } = useProfilSprzetu()
  useEffect(() => {
    if (result.status !== "VALID") return
    zapiszBaterie({
      pojemnoscUzytecznaDzisKwh: result.value.pojemnoscUzytecznaKwh,
      pojemnoscUzytecznaDzisZaktualizowanoIso: new Date().toISOString(),
    })
  }, [result, zapiszBaterie])
  const bufor = profil.bateria

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-pojemnosci-baterii" />
      <NaglowekEkranu tytul="Dobór pojemności baterii" ekran="dobor-pojemnosci-baterii" wzor={result.formula}>
        Bateria nigdy nie jest w 100% „użyteczna” — część pojemności to bufor bezpieczeństwa,
        żeby nie skracać jej życia głębokim rozładowywaniem. Moduł 4, Ekran 1.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zapotrzebowanie dobowe"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieDoboweKwh}
          onChange={(e) => setZapotrzebowanieDoboweKwh(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="zapotrzebowanie" />}
        />
        <Pole
          label="Dni autonomii"
          unit="dni"
          type="number"
          inputMode="decimal"
          min={0}
          value={dniAutonomii}
          onChange={(e) => setDniAutonomii(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="dniAutonomii" />}
        />
        <Pole
          label="Sprawność falownika"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscFalownikaPct}
          onChange={(e) => setSprawnoscFalownikaPct(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="sprawnosc" params={{ sprawnosc: SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT }} />}
        />
        <Pole
          label="DoD (głębokość rozładowania)"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={dodPct}
          onChange={(e) => setDodPct(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="dod" params={{ dodMin: DOD_LIFEPO4_TYPOWY_MIN_PCT, dodMax: DOD_LIFEPO4_TYPOWY_MAX_PCT }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Wymagana pojemność użyteczna">
          <WynikGlowny>{result.value.pojemnoscUzytecznaKwh.toFixed(1)} kWh</WynikGlowny>
          {bufor?.pojemnoscPoczatkowaZBuforemKwh !== undefined &&
          bufor.pojemnoscUzytecznaDzisKwh === result.value.pojemnoscUzytecznaKwh ? (
            <p className="mt-1 text-small">
              Z uwzględnieniem starzenia ogniw na {bufor.buforHoryzontLata} lat (Ekran 6):{" "}
              <strong>{bufor.pojemnoscPoczatkowaZBuforemKwh.toFixed(1)} kWh</strong> pojemności
              początkowej do zamówienia.
            </p>
          ) : (
            <p className="mt-1 text-small text-muted-foreground">
              To pojemność potrzebna dziś, bez bufora na starzenie ogniw — patrz{" "}
              <Link href="/kalkulatory/starzenie-degradacja" className="underline">
                Ekran 6, Starzenie i degradacja
              </Link>
              .
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
