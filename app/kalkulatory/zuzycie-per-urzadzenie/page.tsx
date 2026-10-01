"use client"

import { useMemo } from "react"
import { calculateZuzyciePerUrzadzenie } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/calculator"
import type { PozycjaZuzycia } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/input"
import {
  PRZYKLADOWE_URZADZENIA,
  znajdzPrzyklad,
} from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/przykladowe-urzadzenia"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

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

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const pole = (x: number) => (x === 0 ? "" : String(x))
const LISTA_PRZYKLADOW = "zuzycie-przykladowe-urzadzenia"

export default function ZuzyciePerUrzadzeniePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zuzycie-per-urzadzenie", STAN_POCZATKOWY)
  const urzadzenia = stan.urzadzenia

  function aktualizuj(id: string, zmiana: Partial<PozycjaZuzycia>) {
    setStan((prev) => ({ urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  }

  const result = useMemo(() => calculateZuzyciePerUrzadzenie({ urzadzenia }), [urzadzenia])

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zuzycie-per-urzadzenie" />
      <NaglowekEkranu tytul={t("UI-ZUZPERURZ-ZUZYCIE-ENERGII-PER")} ekran="zuzycie-per-urzadzenie" wynik={result}>
        {t("UI-ZUZPERURZ-MOC-CZAS-PRACY")}
      </NaglowekEkranu>

      <p className="rounded-md border p-3 text-small">
        {t("UI-ZUZPERURZ-WPISZ-MOC")} <strong>{t("UI-ZUZPERURZ-SWOJEGO")}</strong> {t("UI-ZUZPERURZ-URZADZENIA-TABLICZKI-ZNAMION")}
      </p>
      <details className="text-small">
        <summary className="cursor-pointer font-medium">{t("UI-ZUZPERURZ-PRZYKLADOWE-SREDNIE-MOCE")}</summary>
        <ul className="mt-2 flex flex-col gap-1 text-muted-foreground">
          {PRZYKLADOWE_URZADZENIA.map((p) => (
            <li key={p.nazwa}>
              {p.nazwa}: ok. {f0(p.mocW)} W{p.cykliczne ? ` ${t("UI-ZUZPERURZ-PRACUJE-CYKLICZNIE")}` : ""}
            </li>
          ))}
        </ul>
      </details>
      <datalist id={LISTA_PRZYKLADOW}>
        {PRZYKLADOWE_URZADZENIA.map((p) => (
          <option key={p.nazwa} value={p.nazwa} />
        ))}
      </datalist>

      <ul className="flex flex-col gap-4">
        {urzadzenia.map((u, i) => {
          const przyklad = znajdzPrzyklad(u.nazwa)
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
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
