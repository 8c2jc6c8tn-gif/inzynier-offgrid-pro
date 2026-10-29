"use client"

import { useMemo, useState } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { calculateLiczbaPaneli } from "@/lib/core/modules/pv/liczba-paneli/calculator"
import { type IdOkresu, LIMIT_MONTAZOWY_PODPOWIEDZ_SZT } from "@/lib/core/modules/pv/liczba-paneli/constants"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"
import { PolaBudynkuUkryteInfo } from "@/components/pola-budynku-ukryte-info"
import { czyUkryjPolaBudynku } from "@/lib/obiekt/ukrywanie-dla-kampera"
import { useRodzajObiektu } from "@/lib/obiekt/use-rodzaj-obiektu"
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

const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-SKR-${i + 1}`)
const NAZWA_OKRESU: Record<IdOkresu, string> = {
  lato: "UI-LICPAN-TYLKO-LATO",
  marPaz: "UI-LICPAN-MARZEC-PAZDZIERNIK",
  lutLis: "UI-LICPAN-LUTY-LISTOPAD",
  rok: "UI-LICPAN-CALY-ROK",
}

export default function LiczbaPaneliPage() {
  const t = useTranslate()
  const { f0, f1 } = useFormaty()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("liczba-paneli", STAN_POCZATKOWY)
  // A camper has no heating season of a building: the extra-consumption field and its months are hidden and count as zero.
  const ukryjSezonGrzewczy = czyUkryjPolaBudynku(useRodzajObiektu())
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
        dodatkoweZimaKwhDzien: ukryjSezonGrzewczy ? 0 : n(stan.zimaKwh),
        miesiaceGrzewcze: ukryjSezonGrzewczy ? [] : stan.miesiaceGrzewcze,
        limitMontazowy: n(stan.limit),
      }),
    [aktualna, stan, ukryjSezonGrzewczy],
  )

  if (!wczytano) return <StanLadowania linie={6} />
  const r = result.value
  const rek = r?.warianty.find((w) => w.id === r.rekomendacja) ?? null
  const nD = r?.liczbaPaneliDeficytu ?? null

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/liczba-paneli" />
      <NaglowekEkranu tytul={t("UI-LICPAN-ILE-PANELI-POTRZEBUJESZ")} ekran="liczba-paneli" wynik={result}>
        {t("UI-LICPAN-LICZBA-PANELI-CZTERECH")}
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-LICPAN-USTAWIENIE-PANELI")}</h2>
        <Pole
          label={t("UI-LICPAN-AZYMUT-PANELI")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={360}
          value={stan.azymutDeg}
          onChange={(e) => ustaw("azymutDeg", e.target.value)}
          pomoc={<PomocPola ekran="liczba-paneli" pole="azymut" />}
        />
        <Button className="min-h-11" disabled={!lokalizacja || !dane || azymut === undefined || obliczenia.liczy} onClick={policzTabele}>
          {obliczenia.liczy ? t("UI-LICPAN-LICZE-NASLONECZNIENIE") : t("UI-LICPAN-POLICZ-NASLONECZNIENIE")}
        </Button>
        {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
        {tabela && !aktualna && !obliczenia.liczy && <StanPusty tytul={t("UI-LICPAN-ZMIENILA-LOKALIZACJA-AZYMUT")} />}
        <PoleCheckbox
          id="stelaz-regulowany"
          label={t("UI-LICPAN-STELAZ-RECZNA-REGULACJA")}
          hint={t("UI-LICPAN-MIESIAC-PRZESTAWIASZ-PANELE")}
          checked={stan.stelazRegulowany}
          onChange={(e) => ustaw("stelazRegulowany", e.target.checked)}
        />
        {!stan.stelazRegulowany && (
          <Pole
            label={t("UI-LICPAN-KAT-POCHYLENIA")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={90}
            value={stan.nachylenieDeg}
            onChange={(e) => ustaw("nachylenieDeg", e.target.value)}
            pomoc={<PomocPola ekran="liczba-paneli" pole="kat" />}
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-LICPAN-PANEL")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label={t("UI-LICPAN-MOC-JEDNEGO-PANELU")}
            unit="Wp"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.mocPaneluWp}
            onChange={(e) => ustaw("mocPaneluWp", e.target.value)}
            pomoc={<PomocPola ekran="liczba-paneli" pole="mocPanelu" />}
          />
          <Pole
            label={t("UI-LICPAN-POWIERZCHNIA-JEDNEGO-PANELU")}
            unit="m²"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.powierzchniaPaneluM2}
            onChange={(e) => ustaw("powierzchniaPaneluM2", e.target.value)}
            pomoc={<PomocPola ekran="liczba-paneli" pole="powierzchniaPanelu" />}
          />
        </div>
        <Pole
          label={t("UI-LICPAN-WSPOLCZYNNIK-WYDAJNOSCI")}
          type="number"
          inputMode="decimal"
          min={0}
          max={1}
          step={0.01}
          value={stan.pr}
          onChange={(e) => ustaw("pr", e.target.value)}
          pomoc={<PomocPola ekran="liczba-paneli" pole="pr" />}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-LICPAN-ZAPOTRZEBOWANIE")}</h2>
        <Pole
          label={t("UI-LICPAN-ZUZYCIE-ENERGII-DOBE")}
          unit={t("UI-LICPAN-KWH-DZIEN")}
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zapotrzebowanieKwh}
          onChange={(e) => ustaw("zapotrzebowanieKwh", e.target.value)}
          pomoc={<PomocPola ekran="liczba-paneli" pole="zuzycie" />}
        />
        {ukryjSezonGrzewczy ? (
          <PolaBudynkuUkryteInfo />
        ) : (
          <>
            <Pole
              label={t("UI-LICPAN-DODATKOWE-ZUZYCIE-SEZONIE")}
              unit={t("UI-LICPAN-KWH-DZIEN")}
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.zimaKwh}
              onChange={(e) => ustaw("zimaKwh", e.target.value)}
              pomoc={<PomocPola ekran="liczba-paneli" pole="ogrzewanie" />}
            />
            <fieldset className="flex flex-col gap-2">
              <legend className="text-small font-medium">{t("UI-LICPAN-MIESIACE-KTORYCH-GRZEJESZ")}</legend>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {MIESIACE.map((nazwa, m) => (
                  <PoleCheckbox
                    key={m}
                    id={`grzanie-${m}`}
                    label={t(nazwa)}
                    className="p-2"
                    checked={stan.miesiaceGrzewcze.includes(m)}
                    onChange={() => przelaczMiesiac(m)}
                  />
                ))}
              </div>
            </fieldset>
          </>
        )}
        <Pole
          label={t("UI-LICPAN-ILE-PANELI-REALNIE")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={stan.limit}
          onChange={(e) => ustaw("limit", e.target.value)}
          pomoc={<PomocPola ekran="liczba-paneli" pole="realnie" params={{ limit: LIMIT_MONTAZOWY_PODPOWIEDZ_SZT }} />}
        />
      </section>

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-LICPAN-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      {result.status === "INCOMPLETE" && aktualna && (
        <StanPusty tytul={t("UI-LICPAN-UZUPELNIJ-KAT-PANEL")} />
      )}

      {r && (
        <WerdyktPanel
          poziom={poziomZStatusu(result.status)}
          etykieta={rek ? t("UI-LICPAN-OPTYMALNIE-TWOIM-LIMICIE", { p: t(NAZWA_OKRESU[rek.id]) }) : t("UI-LICPAN-LICZBA-PANELI-OKRESOW")}
        >
          {rek && (
            <>
              <WynikGlowny>
                {t("UI-LICPAN-PANELI-KWP", { liczbaPaneli: rek.liczbaPaneli ?? "", p: f1(rek.mocKwp!) })}
              </WynikGlowny>
              <p className="text-small">
                {t("UI-LICPAN-NAJSZERSZY-OKRES-KTORY", { limit: stan.limit, p: t(NAZWA_OKRESU[rek.id]), p2: t(MIESIACE[rek.miesiacDecydujacy!]) })}
              </p>
            </>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}

          <h3 className="mt-3 font-semibold">{t("UI-LICPAN-ILE-PANELI-KAZDY")}</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[320px] text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">{t("UI-LICPAN-OKRES")}</th>
                  <th className="p-2 text-right font-medium">{t("UI-LICPAN-PANELI")}</th>
                  <th className="p-2 text-right font-medium">kWp</th>
                  <th className="p-2 text-right font-medium">m²</th>
                  <th className="p-2 text-right font-medium">{t("UI-LICPAN-DECYDUJE")}</th>
                </tr>
              </thead>
              <tbody>
                {r.warianty.map((w) => (
                  <tr key={w.id} className={`border-b last:border-0 ${w.id === r.rekomendacja ? "font-semibold" : ""}`}>
                    <td className="p-2">
                      {t(NAZWA_OKRESU[w.id])}
                      {w.miesciSieWLimicie === false && <span className="text-muted-foreground"> {t("UI-LICPAN-PONAD-LIMIT")}</span>}
                    </td>
                    <td className="p-2 text-right font-mono">{w.liczbaPaneli ?? "—"}</td>
                    <td className="p-2 text-right font-mono">{w.mocKwp === null ? "—" : f1(w.mocKwp)}</td>
                    <td className="p-2 text-right font-mono">{w.powierzchniaM2 === null ? "—" : f0(w.powierzchniaM2)}</td>
                    <td className="p-2 text-right">{w.miesiacDecydujacy === null ? "—" : t(MIESIACE[w.miesiacDecydujacy])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {r.deficytMiesiecznyKwh && nD !== null && (
            <>
              <h3 className="mt-3 font-semibold">{t("UI-LICPAN-MIESIAC-MIESIACU-PANELACH", { nD })}</h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[320px] text-small">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="p-2 font-medium">{t("UI-LICPAN-MIESIAC")}</th>
                      <th className="p-2 text-right font-medium">{t("UI-LICPAN-ZUZYCIE-KWH")}</th>
                      <th className="p-2 text-right font-medium">{t("UI-LICPAN-PRODUKCJA-KWH")}</th>
                      <th className="p-2 text-right font-medium">{t("UI-LICPAN-BRAKUJE-KWH")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MIESIACE.map((nazwa, m) => (
                      <tr key={m} className="border-b last:border-0">
                        <td className="p-2">
                          {t(nazwa)}
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
                {t("UI-LICPAN-NADWYZKA-LATEM-PRZECHODZI")}
              </p>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
