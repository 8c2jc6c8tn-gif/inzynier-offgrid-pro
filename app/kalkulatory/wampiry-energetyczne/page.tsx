"use client"

import { isComputed } from "@/lib/core/calc-result"
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
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KatalogTab } from "./_components/katalog-tab"
import { PomiarTab } from "./_components/pomiar-tab"
import { SymulacjeTab } from "./_components/symulacje-tab"
import { RekomendacjeTab } from "./_components/rekomendacje-tab"
import { AutomatyzacjaTab } from "./_components/automatyzacja-tab"
import { useTranslate } from "@/lib/i18n/language-context"

type Podzakladka = "katalog" | "pomiar" | "symulacje" | "rekomendacje" | "automatyzacja"

const PODZAKLADKI: { id: Podzakladka; label: string }[] = [
  { id: "katalog", label: "UI-WAMENE-KATALOG-URZADZEN" },
  { id: "pomiar", label: "UI-WAMENE-POMIAR-MOCY-JALOWEJ" },
  { id: "symulacje", label: "UI-WAMENE-SYMULACJE-RAPORTY" },
  { id: "rekomendacje", label: "UI-WAMENE-REKOMENDACJE-SPRZETOWE" },
  { id: "automatyzacja", label: "UI-WAMENE-AUTOMATYZACJA" },
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

const przeliczKwote = (kwota: number, wspolczynnik: number) => Number((kwota * wspolczynnik).toPrecision(6))

/** Money fields (energy price, purchase cost and yearly saving of the disconnect methods) converted on a currency change. */
const PRZELICZ_KWOTY = (stan: FormularzStan, wspolczynnik: number): FormularzStan => ({
  ...stan,
  kosztRoczny: { ...stan.kosztRoczny, cenaEnergiiZlZaKwh: przeliczKwote(stan.kosztRoczny.cenaEnergiiZlZaKwh, wspolczynnik) },
  porownanieMetod: {
    ...stan.porownanieMetod,
    metody: stan.porownanieMetod.metody.map((m) => ({
      ...m,
      kosztZakupuZl: przeliczKwote(m.kosztZakupuZl, wspolczynnik),
      rocznaOszczednoscZl: przeliczKwote(m.rocznaOszczednoscZl, wspolczynnik),
    })),
  },
})

/**
 * Moduł zbiorczy "Wampiry energetyczne" (Moduł 2) — 5 podzakładek, jeden `usePersistedDraft`
 * na cały ekran (nie 5 osobnych kluczy), żeby suma standby wyliczona w Katalogu/Pomiarze była
 * dostępna od razu w Symulacjach i Automatyzacji, bez ponownego wpisywania.
 */
export default function WampiryEnergetycznePage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("wampiry-energetyczne", STAN_POCZATKOWY, PRZELICZ_KWOTY)

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
    (isComputed(katalogResult.status) ? katalogResult.value.sumaW : 0) +
    (isComputed(pomiarResult.status) ? pomiarResult.value.sumaW : 0)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wampiry-energetyczne" />
      <NaglowekEkranu tytul={t("UI-WAMENE-WAMPIRY-ENERGETYCZNE")} ekran="wampiry-energetyczne">
        {t("UI-WAMENE-DROBNY-CIAGLY-POBOR")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <PoleSelect
        label={t("UI-WAMENE-PODZAKLADKA")}
        value={stan.podzakladka}
        onChange={(e) => setPole("podzakladka", e.target.value as Podzakladka)}
        pomoc={<PomocPola ekran="wampiry-energetyczne" pole="podzakladka" />}
      >
        {PODZAKLADKI.map((p) => (
          <option key={p.id} value={p.id}>
            {t(p.label)}
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
