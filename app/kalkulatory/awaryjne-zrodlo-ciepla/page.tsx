"use client"

import { useMemo } from "react"
import { calculateAwaryjneZrodloCiepla } from "@/lib/core/modules/bezpieczenstwo/awaryjne-zrodlo-ciepla/calculator"
import type { AwaryjneZrodloCieplaInput, TypZrodlaCiepla } from "@/lib/core/modules/bezpieczenstwo/awaryjne-zrodlo-ciepla/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PoleLiczbowe = Exclude<keyof AwaryjneZrodloCieplaInput, "typZrodla" | "plaszczWodny">
type FormularzStan = { typZrodla: TypZrodlaCiepla | ""; plaszczWodny: boolean } & Record<PoleLiczbowe, string>

const STAN_POCZATKOWY: FormularzStan = {
  typZrodla: "",
  plaszczWodny: false,
  mocKw: "",
  mocDoWodyKw: "",
  godzinyPaleniaNaDobe: "",
  zapotrzebowanieCieplaKwhDoba: "",
  sprawnoscProc: "",
  wartoscOpalowaKwhKg: "",
}

const liczba = (v: string) => (v === "" ? null : Number(v))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function AwaryjneZrodloCieplaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("awaryjne-zrodlo-ciepla", STAN_POCZATKOWY)
  const ustaw = (pole: PoleLiczbowe) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateAwaryjneZrodloCiepla({
        typZrodla: stan.typZrodla === "" ? null : stan.typZrodla,
        plaszczWodny: stan.plaszczWodny,
        mocKw: liczba(stan.mocKw),
        mocDoWodyKw: liczba(stan.mocDoWodyKw),
        godzinyPaleniaNaDobe: liczba(stan.godzinyPaleniaNaDobe),
        zapotrzebowanieCieplaKwhDoba: liczba(stan.zapotrzebowanieCieplaKwhDoba),
        sprawnoscProc: liczba(stan.sprawnoscProc),
        wartoscOpalowaKwhKg: liczba(stan.wartoscOpalowaKwhKg),
      }),
    [stan],
  )
  const { cieploDobaKwh, cieploDoInstalacjiKwh, pokrycieProc, paliwoKgDoba } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/awaryjne-zrodlo-ciepla" />
      <NaglowekEkranu tytul="Awaryjne źródło ciepła" ekran="awaryjne-zrodlo-ciepla" wzor={result.formula}>
        Ogień to najstarsze źródło ciepła — w off-gridzie wraca jako sensowna rezerwa, o ile jest bezpiecznie zintegrowany z
        resztą systemu. Ile ciepła da kominek i ile drewna zje. Moduł 8, Ekran 1.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Typ źródła"
          value={stan.typZrodla}
          onChange={(e) => setStan((prev) => ({ ...prev, typZrodla: e.target.value as FormularzStan["typZrodla"] }))}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="typ" />}
        >
          <option value="">— wybierz —</option>
          <option value="kominek">Kominek</option>
          <option value="koza">Koza</option>
          <option value="piec">Piec na drewno</option>
        </PoleSelect>
        <Pole
          label="Moc cieplna (z karty)"
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocKw}
          onChange={ustaw("mocKw")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="moc" />}
        />
        <Pole
          label="Czas palenia w dobie"
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={stan.godzinyPaleniaNaDobe}
          onChange={ustaw("godzinyPaleniaNaDobe")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="czas" />}
        />
        <PoleCheckbox
          id="zrodlo-plaszcz-wodny"
          label="Płaszcz wodny podłączony do bufora / C.O."
          checked={stan.plaszczWodny}
          onChange={(e) => setStan((prev) => ({ ...prev, plaszczWodny: e.target.checked }))}
        />
        {stan.plaszczWodny && (
          <>
            <Pole
              label="Moc do wody (z karty)"
              unit="kW"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.mocDoWodyKw}
              onChange={ustaw("mocDoWodyKw")}
              pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="mocWoda" />}
            />
            <Pole
              label="Zapotrzebowanie na ciepło w mroźny dzień"
              unit="kWh/dobę"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.zapotrzebowanieCieplaKwhDoba}
              onChange={ustaw("zapotrzebowanieCieplaKwhDoba")}
              pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="zapotrzebowanie" />}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium">Paliwo (opcjonalnie)</p>
        <Pole
          label="Sprawność urządzenia"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.sprawnoscProc}
          onChange={ustaw("sprawnoscProc")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="sprawnosc" />}
        />
        <Pole
          label="Wartość opałowa paliwa"
          unit="kWh/kg"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.wartoscOpalowaKwhKg}
          onChange={ustaw("wartoscOpalowaKwhKg")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="wartoscOpalowa" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz typ źródła i wpisz moc oraz czas palenia.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Awaryjne źródło ciepła">
          {pokrycieProc !== null ? (
            <WynikGlowny>{f0(pokrycieProc)}% zapotrzebowania</WynikGlowny>
          ) : (
            cieploDobaKwh !== null && <WynikGlowny>{f1(cieploDobaKwh)} kWh ciepła / dobę</WynikGlowny>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {cieploDobaKwh !== null && <li>Ciepło z urządzenia: {f1(cieploDobaKwh)} kWh/dobę</li>}
            {cieploDoInstalacjiKwh !== null && <li>Do instalacji (płaszcz): {f1(cieploDoInstalacjiKwh)} kWh/dobę</li>}
            {paliwoKgDoba !== null && (
              <li>
                Paliwo: {f1(paliwoKgDoba)} kg/dobę · {f0(paliwoKgDoba * 7)} kg/tydzień
              </li>
            )}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
