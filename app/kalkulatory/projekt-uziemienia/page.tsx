"use client"

import { useMemo } from "react"
import { calculateProjektUziemienia } from "@/lib/core/modules/okablowanie/projekt-uziemienia/calculator"
import { ETYKIETA_CELU } from "@/lib/core/modules/okablowanie/projekt-uziemienia/constants"
import type { CelUziemienia } from "@/lib/core/modules/okablowanie/projekt-uziemienia/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  rezystywnoscGruntuOmM: string
  dlugoscPretaM: string
  srednicaPretaMm: string
  celUziemienia: CelUziemienia | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  rezystywnoscGruntuOmM: "",
  dlugoscPretaM: "3",
  srednicaPretaMm: "16",
  celUziemienia: "",
}

export default function ProjektUziemieniaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("projekt-uziemienia", STAN_POCZATKOWY)
  const { rezystywnoscGruntuOmM, dlugoscPretaM, srednicaPretaMm, celUziemienia } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const result = useMemo(
    () =>
      calculateProjektUziemienia({
        rezystywnoscGruntuOmM: rezystywnoscGruntuOmM === "" ? 0 : Number(rezystywnoscGruntuOmM),
        dlugoscPretaM: dlugoscPretaM === "" ? 0 : Number(dlugoscPretaM),
        srednicaPretaMm: srednicaPretaMm === "" ? 0 : Number(srednicaPretaMm),
        celUziemienia: celUziemienia === "" ? null : celUziemienia,
      }),
    [rezystywnoscGruntuOmM, dlugoscPretaM, srednicaPretaMm, celUziemienia],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : result.status === "OUT_OF_SCOPE"
          ? "outOfScope"
          : hasCritical
            ? "red"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    outOfScope: "blad",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij wszystkie pola",
    outOfScope: "Geometria pręta poza zakresem wzoru — sprawdź długość/średnicę",
    red: "Zbyt trudny grunt dla prostego liczenia — potrzebny realny projekt",
    green: "Uziom zaprojektowany",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/projekt-uziemienia" />
      <NaglowekEkranu tytul="Projekt uziemienia" ekran="projekt-uziemienia" wzor={result.formula}>
        Ziemia to kabel — jeśli jest „za cienki” (za mała powierzchnia styku), prąd zwarciowy nie
        ucieknie skutecznie i może wrócić do ciebie. Moduł 5, Ekran 9.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Rezystywność gruntu"
          unit="Ω·m"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystywnoscGruntuOmM}
          onChange={(e) => setPole("rezystywnoscGruntuOmM", e.target.value)}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="rezystywnosc" />}
        />
        <Pole
          label="Długość pojedynczego pręta uziomowego"
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={dlugoscPretaM}
          onChange={(e) => setPole("dlugoscPretaM", e.target.value)}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="dlugosc" />}
        />
        <Pole
          label="Średnica pręta uziomowego"
          unit="mm"
          type="number"
          inputMode="decimal"
          min={0}
          value={srednicaPretaMm}
          onChange={(e) => setPole("srednicaPretaMm", e.target.value)}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="srednica" />}
        />
        <PoleSelect
          label="Cel uziemienia"
          value={celUziemienia}
          onChange={(e) => setPole("celUziemienia", e.target.value as CelUziemienia | "")}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="cel" />}
        >
          <option value="">— wybierz —</option>
          {(Object.keys(ETYKIETA_CELU) as CelUziemienia[]).map((cel) => (
            <option key={cel} value={cel}>
              {ETYKIETA_CELU[cel]}
            </option>
          ))}
        </PoleSelect>
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict === "green" && (
          <WynikGlowny>
            {result.value.liczbaPretowSzacowana} {result.value.liczbaPretowSzacowana === 1 ? "pręt" : "pręty"} (R ≈{" "}
            {result.value.rezystancjaJednegoPretaOm.toFixed(1)} Ω / pręt)
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
