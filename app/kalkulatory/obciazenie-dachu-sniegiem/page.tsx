"use client"

import { useId, useMemo } from "react"
import { calculateObciazenieDachuSniegiem } from "@/lib/core/modules/stress-test/obciazenie-dachu-sniegiem/calculator"
import type { EkspozycjaTerenu, RodzajSniegu, StrefaSniegowa } from "@/lib/core/modules/pv/eurokod-1/snieg"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  strefa: string
  wysokoscNpmM: string
  katDachuDeg: string
  ekspozycja: EkspozycjaTerenu
  barierkiLubAttyka: boolean
  nosnoscDachuKnM2: string
  gruboscWarstwyCm: string
  rodzajSniegu: RodzajSniegu | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  strefa: "",
  wysokoscNpmM: "",
  katDachuDeg: "",
  ekspozycja: "normalny",
  barierkiLubAttyka: false,
  nosnoscDachuKnM2: "",
  gruboscWarstwyCm: "",
  rodzajSniegu: "",
}

const liczbaLubNull = (s: string) => (s === "" ? null : Number(s))
const liczba = (s: string) => (s === "" ? 0 : Number(s))
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function ObciazenieDachuSniegiemPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("obciazenie-dachu-sniegiem", STAN_POCZATKOWY)
  const idBarierki = useId()
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateObciazenieDachuSniegiem({
        strefa: stan.strefa === "" ? null : (Number(stan.strefa) as StrefaSniegowa),
        wysokoscNpmM: liczbaLubNull(stan.wysokoscNpmM),
        katDachuDeg: liczbaLubNull(stan.katDachuDeg),
        ekspozycja: stan.ekspozycja,
        barierkiLubAttyka: stan.barierkiLubAttyka,
        nosnoscDachuKnM2: liczba(stan.nosnoscDachuKnM2),
        gruboscWarstwyCm: liczba(stan.gruboscWarstwyCm),
        rodzajSniegu: stan.rodzajSniegu === "" ? null : stan.rodzajSniegu,
      }),
    [stan],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/obciazenie-dachu-sniegiem" />
      <NaglowekEkranu tytul="Obciążenie dachu śniegiem">
        Ile śniegu musi przenieść Twój dach według normy i ile waży to, co leży na nim teraz. PN-EN 1991-1-3. Moduł 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Strefa obciążenia śniegiem"
          value={stan.strefa}
          onChange={(e) => setStan((prev) => ({ ...prev, strefa: e.target.value }))}
          hint="Mapa stref w PN-EN 1991-1-3, Załącznik krajowy NB.1. Strefa 2 to większość środkowej Polski; 4 — Pomorze Zachodnie i część Wielkopolski/Kujaw; 5 — okolice Tatr."
        >
          <option value="">— wybierz —</option>
          <option value="1">Strefa 1</option>
          <option value="2">Strefa 2</option>
          <option value="3">Strefa 3</option>
          <option value="4">Strefa 4</option>
          <option value="5">Strefa 5</option>
        </PoleSelect>
        <Pole
          label="Wysokość nad poziomem morza"
          unit="m"
          type="number"
          inputMode="decimal"
          value={stan.wysokoscNpmM}
          onChange={ustaw("wysokoscNpmM")}
        />
        <Pole
          label="Kąt spadku dachu"
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={stan.katDachuDeg}
          onChange={ustaw("katDachuDeg")}
          hint="0° = dach płaski."
        />
        <PoleSelect
          label="Otoczenie budynku"
          value={stan.ekspozycja}
          onChange={(e) => setStan((prev) => ({ ...prev, ekspozycja: e.target.value as EkspozycjaTerenu }))}
          hint="Wystawiony: płasko, otwarte ze wszystkich stron. Osłonięty: budynek dużo niższy niż teren, drzewa lub budynki wokół."
        >
          <option value="wystawiony">Wystawiony na wiatr</option>
          <option value="normalny">Normalny</option>
          <option value="osloniety">Osłonięty od wiatru</option>
        </PoleSelect>
        <PoleCheckbox
          id={idBarierki}
          label="Barierki przeciwśnieżne lub attyka"
          hint="Śnieg nie zsuwa się z dachu — norma nie pozwala wtedy liczyć mniej niż przy dachu płaskim."
          checked={stan.barierkiLubAttyka}
          onChange={(e) => setStan((prev) => ({ ...prev, barierkiLubAttyka: e.target.checked }))}
        />
        <Pole
          label="Nośność dachu na śnieg"
          unit="kN/m²"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.nosnoscDachuKnM2}
          onChange={ustaw("nosnoscDachuKnM2")}
          hint="Z projektu budowlanego lub od konstruktora (wartość charakterystyczna). 1 kN/m² ≈ 102 kg/m²."
        />
        <Pole
          label="Grubość śniegu na dachu teraz (opcjonalnie)"
          unit="cm"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.gruboscWarstwyCm}
          onChange={ustaw("gruboscWarstwyCm")}
        />
        <PoleSelect
          label="Rodzaj śniegu"
          value={stan.rodzajSniegu}
          onChange={(e) => setStan((prev) => ({ ...prev, rodzajSniegu: e.target.value as FormularzStan["rodzajSniegu"] }))}
        >
          <option value="">— wybierz —</option>
          <option value="swiezy">Świeży</option>
          <option value="osiadly">Osiadły (kilka godzin lub dni)</option>
          <option value="stary">Stary (tygodnie, miesiące)</option>
          <option value="mokry">Mokry</option>
        </PoleSelect>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz strefę, wpisz wysokość n.p.m. i kąt dachu, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : "ok"}
          etykieta={hasCritical ? "Dach może nie przenieść śniegu" : "Obciążenie śniegiem dachu wg normy"}
        >
          <WynikGlowny>{f2(v.sKnM2)} kN/m²</WynikGlowny>
          <p className="mt-1 text-small">
            ≈ {f0(v.sKgM2)} kg/m² · s<sub>k</sub> = {f2(v.skKnM2)} kN/m² · μ = {f2(v.mu)} · C<sub>e</sub> = {f2(v.ce)}
          </p>
          {v.wykorzystanieNormowePct !== null && (
            <p className="mt-1 text-small">Wykorzystanie nośności wg normy: {f0(v.wykorzystanieNormowePct)}%</p>
          )}
          {v.aktualneMaxKnM2 !== null && v.aktualneMinKnM2 !== null && v.aktualneMaxKgM2 !== null && (
            <p className="mt-1 text-small">
              Śnieg na dachu teraz:{" "}
              {v.aktualneMinKnM2 === v.aktualneMaxKnM2
                ? `${f2(v.aktualneMaxKnM2)} kN/m²`
                : `${f2(v.aktualneMinKnM2)}–${f2(v.aktualneMaxKnM2)} kN/m²`}{" "}
              (do {f0(v.aktualneMaxKgM2)} kg/m²)
              {v.wykorzystanieAktualnePct !== null && ` · ${f0(v.wykorzystanieAktualnePct)}% nośności`}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
