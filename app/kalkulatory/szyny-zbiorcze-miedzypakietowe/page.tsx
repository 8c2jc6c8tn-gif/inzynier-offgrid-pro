"use client"

import { useMemo } from "react"
import { calculateSzynyZbiorczeMiedzypakietowe } from "@/lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe/calculator"
import type { GalazInput } from "@/lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe/input"
import type { Material } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

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
  const t = useTranslate()
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
    invalid: t("UI-SZYZBIMIE-POLICZYC"),
    incomplete: t("UI-SZYZBIMIE-WYPELNIJ-PRAD-CALKOWITY"),
    green: t("UI-SZYZBIMIE-ROZPLYW-PRADU-POLICZONY"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szyny-zbiorcze-miedzypakietowe" />
      <NaglowekEkranu
        tytul={t("UI-SZYZBIMIE-SZYNY-ZBIORCZE-POLACZENIA")}
        ekran="szyny-zbiorcze-miedzypakietowe"
        wynik={result}
      >
        {t("UI-SZYZBIMIE-ELEKTRONY-WSZYSTKO-LENIWE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-SZYZBIMIE-PRAD-CALKOWITY-ROZPLYWAJACY")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradCalkowityA}
          onChange={(e) => setPradCalkowityA(e.target.value)}
          pomoc={<PomocPola ekran="szyny-zbiorcze-miedzypakietowe" pole="pradCalkowity" />}
        />
        <PoleSelect
          label={t("UI-SZYZBIMIE-MATERIAL-PRZEWODOW")}
          value={material}
          onChange={(e) => setMaterial(e.target.value as Material)}
          pomoc={<PomocPola ekran="szyny-zbiorcze-miedzypakietowe" pole="material" />}
        >
          <option value="Cu">{t("UI-SZYZBIMIE-MIEDZ")}</option>
          <option value="Al">{t("UI-SZYZBIMIE-ALUMINIUM")}</option>
        </PoleSelect>
      </div>

      <div className="flex flex-col gap-3">
        {galezie.map((g, i) => (
          <div key={g.id} className="flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-small font-medium">{t("UI-SZYZBIMIE-GALAZ", { p: i + 1 })}</span>
              {galezie.length > 2 && (
                <button
                  type="button"
                  onClick={() => usunGalaz(g.id)}
                  className="text-caption text-muted-foreground underline"
                >
                  {t("UI-SZYZBIMIE-USUN")}
                </button>
              )}
            </div>
            <Pole
              id={`dlugosc-${g.id}`}
              label={t("UI-SZYZBIMIE-DLUGOSC-ODCINKA-WSPOLNEJ")}
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              value={g.dlugoscM}
              onChange={(e) => aktualizujGalaz(g.id, "dlugoscM", e.target.value)}
              pomoc={<PomocPola ekran="szyny-zbiorcze-miedzypakietowe" pole="dlugosc" />}
            />
            <Pole
              id={`przekroj-${g.id}`}
              label={t("UI-SZYZBIMIE-PRZEKROJ-PRZEWODU")}
              unit="mm²"
              type="number"
              inputMode="decimal"
              min={0}
              value={g.przekrojMm2}
              onChange={(e) => aktualizujGalaz(g.id, "przekrojMm2", e.target.value)}
              pomoc={<PomocPola ekran="szyny-zbiorcze-miedzypakietowe" pole="przekroj" />}
            />
          </div>
        ))}
        <button type="button" onClick={dodajGalaz} className="text-small text-muted-foreground underline">
          {t("UI-SZYZBIMIE-DODAJ-GALAZ")}
        </button>
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict === "green" && (
          <ul className="flex flex-col gap-1 text-small">
            {result.value.galezie.map((g, i) => (
              <li key={g.id}>
                {t("UI-SZYZBIMIE-GALAZ-2", { p: i + 1, pradA: g.pradA.toFixed(1), udzialPct: g.udzialPct.toFixed(1), p2: (g.rezystancjaOhm * 1000).toFixed(2) })}
              </li>
            ))}
          </ul>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
