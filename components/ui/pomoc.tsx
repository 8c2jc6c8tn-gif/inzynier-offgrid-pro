"use client"

import { useState } from "react"
import { Chmurka, PomocPole } from "@/components/ui/chmurka"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import type { CalcResult } from "@/lib/core/calc-result"
import { pomoc, type EkranPomocy, type GrupaPomocy, type PolePomocy } from "@/lib/i18n/pomoc"
import type { MigawkaTresc, PomocPolaTresc } from "@/lib/i18n/pomoc/typy"
import { useLanguage, useSymbolWaluty, useTranslate } from "@/lib/i18n/language-context"
import { podstaw } from "@/lib/i18n/t"
import { cn } from "@/lib/utils"

/**
 * Translated help, standard 8.4 + decisions D34/D51. Two levels that complement each other:
 * `PomocPola` — the „?” of one field (name, what for, where to find it, typical range);
 * `MigawkaInfo` — the „i” of the whole screen (what it is about, how it calculates, why, physics).
 * Content: `lib/i18n/pomoc/<module>.ts`, typed per screen, so a wrong screen/field id does not compile.
 */

function TrescPola({ tresc }: { tresc: PomocPolaTresc }) {
  const t = useTranslate()
  return (
    <div className="flex flex-col gap-1.5 leading-relaxed">
      <p className="font-semibold">{tresc.nazwa}</p>
      <p>
        <span className="font-medium">{t("POMOC-UI-DO-CZEGO")}: </span>
        {tresc.cel}
      </p>
      <p>
        <span className="font-medium">{t("POMOC-UI-GDZIE")}: </span>
        {tresc.gdzie}
      </p>
      <p>
        <span className="font-medium">{t("POMOC-UI-ZAKRES")}: </span>
        {tresc.zakres}
      </p>
    </div>
  )
}

/**
 * `params` fill `{name}` placeholders from engine constants, so a number stays in one place
 * (the engine) instead of being copied into three languages.
 */
export function PomocPola<G extends GrupaPomocy>({
  ekran,
  pole,
  params,
}: {
  ekran: G
  pole: PolePomocy<G>
  params?: Record<string, string | number>
}) {
  const language = useLanguage()
  const t = useTranslate()
  const waluta = useSymbolWaluty()
  const parametry = { waluta, ...params }
  const surowa = (pomoc[language][ekran].pola as Record<string, PomocPolaTresc>)[pole]!
  const tresc: PomocPolaTresc = {
    nazwa: podstaw(language, surowa.nazwa, parametry),
    cel: podstaw(language, surowa.cel, parametry),
    gdzie: podstaw(language, surowa.gdzie, parametry),
    zakres: podstaw(language, surowa.zakres, parametry),
  }
  return <PomocPole tresc={<TrescPola tresc={tresc} />} aria={t("POMOC-UI-ARIA-POLE", { nazwa: tresc.nazwa })} />
}

type Zakladka = "po-ludzku" | "fizyka"

/** The part of the current result the „Fizyka” tab shows; `null`/absent before the first calculation. */
export type WynikMigawki = Partial<Pick<CalcResult<unknown>, "formula" | "assumptions">> | null | undefined

/**
 * „i” next to the screen title. Click/tap only (no hover) — the popup has tabs the user clicks.
 * `wynik` = the current `CalcResult`: its `formula` and `assumptions` go into the physics tab (8.4b,
 * 8.4 Section D — what the engine really used, never hand-copied), the assumptions through the same
 * `ZalozeniaLista` as under the result.
 */
export function MigawkaInfo({
  ekran,
  wynik,
  params,
}: {
  ekran: EkranPomocy
  wynik?: WynikMigawki
  params?: Record<string, string | number>
}) {
  const language = useLanguage()
  const t = useTranslate()
  const waluta = useSymbolWaluty()
  const parametry = { waluta, ...params }
  const [zakladka, setZakladka] = useState<Zakladka>("po-ludzku")
  const surowa = (pomoc[language][ekran] as { migawka: MigawkaTresc }).migawka
  const m: MigawkaTresc = {
    oCoChodzi: podstaw(language, surowa.oCoChodzi, parametry),
    jakDziala: podstaw(language, surowa.jakDziala, parametry),
    poCo: podstaw(language, surowa.poCo, parametry),
    fizyka: surowa.fizyka && podstaw(language, surowa.fizyka, parametry),
  }
  const wzor = wynik?.formula
  const zalozenia = wynik?.assumptions ?? []
  const fizykaDostepna = Boolean(wzor || zalozenia.length > 0 || m.fizyka)

  const tresc = (
    <div className="flex flex-col gap-2 leading-relaxed">
      {fizykaDostepna && (
        <div role="tablist" className="flex gap-1 border-b pb-1">
          {(["po-ludzku", "fizyka"] as const).map((z) => (
            <button
              key={z}
              type="button"
              role="tab"
              aria-selected={zakladka === z}
              onClick={() => setZakladka(z)}
              className={cn(
                "min-h-8 rounded px-2 text-xs",
                zakladka === z ? "bg-muted font-semibold" : "text-muted-foreground hover:bg-muted/60",
              )}
            >
              {t(z === "po-ludzku" ? "MIGAWKA-UI-PO-LUDZKU" : "MIGAWKA-UI-FIZYKA")}
            </button>
          ))}
        </div>
      )}
      {zakladka === "po-ludzku" || !fizykaDostepna ? (
        <>
          <p className="font-medium">{m.oCoChodzi}</p>
          <p>
            <span className="font-medium">{t("MIGAWKA-UI-JAK-DZIALA")}: </span>
            {m.jakDziala}
          </p>
          <p>
            <span className="font-medium">{t("MIGAWKA-UI-PO-CO")}: </span>
            {m.poCo}
          </p>
        </>
      ) : (
        <>
          {m.fizyka && <p>{m.fizyka}</p>}
          {wzor && (
            <p>
              <span className="font-medium">{t("MIGAWKA-UI-WZOR")}: </span>
              <span className="font-mono">{wzor}</span>
            </p>
          )}
          {zalozenia.length > 0 && (
            <div>
              <p className="font-medium">{t("MIGAWKA-UI-ZALOZENIA")}:</p>
              <ZalozeniaLista assumptions={zalozenia} className="text-inherit" />
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <Chmurka
      tresc={tresc}
      naHover={false}
      aria={t("MIGAWKA-UI-ARIA")}
      className="max-h-[70vh] max-w-[min(24rem,calc(100vw-2rem))] overflow-y-auto text-small"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold italic text-muted-foreground hover:bg-muted">
        i
      </span>
    </Chmurka>
  )
}
