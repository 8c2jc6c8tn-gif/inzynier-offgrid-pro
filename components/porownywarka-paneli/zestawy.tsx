"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { usePersistedDraft, type WalutyEkranu } from "@/lib/adapters/use-persisted-draft"
import { UdostepnianiePorownania } from "@/components/porownywarka-paneli/udostepnianie"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { formatujDate } from "@/lib/i18n/liczby"
import { kolejnyId, STAN_ZESTAWOW_POCZATKOWY, type FormularzStan, type StanZestawow } from "@/lib/porownywarka-paneli/stan"
import type { BosId } from "@/lib/core/dane/cennik-bos"
import { sciezkiKonkretne } from "@/lib/waluta/kwoty-pol"
import type { KodWaluty } from "@/lib/waluta/waluty"

const BOS_ID: readonly BosId[] = ["kabel-pv", "mc4", "bezpiecznik-dc", "rozlacznik-dc", "spd-dc", "rozdzielnia-dc", "konstrukcja"]

/**
 * Money fields of the comparison form (owner decisions 24.11.2026, `lib/waluta/kwoty-pol.ts`): the same fields the old
 * whole-draft converter (`KWOTY` in `lib/porownywarka-paneli/stan.ts`) rewrote — each panel row keeps its own currency.
 */
export const KWOTY_FORMULARZA_PANELI: readonly string[] = ["stawka", "cenaDzien", "cenaNoc", "agrCena", "panele.*.cena", "cenaUrzadzenia", ...BOS_ID.map((id) => `bosCeny.${id}`)]

/** The same fields inside every saved set (each set is a full form snapshot under `stan`). */
const KWOTY_ZESTAWOW_PANELI: readonly string[] = KWOTY_FORMULARZA_PANELI.map((s) => `zestawy.*.stan.${s}`)

/** Currency of each amount of a form snapshot, by its concrete form path (`panele.p1.cena`). */
export type WalutyMigawki = Record<string, KodWaluty>

/**
 * „Moje zestawy” (spec 12, U20): nazwane migawki całego formularza porównania (miejsca, panele, wycena, kryteria),
 * do których można wracać. Zapis w IndexedDB jak szkic ekranu; nic nie jest wczytywane bez kliknięcia.
 */
export function ZestawyPorownan({
  stan,
  waluty: walutyFormularza,
  onWczytaj,
  kodZLinku,
  onKodObsluzony,
}: {
  stan: FormularzStan
  /** Currencies of the form's amounts: a saved set keeps them, and the shared package gets the amounts in the working currency. */
  waluty: WalutyEkranu<FormularzStan>
  /** A saved set back into the form, with the currency of each of its amounts. */
  onWczytaj: (s: FormularzStan, waluty: WalutyMigawki) => void
  /** Code from the page address (`#udostepnij=…`), `null` when there is none. */
  kodZLinku: string | null
  onKodObsluzony: () => void
}) {
  const t = useTranslate()
  const jezyk = useLanguage()
  const [zapisane, setZapisane, waluty, wczytano] = usePersistedDraft<StanZestawow>("porownywarka-zestawy", STAN_ZESTAWOW_POCZATKOWY, { kwoty: KWOTY_ZESTAWOW_PANELI })
  const [nazwa, setNazwa] = useState("")
  const [doUsuniecia, setDoUsuniecia] = useState<string | null>(null)
  const teraz = () => new Date().toISOString()

  /** The form's currencies copied onto set `id` (called right after the set's snapshot is written). */
  const zapiszWalutyZestawu = (id: string) => {
    for (const s of sciezkiKonkretne(stan, KWOTY_FORMULARZA_PANELI)) waluty.pole(`zestawy.${id}.stan.${s}`).ustaw(walutyFormularza.pole(s).kod)
  }
  /** Currencies of set `z`'s amounts, by form path. */
  const walutyZestawu = (z: StanZestawow["zestawy"][number]): WalutyMigawki =>
    Object.fromEntries(sciezkiKonkretne(z.stan, KWOTY_FORMULARZA_PANELI).map((s) => [s, waluty.pole(`zestawy.${z.id}.stan.${s}`).kod]))

  const zapiszNowy = () => {
    const wpisana = nazwa.trim()
    const id = kolejnyId("z", zapisane.zestawy)
    setZapisane((prev) => ({
      zestawy: [...prev.zestawy, { id, nazwa: wpisana || t("UI-PORP-ZEST-DOMYSLNA", { n: prev.zestawy.length + 1 }), zapisanoIso: teraz(), stan }],
    }))
    zapiszWalutyZestawu(id)
    setNazwa("")
  }

  const dodajOtrzymany = (otrzymany: FormularzStan) => {
    const nazwaZestawu = t("UI-PORP-UDO-NAZWA", { n: zapisane.zestawy.length + 1 })
    setZapisane((prev) => ({ zestawy: [...prev.zestawy, { id: kolejnyId("z", prev.zestawy), nazwa: nazwaZestawu, zapisanoIso: teraz(), stan: otrzymany }] }))
    return nazwaZestawu
  }

  return (
    <>
      {/* The package has one currency for the whole form, so it gets the amounts converted to the working currency. */}
      <UdostepnianiePorownania stan={walutyFormularza.stanRoboczy} kodZLinku={kodZLinku} onKodObsluzony={onKodObsluzony} onDodaj={dodajOtrzymany} gotowe={wczytano} />
    <details className="rounded-lg border p-4">
      <summary className="cursor-pointer text-small font-medium">{t("UI-PORP-ZEST-TYTUL", { n: zapisane.zestawy.length })}</summary>
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-48 flex-1">
            <Pole
              label={t("UI-PORP-ZEST-NAZWA")}
              type="text"
              value={nazwa}
              onChange={(e) => setNazwa(e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="zestawNazwa" />}
            />
          </div>
          <Button variant="outline" className="min-h-11" onClick={zapiszNowy}>
            {t("UI-PORP-ZEST-ZAPISZ")}
          </Button>
        </div>
        {zapisane.zestawy.length === 0 ? (
          <p className="text-small text-muted-foreground">{t("UI-PORP-ZEST-PUSTO")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {zapisane.zestawy.map((z) => (
              <li key={z.id} className="flex flex-col gap-2 rounded-md border p-3 text-small">
                <span className="font-medium">{z.nazwa}</span>
                <span className="text-caption text-muted-foreground">{t("UI-PORP-ZEST-ZAPISANO", { data: formatujDate(new Date(z.zapisanoIso), jezyk) })}</span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="min-h-11" onClick={() => onWczytaj(z.stan, walutyZestawu(z))}>
                    {t("UI-PORP-ZEST-WCZYTAJ")}
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11"
                    onClick={() => {
                      setZapisane((prev) => ({ zestawy: prev.zestawy.map((x) => (x.id === z.id ? { ...x, zapisanoIso: teraz(), stan } : x)) }))
                      zapiszWalutyZestawu(z.id)
                    }}
                  >
                    {t("UI-PORP-ZEST-AKTUALIZUJ")}
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11"
                    onClick={() => {
                      const id = kolejnyId("z", zapisane.zestawy)
                      const kopiowane = walutyZestawu(z)
                      setZapisane((prev) => ({
                        zestawy: [...prev.zestawy, { ...z, id, nazwa: t("UI-PORP-ZEST-KOPIA", { nazwa: z.nazwa }), zapisanoIso: teraz() }],
                      }))
                      for (const [s, kod] of Object.entries(kopiowane)) waluty.pole(`zestawy.${id}.stan.${s}`).ustaw(kod)
                    }}
                  >
                    {t("UI-PORP-ZEST-DUPLIKUJ")}
                  </Button>
                  {doUsuniecia === z.id ? (
                    <Button
                      variant="outline"
                      className="min-h-11"
                      onClick={() => {
                        setZapisane((prev) => ({ zestawy: prev.zestawy.filter((x) => x.id !== z.id) }))
                        setDoUsuniecia(null)
                      }}
                    >
                      {t("UI-PORP-ZEST-USUN-PEWNY")}
                    </Button>
                  ) : (
                    <Button variant="outline" className="min-h-11" onClick={() => setDoUsuniecia(z.id)}>
                      {t("UI-PORP-ZEST-USUN")}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-caption text-muted-foreground">{t("UI-PORP-ZEST-NOTA")}</p>
      </div>
    </details>
    </>
  )
}
