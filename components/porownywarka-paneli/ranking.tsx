"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import type { DanePanelu, MiejsceInput, WymiaryMiejsca } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { posortujRanking, przefiltrujKatalog, rankingKatalogu, type SortowanieRankingu } from "@/lib/core/modules/pv/porownywarka-paneli/ranking"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/** Katalog jako dane silnika: cena jest polem użytkownika (U6), więc w rankingu jej nie ma. */
const KATALOG_DANE: DanePanelu[] = KATALOG_PANELI_PV.map((k) => ({ ...k, cenaBruttoZl: null }))

/**
 * „Sito” przed głębokim porównaniem (spec 12): wszystkie panele katalogu na wybranym miejscu, jeden uczciwy miernik —
 * energia zimowa (XI–II) — z filtrami mocy i najdłuższego boku (U5). Bez gwiazdek i bez ceny. Zaznaczasz do czterech
 * paneli i wstawiasz je do porównania.
 */
export function RankingKatalogu(p: {
  szerokosc: number | undefined
  dlugosc: number | undefined
  dane: RekordGodzinowy[] | undefined
  miejsce: MiejsceInput | null
  wymiary: WymiaryMiejsca | null
  maks: number
  onWstaw: (idKatalogu: string[]) => void
}) {
  const t = useTranslate()
  const [mocMin, setMocMin] = useState("")
  const [mocMax, setMocMax] = useState("")
  const [maxBok, setMaxBok] = useState("")
  const [sort, setSort] = useState<SortowanieRankingu>("zimaNaPanel")
  const [zaznaczone, setZaznaczone] = useState<string[]>([])

  const wynik = useMemo(() => {
    if (p.szerokosc === undefined || p.dlugosc === undefined || !p.dane?.length || p.miejsce === null) return null
    const filtr = {
      ...(liczba(mocMin) !== undefined ? { pmaxMinW: liczba(mocMin)! } : {}),
      ...(liczba(mocMax) !== undefined ? { pmaxMaxW: liczba(mocMax)! } : {}),
      ...(liczba(maxBok) !== undefined ? { maxBokMm: liczba(maxBok)! } : {}),
    }
    return rankingKatalogu({
      szerokoscGeograficzna: p.szerokosc,
      dlugoscGeograficzna: p.dlugosc,
      daneGodzinowe: p.dane,
      miejsce: p.miejsce,
      wymiaryMiejsca: p.wymiary,
      panele: przefiltrujKatalog(KATALOG_DANE, filtr),
    })
  }, [p.szerokosc, p.dlugosc, p.dane, p.miejsce, p.wymiary, mocMin, mocMax, maxBok])

  const wiersze = useMemo(() => (wynik ? posortujRanking(wynik.wiersze, sort) : []), [wynik, sort])
  const znaMiejsce = wiersze.some((w) => w.zimaWMiejscuKwh !== null)
  const przekroczono = zaznaczone.length > p.maks

  return (
    <details className="rounded-lg border p-4">
      <summary className="cursor-pointer text-small font-medium">{t("UI-PORP-RANK-TYTUL")}</summary>
      <div className="mt-3 flex flex-col gap-3">
        <p className="text-caption text-muted-foreground">{t("UI-PORP-RANK-OPIS")}</p>
        {wynik === null ? (
          <p className="text-small text-muted-foreground">{t("UI-PORP-RANK-BRAK-DANYCH")}</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <Pole
                label={t("UI-PORP-RANK-MOC-MIN")}
                unit="W"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={mocMin}
                onChange={(e) => setMocMin(e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="rankingMoc" />}
              />
              <Pole
                label={t("UI-PORP-RANK-MOC-MAX")}
                unit="W"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={mocMax}
                onChange={(e) => setMocMax(e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="rankingMoc" />}
              />
              <Pole
                label={t("UI-PORP-RANK-MAX-BOK")}
                unit="mm"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={maxBok}
                onChange={(e) => setMaxBok(e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="rankingMaxBok" />}
              />
            </div>
            <PoleSelect
              label={t("UI-PORP-RANK-SORT")}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortowanieRankingu)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="rankingSort" />}
            >
              <option value="zimaNaPanel">{t("UI-PORP-RANK-SORT-PANEL")}</option>
              <option value="zimaNaM2">{t("UI-PORP-RANK-SORT-M2")}</option>
              {znaMiejsce && <option value="zimaWMiejscu">{t("UI-PORP-RANK-SORT-MIEJSCE")}</option>}
            </PoleSelect>
            {wiersze.length === 0 ? (
              <p className="text-small text-muted-foreground">{t("UI-PORP-RANK-PUSTO")}</p>
            ) : (
              <div className="max-h-96 overflow-auto rounded-md border">
                <table className="w-full text-small">
                  <thead className="sticky top-0 bg-background">
                    <tr className="text-left">
                      <th className="p-1" />
                      <th className="p-1 font-medium">{t("UI-PORP-RANK-COL-PANEL")}</th>
                      <th className="p-1 font-medium">{t("UI-PORP-RANK-COL-ZIMA")}</th>
                      <th className="p-1 font-medium">{t("UI-PORP-RANK-COL-M2")}</th>
                      {znaMiejsce && <th className="p-1 font-medium">{t("UI-PORP-RANK-COL-MIEJSCE")}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {wiersze.map((w) => {
                      const brak = w.brakuje.length > 0
                      return (
                      <tr key={w.id} className={`border-t align-top ${brak ? "bg-muted/50 text-muted-foreground" : ""}`}>
                        <td className="p-1">
                          <input
                            type="checkbox"
                            aria-label={w.nazwa}
                            className="h-5 w-5"
                            disabled={brak}
                            checked={zaznaczone.includes(w.id)}
                            onChange={(e) => setZaznaczone((prev) => (e.target.checked ? [...prev, w.id] : prev.filter((x) => x !== w.id)))}
                          />
                        </td>
                        <td className="p-1">{w.nazwa}</td>
                        {brak ? (
                          <td className="p-1 italic" colSpan={znaMiejsce ? 3 : 2}>
                            {t("UI-PORP-RANK-BRAK", { czego: w.brakuje.map((b) => (b === "gamma" ? "γ" : "NOCT")).join(", ") })}
                          </td>
                        ) : (
                          <>
                            <td className="p-1 tabular-nums">{w.zimaNaPanelKwh === null ? "—" : f1(w.zimaNaPanelKwh)}</td>
                            <td className="p-1 tabular-nums">{w.zimaNaM2Kwh === null ? "—" : f1(w.zimaNaM2Kwh)}</td>
                            {znaMiejsce && (
                              <td className="p-1 tabular-nums">
                                {w.zimaWMiejscuKwh === null || w.liczbaWMiejscu === null ? "—" : `${f0(w.zimaWMiejscuKwh)} (${w.liczbaWMiejscu} ${t("UI-PORP-RANK-SZT")})`}
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {przekroczono && (
              <p role="alert" className="text-small text-werdykt-blad-foreground">
                {t("UI-PORP-RANK-ZA-DUZO", { maks: p.maks })}
              </p>
            )}
            <Button
              variant="outline"
              className="min-h-11 self-start"
              disabled={zaznaczone.length === 0 || przekroczono}
              onClick={() => {
                p.onWstaw(zaznaczone)
                setZaznaczone([])
              }}
            >
              {t("UI-PORP-RANK-WSTAW", { n: zaznaczone.length })}
            </Button>
            <p className="text-caption text-muted-foreground">{t("UI-PORP-RANK-NOTA")}</p>
            <p className="text-caption text-muted-foreground">{t(wynik.zakresModelu.temperatura ? "UI-PORP-RANK-TEMP-TAK" : "UI-PORP-RANK-TEMP-NIE")}</p>
          </>
        )}
      </div>
    </details>
  )
}
