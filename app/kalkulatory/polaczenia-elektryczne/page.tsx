"use client"

import { useMemo } from "react"
import { calculatePolaczeniaElektryczne } from "@/lib/core/modules/montaz-baterii/polaczenia-elektryczne/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/montaz-baterii/polaczenia-elektryczne/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

/** Schemat: kolejność łączenia ogniw w szereg (przykład 4S — minus jednego do plusa następnego). */
function PolaczeniaSzeregoweIlustracja() {
  const t = useTranslate()
  const cellXs = [55, 150, 245, 340]
  const cellW = 65
  const cellY = 44
  const cellH = 56
  const midY = cellY + cellH / 2

  return (
    <svg
      viewBox="0 0 440 160"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={t("UI-POLELE-SCHEMAT-KOLEJNOSCI-LACZENIA")}
    >
      {cellXs.map((x, i) => (
        <g key={x}>
          <rect x={x} y={cellY} width={cellW} height={cellH} rx="4" className="fill-indigo-400/60 stroke-current" />
          <text x={x + 13} y={midY - 10} textAnchor="middle" className="fill-current text-[11px] font-semibold">
            +
          </text>
          <text x={x + cellW - 13} y={midY - 10} textAnchor="middle" className="fill-current text-[11px] font-semibold">
            −
          </text>
          <text x={x + cellW / 2} y={midY + 20} textAnchor="middle" className="fill-current text-[9px]">
            {t("UI-POLELE-OGNIWO", { p: i + 1 })}
          </text>
        </g>
      ))}

      {/* Wewnętrzne połączenia szeregowe, ponumerowane wg kolejności łączenia. */}
      {[0, 1, 2].map((i) => {
        const x1 = cellXs[i] + cellW
        const x2 = cellXs[i + 1]
        const xm = (x1 + x2) / 2
        return (
          <g key={i}>
            <line x1={x1} y1={midY} x2={x2} y2={midY} className="stroke-red-500" strokeWidth="3" />
            <circle cx={xm} cy={midY - 20} r="9" className="fill-red-500" />
            <text x={xm} y={midY - 16} textAnchor="middle" className="fill-white text-[10px] font-bold">
              {i + 1}
            </text>
          </g>
        )
      })}

      {/* Główne terminale pakietu. */}
      <line x1="6" y1={midY} x2={cellXs[0]} y2={midY} className="stroke-current" strokeWidth="3" />
      <text x="6" y={midY - 22} textAnchor="start" className="fill-current text-[8px] font-medium">
        {t("UI-POLELE-PAKIET")}
      </text>
      <text x="6" y={midY - 12} textAnchor="start" className="fill-current text-[8px] font-medium">
        (+)
      </text>
      <line
        x1={cellXs[3] + cellW}
        y1={midY}
        x2="434"
        y2={midY}
        className="stroke-current"
        strokeWidth="3"
      />
      <text x="434" y={midY - 22} textAnchor="end" className="fill-current text-[8px] font-medium">
        Do BMS
      </text>
      <text x="434" y={midY - 12} textAnchor="end" className="fill-current text-[8px] font-medium">
        (−)
      </text>

      <text x="220" y="128" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-POLELE-KOLEJNOSC-MINUS-OGNIWA")}
      </text>
      <text x="220" y="142" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-POLELE-SZYNY-ZBIORCZE-DOPIERO")}
      </text>
    </svg>
  )
}

type FormularzStan = { potwierdzoneIds: string[] }
const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function PolaczeniaElektrycznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("polaczenia-elektryczne", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof a === "function" ? (a as (p: string[]) => string[])(prev.potwierdzoneIds) : a,
    }))

  const result = useMemo(
    () => calculatePolaczeniaElektryczne({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/polaczenia-elektryczne" />
      <NaglowekEkranu tytul={t("UI-POLELE-POLACZENIA-ELEKTRYCZNE-KOLEJ")} ekran="polaczenia-elektryczne">
        {t("UI-POLELE-KOLEJNOSC-LACZENIA-ZNACZENIE")}
      </NaglowekEkranu>

      <PolaczeniaSzeregoweIlustracja />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        numerowana
        renderLabel={(item, index) => (
          <>
            <span className="font-medium">{t("UI-POLELE-KROK", { p: index + 1 })} </span>
            {item.krok}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>🔴 {w}</li>
        ))}
      </ul>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? t("UI-POLELE-POLACZENIA-ZGODNE-KOLEJNOSCI") : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <StanPusty
          tytul={t("UI-POLELE-POTWIERDZONO-KROKOW-KOLEI", { potwierdzoneWKolejnosci: result.value.potwierdzoneWKolejnosci, razem: result.value.razem })}
        />
      )}
    </main>
  )
}
