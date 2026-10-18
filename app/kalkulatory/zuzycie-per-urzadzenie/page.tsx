"use client"

import { useMemo, useState } from "react"
import { calculateZuzyciePerUrzadzenie } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/calculator"
import { OBIEKTY_MIKROINSTALACJI, type ObiektMikroinstalacji, type PozycjaZuzycia } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/input"
import {
  PRZYKLADOWE_URZADZENIA,
  znajdzPrzyklad,
} from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/przykladowe-urzadzenia"
import { usePersistedDraft, useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { dobowaWhNaMiesiac, maOdbiornikiSezonowe } from "@/lib/obiekt/zuzycie-z-odbiornikow"
import { KLUCZ_NAZWY_OBIEKTU, KLUCZ_PROFILU_OBIEKTU, type ProfilObiektu } from "@/lib/obiekt/profil-obiektu"
import { obiektMikroinstalacji, pozycjeZSzablonu } from "@/lib/obiekt/szablon-do-listy"
import { KOLEJNOSC_SZABLONOW, type SzablonZestawu } from "@/lib/core/modules/kalkulator-mobilny/szablony-zestawow/constants"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = { urzadzenia: PozycjaZuzycia[] }

const nowaPozycja = (): PozycjaZuzycia => ({
  id: crypto.randomUUID(),
  nazwa: "",
  mocW: 0,
  godzinNaDobe: 0,
  cykliczne: false,
  wspolczynnikPracyPct: 0,
})

const STAN_POCZATKOWY: FormularzStan = { urzadzenia: [] }
const pole = (x: number) => (x === 0 ? "" : String(x))
const LISTA_PRZYKLADOW = "zuzycie-przykladowe-urzadzenia"
const KLUCZE_MIESIECY = Array.from({ length: 12 }, (_, i) => `UI-MIES-${String(i + 1).padStart(2, "0")}`)
const WSZYSTKIE_MIESIACE: readonly boolean[] = Array(12).fill(true)

export default function ZuzyciePerUrzadzeniePage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zuzycie-per-urzadzenie", STAN_POCZATKOWY)
  const { dane: profilObiektu } = useOdczytDraftu<ProfilObiektu>(KLUCZ_PROFILU_OBIEKTU)
  const urzadzenia = stan.urzadzenia
  const [szablon, setSzablon] = useState<SzablonZestawu | "">("")

  function aktualizuj(id: string, zmiana: Partial<PozycjaZuzycia>) {
    setStan((prev) => ({ urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  }

  const result = useMemo(() => calculateZuzyciePerUrzadzenie({ urzadzenia }), [urzadzenia])
  const sezonowe = useMemo(() => maOdbiornikiSezonowe({ urzadzenia }), [urzadzenia])
  const dobowePoMiesiacach = useMemo(() => (sezonowe ? dobowaWhNaMiesiac({ urzadzenia }) : null), [sezonowe, urzadzenia])

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zuzycie-per-urzadzenie" />
      <NaglowekEkranu tytul={t("UI-ZUZPERURZ-ZUZYCIE-ENERGII-PER")} ekran="zuzycie-per-urzadzenie" wynik={result}>
        {t("UI-ZUZPERURZ-MOC-CZAS-PRACY")}
      </NaglowekEkranu>

      <p className="rounded-md border p-3 text-small">
        {t("UI-ZUZPERURZ-WPISZ-MOC")} <strong>{t("UI-ZUZPERURZ-SWOJEGO")}</strong> {t("UI-ZUZPERURZ-URZADZENIA-TABLICZKI-ZNAMION")}
      </p>
      <p className="text-small text-muted-foreground">{t("UI-ZUZPERURZ-SEZON-NOTA")}</p>
      <details className="text-small">
        <summary className="cursor-pointer font-medium">{t("UI-ZUZPERURZ-PRZYKLADOWE-SREDNIE-MOCE")}</summary>
        <ul className="mt-2 flex flex-col gap-1 text-muted-foreground">
          {PRZYKLADOWE_URZADZENIA.map((p) => (
            <li key={p.nazwa}>
              {t(p.nazwaKey)}: ok. {f0(p.mocW)} W{p.cykliczne ? ` ${t("UI-ZUZPERURZ-PRACUJE-CYKLICZNIE")}` : ""}
            </li>
          ))}
        </ul>
      </details>
      <datalist id={LISTA_PRZYKLADOW}>
        {PRZYKLADOWE_URZADZENIA.map((p) => (
          <option key={p.nazwa} value={t(p.nazwaKey)} />
        ))}
      </datalist>

      <section className="flex flex-col gap-2 rounded-md border p-3">
        <PoleSelect
          label={t("UI-ZUZPERURZ-SZABLON")}
          value={szablon}
          onChange={(e) => setSzablon(e.target.value as SzablonZestawu | "")}
          pomoc={<PomocPola ekran="zuzycie-per-urzadzenie" pole="szablon" />}
        >
          <option value="">{t("UI-ZUZPERURZ-SZABLON-WYBIERZ")}</option>
          {KOLEJNOSC_SZABLONOW.map((s) => (
            <option key={s} value={s}>
              {t(`UI-M12-SZ-S-${s.toUpperCase()}`)}
            </option>
          ))}
        </PoleSelect>
        <p className="text-caption text-muted-foreground">{t("UI-ZUZPERURZ-SZABLON-OPIS")}</p>
        <button
          type="button"
          disabled={szablon === ""}
          onClick={() => {
            if (szablon === "") return
            setStan((prev) => ({ urzadzenia: [...prev.urzadzenia, ...pozycjeZSzablonu(szablon, t, prev.urzadzenia, () => crypto.randomUUID(), obiektMikroinstalacji(profilObiektu?.rodzaj))] }))
          }}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted disabled:opacity-50"
        >
          {t("UI-ZUZPERURZ-SZABLON-DODAJ")}
        </button>
      </section>

      <ul className="flex flex-col gap-4">
        {urzadzenia.map((u, i) => {
          const przyklad = znajdzPrzyklad(u.nazwa, (p) => t(p.nazwaKey))
          return (
            <li key={u.id} className="flex flex-col gap-3 rounded-md border p-3">
              <Pole
                label={t("UI-ZUZPERURZ-URZADZENIE", { p: i + 1 })}
                placeholder={t("UI-ZUZPERURZ-LODOWKA-TURYSTYCZNA")}
                list={LISTA_PRZYKLADOW}
                value={u.nazwa}
                onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
                pomoc={<PomocPola ekran="zuzycie-per-urzadzenie" pole="nazwa" />}
              />
              {przyklad && (
                <p className="text-caption text-muted-foreground">
                  {t("UI-ZUZPERURZ-PRZYKLADOWA-SREDNIA-MOC", { mocW: f0(przyklad.mocW) })}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Pole label={t("UI-ZUZPERURZ-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={pole(u.mocW)} onChange={(e) => aktualizuj(u.id, { mocW: Number(e.target.value) })} pomoc={<PomocPola ekran="zuzycie-per-urzadzenie" pole="moc" />} />
                <Pole label={t("UI-ZUZPERURZ-WLACZONE")} unit={t("UI-ZUZPERURZ-DOBE")} type="number" inputMode="decimal" min={0} max={24} value={pole(u.godzinNaDobe)} onChange={(e) => aktualizuj(u.id, { godzinNaDobe: Number(e.target.value) })} pomoc={<PomocPola ekran="zuzycie-per-urzadzenie" pole="godziny" />} />
              </div>
              <PoleCheckbox
                id={`${u.id}-cykliczne`}
                label={t("UI-ZUZPERURZ-PRACUJE-CYKLICZNIE-SPREZARKA")}
                checked={u.cykliczne}
                onChange={(e) => aktualizuj(u.id, { cykliczne: e.target.checked })}
              />
              {u.cykliczne && (
                <Pole
                  label={t("UI-ZUZPERURZ-WSPOLCZYNNIK-PRACY-SPREZARKI")}
                  unit="%"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={pole(u.wspolczynnikPracyPct)}
                  onChange={(e) => aktualizuj(u.id, { wspolczynnikPracyPct: Number(e.target.value) })}
                  pomoc={<PomocPola ekran="zuzycie-per-urzadzenie" pole="wspolczynnik" />}
                />
              )}
              <fieldset className="flex flex-col gap-2 rounded-md border p-3">
                <legend className="flex items-center gap-2 px-1 text-small font-medium">
                  {t("UI-ZUZPERURZ-MIESIACE-PRACY")}
                  <PomocPola ekran="zuzycie-per-urzadzenie" pole="miesiace" />
                </legend>
                <p className="text-caption text-muted-foreground">{t("UI-ZUZPERURZ-MIESIACE-OPIS")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {KLUCZE_MIESIECY.map((klucz, m) => {
                    const biezace = u.miesiace && u.miesiace.length === 12 ? u.miesiace : WSZYSTKIE_MIESIACE
                    return (
                      <PoleCheckbox
                        key={klucz}
                        id={`${u.id}-miesiac-${m + 1}`}
                        label={t(klucz)}
                        checked={biezace[m] ?? true}
                        onChange={(e) => aktualizuj(u.id, { miesiace: biezace.map((v, j) => (j === m ? e.target.checked : v)) })}
                      />
                    )
                  })}
                </div>
                {u.miesiace && (
                  <button type="button" onClick={() => aktualizuj(u.id, { miesiace: undefined })} className="self-start text-caption text-muted-foreground underline">
                    {t("UI-ZUZPERURZ-MIESIACE-WSZYSTKIE")}
                  </button>
                )}
              </fieldset>
              <fieldset className="flex flex-col gap-2 rounded-md border p-3">
                <legend className="flex items-center gap-2 px-1 text-small font-medium">
                  {t("UI-ZUZPERURZ-OBIEKTY")}
                  <PomocPola ekran="zuzycie-per-urzadzenie" pole="obiekty" />
                </legend>
                <p className="text-caption text-muted-foreground">{t("UI-ZUZPERURZ-OBIEKTY-OPIS")}</p>
                <div className="grid grid-cols-1 gap-2">
                  {OBIEKTY_MIKROINSTALACJI.map((rodzaj) => {
                    const biezace: readonly ObiektMikroinstalacji[] = u.obiekty && u.obiekty.length > 0 ? u.obiekty : OBIEKTY_MIKROINSTALACJI
                    return (
                      <PoleCheckbox
                        key={rodzaj}
                        id={`${u.id}-obiekt-${rodzaj}`}
                        label={t(KLUCZ_NAZWY_OBIEKTU[rodzaj])}
                        checked={biezace.includes(rodzaj)}
                        onChange={(e) => {
                          const nowe = e.target.checked ? OBIEKTY_MIKROINSTALACJI.filter((x) => x === rodzaj || biezace.includes(x)) : biezace.filter((x) => x !== rodzaj)
                          // Unticking the last site would leave a device that belongs nowhere; that is the same as "every site", so it is stored as such.
                          aktualizuj(u.id, { obiekty: nowe.length === 0 || nowe.length === OBIEKTY_MIKROINSTALACJI.length ? undefined : nowe })
                        }}
                      />
                    )
                  })}
                </div>
              </fieldset>
              <button
                type="button"
                onClick={() => setStan((prev) => ({ urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
                className="self-start text-caption text-muted-foreground underline"
                aria-label={t("UI-ZUZPERURZ-USUN-2", { p: u.nazwa || t("UI-ZUZPERURZ-URZADZENIE-N", { n: i + 1 }) })}
              >
                {t("UI-ZUZPERURZ-USUN")}
              </button>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={() => setStan((prev) => ({ urzadzenia: [...prev.urzadzenia, nowaPozycja()] }))}
        className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
      >
        {t("UI-ZUZPERURZ-DODAJ-URZADZENIE")}
      </button>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-ZUZPERURZ-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-ZUZPERURZ-DODAJ-URZADZENIE-MOCA")}
        </p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-ZUZPERURZ-ZUZYCIE-DOBE")}>
          <WynikGlowny>{f0(result.value.sumaWh)} Wh</WynikGlowny>
          <ul className="mt-1 text-small">
            {result.value.urzadzenia.map((u, i) => (
              <li key={u.id}>
                {u.nazwa || t("UI-ZUZPERURZ-URZADZENIE", { p: i + 1 })}: {f0(u.zuzycieWh)} Wh
              </li>
            ))}
          </ul>
          {dobowePoMiesiacach && (
            <>
              <p className="mt-2 text-small">{t("UI-ZUZPERURZ-SUMA-WSZYSTKIE")}</p>
              <table className="mt-1 w-full text-small">
                <caption className="text-left font-medium">{t("UI-ZUZPERURZ-TABELA-MIESIECY")}</caption>
                <tbody>
                  {dobowePoMiesiacach.map((wh, m) => (
                    <tr key={KLUCZE_MIESIECY[m]}>
                      <th scope="row" className="py-0.5 text-left font-normal">
                        {t(KLUCZE_MIESIECY[m]!)}
                      </th>
                      <td className="py-0.5 text-right">{f0(wh)} Wh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
