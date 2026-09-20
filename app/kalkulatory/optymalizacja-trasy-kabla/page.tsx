"use client"

import { useMemo } from "react"
import { calculateOptymalizacjaTrasyKabla } from "@/lib/core/modules/okablowanie/optymalizacja-trasy-kabla/calculator"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  pradA: string
  napiecieV: string
  material: Material
  sposobUlozenia: SposobUlozenia
  temperaturaOtoczeniaC: string
  liczbaKabliWWiazce: string
  dopuszczalnySpadekNapieciaPct: string
  cenaEnergiiZlZaKwh: string
  liczbaLat: string
  dlugoscA: string
  przekrojA: string
  kosztA: string
  dlugoscB: string
  przekrojB: string
  kosztB: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pradA: "",
  napiecieV: "",
  material: "Cu",
  sposobUlozenia: "swobodnie",
  temperaturaOtoczeniaC: "",
  liczbaKabliWWiazce: "1",
  dopuszczalnySpadekNapieciaPct: "3",
  cenaEnergiiZlZaKwh: "",
  liczbaLat: "10",
  dlugoscA: "",
  przekrojA: "",
  kosztA: "",
  dlugoscB: "",
  przekrojB: "",
  kosztB: "",
}

export default function OptymalizacjaTrasyKablaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("optymalizacja-trasy-kabla", STAN_POCZATKOWY)
  const {
    pradA,
    napiecieV,
    material,
    sposobUlozenia,
    temperaturaOtoczeniaC,
    liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct,
    cenaEnergiiZlZaKwh,
    liczbaLat,
    dlugoscA,
    przekrojA,
    kosztA,
    dlugoscB,
    przekrojB,
    kosztB,
  } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPradA = (a: string | ((p: string) => string)) => setPole("pradA", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)
  const setMaterial = (a: Material | ((p: Material) => Material)) => setPole("material", a)
  const setSposobUlozenia = (a: SposobUlozenia | ((p: SposobUlozenia) => SposobUlozenia)) => setPole("sposobUlozenia", a)
  const setTemperaturaOtoczeniaC = (a: string | ((p: string) => string)) => setPole("temperaturaOtoczeniaC", a)
  const setLiczbaKabliWWiazce = (a: string | ((p: string) => string)) => setPole("liczbaKabliWWiazce", a)
  const setDopuszczalnySpadekNapieciaPct = (a: string | ((p: string) => string)) => setPole("dopuszczalnySpadekNapieciaPct", a)
  const setCenaEnergiiZlZaKwh = (a: string | ((p: string) => string)) => setPole("cenaEnergiiZlZaKwh", a)
  const setLiczbaLat = (a: string | ((p: string) => string)) => setPole("liczbaLat", a)
  const setDlugoscA = (a: string | ((p: string) => string)) => setPole("dlugoscA", a)
  const setPrzekrojA = (a: string | ((p: string) => string)) => setPole("przekrojA", a)
  const setKosztA = (a: string | ((p: string) => string)) => setPole("kosztA", a)
  const setDlugoscB = (a: string | ((p: string) => string)) => setPole("dlugoscB", a)
  const setPrzekrojB = (a: string | ((p: string) => string)) => setPole("przekrojB", a)
  const setKosztB = (a: string | ((p: string) => string)) => setPole("kosztB", a)

  const result = useMemo(
    () =>
      calculateOptymalizacjaTrasyKabla({
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        material,
        sposobUlozenia,
        temperaturaOtoczeniaC: temperaturaOtoczeniaC === "" ? null : Number(temperaturaOtoczeniaC),
        liczbaKabliWWiazce: liczbaKabliWWiazce === "" ? 0 : Number(liczbaKabliWWiazce),
        dopuszczalnySpadekNapieciaPct: dopuszczalnySpadekNapieciaPct === "" ? 0 : Number(dopuszczalnySpadekNapieciaPct),
        cenaEnergiiZlZaKwh: cenaEnergiiZlZaKwh === "" ? 0 : Number(cenaEnergiiZlZaKwh),
        liczbaLat: liczbaLat === "" ? 0 : Number(liczbaLat),
        trasaA: {
          dlugoscTrasyM: dlugoscA === "" ? 0 : Number(dlugoscA),
          przekrojMm2: przekrojA === "" ? 0 : Number(przekrojA),
          kosztZakupuZl: kosztA === "" ? 0 : Number(kosztA),
        },
        trasaB: {
          dlugoscTrasyM: dlugoscB === "" ? 0 : Number(dlugoscB),
          przekrojMm2: przekrojB === "" ? 0 : Number(przekrojB),
          kosztZakupuZl: kosztB === "" ? 0 : Number(kosztB),
        },
      }),
    [
      pradA,
      napiecieV,
      material,
      sposobUlozenia,
      temperaturaOtoczeniaC,
      liczbaKabliWWiazce,
      dopuszczalnySpadekNapieciaPct,
      cenaEnergiiZlZaKwh,
      liczbaLat,
      dlugoscA,
      przekrojA,
      kosztA,
      dlugoscB,
      przekrojB,
      kosztB,
    ],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "OUT_OF_SCOPE"
        ? "invalid"
        : result.status === "INCOMPLETE"
          ? "incomplete"
          : hasCritical
            ? "red"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }
  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij dane obu tras",
    red: "Uwaga — jedna z tras nie spełnia wymagań przekroju",
    green: "Porównanie gotowe",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/optymalizacja-trasy-kabla" />
      <NaglowekEkranu tytul="Optymalizacja trasy i kosztu kabla">
        Nie patrz tylko na cenę kabla — grubszy, krótszy kabel często zwraca się w mniejszych
        stratach przez lata. Moduł 5, Ekran 26.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label="Prąd obwodu (wspólny dla obu tras)" unit="A" type="number" inputMode="decimal" min={0} value={pradA} onChange={(e) => setPradA(e.target.value)} />
        <Pole label="Napięcie systemowe" unit="V" type="number" inputMode="decimal" min={0} value={napiecieV} onChange={(e) => setNapiecieV(e.target.value)} />
        <PoleSelect label="Materiał" value={material} onChange={(e) => setMaterial(e.target.value as Material)}>
          <option value="Cu">Miedź (Cu)</option>
          <option value="Al">Aluminium (Al)</option>
        </PoleSelect>
        <PoleSelect label="Sposób ułożenia" value={sposobUlozenia} onChange={(e) => setSposobUlozenia(e.target.value as SposobUlozenia)}>
          <option value="swobodnie">Swobodnie / na ścianie</option>
          <option value="w_peszlu">W peszlu</option>
          <option value="w_ziemi">W ziemi</option>
          <option value="w_wiazce">W wiązce</option>
        </PoleSelect>
        <Pole label="Temperatura otoczenia" unit="°C" type="number" inputMode="decimal" value={temperaturaOtoczeniaC} onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)} />
        <Pole label="Liczba kabli w wiązce" unit="szt." type="number" inputMode="decimal" min={0} value={liczbaKabliWWiazce} onChange={(e) => setLiczbaKabliWWiazce(e.target.value)} />
        <Pole label="Dopuszczalny spadek napięcia" unit="%" type="number" inputMode="decimal" min={0} value={dopuszczalnySpadekNapieciaPct} onChange={(e) => setDopuszczalnySpadekNapieciaPct(e.target.value)} />
        <Pole label="Cena energii elektrycznej" unit="zł/kWh" type="number" inputMode="decimal" min={0} value={cenaEnergiiZlZaKwh} onChange={(e) => setCenaEnergiiZlZaKwh(e.target.value)} />
        <Pole label="Horyzont porównania" unit="lat" type="number" inputMode="decimal" min={0} value={liczbaLat} onChange={(e) => setLiczbaLat(e.target.value)} />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <div className="font-medium">Trasa A</div>
        <Pole id="dlugosc-trasy-a" label="Długość trasy" unit="m" type="number" inputMode="decimal" min={0} value={dlugoscA} onChange={(e) => setDlugoscA(e.target.value)} />
        <Pole id="przekroj-trasy-a" label="Przekrój rozważany" unit="mm²" type="number" inputMode="decimal" min={0} value={przekrojA} onChange={(e) => setPrzekrojA(e.target.value)} />
        <Pole id="koszt-trasy-a" label="Koszt zakupu (kabel + osłony + robocizna)" unit="zł" type="number" inputMode="decimal" min={0} value={kosztA} onChange={(e) => setKosztA(e.target.value)} />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <div className="font-medium">Trasa B</div>
        <Pole id="dlugosc-trasy-b" label="Długość trasy" unit="m" type="number" inputMode="decimal" min={0} value={dlugoscB} onChange={(e) => setDlugoscB(e.target.value)} />
        <Pole id="przekroj-trasy-b" label="Przekrój rozważany" unit="mm²" type="number" inputMode="decimal" min={0} value={przekrojB} onChange={(e) => setPrzekrojB(e.target.value)} />
        <Pole id="koszt-trasy-b" label="Koszt zakupu (kabel + osłony + robocizna)" unit="zł" type="number" inputMode="decimal" min={0} value={kosztB} onChange={(e) => setKosztB(e.target.value)} />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict === "green" ? (
          <WynikGlowny>
            TCO A: {result.value.tcoAZl.toFixed(0)} zł ({result.value.strataRocznaAKwh.toFixed(1)} kWh/rok) · TCO B:{" "}
            {result.value.tcoBZl.toFixed(0)} zł ({result.value.strataRocznaBKwh.toFixed(1)} kWh/rok)
          </WynikGlowny>
        ) : null}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
