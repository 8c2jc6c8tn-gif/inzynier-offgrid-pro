"use client"

import type { ReactNode } from "react"
import { DANE_ROZLICZEN, type Grupa, type OsdId, type Strefa, wartoscNajdluzej } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { KodSkladnika } from "@/lib/core/modules/siec/rachunek-za-prad/calculator"
import type { Status } from "@/lib/core/calc-result"
import type { Warning } from "@/lib/core/calc-result"
import type { WerdyktPoziom } from "@/components/werdykt"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { cn } from "@/lib/utils"
import type { Segment as SegmentSieci } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { useTranslate } from "@/lib/i18n/language-context"

/** Shared pieces of the M14 screens (D1/F1, D2/F2, D8, D12, F3–F5). */

/** Zone labels — `UI-STREFA-*` keys, render through `t()`. */
export const ETYKIETA_STREFY: Record<Strefa, string> = {
  calodobowa: "UI-STREFA-CALODOBOWA",
  dzien: "UI-STREFA-DZIEN",
  noc: "UI-STREFA-NOC",
  szczyt: "UI-STREFA-SZCZYT",
  pozaszczyt: "UI-STREFA-POZASZCZYT",
}

/** Bill component labels — `UI-SKLADNIK-*` keys, render through `t()`. */
export const ETYKIETA_SKLADNIKA: Record<KodSkladnika, string> = {
  energia: "UI-SKLADNIK-ENERGIA",
  handlowa: "UI-SKLADNIK-HANDLOWA",
  sieciowaZmienna: "UI-SKLADNIK-SIECIOWA-ZMIENNA",
  sieciowaStala: "UI-SKLADNIK-SIECIOWA-STALA",
  abonament: "UI-SKLADNIK-ABONAMENT",
  mocowa: "UI-SKLADNIK-MOCOWA",
  jakosciowa: "UI-SKLADNIK-JAKOSCIOWA",
  oze: "UI-SKLADNIK-OZE",
  kogeneracyjna: "UI-SKLADNIK-KOGENERACYJNA",
}

export const GRUPY_DOM: Grupa[] = ["G11", "G12", "G12w"]
export const GRUPY_FIRMA: Grupa[] = ["C11", "C12a", "C12b", "C21", "C22a", "C22b"]

/**
 * Statutory rates quoted in the help texts (8.4b: numbers come from the data file, never retyped
 * in three languages). Value of the data year, picked the same way as the engines without a date (D36).
 */
export function stawkiDoPomocy(): Record<string, string | number> {
  const rok = Number(DANE_ROZLICZEN.stanNa.slice(0, 4))
  const w = (o: { okresy: { odDnia: string; doDnia: string | null; wartosc: number }[] }) => wartoscNajdluzej(o.okresy, rok)
  const pct = (v: number | null) => (v === null ? "—" : Math.round(v * 100))
  const vat = w(DANE_ROZLICZEN.krajowe.vat)
  const p = DANE_ROZLICZEN.prosument
  return {
    mnoznikVat: vat === null ? "—" : (1 + vat).toFixed(2),
    wspDepozytu: w(p.wspolczynnikDepozytu)?.toFixed(2) ?? "—",
    zwrotRcem: pct(w(p.zwrotDepozytuMaksRcem)),
    zwrotRce: pct(w(p.zwrotDepozytuMaksRce)),
    k: w(DANE_ROZLICZEN.mocBierna.krotnoscKNn) ?? "—",
  }
}

export function czyOsdMaStawki(osd: OsdId): boolean {
  return (DANE_ROZLICZEN.osd.find((o) => o.id === osd)?.okresy.length ?? 0) > 0
}

/** Empty text → 0 (not entered, for always-positive fields — D15). */
export function liczba(s: string): number {
  return s === "" ? 0 : Number(s)
}

/** Empty text → null (0 is a legal value — D15). */
export function liczbaLubNull(s: string): number | null {
  return s === "" ? null : Number(s)
}

/** Empty text → undefined (no override — take the ✅ rate from the data file, D36). */
export function nadpisanie(s: string): number | undefined {
  return s === "" ? undefined : Number(s)
}

export function zl(v: number, cyfry = 0): string {
  return v.toLocaleString("pl-PL", { minimumFractionDigits: cyfry, maximumFractionDigits: cyfry }) + " zł"
}

/** Verdict colour from warnings, never from status alone (D14, `kontrakty-rdzenia.md` §6). */
export function poziomWerdyktu(status: Status, warnings: Warning[]): WerdyktPoziom | null {
  if (status === "INVALID_INPUT" || warnings.some((w) => w.level === "critical")) return "blad"
  if (status === "VALID") return "ok"
  if (status === "VALID_WITH_WARNINGS") return "uwaga"
  return null
}

export function PoleOsd({ value, onChange }: { value: OsdId; onChange: (v: OsdId) => void }) {
  const t = useTranslate()
  return (
    <PoleSelect
      label={t("UI-WSP-OPERATOR-SIECI-OSD")}
      value={value}
      onChange={(e) => onChange(e.target.value as OsdId)}
      pomoc={<PomocPola ekran="siec-osd" pole="osd" />}
    >
      {DANE_ROZLICZEN.osd.map((o) => (
        <option key={o.id} value={o.id}>
          {o.nazwa}
        </option>
      ))}
    </PoleSelect>
  )
}

export function ZrodloDanych({ children }: { children?: ReactNode }) {
  const t = useTranslate()
  return (
    <p className="text-small text-muted-foreground">
      {t("UI-WSP-STAWKI-PLIK-ROZLICZENIA", { stanNa: DANE_ROZLICZEN.stanNa, waznoscDo: DANE_ROZLICZEN.waznoscDo })} {children}
    </p>
  )
}

/** One position of a segmented switch (M14: price path D42, dom/firma on the shared screens). */
export function PrzyciskSegmentu({ aktywny, onClick, children }: { aktywny: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={aktywny}
      onClick={onClick}
      className={cn(
        "min-h-11 flex-1 rounded-md px-2 text-small transition-colors",
        aktywny ? "bg-primary text-primary-foreground" : "hover:bg-muted",
      )}
    >
      {children}
    </button>
  )
}

/** Dom/Firma switch of the shared screens D9–D11 / F9–F10 and the „Ścieżka przejścia” wizard. */
export function PrzelacznikSegmentu({ value, onChange }: { value: SegmentSieci; onChange: (s: SegmentSieci) => void }) {
  const t = useTranslate()
  return (
    <div className="flex gap-1 rounded-lg border p-1" role="group" aria-label={t("UI-DOM-CZY-FIRMA")}>
      <PrzyciskSegmentu aktywny={value === "dom"} onClick={() => onChange("dom")}>
        {t("UI-DOM")}
      </PrzyciskSegmentu>
      <PrzyciskSegmentu aktywny={value === "firma"} onClick={() => onChange("firma")}>
        {t("UI-FIRMA")}
      </PrzyciskSegmentu>
    </div>
  )
}

/** Segment chosen on the shared „Przejście” screens (D9–D11, F9–F10, wizard) — one draft for all of them. */
export const KLUCZ_SEGMENTU_PRZEJSCIA = "siec-segment-przejscia"
export const POCZATKOWY_SEGMENTU: { segment: SegmentSieci } = { segment: "dom" }
