"use client"

import { useMemo, useState } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { calculateLiczbaPaneli } from "@/lib/core/modules/pv/liczba-paneli/calculator"
import { type IdOkresu, LIMIT_MONTAZOWY_PODPOWIEDZ_SZT } from "@/lib/core/modules/pv/liczba-paneli/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"

type FormularzStan = {
  azymutDeg: string
  nachylenieDeg: string
  stelazRegulowany: boolean
  mocPaneluWp: string
  powierzchniaPaneluM2: string
  pr: string
  zapotrzebowanieKwh: string
  zimaKwh: string
  miesiaceGrzewcze: number[]
  limit: string
}

const STAN_POCZATKOWY: FormularzStan = {
  azymutDeg: "",
  nachylenieDeg: "",
  stelazRegulowany: false,
  mocPaneluWp: "",
  powierzchniaPaneluM2: "",
  pr: "",
  zapotrzebowanieKwh: "",
  zimaKwh: "0",
  miesiaceGrzewcze: [],
  limit: String(LIMIT_MONTAZOWY_PODPOWIEDZ_SZT),
}

const MIESIACE = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]
const NAZWA_OKRESU: Record<IdOkresu, string> = {
  lato: "Tylko lato (cze–sie)",
  marPaz: "Marzec–październik",
  lutLis: "Luty–listopad",
  rok: "Cały rok",
}
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function LiczbaPaneliPage() {
  const t = useTranslate()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("liczba-paneli", STAN_POCZATKOWY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [tabela, setTabela] = useState<{ klucz: string; t: TabelaNapromieniowania | null } | null>(null)
  const ustaw = (pole: keyof FormularzStan, v: string | boolean) => setStan((prev) => ({ ...prev, [pole]: v }))
  const przelaczMiesiac = (m: number) =>
    setStan((prev) => ({
      ...prev,
      miesiaceGrzewcze: prev.miesiaceGrzewcze.includes(m)
        ? prev.miesiaceGrzewcze.filter((x) => x !== m)
        : [...prev.miesiaceGrzewcze, m].sort((a, b) => a - b),
    }))

  const azymut = liczba(stan.azymutDeg)
  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, azymut])
  const aktualna = tabela !== null && tabela.klucz === klucz ? tabela : null

  async function policzTabele() {
    if (!lokalizacja || !dane || azymut === undefined) return
    const r = await uruchom({
      typ: "tabela-napromieniowania",
      wejscie: {
        szerokoscGeograficzna: lokalizacja.szerokosc,
        dlugoscGeograficzna: lokalizacja.dlugosc,
        daneGodzinowe: dane.dane.rekordy,
        azymutDeg: azymut,
      },
    })
    if (r) setTabela({ klucz, t: r.wynik.value })
  }

  const n = (s: string) => liczba(s) ?? null
  const result = useMemo(
    () =>
      calculateLiczbaPaneli({
        tabela: aktualna?.t ?? null,
        nachylenieDeg: n(stan.nachylenieDeg),
        stelazRegulowany: stan.stelazRegulowany,
        mocPaneluWp: n(stan.mocPaneluWp),
        powierzchniaPaneluM2: n(stan.powierzchniaPaneluM2),
        wspolczynnikPr: n(stan.pr),
        zapotrzebowanieDoboweKwh: n(stan.zapotrzebowanieKwh),
        dodatkoweZimaKwhDzien: n(stan.zimaKwh),
        miesiaceGrzewcze: stan.miesiaceGrzewcze,
        limitMontazowy: n(stan.limit),
      }),
    [aktualna, stan],
  )

  if (!wczytano) return <StanLadowania linie={6} />
  const r = result.value
  const rek = r?.warianty.find((w) => w.id === r.rekomendacja) ?? null
  const nD = r?.liczbaPaneliDeficytu ?? null

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/liczba-paneli" />
      <NaglowekEkranu tytul="Ile paneli potrzebujesz">
        Liczba paneli dla czterech okresów: samo lato, marzec–październik, luty–listopad i cały rok — policzona z
        nasłonecznienia Twojej lokalizacji. Obok: ile paneli realnie zamontujesz i ile energii zabraknie zimą.
        Moduł 3, Ekran 4.
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">1. Ustawienie paneli</h2>
        <Pole
          label="Azymut paneli"
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={360}
          value={stan.azymutDeg}
          onChange={(e) => ustaw("azymutDeg", e.target.value)}
          hint="180° = południe, 90° = wschód, 270° = zachód."
        />
        <Button className="min-h-11" disabled={!lokalizacja || !dane || azymut === undefined || obliczenia.liczy} onClick={policzTabele}>
          {obliczenia.liczy ? "Liczę nasłonecznienie…" : "Policz nasłonecznienie"}
        </Button>
        {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
        {tabela && !aktualna && !obliczenia.liczy && <StanPusty tytul="Zmieniła się lokalizacja lub azymut — policz ponownie." />}
        <PoleCheckbox
          id="stelaz-regulowany"
          label="Stelaż z ręczną regulacją kąta"
          hint="Co miesiąc przestawiasz panele na najlepszy kąt tego miesiąca (zimą stromo, latem płasko)."
          checked={stan.stelazRegulowany}
          onChange={(e) => ustaw("stelazRegulowany", e.target.checked)}
        />
        {!stan.stelazRegulowany && (
          <Pole
            label="Kąt pochylenia"
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={90}
            value={stan.nachylenieDeg}
            onChange={(e) => ustaw("nachylenieDeg", e.target.value)}
            hint="Stały kąt przez cały rok. Najlepszy kąt dla swojej lokalizacji znajdziesz na ekranie „Kąt pochylenia i azymut”."
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Panel</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole label="Moc jednego panelu" unit="Wp" type="number" inputMode="decimal" min={0} value={stan.mocPaneluWp} onChange={(e) => ustaw("mocPaneluWp", e.target.value)} hint="Z karty katalogowej (STC)." />
          <Pole
            label="Powierzchnia jednego panelu"
            unit="m²"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.powierzchniaPaneluM2}
            onChange={(e) => ustaw("powierzchniaPaneluM2", e.target.value)}
            hint="Opcjonalnie — długość × szerokość z karty katalogowej."
          />
        </div>
        <Pole
          label="Współczynnik wydajności PR"
          type="number"
          inputMode="decimal"
          min={0}
          max={1}
          step={0.01}
          value={stan.pr}
          onChange={(e) => ustaw("pr", e.target.value)}
          hint="Ułamek 0–1 — część energii, która zostaje po stratach (temperatura, kable, falownik, brud). Źródło nie podaje wartości — wpisz własną."
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">3. Zapotrzebowanie</h2>
        <Pole
          label="Zużycie energii na dobę"
          unit="kWh/dzień"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zapotrzebowanieKwh}
          onChange={(e) => ustaw("zapotrzebowanieKwh", e.target.value)}
          hint="Suma wszystkich odbiorników z Modułu 2 (Zapotrzebowanie)."
        />
        <Pole
          label="Dodatkowe zużycie w sezonie grzewczym"
          unit="kWh/dzień"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zimaKwh}
          onChange={(e) => ustaw("zimaKwh", e.target.value)}
          hint="Prąd na ogrzewanie (pompa, grzałki, dmuchawy, sterowanie kotła). 0 = nie grzejesz prądem. Policzysz go na ekranie „Straty ciepła budynku” (Moduł 6) — prąd na dobę przy danym COP."
        />
        <fieldset className="flex flex-col gap-2">
          <legend className="text-small font-medium">Miesiące, w których grzejesz</legend>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {MIESIACE.map((nazwa, m) => (
              <PoleCheckbox
                key={m}
                id={`grzanie-${m}`}
                label={nazwa}
                className="p-2"
                checked={stan.miesiaceGrzewcze.includes(m)}
                onChange={() => przelaczMiesiac(m)}
              />
            ))}
          </div>
        </fieldset>
        <Pole
          label="Ile paneli realnie zamontujesz"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={stan.limit}
          onChange={(e) => ustaw("limit", e.target.value)}
          hint="Podpowiedź 30 szt. — praktyczny pułap dla domu (wartość właściciela projektu, nie z normy). Wpisz, ile zmieścisz na dachu, gruncie i ile udźwignie budżet."
        />
      </section>

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      {result.status === "INCOMPLETE" && aktualna && (
        <StanPusty tytul="Uzupełnij kąt, panel, PR i zużycie — wtedy pojawi się liczba paneli." />
      )}

      {r && (
        <WerdyktPanel
          poziom={poziomZStatusu(result.status)}
          etykieta={rek ? `Optymalnie w Twoim limicie: ${NAZWA_OKRESU[rek.id]}` : "Liczba paneli dla okresów pokrycia"}
        >
          {rek && (
            <>
              <WynikGlowny>
                {rek.liczbaPaneli} paneli · {f1(rek.mocKwp!)} kWp
              </WynikGlowny>
              <p className="text-small">
                Najszerszy okres, który mieści się w limicie {stan.limit} szt. Pokrywa zużycie w każdym miesiącu okresu
                „{NAZWA_OKRESU[rek.id]}”; najtrudniejszy miesiąc to {MIESIACE[rek.miesiacDecydujacy!]}.
              </p>
            </>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}

          <h3 className="mt-3 font-semibold">Ile paneli na każdy okres</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[320px] text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">Okres</th>
                  <th className="p-2 text-right font-medium">Paneli</th>
                  <th className="p-2 text-right font-medium">kWp</th>
                  <th className="p-2 text-right font-medium">m²</th>
                  <th className="p-2 text-right font-medium">Decyduje</th>
                </tr>
              </thead>
              <tbody>
                {r.warianty.map((w) => (
                  <tr key={w.id} className={`border-b last:border-0 ${w.id === r.rekomendacja ? "font-semibold" : ""}`}>
                    <td className="p-2">
                      {NAZWA_OKRESU[w.id]}
                      {w.miesciSieWLimicie === false && <span className="text-muted-foreground"> · ponad limit</span>}
                    </td>
                    <td className="p-2 text-right font-mono">{w.liczbaPaneli ?? "—"}</td>
                    <td className="p-2 text-right font-mono">{w.mocKwp === null ? "—" : f1(w.mocKwp)}</td>
                    <td className="p-2 text-right font-mono">{w.powierzchniaM2 === null ? "—" : f0(w.powierzchniaM2)}</td>
                    <td className="p-2 text-right">{w.miesiacDecydujacy === null ? "—" : MIESIACE[w.miesiacDecydujacy]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {r.deficytMiesiecznyKwh && nD !== null && (
            <>
              <h3 className="mt-3 font-semibold">Miesiąc po miesiącu przy {nD} panelach</h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[320px] text-small">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="p-2 font-medium">Miesiąc</th>
                      <th className="p-2 text-right font-medium">Zużycie [kWh]</th>
                      <th className="p-2 text-right font-medium">Produkcja [kWh]</th>
                      <th className="p-2 text-right font-medium">Brakuje [kWh]</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MIESIACE.map((nazwa, m) => (
                      <tr key={m} className="border-b last:border-0">
                        <td className="p-2">
                          {nazwa}
                          {stan.stelazRegulowany && <span className="text-muted-foreground"> · {r.katMiesiacaDeg[m]}°</span>}
                        </td>
                        <td className="p-2 text-right font-mono">{f0(r.zapotrzebowanieMiesieczneKwh[m]!)}</td>
                        <td className="p-2 text-right font-mono">{f0(nD * r.produkcjaPaneluMiesiecznaKwh[m]!)}</td>
                        <td className={`p-2 text-right font-mono ${r.deficytMiesiecznyKwh![m]! > 0 ? "font-semibold" : "text-muted-foreground"}`}>
                          {r.deficytMiesiecznyKwh![m]! > 0 ? f0(r.deficytMiesiecznyKwh![m]!) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-small text-muted-foreground">
                Nadwyżka latem nie przechodzi na zimę — akumulator wyrównuje dni i noce, nie pory roku.
              </p>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      <MigawkaBox>
        „Im więcej paneli &apos;na zapas&apos;, tym mniej będziesz się martwić w grudniu — ale to też więcej miejsca i
        pieniędzy na start. Wybierz świadomie, nie automatycznie największy wariant.”
      </MigawkaBox>
    </main>
  )
}
