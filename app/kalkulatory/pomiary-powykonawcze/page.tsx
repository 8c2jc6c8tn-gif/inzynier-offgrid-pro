"use client"

import { useMemo } from "react"
import { calculatePomiaryPowykonawcze } from "@/lib/core/modules/okablowanie/pomiary-powykonawcze/calculator"
import type { CelUziemienia } from "@/lib/core/modules/okablowanie/pomiary-powykonawcze/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  ciagloscPotwierdzona: boolean
  rezystancjaIzolacjiMohm: string
  celUziemienia: CelUziemienia
  rezystancjaUziemieniaOhm: string
  czasZadzialaniaRcdS: string
  testZwarciowyPotwierdzony: boolean
  termowizjaPotwierdzona: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  ciagloscPotwierdzona: false,
  rezystancjaIzolacjiMohm: "",
  celUziemienia: "ochronna",
  rezystancjaUziemieniaOhm: "",
  czasZadzialaniaRcdS: "",
  testZwarciowyPotwierdzony: false,
  termowizjaPotwierdzona: false,
}

export default function PomiaryPowykonawczePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pomiary-powykonawcze", STAN_POCZATKOWY)
  const {
    ciagloscPotwierdzona,
    rezystancjaIzolacjiMohm,
    celUziemienia,
    rezystancjaUziemieniaOhm,
    czasZadzialaniaRcdS,
    testZwarciowyPotwierdzony,
    termowizjaPotwierdzona,
  } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setCiagloscPotwierdzona = (a: boolean | ((p: boolean) => boolean)) => setPole("ciagloscPotwierdzona", a)
  const setRezystancjaIzolacjiMohm = (a: string | ((p: string) => string)) => setPole("rezystancjaIzolacjiMohm", a)
  const setCelUziemienia = (a: CelUziemienia | ((p: CelUziemienia) => CelUziemienia)) => setPole("celUziemienia", a)
  const setRezystancjaUziemieniaOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaUziemieniaOhm", a)
  const setCzasZadzialaniaRcdS = (a: string | ((p: string) => string)) => setPole("czasZadzialaniaRcdS", a)
  const setTestZwarciowyPotwierdzony = (a: boolean | ((p: boolean) => boolean)) => setPole("testZwarciowyPotwierdzony", a)
  const setTermowizjaPotwierdzona = (a: boolean | ((p: boolean) => boolean)) => setPole("termowizjaPotwierdzona", a)

  const result = useMemo(
    () =>
      calculatePomiaryPowykonawcze({
        ciagloscPotwierdzona,
        rezystancjaIzolacjiMohm: rezystancjaIzolacjiMohm === "" ? 0 : Number(rezystancjaIzolacjiMohm),
        celUziemienia,
        rezystancjaUziemieniaOhm: rezystancjaUziemieniaOhm === "" ? 0 : Number(rezystancjaUziemieniaOhm),
        czasZadzialaniaRcdS: czasZadzialaniaRcdS === "" ? 0 : Number(czasZadzialaniaRcdS),
        testZwarciowyPotwierdzony,
        termowizjaPotwierdzona,
      }),
    [
      ciagloscPotwierdzona,
      rezystancjaIzolacjiMohm,
      celUziemienia,
      rezystancjaUziemieniaOhm,
      czasZadzialaniaRcdS,
      testZwarciowyPotwierdzony,
      termowizjaPotwierdzona,
    ],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij testy powykonawcze",
    red: "Brak formalnego odbioru — co najmniej jeden test poza progiem",
    green: "Wszystkie testy w normie — formalny odbiór możliwy",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pomiary-powykonawcze" />
      <NaglowekEkranu tytul="Pomiary i testy powykonawcze">
        Ostatni krok przed odbiorem instalacji — sześć testów, każdy z twardym progiem. Dowolny
        wynik poza progiem oznacza brak formalnego odbioru. Moduł 5, Ekran 29.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="ciaglosc-potwierdzona"
          label="Ciągłość przewodów ochronnych potwierdzona (wszystkie połączone z GSW)"
          checked={ciagloscPotwierdzona}
          onChange={(e) => setCiagloscPotwierdzona(e.target.checked)}
        />
        <Pole
          label="Rezystancja izolacji (wymagane > 1 MΩ)"
          unit="MΩ"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaIzolacjiMohm}
          onChange={(e) => setRezystancjaIzolacjiMohm(e.target.value)}
        />
        <PoleSelect
          label="Cel uziemienia"
          value={celUziemienia}
          onChange={(e) => setCelUziemienia(e.target.value as CelUziemienia)}
        >
          <option value="odgromowa">Odgromowe (próg 10 Ω)</option>
          <option value="ochronna">Ochronne (próg 30 Ω)</option>
        </PoleSelect>
        <Pole
          label="Rezystancja uziemienia"
          unit="Ω"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaUziemieniaOhm}
          onChange={(e) => setRezystancjaUziemieniaOhm(e.target.value)}
        />
        <Pole
          label="Czas zadziałania RCD (wymagane < 0,4 s)"
          unit="s"
          type="number"
          inputMode="decimal"
          min={0}
          value={czasZadzialaniaRcdS}
          onChange={(e) => setCzasZadzialaniaRcdS(e.target.value)}
        />
        <PoleCheckbox
          id="test-zwarciowy-potwierdzony"
          label="Test zwarciowy pętli potwierdzony (zabezpieczenie zadziałało)"
          checked={testZwarciowyPotwierdzony}
          onChange={(e) => setTestZwarciowyPotwierdzony(e.target.checked)}
        />
        <PoleCheckbox
          id="termowizja-potwierdzona"
          label="Termowizja połączeń potwierdzona (brak gorących punktów pod obciążeniem)"
          checked={termowizjaPotwierdzona}
          onChange={(e) => setTermowizjaPotwierdzona(e.target.checked)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>
            {result.value.testowPrzeszlo} / {result.value.testowLacznie} testów w normie
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
