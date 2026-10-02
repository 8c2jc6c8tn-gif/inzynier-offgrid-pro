"use client"

import type { Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * M14 — 12 monthly consumption values (D3 for dom, owned by F6 for firma). One owner of the draft
 * `siec-zuzycie-${segment}`; D1/F1, D4, D5, D6, D7/F8 only read it (echo). No profile is assumed —
 * the typical OSD profile is 🔎B (W4), so every month comes from the invoices or the OSD portal.
 */
export type StanZuzycia = { miesiace: string[] }

export const POCZATKOWY_ZUZYCIA: StanZuzycia = { miesiace: Array(12).fill("") }

export const kluczZuzycia = (segment: Segment) => `siec-zuzycie-${segment}`

/** Short month names as translation keys (`t()`), January first. */
export const KLUCZE_MIESIECY = Array.from({ length: 12 }, (_, i) => `UI-MIES-${String(i + 1).padStart(2, "0")}`)

/** 12 numbers when every month is filled, otherwise null (nothing guessed). */
export function zuzycieZeSzkicu(stan: StanZuzycia | null): number[] | null {
  if (!stan || stan.miesiace.length !== 12 || stan.miesiace.some((v) => v === "")) return null
  return stan.miesiace.map(Number)
}

export function useZuzycieMiesieczne(segment: Segment): { zuzycie: number[] | null; wczytano: boolean } {
  const { dane, wczytano } = useOdczytDraftu<StanZuzycia>(kluczZuzycia(segment))
  return { zuzycie: zuzycieZeSzkicu(dane), wczytano }
}

export function PolaZuzycia({ stan, onChange }: { stan: StanZuzycia; onChange: (s: StanZuzycia) => void }) {
  const t = useTranslate(true)
  return (
    <fieldset className="grid grid-cols-3 gap-3 rounded-md border p-3">
      <legend className="px-1 text-small font-medium">{t("UI-ZUZ-LEGENDA")}</legend>
      {KLUCZE_MIESIECY.map((m, i) => (
        <Pole
          key={m}
          label={t(m)}
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.miesiace[i] ?? ""}
          onChange={(e) => onChange({ miesiace: stan.miesiace.map((v, j) => (j === i ? e.target.value : v)) })}
          pomoc={<PomocPola ekran="siec-zuzycie" pole="miesiac" />}
        />
      ))}
    </fieldset>
  )
}
