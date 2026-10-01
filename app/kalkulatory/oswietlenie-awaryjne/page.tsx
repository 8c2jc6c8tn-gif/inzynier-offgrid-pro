"use client"

import { useMemo } from "react"
import { calculateOswietlenieAwaryjne } from "@/lib/core/modules/bezpieczenstwo/oswietlenie-awaryjne/calculator"
import type { LampaAwaryjna, StanLampy, ZasilanieLamp } from "@/lib/core/modules/bezpieczenstwo/oswietlenie-awaryjne/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type LampaWiersz = LampaAwaryjna & { id: string }
type FormularzStan = { zasilanie: ZasilanieLamp | ""; lampy: LampaWiersz[]; oswietlenieZewnetrzne: boolean }

const STAN_POCZATKOWY: FormularzStan = { zasilanie: "", lampy: [], oswietlenieZewnetrzne: false }

const STANY: { id: StanLampy; label: string }[] = [
  { id: "nietestowana", label: "UI-OSWAWA-NIETESTOWANA" },
  { id: "sprawna", label: "UI-OSWAWA-SPRAWNA" },
  { id: "niesprawna", label: "UI-OSWAWA-NIESPRAWNA" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function OswietlenieAwaryjnePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("oswietlenie-awaryjne", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<LampaWiersz>) {
    setStan((prev) => ({ ...prev, lampy: prev.lampy.map((l) => (l.id === id ? { ...l, ...zmiana } : l)) }))
  }

  const result = useMemo(
    () =>
      calculateOswietlenieAwaryjne({
        zasilanie: stan.zasilanie === "" ? null : stan.zasilanie,
        lampy: stan.lampy,
        oswietlenieZewnetrzne: stan.oswietlenieZewnetrzne,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const { sprawne, niesprawne, nietestowane } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oswietlenie-awaryjne" />
      <NaglowekEkranu tytul={t("UI-OSWAWA-OSWIETLENIE-AWARYJNE")} ekran="oswietlenie-awaryjne" wynik={result}>
        {t("UI-OSWAWA-DYMIE-WIDAC-DROGI")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-OSWAWA-ZASILANIE-LAMP")}
        value={stan.zasilanie}
        onChange={(e) => setStan((prev) => ({ ...prev, zasilanie: e.target.value as FormularzStan["zasilanie"] }))}
        pomoc={<PomocPola ekran="oswietlenie-awaryjne" pole="zasilanie" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        <option value="ups">Z UPS</option>
        <option value="wlasne-akumulatory">{t("UI-OSWAWA-WLASNE-AKUMULATORY-LAMPACH")}</option>
      </PoleSelect>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-OSWAWA-LAMPY-DROGACH-EWAKUACJI")}</p>
        <p className="text-caption text-muted-foreground">{t("UI-OSWAWA-STAN-OSTATNIEGO-TESTU")}</p>
        <p className="flex items-center gap-3 text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            {t("UI-OSW-MIEJSCE")} <PomocPola ekran="oswietlenie-awaryjne" pole="miejsce" />
          </span>
          <span className="flex items-center gap-1">
            {t("UI-OSW-STAN")} <PomocPola ekran="oswietlenie-awaryjne" pole="stanLampy" />
          </span>
        </p>
        <ul className="flex flex-col gap-3">
          {stan.lampy.map((l, i) => {
            const opis = l.nazwa || t("UI-OSWAWA-LAMPA-N", { n: i + 1 })
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder={t("UI-OSWAWA-MIEJSCE")}
                  value={l.nazwa}
                  onChange={(e) => aktualizuj(l.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-OSWAWA-MIEJSCE-LAMPA", { p: i + 1 })}
                />
                <select
                  value={l.stan}
                  onChange={(e) => aktualizuj(l.id, { stan: e.target.value as StanLampy })}
                  className={pole}
                  aria-label={t("UI-OSWAWA-STAN", { opis })}
                >
                  {STANY.map((s) => (
                    <option key={s.id} value={s.id}>
                      {t(s.label)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, lampy: prev.lampy.filter((x) => x.id !== l.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-OSWAWA-USUN-2", { opis })}
                >
                  {t("UI-OSWAWA-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({ ...prev, lampy: [...prev.lampy, { id: crypto.randomUUID(), nazwa: "", stan: "nietestowana" }] }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-OSWAWA-DODAJ-LAMPE")}
        </button>
      </div>

      <PoleCheckbox
        id="osw-zewnetrzne"
        label={t("UI-OSWAWA-OSWIETLENIE-ZEWNETRZNE-SLUZB")}
        checked={stan.oswietlenieZewnetrzne}
        onChange={(e) => setStan((prev) => ({ ...prev, oswietlenieZewnetrzne: e.target.checked }))}
      />

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-OSWAWA-WYBIERZ-ZASILANIE-DODAJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-OSWAWA-NIESPRAWNA-LAMPA-TRASIE") : hasWarning ? t("UI-OSWAWA-WSZYSTKIE-LAMPY-PRZETESTOWAN") : t("UI-OSWAWA-OSWIETLENIE-EWAKUACYJNE-SPRA")}
        >
          <WynikGlowny>
            {t("UI-OSWAWA-SPRAWNYCH", { sprawne, p: sprawne + niesprawne + nietestowane })}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <p className="text-caption text-muted-foreground">
        {t("UI-OSWAWA-ADAPTACYJNA-TRASA-EWAKUACJI")}
      </p>
    </main>
  )
}
