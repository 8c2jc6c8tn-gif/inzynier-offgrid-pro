"use client"

import { useMemo } from "react"
import { calculateKatalogUrzadzen } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/calculator"
import { KATALOG_URZADZEN_STANDBY } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/constants"
import type { KatalogUrzadzenInput, StandbyDeviceItem } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/input"
import { calculatePomiarMocyJalowej } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej/calculator"
import type { PomiarMocyJalowejInput, PomiarPozycja } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej/input"
import type { AutonomiaStandbyInput, KosztRocznyStandbyInput, WplywNaDoborInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/symulacje-i-raporty/input"
import type { DoborMetodyInput, PorownanieMetodInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/input"
import type { ScenariuszAutomatyzacjiInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/automatyzacja/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KatalogTab } from "./_components/katalog-tab"
import { PomiarTab } from "./_components/pomiar-tab"
import { SymulacjeTab } from "./_components/symulacje-tab"
import { RekomendacjeTab } from "./_components/rekomendacje-tab"
import { AutomatyzacjaTab } from "./_components/automatyzacja-tab"

type Podzakladka = "katalog" | "pomiar" | "symulacje" | "rekomendacje" | "automatyzacja"

const PODZAKLADKI: { id: Podzakladka; label: string }[] = [
  { id: "katalog", label: "Katalog urządzeń" },
  { id: "pomiar", label: "Pomiar mocy jałowej" },
  { id: "symulacje", label: "Symulacje i raporty" },
  { id: "rekomendacje", label: "Rekomendacje sprzętowe" },
  { id: "automatyzacja", label: "Automatyzacja" },
]

type FormularzStan = {
  podzakladka: Podzakladka
  katalog: KatalogUrzadzenInput
  pomiar: PomiarMocyJalowejInput
  autonomia: AutonomiaStandbyInput
  kosztRoczny: KosztRocznyStandbyInput
  wplywNaDobor: WplywNaDoborInput
  porownanieMetod: PorownanieMetodInput
  doborMetody: DoborMetodyInput
  automatyzacja: ScenariuszAutomatyzacjiInput
}

const STAN_POCZATKOWY: FormularzStan = {
  podzakladka: "katalog",
  katalog: {
    items: KATALOG_URZADZEN_STANDBY.map((d) => ({
      id: d.id,
      label: d.label,
      powerW: d.defaultPowerW,
      selected: false,
    })),
  },
  pomiar: { pozycje: [] },
  autonomia: { standbyW: 0, standbyZredukowanyW: 0, pojemnoscUzytecznaKwh: 0, dodPct: 80 },
  kosztRoczny: { standbyW: 0, cenaEnergiiZlZaKwh: 0, zapotrzebowanieCalkowiteRocznaKwh: 0 },
  wplywNaDobor: { standbyDobowaKwh: 0, eliminacjaPct: 0, dniAutonomii: 3, sprawnoscFalownikaPct: 95, dodPct: 80 },
  porownanieMetod: { metody: [] },
  doborMetody: { kategoria: "tv-konsola" },
  automatyzacja: { standbyReferencyjnyW: 0, standbyWScenariuszuW: 0 },
}

/**
 * Moduł zbiorczy "Wampiry energetyczne" (Moduł 2) — 5 podzakładek, jeden `usePersistedDraft`
 * na cały ekran (nie 5 osobnych kluczy), żeby suma standby wyliczona w Katalogu/Pomiarze była
 * dostępna od razu w Symulacjach i Automatyzacji, bez ponownego wpisywania.
 */
export default function WampiryEnergetycznePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wampiry-energetyczne", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }

  const katalogResult = useMemo(() => calculateKatalogUrzadzen(stan.katalog), [stan.katalog])
  const pomiarResult = useMemo(() => calculatePomiarMocyJalowej(stan.pomiar), [stan.pomiar])

  const sumaStandbyW =
    (katalogResult.status === "VALID" || katalogResult.status === "VALID_WITH_WARNINGS" ? katalogResult.value.sumaW : 0) +
    (pomiarResult.status === "VALID" || pomiarResult.status === "VALID_WITH_WARNINGS" ? pomiarResult.value.sumaW : 0)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wampiry-energetyczne" />
      <NaglowekEkranu tytul="Wampiry energetyczne">
        Drobny, ciągły pobór urządzeń w trybie czuwania — pojedynczo niewiele, ale w skali roku i w systemie
        off-grid regularnie zjada pojemność baterii. Moduł 2.
      </NaglowekEkranu>

      <PoleSelect
        label="Podzakładka"
        value={stan.podzakladka}
        onChange={(e) => setPole("podzakladka", e.target.value as Podzakladka)}
      >
        {PODZAKLADKI.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </PoleSelect>

      {stan.podzakladka === "katalog" && (
        <KatalogTab
          input={stan.katalog}
          onChange={(items: StandbyDeviceItem[]) => setPole("katalog", { items })}
          result={katalogResult}
        />
      )}

      {stan.podzakladka === "pomiar" && (
        <PomiarTab
          input={stan.pomiar}
          onChange={(pozycje: PomiarPozycja[]) => setPole("pomiar", { pozycje })}
          result={pomiarResult}
        />
      )}

      {stan.podzakladka === "symulacje" && (
        <SymulacjeTab
          autonomia={stan.autonomia}
          kosztRoczny={stan.kosztRoczny}
          wplywNaDobor={stan.wplywNaDobor}
          onChangeAutonomia={(v) => setPole("autonomia", v)}
          onChangeKosztRoczny={(v) => setPole("kosztRoczny", v)}
          onChangeWplywNaDobor={(v) => setPole("wplywNaDobor", v)}
          sumaStandbyW={sumaStandbyW}
        />
      )}

      {stan.podzakladka === "rekomendacje" && (
        <RekomendacjeTab
          porownanie={stan.porownanieMetod}
          dobor={stan.doborMetody}
          onChangePorownanie={(v) => setPole("porownanieMetod", v)}
          onChangeDobor={(v) => setPole("doborMetody", v)}
        />
      )}

      {stan.podzakladka === "automatyzacja" && (
        <AutomatyzacjaTab
          input={stan.automatyzacja}
          onChange={(v) => setPole("automatyzacja", v)}
          sumaStandbyW={sumaStandbyW}
        />
      )}
    </main>
  )
}
