"use client"

import { useMemo, useState, type ReactNode } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { calculateKatIAzymut } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"
import { KLUCZE_MIESIECY } from "./zuzycie-miesieczne"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * Monthly PV yield [kWh/kWp] for the M14 transition screens — echo of M3 „Kąt i azymut”
 * (`calculateKatIAzymut` with 1 kWp and the user's PR, irradiation from the project location, M1)
 * or 12 values typed in (e.g. from PVGIS). The computed yield is kept in the owner's draft so the
 * echo screens (D5, D6, D7/F8) never recompute it.
 */
export type StanUzysku = {
  zrodlo: "lokalizacja" | "reczny"
  azymutDeg: string
  nachylenieDeg: string
  pr: string
  reczny: string[]
  /** Last yield computed from the location (kWh/kWp per month); null = not computed yet. */
  obliczony: number[] | null
}

export const POCZATKOWY_UZYSKU: StanUzysku = {
  zrodlo: "lokalizacja",
  azymutDeg: "",
  nachylenieDeg: "",
  pr: "",
  reczny: Array(12).fill(""),
  obliczony: null,
}

export function uzyskZeStanu(s: StanUzysku | null | undefined): number[] | null {
  if (!s) return null
  if (s.zrodlo === "lokalizacja") return s.obliczony
  return s.reczny.length === 12 && s.reczny.every((v) => v !== "") ? s.reczny.map(Number) : null
}

const nn = (s: string) => (s === "" ? null : Number(s))

export function SekcjaUzyskuPv({ stan, onChange }: { stan: StanUzysku; onChange: (z: Partial<StanUzysku>) => void }): ReactNode {
  const t = useTranslate()
  const { lokalizacja, dane, tmy } = useLokalizacjaProjektu()
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [tabela, setTabela] = useState<TabelaNapromieniowania | null>(null)

  const wynik = useMemo(
    () =>
      calculateKatIAzymut({
        tabela,
        nachylenieDeg: nn(stan.nachylenieDeg),
        mocInstalacjiKwp: 1,
        wspolczynnikPr: nn(stan.pr),
      }),
    [tabela, stan.nachylenieDeg, stan.pr],
  )

  async function policz() {
    if (!lokalizacja || !dane || stan.azymutDeg === "") return
    const r = await uruchom({
      typ: "tabela-napromieniowania",
      wejscie: {
        szerokoscGeograficzna: lokalizacja.szerokosc,
        dlugoscGeograficzna: lokalizacja.dlugosc,
        daneGodzinowe: dane.dane.rekordy,
        azymutDeg: Number(stan.azymutDeg),
      },
    })
    if (r) setTabela(r.wynik.value)
  }

  const produkcja = wynik.value?.produkcjaMiesiecznaKwh ?? null
  const zapisany = stan.obliczony

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("UI-UZY-TYTUL")}</h2>
      <PoleSelect
        label={t("UI-UZY-SKAD")}
        value={stan.zrodlo}
        onChange={(e) => onChange({ zrodlo: e.target.value as StanUzysku["zrodlo"] })}
        pomoc={<PomocPola ekran="siec-uzysk-pv" pole="zrodlo" />}
      >
        <option value="lokalizacja">{t("UI-UZY-Z-LOKALIZACJI")}</option>
        <option value="reczny">{t("UI-UZY-RECZNY")}</option>
      </PoleSelect>
      {stan.zrodlo === "lokalizacja" ? (
        <>
          <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />
          <div className="grid grid-cols-3 gap-3">
            <Pole
              label={t("UI-UZY-AZYMUT")}
              unit="°"
              type="number"
              inputMode="decimal"
              value={stan.azymutDeg}
              onChange={(e) => onChange({ azymutDeg: e.target.value })}
              pomoc={<PomocPola ekran="siec-uzysk-pv" pole="azymut" />}
            />
            <Pole
              label={t("UI-UZY-NACHYLENIE")}
              unit="°"
              type="number"
              inputMode="decimal"
              value={stan.nachylenieDeg}
              onChange={(e) => onChange({ nachylenieDeg: e.target.value })}
              pomoc={<PomocPola ekran="siec-uzysk-pv" pole="nachylenie" />}
            />
            <Pole
              label="PR"
              type="number"
              inputMode="decimal"
              step={0.01}
              value={stan.pr}
              onChange={(e) => onChange({ pr: e.target.value })}
              pomoc={<PomocPola ekran="siec-uzysk-pv" pole="pr" />}
            />
          </div>
          <Button type="button" variant="outline" onClick={policz} disabled={!lokalizacja || !dane || stan.azymutDeg === "" || obliczenia.liczy}>
            {t("UI-UZY-POLICZ")}
          </Button>
          {produkcja && (
            <Button type="button" onClick={() => onChange({ obliczony: produkcja })}>
              {t("UI-UZY-UZYJ", { roczny: Math.round(produkcja.reduce((a, b) => a + b, 0)) })}
            </Button>
          )}
          {zapisany ? (
            <p className="text-small">
              {t("UI-UZY-ZAPISANY", {
                roczny: Math.round(zapisany.reduce((a, b) => a + b, 0)),
                grudzien: zapisany[11].toFixed(0),
                styczen: zapisany[0].toFixed(0),
              })}
            </p>
          ) : (
            <p className="text-small text-muted-foreground">{t("UI-UZY-NIEZAPISANY")}</p>
          )}
        </>
      ) : (
        <fieldset className="grid grid-cols-3 gap-3 rounded-md border p-3">
          <legend className="px-1 text-small font-medium">{t("UI-UZY-LEGENDA")}</legend>
          {KLUCZE_MIESIECY.map((m, i) => (
            <Pole
              key={m}
              label={t(m)}
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.reczny[i] ?? ""}
              onChange={(e) => onChange({ reczny: stan.reczny.map((v, j) => (j === i ? e.target.value : v)) })}
              pomoc={<PomocPola ekran="siec-uzysk-pv" pole="miesiac" />}
            />
          ))}
        </fieldset>
      )}
    </section>
  )
}
