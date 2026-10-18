"use client"

import { useMemo } from "react"
import { calculateStrategiaZamarzanie } from "@/lib/core/modules/stress-test/strategia-zamarzanie/calculator"
import type { OdbiornikZimowy } from "@/lib/core/modules/stress-test/strategia-zamarzanie/input"
import type { PriorytetOdbiornika } from "@/lib/core/modules/zapotrzebowanie/load-shedding/input"
import { PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT } from "@/lib/core/modules/zapotrzebowanie/load-shedding/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type Wiersz = OdbiornikZimowy & { id: string }
type PoleLiczbowe = "pojemnoscKwh" | "socPct" | "socMinPct" | "sprawnoscFalownikaPct"
type FormularzStan = Record<PoleLiczbowe, string> & { odbiorniki: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = { pojemnoscKwh: "", socPct: "", socMinPct: "", sprawnoscFalownikaPct: "", odbiorniki: [] }

const POLA: { pole: PoleLiczbowe; label: string; unit: string }[] = [
  { pole: "pojemnoscKwh", label: "UI-STRZAM-POJEMNOSC-BATERII", unit: "kWh" },
  { pole: "socPct", label: "UI-STRZAM-AKTUALNY-SOC", unit: "%" },
  { pole: "socMinPct", label: "UI-STRZAM-SOC-WYLACZENIA-SYSTEMU", unit: "%" },
  { pole: "sprawnoscFalownikaPct", label: "UI-STRZAM-SPRAWNOSC-FALOWNIKA", unit: "%" },
]

const PRIORYTETY: { id: PriorytetOdbiornika; label: string }[] = [
  { id: 1, label: "UI-STRZAM-KRYTYCZNY" },
  { id: 2, label: "UI-STRZAM-WAZNY" },
  { id: 3, label: "UI-STRZAM-KOMFORT" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"
const liczba = (v: string) => (v === "" ? null : Number(v))

export default function StrategiaZamarzaniePage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("strategia-zamarzanie", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<Wiersz>) {
    setStan((prev) => ({ ...prev, odbiorniki: prev.odbiorniki.map((o) => (o.id === id ? { ...o, ...zmiana } : o)) }))
  }

  const result = useMemo(
    () =>
      calculateStrategiaZamarzanie({
        pojemnoscKwh: liczba(stan.pojemnoscKwh),
        socPct: liczba(stan.socPct),
        socMinPct: liczba(stan.socMinPct),
        sprawnoscFalownikaPct: liczba(stan.sprawnoscFalownikaPct),
        odbiorniki: stan.odbiorniki,
      }),
    [stan],
  )
  const { czasKrytycznychH, czasEtapuAH, czasEtapuBH } = result.value
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/strategia-zamarzanie" />
      <NaglowekEkranu
        tytul={t("UI-STRZAM-STRATEGIA-ZAMARZANIE")}
        ekran="strategia-zamarzanie"
        wynik={result}
        parametry={{ prog: PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT }}
      >
        {t("UI-STRZAM-GDY-ENERGII-MALO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole: p, label, unit }) => (
          <Pole
            key={p}
            label={t(label)}
            unit={unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[p]}
            onChange={(e) => setStan((prev) => ({ ...prev, [p]: e.target.value }))}
            pomoc={<PomocPola ekran="strategia-zamarzanie" pole={p} />}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-STRZAM-ODBIORNIKI-ZIMA")}</p>
        <p className="text-caption text-muted-foreground">
          {t("UI-STRZAM-KRYTYCZNE-POMPA-CIEPLA")}
        </p>
        <ul className="flex flex-col gap-3">
          {stan.odbiorniki.map((o, i) => {
            const opis = o.nazwa || `odbiornik ${i + 1}`
            return (
              <li key={o.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder={t("UI-STRZAM-NAZWA")}
                  value={o.nazwa}
                  onChange={(e) => aktualizuj(o.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-STRZAM-NAZWA-ODBIORNIK", { p: i + 1 })}
                />
                <PomocPola ekran="strategia-zamarzanie" pole="nazwa" />
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="W"
                  value={o.mocW ?? ""}
                  onChange={(e) => aktualizuj(o.id, { mocW: liczba(e.target.value) })}
                  className={`${pole} w-20`}
                  aria-label={t("UI-STRZAM-MOC", { opis })}
                />
                <PomocPola ekran="strategia-zamarzanie" pole="moc" />
                <select
                  value={o.priorytet}
                  onChange={(e) => aktualizuj(o.id, { priorytet: Number(e.target.value) as PriorytetOdbiornika })}
                  className={pole}
                  aria-label={t("UI-STRZAM-PRIORYTET", { opis })}
                >
                  {PRIORYTETY.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.label)}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="strategia-zamarzanie" pole="priorytet" params={{ prog: PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT }} />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, odbiorniki: prev.odbiorniki.filter((x) => x.id !== o.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-STRZAM-USUN-2", { opis })}
                >
                  {t("UI-STRZAM-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({ ...prev, odbiorniki: [...prev.odbiorniki, { id: crypto.randomUUID(), nazwa: "", mocW: null, priorytet: 1 }] }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-STRZAM-DODAJ-ODBIORNIK")}
        </button>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-STRZAM-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-STRZAM-WPISZ-DANE-BATERII")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-STRZAM-BRAK-ZASILANIA-OGRZEWANIA") : hasWarning ? t("UI-STRZAM-SPRAWDZ-LISTE-ODBIORNIKOW") : t("UI-STRZAM-OGRZEWANIE-CHRONIONE")}
        >
          {czasKrytycznychH !== null && <WynikGlowny>{t("UI-STRZAM-OGRZEWANIA-POMP", { czasKrytycznychH: f1(czasKrytycznychH) })}</WynikGlowny>}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {czasEtapuAH !== null && <li>{t("UI-STRZAM-WAZNYMI-SOC", { czasEtapuAH: f1(czasEtapuAH) })}</li>}
            {czasEtapuBH !== null && <li>{t("UI-STRZAM-SAME-KRYTYCZNE", { czasEtapuBH: f1(czasEtapuBH) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
