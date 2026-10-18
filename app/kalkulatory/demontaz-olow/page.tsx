"use client"

import { isComputed } from "@/lib/core/calc-result"
import { useMemo } from "react"
import { calculateDemontazOlow } from "@/lib/core/modules/montaz-baterii/demontaz-olow/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/montaz-baterii/demontaz-olow/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom, poziomZStatusu } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"
import { ZnakStanu } from "@/components/ui/znak-stanu"

/** Schemat: kolejność demontażu — najpierw minus systemowy, potem plus, na końcu szereg wewnętrzny. */
function DemontazOlowIlustracja() {
  const t = useTranslate()
  return (
    <svg
      viewBox="0 0 400 170"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={t("UI-DEMOLO-SCHEMAT-DEMONTAZU-AKUMULATOR")}
    >
      <rect x="45" y="60" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="90" y="87" textAnchor="middle" className="fill-current text-[9px]">
        {t("UI-DEMOLO-AKUM")}
      </text>
      <rect x="235" y="60" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="280" y="87" textAnchor="middle" className="fill-current text-[9px]">
        {t("UI-DEMOLO-AKUM-2")}
      </text>
      <text x="53" y="56" className="fill-current text-[9px] font-semibold">+</text>
      <text x="123" y="56" className="fill-current text-[9px] font-semibold">−</text>
      <text x="243" y="56" className="fill-current text-[9px] font-semibold">+</text>
      <text x="313" y="56" className="fill-current text-[9px] font-semibold">−</text>

      {/* wewnętrzny szereg */}
      <line x1="135" y1="83" x2="235" y2="83" className="stroke-red-500" strokeWidth="3" />
      <circle cx="185" cy="103" r="9" className="fill-red-500" />
      <text x="185" y="107" textAnchor="middle" className="fill-white text-[9px] font-bold">3</text>

      {/* główny plus systemowy — od Akum.1(+) */}
      <line x1="6" y1="83" x2="45" y2="83" className="stroke-current" strokeWidth="3" />
      <circle cx="20" cy="63" r="9" className="fill-red-500" />
      <text x="20" y="67" textAnchor="middle" className="fill-white text-[9px] font-bold">2</text>
      <text x="4" y="46" textAnchor="start" className="fill-current text-[8px] font-medium">{t("UI-DEMOLO-SYSTEMU")}</text>

      {/* główny minus systemowy — od Akum.2(−) */}
      <line x1="325" y1="83" x2="394" y2="83" className="stroke-current" strokeWidth="3" />
      <circle cx="360" cy="63" r="9" className="fill-red-500" />
      <text x="360" y="67" textAnchor="middle" className="fill-white text-[9px] font-bold">1</text>
      <text x="396" y="46" textAnchor="end" className="fill-current text-[8px] font-medium">{t("UI-DEMOLO-SYSTEMU-2")}</text>

      <text x="200" y="140" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-DEMOLO-MINUS-SYSTEMOWY-PLUS")}
      </text>
      <text x="200" y="154" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-DEMOLO-KONCA-NAJWYZSZYM-POTENCJALE")}
      </text>
    </svg>
  )
}

type FormularzStan = {
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  potwierdzoneIds: [],
}

export default function DemontazOlowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("demontaz-olow", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan

  function setPotwierdzoneIds(akcja: string[] | ((prev: string[]) => string[])) {
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof akcja === "function" ? (akcja as (p: string[]) => string[])(prev.potwierdzoneIds) : akcja,
    }))
  }

  const result = useMemo(() => calculateDemontazOlow({ potwierdzoneIds }), [potwierdzoneIds])

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    isComputed(result.status) ? poziomZStatusu(result.status) : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/demontaz-olow" />
      <NaglowekEkranu tytul={t("UI-DEMOLO-DEMONTAZ-PROCEDURA-KOLEJNOSC")} ekran="demontaz-olow">
        {t("UI-DEMOLO-SAMA-ZASADA-LIFEPO4")}
      </NaglowekEkranu>

      <DemontazOlowIlustracja />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        numerowana
        renderLabel={(item, index) => (
          <>
            <span className="font-medium">{t("UI-DEMOLO-KROK", { p: index + 1 })} </span>
            {item.krok}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}><ZnakStanu poziom="uwaga" />{w}</li>
        ))}
      </ul>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? t("UI-DEMOLO-DEMONTAZ-ZGODNY-KOLEJNOSCIA") : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <StanPusty
          tytul={t("UI-DEMOLO-POTWIERDZONO-KROKOW-KOLEI", { potwierdzoneWKolejnosci: result.value.potwierdzoneWKolejnosci, razem: result.value.razem })}
        />
      )}
    </main>
  )
}
