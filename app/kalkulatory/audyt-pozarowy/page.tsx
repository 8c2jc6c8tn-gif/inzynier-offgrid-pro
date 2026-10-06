"use client"

import { useMemo } from "react"
import { calculateAuditPozarowy } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/calculator"
import { AUDIT_KATEGORIE } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/constants"
import type { AuditCheckItem, AuditItemStatus, AuditKategoria } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { pozycje: AuditCheckItem[] }

const STAN_POCZATKOWY: FormularzStan = { pozycje: [] }

const STATUSY: { id: AuditItemStatus; label: string }[] = [
  { id: "ok", label: "UI-AUDPOZ-STATUS-OK" },
  { id: "warning", label: "UI-AUDPOZ-STATUS-WARNING" },
  { id: "critical", label: "UI-AUDPOZ-STATUS-CRITICAL" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function AudytPozarowyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("audyt-pozarowy", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<AuditCheckItem>) {
    setStan((prev) => ({ ...prev, pozycje: prev.pozycje.map((p) => (p.id === id ? { ...p, ...zmiana } : p)) }))
  }

  const result = useMemo(() => calculateAuditPozarowy(stan.pozycje), [stan])

  const poziom: WerdyktPoziom =
    result.value.liczbaKrytycznych > 0
      ? "blad"
      : result.value.liczbaOstrzezen > 0
        ? "uwaga"
        : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/audyt-pozarowy" />
      <NaglowekEkranu tytul={t("UI-AUDPOZ-AUTONOMICZNY-AUDYT-BEZPIECZE")} ekran="audyt-pozarowy" wynik={result}>
        {t("UI-AUDPOZ-REGULARNIE-SPRAWDZA-RAZIE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-AUDPOZ-ELEMENTY-AUDYTU")}</p>
        <p className="text-caption text-muted-foreground">{t("UI-AUDPOZ-WPIS-RECZNY-DO-TRYBU-LIVE")}</p>
        <ul className="flex flex-col gap-4">
          {stan.pozycje.map((p, i) => {
            const opis = p.element || t("NAZWA-ELEMENT-NR", { nr: i + 1 })
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-2">
                <select
                  value={p.kategoria}
                  onChange={(e) => aktualizuj(p.id, { kategoria: e.target.value as AuditKategoria })}
                  className={pole}
                  aria-label={t("UI-AUDPOZ-ARIA-KATEGORIA", { opis })}
                >
                  {AUDIT_KATEGORIE.map((k) => (
                    <option key={k.id} value={k.id}>
                      {t(k.labelKey)}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="audyt-pozarowy" pole="kategoria" />
                <input
                  placeholder={t("UI-AUDPOZ-NAZWA-ELEMENTU")}
                  value={p.element}
                  onChange={(e) => aktualizuj(p.id, { element: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-AUDPOZ-ARIA-NAZWA", { p: i + 1 })}
                />
                <PomocPola ekran="audyt-pozarowy" pole="element" />
                <select
                  value={p.status}
                  onChange={(e) => aktualizuj(p.id, { status: e.target.value as AuditItemStatus })}
                  className={pole}
                  aria-label={t("UI-AUDPOZ-ARIA-STATUS", { opis })}
                >
                  {STATUSY.map((s) => (
                    <option key={s.id} value={s.id}>
                      {t(s.label)}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="audyt-pozarowy" pole="status" />
                <input
                  placeholder={t("UI-AUDPOZ-NOTATKA")}
                  value={p.opis}
                  onChange={(e) => aktualizuj(p.id, { opis: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-AUDPOZ-ARIA-NOTATKA", { opis })}
                />
                <PomocPola ekran="audyt-pozarowy" pole="opis" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, pozycje: prev.pozycje.filter((x) => x.id !== p.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-AUDPOZ-ARIA-USUN", { opis })}
                >
                  {t("UI-AUDPOZ-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({
              ...prev,
              // A new item starts as "to check" — never assumed working before the user inspects it.
              pozycje: [...prev.pozycje, { id: crypto.randomUUID(), kategoria: "czujniki-dymu", element: "", status: "warning", opis: "" }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-AUDPOZ-DODAJ-ELEMENT")}
        </button>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-AUDPOZ-DODAJ-PIERWSZY")}</p>
      ) : (
        <WerdyktPanel poziom={poziom}>
          <p className="mt-1 text-h1 font-semibold">{t("UI-AUDPOZ-GOTOWOSCI", { procentGotowosci: result.value.procentGotowosci })}</p>
          <p className="mt-1 text-small">
            {t("UI-AUDPOZ-SPRAWDZENIA-KRYTYCZNYCH-ELEM", { liczbaOk: result.value.liczbaOk, liczbaOstrzezen: result.value.liczbaOstrzezen, liczbaKrytycznych: result.value.liczbaKrytycznych, razem: result.value.razem })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
