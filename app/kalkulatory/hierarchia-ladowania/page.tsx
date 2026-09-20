"use client"

import { useMemo } from "react"
import { calculateHierarchiaLadowania } from "@/lib/core/modules/baterie/hierarchia-ladowania/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  produkcjaPvDostepnaTeraz: boolean
  socAktualnyPct: string
  socProguKrytycznegoPct: string
  prognozaSloncaJutro: boolean
  agregatDostepny: boolean
  siecDostepna: boolean
  taniaTaryfaNocna: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  produkcjaPvDostepnaTeraz: false,
  socAktualnyPct: "",
  socProguKrytycznegoPct: "",
  prognozaSloncaJutro: false,
  agregatDostepny: false,
  siecDostepna: false,
  taniaTaryfaNocna: false,
}

const ETYKIETA_ZRODLA: Record<string, string> = {
  PV: "Ładowanie z paneli PV",
  AGREGAT: "Ładowanie z agregatu prądotwórczego",
  SIEC: "Doładowanie z sieci (tania taryfa)",
  BRAK: "Brak aktywnego źródła ładowania",
}

export default function HierarchiaLadowaniaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("hierarchia-ladowania", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const {
    produkcjaPvDostepnaTeraz,
    socAktualnyPct,
    socProguKrytycznegoPct,
    prognozaSloncaJutro,
    agregatDostepny,
    siecDostepna,
    taniaTaryfaNocna,
  } = stan

  const result = useMemo(
    () =>
      calculateHierarchiaLadowania({
        produkcjaPvDostepnaTeraz,
        socAktualnyPct: socAktualnyPct === "" ? 0 : Number(socAktualnyPct),
        socProguKrytycznegoPct: socProguKrytycznegoPct === "" ? 0 : Number(socProguKrytycznegoPct),
        prognozaSloncaJutro,
        agregatDostepny,
        siecDostepna,
        taniaTaryfaNocna,
      }),
    [
      produkcjaPvDostepnaTeraz,
      socAktualnyPct,
      socProguKrytycznegoPct,
      prognozaSloncaJutro,
      agregatDostepny,
      siecDostepna,
      taniaTaryfaNocna,
    ],
  )

  const poziom = result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/hierarchia-ladowania" />
      <NaglowekEkranu tytul="Hierarchia ładowania (PV > Agregat > Sieć)">
        Mądry system czeka na darmowe paliwo ze słońca, zamiast od razu sięgać po drogi agregat.
        Moduł 4, Ekran 32.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="produkcja-pv-teraz"
          label="Jest teraz produkcja z PV"
          checked={produkcjaPvDostepnaTeraz}
          onChange={(e) => setPole("produkcjaPvDostepnaTeraz", e.target.checked)}
        />
        <Pole
          label="Aktualny SoC baterii"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socAktualnyPct}
          onChange={(e) => setPole("socAktualnyPct", e.target.value)}
        />
        <Pole
          label="Próg krytyczny SoC (od którego rozważany jest agregat)"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socProguKrytycznegoPct}
          onChange={(e) => setPole("socProguKrytycznegoPct", e.target.value)}
          hint="Brak sugerowanej wartości — ustal ją świadomie, dane bezpieczeństwa nie mają ukrytego domyślnego wypełnienia."
        />
        <PoleCheckbox
          id="prognoza-slonca-jutro"
          label="Prognoza przewiduje produkcję PV jutro"
          hint="Docelowo auto z Modułu 10 (Prognozy)."
          checked={prognozaSloncaJutro}
          onChange={(e) => setPole("prognozaSloncaJutro", e.target.checked)}
        />
        <PoleCheckbox
          id="agregat-dostepny"
          label="Agregat prądotwórczy jest dostępny i sprawny"
          checked={agregatDostepny}
          onChange={(e) => setPole("agregatDostepny", e.target.checked)}
        />
        <PoleCheckbox
          id="siec-dostepna"
          label="Podłączenie do sieci energetycznej jest dostępne"
          checked={siecDostepna}
          onChange={(e) => setPole("siecDostepna", e.target.checked)}
        />
        <PoleCheckbox
          id="tania-taryfa-nocna"
          label="Teraz obowiązuje tania taryfa nocna"
          checked={taniaTaryfaNocna}
          onChange={(e) => setPole("taniaTaryfaNocna", e.target.checked)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wpisz aktualny SoC i próg krytyczny, żeby zobaczyć wybór źródła.
        </p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={ETYKIETA_ZRODLA[result.value.zrodlo]}>
          <WynikGlowny>{ETYKIETA_ZRODLA[result.value.zrodlo]}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
