"use client"

import { useMemo } from "react"
import { calculateUrzadzeniaZmienne } from "@/lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/calculator"
import {
  KATALOG_URZADZEN_ZMIENNYCH,
  MNOZNIK_KLASY,
  PLYTA_INDUKCYJNA_MOC_SUGEROWANA_W,
} from "@/lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/constants"
import type { KlasaEnergetyczna, PozycjaUrzadzenia } from "@/lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KLUCZ_URZADZENIA_ZMIENNEGO, WPISY_URZADZENIA_ZMIENNE, etykieta, tlumaczParamsEtykiet } from "@/components/zapotrzebowanie/etykiety-stalych"
import { useTranslate } from "@/lib/i18n/language-context"

const INLINE_INPUT_KLASY =
  "w-20 min-h-10 rounded-md border border-input bg-background px-2 text-small outline-none transition-colors " +
  "hover:not-disabled:border-foreground/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"

const initialItems: PozycjaUrzadzenia[] = KATALOG_URZADZEN_ZMIENNYCH.map((def) => ({
  id: def.id,
  wybrane: false,
  mocW: def.mocDomyslnaW,
  czasMin: 0,
  klasa: "standardowe",
}))

type FormularzStan = {
  urzadzenia: PozycjaUrzadzenia[]
  plytaIndukcyjnaWybrana: boolean
  plytaIndukcyjnaMocW: string
  plytaIndukcyjnaCzasMin: string
}

const STAN_POCZATKOWY: FormularzStan = {
  urzadzenia: initialItems,
  plytaIndukcyjnaWybrana: false,
  plytaIndukcyjnaMocW: String(PLYTA_INDUKCYJNA_MOC_SUGEROWANA_W),
  plytaIndukcyjnaCzasMin: "",
}

export default function UrzadzeniaZmiennePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("urzadzenia-zmienne", STAN_POCZATKOWY)
  const { urzadzenia, plytaIndukcyjnaWybrana, plytaIndukcyjnaMocW, plytaIndukcyjnaCzasMin } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setUrzadzenia = (a: PozycjaUrzadzenia[] | ((p: PozycjaUrzadzenia[]) => PozycjaUrzadzenia[])) => setPole("urzadzenia", a)
  const setPlytaIndukcyjnaWybrana = (a: boolean | ((p: boolean) => boolean)) => setPole("plytaIndukcyjnaWybrana", a)
  const setPlytaIndukcyjnaMocW = (a: string | ((p: string) => string)) => setPole("plytaIndukcyjnaMocW", a)
  const setPlytaIndukcyjnaCzasMin = (a: string | ((p: string) => string)) => setPole("plytaIndukcyjnaCzasMin", a)

  const result = useMemo(
    () =>
      calculateUrzadzeniaZmienne({
        urzadzenia,
        plytaIndukcyjnaWybrana,
        plytaIndukcyjnaMocW: plytaIndukcyjnaMocW === "" ? 0 : Number(plytaIndukcyjnaMocW),
        plytaIndukcyjnaCzasMin: plytaIndukcyjnaCzasMin === "" ? 0 : Number(plytaIndukcyjnaCzasMin),
      }),
    [urzadzenia, plytaIndukcyjnaWybrana, plytaIndukcyjnaMocW, plytaIndukcyjnaCzasMin],
  )

  function aktualizuj(id: string, patch: Partial<PozycjaUrzadzenia>) {
    setUrzadzenia((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }

  const energiaLacznaWh = result.value.energiaWh + result.value.plytaIndukcyjnaEnergiaWh

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/urzadzenia-zmienne" />
      <NaglowekEkranu
        tytul={t("UI-URZZMI-URZADZENIA-ZMIENNE-KLASA")}
        ekran="urzadzenia-zmienne"
        wynik={result}
        parametry={{ nowoczesne: MNOZNIK_KLASY.nowoczesne, standardowe: MNOZNIK_KLASY.standardowe, stare: MNOZNIK_KLASY.stare }}
      >
        {t("UI-URZZMI-STARE-URZADZENIA-TYLKO")}
      </NaglowekEkranu>

      <ul className="flex flex-col gap-3">
        {urzadzenia.map((u) => {
          const def = KATALOG_URZADZEN_ZMIENNYCH.find((d) => d.id === u.id)
          const nazwa = etykieta(t, KLUCZ_URZADZENIA_ZMIENNEGO, u.id, def?.label ?? u.id)
          return (
            <li key={u.id} className="flex flex-col gap-2 rounded-md border p-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none"
                  checked={u.wybrane}
                  onChange={() => aktualizuj(u.id, { wybrane: !u.wybrane })}
                  id={`urz-${u.id}`}
                />
                <label htmlFor={`urz-${u.id}`} className="flex-1 text-small font-medium">
                  {nazwa}
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-8 text-caption">
                <input
                  type="number"
                  inputMode="decimal"
                  className={INLINE_INPUT_KLASY}
                  value={u.mocW}
                  disabled={!u.wybrane}
                  onChange={(e) => aktualizuj(u.id, { mocW: Number(e.target.value) })}
                  aria-label={t("UI-URZZMI-MOC", { p: nazwa })}
                />
                <PomocPola ekran="urzadzenia-zmienne" pole="moc" />
                <span>W ×</span>
                <input
                  type="number"
                  inputMode="decimal"
                  className={INLINE_INPUT_KLASY}
                  value={u.czasMin || ""}
                  placeholder="min"
                  disabled={!u.wybrane}
                  onChange={(e) => aktualizuj(u.id, { czasMin: Number(e.target.value) })}
                  aria-label={t("UI-URZZMI-CZAS-PRACY-DZIENNIE", { p: nazwa })}
                />
                <PomocPola ekran="urzadzenia-zmienne" pole="czas" />
                <span>{t("UI-URZZMI-MIN-DOBE")}</span>
                <select
                  className="min-h-10 rounded-md border border-input bg-background px-2 text-small disabled:opacity-50"
                  value={u.klasa}
                  disabled={!u.wybrane}
                  onChange={(e) => aktualizuj(u.id, { klasa: e.target.value as KlasaEnergetyczna })}
                  aria-label={t("UI-URZZMI-KLASA-ENERGETYCZNA", { p: nazwa })}
                >
                  <option value="nowoczesne">{t("UI-URZZMI-NOWOCZESNE")}</option>
                  <option value="standardowe">{t("UI-URZZMI-STANDARDOWE-LAT")}</option>
                  <option value="stare">{t("UI-URZZMI-STARE-LAT")}</option>
                </select>
                <PomocPola
                  ekran="urzadzenia-zmienne"
                  pole="klasa"
                  params={{ nowoczesne: MNOZNIK_KLASY.nowoczesne, standardowe: MNOZNIK_KLASY.standardowe, stare: MNOZNIK_KLASY.stare }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <div className="rounded-md border p-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none"
            checked={plytaIndukcyjnaWybrana}
            onChange={(e) => setPlytaIndukcyjnaWybrana(e.target.checked)}
          />
          <span className="text-small font-medium">{t("UI-URZZMI-PLYTA-INDUKCYJNA-WYSOKI")}</span>
        </label>
        {plytaIndukcyjnaWybrana && (
          <div className="mt-2 flex flex-col gap-2 pl-8">
            <PoleSelect
              label={t("UI-URZZMI-MOC-PALNIKOW")}
              value={plytaIndukcyjnaMocW}
              onChange={(e) => setPlytaIndukcyjnaMocW(e.target.value)}
              pomoc={<PomocPola ekran="urzadzenia-zmienne" pole="mocPlyty" params={{ sugerowana: PLYTA_INDUKCYJNA_MOC_SUGEROWANA_W }} />}
            >
              <option value="3000">3000 W</option>
              <option value="5000">5000 W</option>
              <option value="7000">{t("UI-URZZMI-7000-TYPOWO")}</option>
              <option value="9000">9000 W</option>
            </PoleSelect>
            <input
              type="number"
              inputMode="decimal"
              className={INLINE_INPUT_KLASY}
              placeholder={t("UI-URZZMI-MIN-DOBE")}
              value={plytaIndukcyjnaCzasMin}
              onChange={(e) => setPlytaIndukcyjnaCzasMin(e.target.value)}
              aria-label={t("UI-URZZMI-CZAS-GOTOWANIA-DZIENNIE")}
            />
            <PomocPola ekran="urzadzenia-zmienne" pole="czasGotowania" />
          </div>
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-URZZMI-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings.map((w) => ({ ...w, params: tlumaczParamsEtykiet(t, w.params, WPISY_URZADZENIA_ZMIENNE) }))} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-URZZMI-ZAZNACZ-PRZYNAJMNIEJ-JEDNO")}
        </p>
      ) : (
        <WerdyktPanel poziom={result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"} etykieta={t("UI-URZZMI-ZAPOTRZEBOWANIE-DOBOWE")}>
          <WynikGlowny>{(energiaLacznaWh / 1000).toFixed(2)} kWh</WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, tlumaczParamsEtykiet(t, w.params, WPISY_URZADZENIA_ZMIENNE))}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
