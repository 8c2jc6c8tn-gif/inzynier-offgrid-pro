"use client"

import { useMemo } from "react"
import { calculateModulGasniczy } from "@/lib/core/modules/bezpieczenstwo/modul-gasniczy/calculator"
import { MIN_CZUJNIKOW_POTWIERDZENIA } from "@/lib/core/modules/bezpieczenstwo/modul-gasniczy/constants"
import type { MagazynWStrefie, SrodekGasniczy, StanModuluGasniczego } from "@/lib/core/modules/bezpieczenstwo/modul-gasniczy/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  srodek: SrodekGasniczy | ""
  magazynWStrefie: MagazynWStrefie | ""
  liczbaCzujnikowPotwierdzenia: string
  odcinaWentylacjeIKlapy: boolean
  stanModulu: StanModuluGasniczego | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  srodek: "",
  magazynWStrefie: "",
  liczbaCzujnikowPotwierdzenia: "",
  odcinaWentylacjeIKlapy: false,
  stanModulu: "",
}

/** Sekwencja dowódcy akcji AI — 1:1 ze źródła (Tresc_Modul_8, Ekran 4, B.2; Biblia v2.0 §8.9). */
const SEKWENCJA = [
  "Odłącz zasilanie PV i baterii w zagrożonej strefie.",
  "Wyłącz wentylację mechaniczną i zamknij klapy pożarowe.",
  "Zwolnij zamki drzwi ewakuacyjnych.",
  "Uruchom oświetlenie ewakuacyjne i zewnętrzne.",
  "Odłącz zbędne obwody, żeby nie zasilały ognia.",
  "Uruchom moduł gaśniczy.",
]

export default function ModulGasniczyPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("modul-gasniczy", STAN_POCZATKOWY)
  const ustaw = <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))

  const result = useMemo(
    () =>
      calculateModulGasniczy({
        srodek: stan.srodek === "" ? null : stan.srodek,
        magazynWStrefie: stan.magazynWStrefie === "" ? null : stan.magazynWStrefie,
        liczbaCzujnikowPotwierdzenia: stan.liczbaCzujnikowPotwierdzenia === "" ? null : Number(stan.liczbaCzujnikowPotwierdzenia),
        odcinaWentylacjeIKlapy: stan.odcinaWentylacjeIKlapy,
        stanModulu: stan.stanModulu === "" ? null : stan.stanModulu,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/modul-gasniczy" />
      <NaglowekEkranu
        tytul="Moduł gaśniczy"
        ekran="modul-gasniczy"
        parametry={{ minCzujnikow: MIN_CZUJNIKOW_POTWIERDZENIA }}
        wynik={result}
      >
        Człowiek może nie zdążyć pomyśleć we właściwej kolejności podczas pożaru — system realizuje sprawdzoną sekwencję
        kroków w ciągu sekund. Moduł 8, Ekran 4.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Środek gaśniczy"
          value={stan.srodek}
          onChange={(e) => ustaw("srodek", e.target.value as FormularzStan["srodek"])}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="srodek" />}
        >
          <option value="">— wybierz —</option>
          <option value="mgla-wodna">Mgła wodna</option>
          <option value="specjalny-magazyn-energii">Środek do magazynów energii</option>
          <option value="gaz-obojetny">Gaz obojętny</option>
          <option value="aerozol">Aerozol</option>
          <option value="proszek">Proszek</option>
          <option value="co2">CO2</option>
        </PoleSelect>
        <PoleSelect
          label="Magazyn energii w strefie gaśniczej"
          value={stan.magazynWStrefie}
          onChange={(e) => ustaw("magazynWStrefie", e.target.value as FormularzStan["magazynWStrefie"])}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="magazyn" />}
        >
          <option value="">— wybierz —</option>
          <option value="brak">Brak magazynu w strefie</option>
          <option value="lifepo4">LiFePO4</option>
          <option value="inna">Inna chemia</option>
        </PoleSelect>
        <Pole
          label="Czujniki potwierdzające alarm"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={stan.liczbaCzujnikowPotwierdzenia}
          onChange={(e) => ustaw("liczbaCzujnikowPotwierdzenia", e.target.value)}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="czujniki" params={{ minCzujnikow: MIN_CZUJNIKOW_POTWIERDZENIA }} />}
        />
        <PoleCheckbox
          id="gasz-odciecie-wentylacji"
          label="Gaszenie odcina wentylację i zamyka klapy"
          checked={stan.odcinaWentylacjeIKlapy}
          onChange={(e) => ustaw("odcinaWentylacjeIKlapy", e.target.checked)}
        />
        <PoleSelect
          label="Stan modułu"
          value={stan.stanModulu}
          onChange={(e) => ustaw("stanModulu", e.target.value as FormularzStan["stanModulu"])}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="stanModulu" />}
        >
          <option value="">— wybierz —</option>
          <option value="sprawny">Sprawny (naładowany)</option>
          <option value="rozladowany">Rozładowany</option>
        </PoleSelect>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się ocenić — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć ocenę.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Gaszenie może nie zadziałać" : hasWarning ? "Są braki w konfiguracji" : "Konfiguracja zgodna"}
        >
          <WynikGlowny>Braki: {result.value.liczbaBrakow}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-body font-medium">Kolejność działań po wykryciu pożaru</h2>
        <ol className="list-decimal pl-5 text-small">
          {SEKWENCJA.map((krok) => (
            <li key={krok}>{krok}</li>
          ))}
        </ol>
        <p className="text-caption text-muted-foreground">
          Kolejność ma znaczenie — wykonuje ją sterownik (Moduł 9), ten ekran tylko ją pokazuje.
        </p>
      </section>
    </main>
  )
}
