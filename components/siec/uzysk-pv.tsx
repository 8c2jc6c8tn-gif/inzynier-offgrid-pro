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
import { MIESIACE_KROTKO } from "./zuzycie-miesieczne"

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
      <h2 className="font-semibold">Uzysk PV z 1 kWp</h2>
      <PoleSelect
        label="Skąd uzysk"
        value={stan.zrodlo}
        onChange={(e) => onChange({ zrodlo: e.target.value as StanUzysku["zrodlo"] })}
        pomoc={<PomocPola ekran="siec-uzysk-pv" pole="zrodlo" />}
      >
        <option value="lokalizacja">z nasłonecznienia mojej lokalizacji (Moduł 1 i 3)</option>
        <option value="reczny">wpiszę 12 wartości (np. z PVGIS)</option>
      </PoleSelect>
      {stan.zrodlo === "lokalizacja" ? (
        <>
          <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />
          <div className="grid grid-cols-3 gap-3">
            <Pole
              label="Azymut"
              unit="°"
              type="number"
              inputMode="decimal"
              value={stan.azymutDeg}
              onChange={(e) => onChange({ azymutDeg: e.target.value })}
              pomoc={<PomocPola ekran="siec-uzysk-pv" pole="azymut" />}
            />
            <Pole
              label="Nachylenie"
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
            Policz nasłonecznienie dla tego azymutu
          </Button>
          {produkcja && (
            <Button type="button" onClick={() => onChange({ obliczony: produkcja })}>
              Użyj tego uzysku ({Math.round(produkcja.reduce((a, b) => a + b, 0))} kWh/kWp rocznie)
            </Button>
          )}
          {zapisany ? (
            <p className="text-small">
              Zapisany uzysk: {Math.round(zapisany.reduce((a, b) => a + b, 0))} kWh/kWp rocznie; grudzień {zapisany[11].toFixed(0)}, styczeń{" "}
              {zapisany[0].toFixed(0)} kWh/kWp.
            </p>
          ) : (
            <p className="text-small text-muted-foreground">Uzysk jeszcze nie zapisany — policz go i kliknij „Użyj tego uzysku”.</p>
          )}
        </>
      ) : (
        <fieldset className="grid grid-cols-3 gap-3 rounded-md border p-3">
          <legend className="px-1 text-small font-medium">Uzysk w miesiącach [kWh/kWp]</legend>
          {MIESIACE_KROTKO.map((m, i) => (
            <Pole
              key={m}
              label={m}
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
