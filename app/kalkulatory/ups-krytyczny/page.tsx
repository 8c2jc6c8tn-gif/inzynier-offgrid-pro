"use client"

import { useMemo } from "react"
import { calculateUpsKrytyczny } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/calculator"
import { DOMYSLNE_URZADZENIA_KRYTYCZNE, PRIORYTET_ZRODLA } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/constants"
import type { PriorytetUps, UrzadzenieKrytyczne } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import type { EtapOdciecia } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/calculator"
import { useTranslate } from "@/lib/i18n/language-context"

const initialItems: UrzadzenieKrytyczne[] = DOMYSLNE_URZADZENIA_KRYTYCZNE.map((def) => ({
  id: def.id,
  label: def.label,
  selected: false,
  powerW: 0,
}))

// Display names of the default devices; the stored `label` (Polish) stays untouched in the draft.
const KLUCZE_URZADZEN: Record<string, string> = {
  esp32: "UI-STALE-UPS-ESP32",
  router: "UI-STALE-UPS-ROUTER",
  silowniki: "UI-STALE-UPS-SILOWNIKI",
  "centrala-pozarowa": "UI-STALE-UPS-CENTRALA-POZAROWA",
  "oswietlenie-awaryjne": "UI-STALE-UPS-OSWIETLENIE-AWARYJNE",
}

const INLINE_INPUT_KLASY =
  "w-24 min-h-11 rounded-md border border-input bg-background px-2 text-body outline-none transition-colors " +
  "hover:not-disabled:border-foreground/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"

type FormularzStan = {
  urzadzenia: UrzadzenieKrytyczne[]
  pojemnoscAh: string
  napiecieV: string
  /** 12.54 — added in v1.1.0; older drafts lack them (read with a fallback). */
  progMin?: string
  akumulatorSlaby?: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  urzadzenia: initialItems,
  pojemnoscAh: "",
  napiecieV: "",
}

export default function UpsKrytycznyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ups-krytyczny", STAN_POCZATKOWY)
  const { urzadzenia, pojemnoscAh, napiecieV } = stan
  const progMin = stan.progMin ?? ""
  const akumulatorSlaby = stan.akumulatorSlaby ?? false

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setUrzadzenia = (a: UrzadzenieKrytyczne[] | ((p: UrzadzenieKrytyczne[]) => UrzadzenieKrytyczne[])) => setPole("urzadzenia", a)
  const setPojemnoscAh = (a: string | ((p: string) => string)) => setPole("pojemnoscAh", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)

  const result = useMemo(
    () =>
      calculateUpsKrytyczny({
        urzadzenia,
        pojemnoscAh: pojemnoscAh === "" ? 0 : Number(pojemnoscAh),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        progOdcieciaMin: progMin === "" ? 0 : Number(progMin),
        akumulatorSlaby,
      }),
    [urzadzenia, pojemnoscAh, napiecieV, progMin, akumulatorSlaby],
  )

  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const nazwaUrzadzenia = (u: { id: string; label: string }) => (KLUCZE_URZADZEN[u.id] ? t(KLUCZE_URZADZEN[u.id]) : u.label)
  const etykietaUrzadzenia = (id: string) => {
    const u = urzadzenia.find((x) => x.id === id)
    return u ? nazwaUrzadzenia(u) : id
  }
  const r2 = (x: number) => Math.round(x * 100) / 100
  const kolumnyPlanu: Kolumna<EtapOdciecia & { id: number }>[] = [
    {
      naglowek: t("UI-M8-UPS-KOL-ETAP"),
      render: (e) => (e.odcietyPriorytet === null ? t("UI-M8-UPS-ETAP-WSZYSTKO") : t("UI-M8-UPS-ETAP-BEZ", { p: e.odcietyPriorytet })),
    },
    { naglowek: t("UI-M8-UPS-KOL-AKTYWNE"), render: (e) => e.aktywne.map(etykietaUrzadzenia).join(", ") },
    { naglowek: t("UI-M8-UPS-KOL-MOC"), render: (e) => r2(e.mocW), liczbowa: true },
    { naglowek: t("UI-M8-UPS-KOL-OD-PELNEGO"), render: (e) => r2(e.czasOdPelnegoH), liczbowa: true },
    { naglowek: t("UI-M8-UPS-KOL-ETAP-H"), render: (e) => (e.czasEtapuH === null ? "—" : r2(e.czasEtapuH)), liczbowa: true },
  ]

  function toggleSelected(id: string) {
    setUrzadzenia((prev) => prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u)))
  }

  function updatePower(id: string, powerW: number) {
    setUrzadzenia((prev) => prev.map((u) => (u.id === id ? { ...u, powerW } : u)))
  }

  function updatePriorytet(id: string, wartosc: string) {
    const priorytet = wartosc === "" ? null : (Number(wartosc) as PriorytetUps)
    setUrzadzenia((prev) => prev.map((u) => (u.id === id ? { ...u, priorytet } : u)))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ups-krytyczny" />
      <NaglowekEkranu tytul={t("UI-UPSKRY-UPS-KRYTYCZNY-DOBOR")} ekran="ups-krytyczny" wynik={result}>
        {t("UI-UPSKRY-POZARZE-CZESTO-PADA")}
      </NaglowekEkranu>

      <ul className="flex flex-col gap-3">
        {urzadzenia.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/60">
            <input
              type="checkbox"
              className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
              checked={u.selected}
              onChange={() => toggleSelected(u.id)}
              id={`urzadzenie-${u.id}`}
            />
            <label htmlFor={`urzadzenie-${u.id}`} className="flex-1 text-small font-medium">
              {nazwaUrzadzenia(u)}
              <span className="block text-caption font-normal text-muted-foreground">
                {t("UI-UPSKRY-BRAK-WARTOSCI-DOMYSLNEJ")}
              </span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              className={INLINE_INPUT_KLASY}
              value={u.powerW}
              disabled={!u.selected}
              onChange={(e) => updatePower(u.id, Number(e.target.value))}
              aria-label={t("UI-UPSKRY-MOC", { label: nazwaUrzadzenia(u) })}
            />
            <span className="w-4 text-caption text-muted-foreground">W</span>
            <PomocPola ekran="ups-krytyczny" pole="mocUrzadzenia" />
            <div className="flex basis-full items-center gap-2 pl-8">
              <select
                className={INLINE_INPUT_KLASY + " w-auto"}
                value={String(u.priorytet !== undefined ? (u.priorytet ?? "") : (PRIORYTET_ZRODLA[u.id] ?? ""))}
                disabled={!u.selected}
                onChange={(e) => updatePriorytet(u.id, e.target.value)}
                aria-label={t("UI-M8-UPS-PRIORYTET", { label: nazwaUrzadzenia(u) })}
              >
                <option value="">{t("UI-WYBIERZ")}</option>
                <option value="1">{t("UI-M8-UPS-PRIORYTET-1")}</option>
                <option value="2">{t("UI-M8-UPS-PRIORYTET-2")}</option>
                <option value="3">{t("UI-M8-UPS-PRIORYTET-3")}</option>
              </select>
              <PomocPola ekran="ups-krytyczny" pole="priorytet" />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-UPSKRY-POJEMNOSC-AKUMULATORA-UPS")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
          pomoc={<PomocPola ekran="ups-krytyczny" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-UPSKRY-NAPIECIE-SYSTEMU-UPS")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="ups-krytyczny" pole="napiecie" />}
        />
        <Pole
          label={t("UI-M8-UPS-PROG")}
          unit="min"
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="10"
          value={progMin}
          onChange={(e) => setStan((s) => ({ ...s, progMin: e.target.value }))}
          pomoc={<PomocPola ekran="ups-krytyczny" pole="prog" />}
        />
        <PoleCheckbox
          id="ups-akumulator-slaby"
          label={t("UI-M8-UPS-AKUMULATOR-SLABY")}
          checked={akumulatorSlaby}
          onChange={(e) => setStan((s) => ({ ...s, akumulatorSlaby: e.target.checked }))}
        />
        <PomocPola ekran="ups-krytyczny" pole="akumulatorSlaby" />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-UPSKRY-POLICZYC-SPRAWDZ-ZAZNACZONE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.value.laczonyPoborW === 0 && hasCritical ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M8-UPS-STOP")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-UPSKRY-ZAZNACZ-PRZYNAJMNIEJ-JEDNO")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta={t("UI-UPSKRY-CZAS-PODTRZYMANIA")}>
          <WynikGlowny>{result.value.czasPodtrzymaniaH.toFixed(2)} h</WynikGlowny>
          <p className="mt-2 text-small">{t("UI-UPSKRY-LACZNY-POBOR-MOCY", { laczonyPoborW: result.value.laczonyPoborW.toFixed(0) })}</p>
          {result.value.planOdciecia && (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-small font-semibold">{t("UI-M8-UPS-PLAN")}</p>
              {result.value.czasPriorytetu1H !== null && (
                <p className="text-small">
                  {t("UI-M8-UPS-PRIORYTET-1-CZAS", { h: r2(result.value.czasPriorytetu1H), bez: r2(result.value.czasPodtrzymaniaH) })}
                </p>
              )}
              <KartaPorownawcza
                kolumny={kolumnyPlanu}
                wiersze={result.value.planOdciecia.map((e) => ({ ...e, id: e.etap }))}
                minWidth={520}
              />
            </div>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
