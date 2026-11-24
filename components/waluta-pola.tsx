"use client"

/**
 * Currency of one money field (owner decisions 24.11.2026): a compact choice of the currency the amount is in, and — when it
 * is not the working currency from Settings — the amount converted to it at the NBP average rate (with the table date), or a
 * clear note that no rate is known (the amount is then not counted, never computed with a guessed rate).
 */
import type { StanWalutyPola } from "@/lib/adapters/use-persisted-draft"
import { KODY_WALUT } from "@/lib/adapters/use-persisted-draft"
import { formatujDate } from "@/lib/i18n/liczby"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { formatujKwote, symbolWaluty } from "@/lib/waluta/przelicz"
import { useWaluta } from "@/lib/waluta/use-waluta"
import type { KodWaluty } from "@/lib/waluta/waluty"

/** The select next to the input. */
export function WyborWalutyPola({ waluta, id }: { waluta: StanWalutyPola; id?: string }) {
  const t = useTranslate()
  return (
    <select
      id={id}
      aria-label={t("UI-WAL-POLE-WYBOR")}
      value={waluta.kod}
      onChange={(e) => waluta.ustaw(e.target.value as KodWaluty)}
      className="min-h-11 shrink-0 cursor-pointer rounded-md border border-input bg-background px-2 text-small outline-none hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {KODY_WALUT.map((k) => (
        <option key={k} value={k}>
          {k}
        </option>
      ))}
    </select>
  )
}

/** The line under the field: the amount in the working currency, or the missing-rate note. */
export function PrzeliczenieWalutyPola({ waluta }: { waluta: StanWalutyPola }) {
  const t = useTranslate()
  const jezyk = useLanguage()
  const { stan } = useWaluta()
  if (waluta.brakKursu) {
    return (
      <span role="alert" className="text-caption text-werdykt-uwaga-foreground">
        {t("UI-WAL-POLE-BRAK-KURSU", { z: waluta.kod, na: waluta.robocza })}
      </span>
    )
  }
  if (waluta.wRoboczej === null) return null
  const kwota = formatujKwote(waluta.wRoboczej, waluta.robocza, jezyk, 2)
  const data = stan.kursy?.dataEcb ? formatujDate(new Date(stan.kursy.dataEcb), jezyk) : ""
  return (
    <span className="text-caption text-muted-foreground">
      {waluta.reczny || !data ? t("UI-WAL-POLE-PRZELICZENIE-RECZNY", { kwota }) : t("UI-WAL-POLE-PRZELICZENIE", { kwota, data })}
    </span>
  )
}

/** Symbol of a field's currency for its unit text: `unit={t("UI-J-ZL-KWH", { waluta: symbol(w.kod) })}`. */
export function useSymbolWaluty(): (kod: KodWaluty) => string {
  const jezyk = useLanguage()
  return (kod) => symbolWaluty(kod, jezyk)
}

/** „Typed amounts: 1 200 € + 3 400 zł” under a result — only when the screen's amounts are in two or more currencies. */
export function RozbicieKwot({ rozbicie }: { rozbicie: Partial<Record<KodWaluty, number>> }) {
  const t = useTranslate()
  const jezyk = useLanguage()
  const pozycje = (Object.entries(rozbicie) as [KodWaluty, number][]).filter(([, x]) => x !== 0)
  if (pozycje.length < 2) return null
  const lista = pozycje.map(([kod, x]) => formatujKwote(x, kod, jezyk, 2)).join(" + ")
  return <p className="text-caption text-muted-foreground">{t("UI-WAL-ROZBICIE", { lista })}</p>
}
