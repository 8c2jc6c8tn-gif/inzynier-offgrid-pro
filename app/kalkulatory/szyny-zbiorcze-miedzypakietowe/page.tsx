"use client"

import { useMemo } from "react"
import { calculateSzynyZbiorczeMiedzypakietowe } from "@/lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe/calculator"
import type { GalazInput } from "@/lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe/input"
import type { Material } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type GalazForm = { id: string; dlugoscM: string; przekrojMm2: string }

function nowaGalaz(id: string): GalazForm {
  return { id, dlugoscM: "", przekrojMm2: "" }
}

type FormularzStan = {
  pradCalkowityA: string
  material: Material
  galezie: GalazForm[]
}

const STAN_POCZATKOWY: FormularzStan = {
  pradCalkowityA: "",
  material: "Cu",
  galezie: [nowaGalaz("galaz-1"), nowaGalaz("galaz-2")],
}

export default function SzynyZbiorczeMiedzypakietowePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("szyny-zbiorcze-miedzypakietowe", STAN_POCZATKOWY)
  const { pradCalkowityA, material, galezie } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPradCalkowityA = (a: string | ((p: string) => string)) => setPole("pradCalkowityA", a)
  const setMaterial = (a: Material | ((p: Material) => Material)) => setPole("material", a)
  const setGalezie = (a: GalazForm[] | ((p: GalazForm[]) => GalazForm[])) => setPole("galezie", a)

  function dodajGalaz() {
    setGalezie((prev) => [...prev, nowaGalaz(`galaz-${prev.length + 1}-${Date.now()}`)])
  }

  function usunGalaz(id: string) {
    setGalezie((prev) => (prev.length > 2 ? prev.filter((g) => g.id !== id) : prev))
  }

  function aktualizujGalaz(id: string, pole: "dlugoscM" | "przekrojMm2", wartosc: string) {
    setGalezie((prev) => prev.map((g) => (g.id === id ? { ...g, [pole]: wartosc } : g)))
  }

  const galezieInput: GalazInput[] = useMemo(
    () =>
      galezie.map((g) => ({
        id: g.id,
        dlugoscM: g.dlugoscM === "" ? 0 : Number(g.dlugoscM),
        przekrojMm2: g.przekrojMm2 === "" ? 0 : Number(g.przekrojMm2),
      })),
    [galezie],
  )

  const result = useMemo(
    () =>
      calculateSzynyZbiorczeMiedzypakietowe({
        pradCalkowityA: pradCalkowityA === "" ? 0 : Number(pradCalkowityA),
        material,
        galezie: galezieInput,
      }),
    [pradCalkowityA, material, galezieInput],
  )

  const verdict = result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    green: "ok",
  }
  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij prąd całkowity i dane wszystkich gałęzi",
    green: "Rozpływ prądu policzony",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szyny-zbiorcze-miedzypakietowe" />
      <NaglowekEkranu tytul="Szyny zbiorcze i połączenia międzypakietowe">
        Elektrony, jak wszystko leniwe, płyną tam, gdzie jest im łatwiej — nierówne długości
        kabli czy niesymetryczne podłączenie zawsze prowadzi do nierównego obciążenia. Moduł 4,
        Ekran 25.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Prąd całkowity rozpływający się między gałęziami"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradCalkowityA}
          onChange={(e) => setPradCalkowityA(e.target.value)}
        />
        <PoleSelect label="Materiał przewodów" value={material} onChange={(e) => setMaterial(e.target.value as Material)}>
          <option value="Cu">Miedź (Cu)</option>
          <option value="Al">Aluminium (Al)</option>
        </PoleSelect>
      </div>

      <div className="flex flex-col gap-3">
        {galezie.map((g, i) => (
          <div key={g.id} className="flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-small font-medium">Gałąź {i + 1}</span>
              {galezie.length > 2 && (
                <button
                  type="button"
                  onClick={() => usunGalaz(g.id)}
                  className="text-caption text-muted-foreground underline"
                >
                  Usuń
                </button>
              )}
            </div>
            <Pole
              id={`dlugosc-${g.id}`}
              label="Długość odcinka do wspólnej szyny"
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              value={g.dlugoscM}
              onChange={(e) => aktualizujGalaz(g.id, "dlugoscM", e.target.value)}
            />
            <Pole
              id={`przekroj-${g.id}`}
              label="Przekrój przewodu"
              unit="mm²"
              type="number"
              inputMode="decimal"
              min={0}
              value={g.przekrojMm2}
              onChange={(e) => aktualizujGalaz(g.id, "przekrojMm2", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={dodajGalaz} className="text-small text-muted-foreground underline">
          + Dodaj gałąź
        </button>
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict === "green" && (
          <ul className="flex flex-col gap-1 text-small">
            {result.value.galezie.map((g, i) => (
              <li key={g.id}>
                Gałąź {i + 1}: {g.pradA.toFixed(1)} A ({g.udzialPct.toFixed(1)}%), R = {(g.rezystancjaOhm * 1000).toFixed(2)} mΩ
              </li>
            ))}
          </ul>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
