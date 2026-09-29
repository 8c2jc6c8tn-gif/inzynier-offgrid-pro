"use client"

import { useMemo } from "react"
import { calculateUziemienieFunkcjonalneOchronne } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/calculator"
import type { UkladSieci } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  ukladSieci: UkladSieci | ""
  falownikWymagaUkladuIt: boolean
  biegunDcUziemiony: boolean
  obudowaPolaczonaZGsw: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  ukladSieci: "",
  falownikWymagaUkladuIt: false,
  biegunDcUziemiony: false,
  obudowaPolaczonaZGsw: false,
}

export default function UziemienieFunkcjonalneOchronnePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("uziemienie-funkcjonalne-ochronne", STAN_POCZATKOWY)
  const { ukladSieci, falownikWymagaUkladuIt, biegunDcUziemiony, obudowaPolaczonaZGsw } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setUkladSieci = (a: (UkladSieci | "") | ((p: UkladSieci | "") => UkladSieci | "")) => setPole("ukladSieci", a)
  const setFalownikWymagaUkladuIt = (a: boolean | ((p: boolean) => boolean)) => setPole("falownikWymagaUkladuIt", a)
  const setBiegunDcUziemiony = (a: boolean | ((p: boolean) => boolean)) => setPole("biegunDcUziemiony", a)
  const setObudowaPolaczonaZGsw = (a: boolean | ((p: boolean) => boolean)) => setPole("obudowaPolaczonaZGsw", a)

  const result = useMemo(
    () =>
      calculateUziemienieFunkcjonalneOchronne({
        ukladSieci: ukladSieci === "" ? null : ukladSieci,
        falownikWymagaUkladuIt,
        biegunDcUziemiony,
        obudowaPolaczonaZGsw,
      }),
    [ukladSieci, falownikWymagaUkladuIt, biegunDcUziemiony, obudowaPolaczonaZGsw],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict = hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = { red: "blad", green: "ok" }
  const verdictLabel: Record<typeof verdict, string> = {
    red: "Wymaga korekty — sprawdź ostrzeżenia poniżej",
    green: "Uziemienie zgodne z wymaganiami",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/uziemienie-funkcjonalne-ochronne" />
      <NaglowekEkranu
        tytul="Uziemienie funkcjonalne vs ochronne"
        ekran="uziemienie-funkcjonalne-ochronne"
        wzor={result.formula}
      >
        Ochronne to poduszka powietrzna dla ciebie. Funkcjonalne to stabilizator dla elektroniki.
        Oba muszą być, ale nie zawsze razem. Moduł 5, Ekran 11.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Układ sieci (informacyjnie)"
          value={ukladSieci}
          onChange={(e) => setUkladSieci(e.target.value as UkladSieci)}
          pomoc={<PomocPola ekran="uziemienie-funkcjonalne-ochronne" pole="uklad" />}
        >
          <option value="">— wybierz —</option>
          <option value="TN-S">TN-S</option>
          <option value="TN-C-S">TN-C-S</option>
          <option value="TT">TT</option>
          <option value="IT">IT</option>
        </PoleSelect>
        <PoleCheckbox
          id="falownik-it"
          label="Falownik wymaga/pracuje w układzie izolowanym (IT) wg dokumentacji producenta"
          checked={falownikWymagaUkladuIt}
          onChange={(e) => setFalownikWymagaUkladuIt(e.target.checked)}
        />
        <PoleCheckbox
          id="biegun-dc-uziemiony"
          label="Biegun DC jest uziemiony w tej instalacji"
          checked={biegunDcUziemiony}
          onChange={(e) => setBiegunDcUziemiony(e.target.checked)}
        />
        <PoleCheckbox
          id="obudowa-gsw"
          label="Obudowa falownika (uziemienie ochronne) połączona z GSW"
          checked={obudowaPolaczonaZGsw}
          onChange={(e) => setObudowaPolaczonaZGsw(e.target.checked)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
