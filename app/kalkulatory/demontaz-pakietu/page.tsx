"use client"

import { useMemo } from "react"
import { calculateDemontazPakietu } from "@/lib/core/modules/montaz-baterii/demontaz-pakietu/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/montaz-baterii/demontaz-pakietu/constants"
import { OCZEKIWANA_LICZBA_OGNIW } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/constants"
import type { NapiecieSystemu } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { MAX_ZALECANE_NAPIECIE_OGNIWA_V } from "@/lib/core/modules/montaz-baterii/demontaz-pakietu/constants"
import { useTranslate } from "@/lib/i18n/language-context"

/** Schemat: ten sam szereg co przy montażu, rozpinany od końca o najwyższym potencjale. */
function DemontazIlustracja() {
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
      aria-label={t("UI-DEMPAK-SCHEMAT-DEMONTAZU-ROZPINANIE")}
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
            {t("UI-DEMPAK-OGNIWO", { p: i + 1 })}
          </text>
        </g>
      ))}

      {[0, 1, 2].map((i) => {
        const x1 = cellXs[i] + cellW
        const x2 = cellXs[i + 1]
        return <line key={i} x1={x1} y1={midY} x2={x2} y2={midY} className="stroke-red-500" strokeWidth="3" />
      })}

      <line x1="6" y1={midY} x2={cellXs[0]} y2={midY} className="stroke-current" strokeWidth="3" />
      <line
        x1={cellXs[3] + cellW}
        y1={midY}
        x2="434"
        y2={midY}
        className="stroke-current"
        strokeWidth="3"
      />
      <text x="434" y={midY - 12} textAnchor="end" className="fill-current text-[8px] font-medium">
        Do BMS (−)
      </text>

      {/* Znacznik startu demontażu — koniec o najwyższym potencjale. */}
      <circle cx="6" cy={midY} r="10" className="fill-red-500" />
      <text x="6" y={midY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold">
        1
      </text>
      <text x="6" y={midY - 24} textAnchor="start" className="fill-red-500 text-[8px] font-semibold">
        {t("UI-DEMPAK-ZACZNIJ")}
      </text>
      <text x="6" y={midY - 14} textAnchor="start" className="fill-red-500 text-[8px] font-semibold">
        {t("UI-DEMPAK-PAKIET")}
      </text>

      <text x="220" y="128" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-DEMPAK-ROZPINANIE-ZACZYNA-KONCA")}
      </text>
      <text x="220" y="142" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-DEMPAK-DOKLADNA-ODWROTNOSC-KOLEJNOS")}
      </text>
    </svg>
  )
}

type FormularzStan = {
  napiecieSystemu: NapiecieSystemu
  napieciePakietuV: string
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieSystemu: 48,
  napieciePakietuV: "49.6",
  potwierdzoneIds: [],
}

export default function DemontazPakietuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("demontaz-pakietu", STAN_POCZATKOWY)
  const { napiecieSystemu, napieciePakietuV, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setNapiecieSystemu = (a: NapiecieSystemu | ((p: NapiecieSystemu) => NapiecieSystemu)) => setPole("napiecieSystemu", a)
  const setNapieciePakietuV = (a: string | ((p: string) => string)) => setPole("napieciePakietuV", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () =>
      calculateDemontazPakietu({
        napiecieSystemu,
        napieciePakietuV: Number(napieciePakietuV),
        potwierdzoneIds,
      }),
    [napiecieSystemu, napieciePakietuV, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasWarning
          ? "uwaga"
          : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/demontaz-pakietu" />
      <NaglowekEkranu tytul={t("UI-DEMPAK-DEMONTAZ-PAKIETU")} ekran="demontaz-pakietu" wynik={result}>
        {t("UI-DEMPAK-KOLEJNOSC-SUGESTIA-DOKLADNA", { WYMAGANE_WYPOSAZENIE: t("UI-STALE-DEMPAK-WYPOSAZENIE") })}
      </NaglowekEkranu>

      <DemontazIlustracja />

      <PoleSelect
        label={t("UI-DEMPAK-NAPIECIE-SYSTEMU")}
        value={napiecieSystemu}
        onChange={(e) => setNapiecieSystemu(Number(e.target.value) as NapiecieSystemu)}
        pomoc={<PomocPola ekran="demontaz-pakietu" pole="napiecieSystemu" />}
      >
        <option value={12}>12 V (4S)</option>
        <option value={24}>24 V (8S)</option>
        <option value={48}>48 V (16S)</option>
      </PoleSelect>

      <Pole
        label={t("UI-DEMPAK-ZMIERZONE-NAPIECIE-PAKIETU")}
        unit="V"
        type="number"
        inputMode="decimal"
        value={napieciePakietuV}
        onChange={(e) => setNapieciePakietuV(e.target.value)}
        pomoc={<PomocPola ekran="demontaz-pakietu" pole="napiecie" params={{ vMax: MAX_ZALECANE_NAPIECIE_OGNIWA_V, s: OCZEKIWANA_LICZBA_OGNIW[napiecieSystemu], vLo: (3 * OCZEKIWANA_LICZBA_OGNIW[napiecieSystemu]).toFixed(0), vHi: (MAX_ZALECANE_NAPIECIE_OGNIWA_V * OCZEKIWANA_LICZBA_OGNIW[napiecieSystemu]).toFixed(0) }} />}
      />

      {result.status !== "INVALID_INPUT" && (
        <p className="text-small text-muted-foreground">
          {t("UI-DEMPAK-NAPIECIE-OGNIWO")} <span className="font-medium text-foreground">{result.value.napiecieOgniwaV.toFixed(2)} V</span>
        </p>
      )}

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        numerowana
        renderLabel={(item, index) => (
          <>
            <span className="font-medium">{t("UI-DEMPAK-KROK", { p: index + 1 })} </span>
            {item.krok}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>🔴 {w}</li>
        ))}
      </ul>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-DEMPAK-POLICZYC-SPRAWDZ-NAPIECIE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : poziom === null ? (
        <p className="text-small text-muted-foreground">
          {t("UI-DEMPAK-POTWIERDZONO-KROKOW-KOLEI", { potwierdzoneWKolejnosci: result.value.potwierdzoneWKolejnosci, razem: result.value.razem })}
        </p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            hasCritical
              ? t("UI-DEMPAK-ZABRONIONE-PAKIET-WCIAZ")
              : poziom === "ok"
                ? t("UI-DEMPAK-BEZPIECZNY-DEMONTAZU")
                : undefined
          }
        >
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
