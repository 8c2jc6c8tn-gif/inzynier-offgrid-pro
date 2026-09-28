"use client"

import type { ReactNode } from "react"
import { DANE_ROZLICZEN, type Grupa, type OsdId, type Strefa } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { KodSkladnika } from "@/lib/core/modules/siec/rachunek-za-prad/calculator"
import type { Status } from "@/lib/core/calc-result"
import type { Warning } from "@/lib/core/calc-result"
import type { WerdyktPoziom } from "@/components/werdykt"
import { PoleSelect } from "@/components/ui/pole"

/** Shared pieces of the M14 screens (D1/F1, D2/F2, D8, D12, F3–F5). */

export const ETYKIETA_STREFY: Record<Strefa, string> = {
  calodobowa: "całodobowa",
  dzien: "dzień",
  noc: "noc",
  szczyt: "szczyt",
  pozaszczyt: "pozaszczyt",
}

export const ETYKIETA_SKLADNIKA: Record<KodSkladnika, string> = {
  energia: "Energia czynna (sprzedaż)",
  handlowa: "Opłata handlowa sprzedawcy",
  sieciowaZmienna: "Opłata sieciowa zmienna (OSD)",
  sieciowaStala: "Opłata sieciowa stała (OSD)",
  abonament: "Opłata abonamentowa (OSD)",
  mocowa: "Opłata mocowa",
  jakosciowa: "Stawka jakościowa",
  oze: "Opłata OZE",
  kogeneracyjna: "Opłata kogeneracyjna",
}

export const GRUPY_DOM: Grupa[] = ["G11", "G12", "G12w"]
export const GRUPY_FIRMA: Grupa[] = ["C11", "C12a", "C12b", "C21", "C22a", "C22b"]

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
  return (
    <PoleSelect
      label="Operator sieci (OSD)"
      value={value}
      onChange={(e) => onChange(e.target.value as OsdId)}
      hint={
        czyOsdMaStawki(value)
          ? "Stawki dystrybucyjne 2026 są w aplikacji (odczyt taryfy OSD)."
          : "Dla tego OSD aplikacja nie ma jeszcze stawek — wpiszesz je z faktury."
      }
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
  return (
    <p className="text-small text-muted-foreground">
      Stawki: plik „rozliczenia-pl-2026”, stan na {DANE_ROZLICZEN.stanNa}, ważne do {DANE_ROZLICZEN.waznoscDo}. Kwoty
      netto, VAT doliczany na końcu. {children}
    </p>
  )
}
