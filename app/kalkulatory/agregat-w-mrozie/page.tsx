"use client"

import { useMemo } from "react"
import { calculateAgregatWMrozie } from "@/lib/core/modules/stress-test/agregat-w-mrozie/calculator"
import type { AgregatWMrozieInput, PaliwoAgregatu } from "@/lib/core/modules/stress-test/agregat-w-mrozie/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
  type BezpieczenstwoAgregatuStan,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"
import { DIESEL_ROZRUCH_MROZ_C, DIESEL_ZWYKLY_RYZYKO_C, DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C, DLUGI_POSTOJ_DNI } from "@/lib/core/modules/stress-test/agregat-w-mrozie/constants"

type PoleLiczbowe = Exclude<keyof AgregatWMrozieInput, "paliwo" | keyof BezpieczenstwoAgregatuStan>
type FormularzStan = { paliwo: PaliwoAgregatu | "" } & BezpieczenstwoAgregatuStan & Record<PoleLiczbowe, string>

const STAN_POCZATKOWY: FormularzStan = {
  paliwo: "",
  temperaturaMiejscaC: "",
  wymaganyCzasPracyH: "",
  maxPracaCiaglaH: "",
  przerwaH: "",
  zuzyciePaliwaLH: "",
  interwalWymianyOlejuH: "",
  dniPostoju: "",
  miejsceAgregatu: "",
  podlaczenieAgregatu: "",
}

const liczba = (v: string) => (v === "" ? null : Number(v))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function AgregatWMroziePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("agregat-w-mrozie", STAN_POCZATKOWY)
  const ustaw = (pole: PoleLiczbowe) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateAgregatWMrozie({
        paliwo: stan.paliwo === "" ? null : stan.paliwo,
        temperaturaMiejscaC: liczba(stan.temperaturaMiejscaC),
        wymaganyCzasPracyH: liczba(stan.wymaganyCzasPracyH),
        maxPracaCiaglaH: liczba(stan.maxPracaCiaglaH),
        przerwaH: liczba(stan.przerwaH),
        zuzyciePaliwaLH: liczba(stan.zuzyciePaliwaLH),
        interwalWymianyOlejuH: liczba(stan.interwalWymianyOlejuH),
        dniPostoju: liczba(stan.dniPostoju),
        ...naWejscieBezpieczenstwa(stan),
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const { paliwoL, wymianyOleju, liczbaPrzerw, czasKalendarzowyH } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/agregat-w-mrozie" />
      <NaglowekEkranu
        tytul="Agregat w mrozie"
        ekran="agregat-w-mrozie"
        wynik={result}
        parametry={{ postoj: DLUGI_POSTOJ_DNI }}
      >
        Rozruch na zimno, długa praca i długi postój — ile paliwa i oleju zje agregat w zimowym scenariuszu. Moduł 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Paliwo"
          value={stan.paliwo}
          onChange={(e) => setStan((prev) => ({ ...prev, paliwo: e.target.value as FormularzStan["paliwo"] }))}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="paliwo" params={{ ryzyko: DIESEL_ZWYKLY_RYZYKO_C, wysokie: DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C, rozruch: DIESEL_ROZRUCH_MROZ_C }} />}
        >
          <option value="">— wybierz —</option>
          <option value="diesel-zwykly">Olej napędowy zwykły</option>
          <option value="diesel-arktyczny">Olej napędowy arktyczny</option>
          <option value="benzyna">Benzyna</option>
          <option value="inne">Inne (LPG, gaz ziemny)</option>
        </PoleSelect>
        <Pole
          label="Najniższa temperatura przy agregacie"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={stan.temperaturaMiejscaC}
          onChange={ustaw("temperaturaMiejscaC")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="temp" />}
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium">Praca w scenariuszu (np. tydzień blackoutu)</p>
        <Pole
          label="Łączny czas pracy"
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.wymaganyCzasPracyH}
          onChange={ustaw("wymaganyCzasPracyH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="czasPracy" />}
        />
        <Pole
          label="Maks. praca ciągła wg producenta"
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.maxPracaCiaglaH}
          onChange={ustaw("maxPracaCiaglaH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="maxCiagla" />}
        />
        <Pole
          label="Wymagana przerwa"
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.przerwaH}
          onChange={ustaw("przerwaH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="przerwa" />}
        />
        <Pole
          label="Zużycie paliwa"
          unit="l/h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zuzyciePaliwaLH}
          onChange={ustaw("zuzyciePaliwaLH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="zuzycie" />}
        />
        <Pole
          label="Wymiana oleju co"
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.interwalWymianyOlejuH}
          onChange={ustaw("interwalWymianyOlejuH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="olej" />}
        />
      </div>

      <Pole
        label="Dni postoju bez uruchamiania"
        unit="dni"
        type="number"
        inputMode="numeric"
        min={0}
        value={stan.dniPostoju}
        onChange={ustaw("dniPostoju")}
        pomoc={<PomocPola ekran="agregat-w-mrozie" pole="dniPostoju" params={{ postoj: DLUGI_POSTOJ_DNI }} />}
      />

      <PolaBezpieczenstwaAgregatu
        miejsceAgregatu={stan.miejsceAgregatu}
        podlaczenieAgregatu={stan.podlaczenieAgregatu}
        onChange={(zmiana) => setStan((prev) => ({ ...prev, ...zmiana }))}
      />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz czas pracy w scenariuszu, albo temperaturę z rodzajem paliwa lub dniami postoju, albo odpowiedz na pytania o bezpieczeństwo.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={
            hasCritical
              ? "Poważne zagrożenie — sprawdź czerwone ostrzeżenia"
              : hasWarning
                ? "Agregat może nie wystartować"
                : "Agregat w scenariuszu zimowym"
          }
        >
          {paliwoL !== null && <WynikGlowny>{f0(paliwoL)} l paliwa</WynikGlowny>}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {wymianyOleju !== null && <li>Wymiany oleju: {wymianyOleju}</li>}
            {liczbaPrzerw !== null && <li>Przerwy: {liczbaPrzerw}</li>}
            {czasKalendarzowyH !== null && <li>Praca z przerwami: {f0(czasKalendarzowyH)} h</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
