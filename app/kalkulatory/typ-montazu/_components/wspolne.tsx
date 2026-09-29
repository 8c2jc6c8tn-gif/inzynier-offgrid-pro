"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import type { Warning } from "@/lib/core/calc-result"
import { KATEGORIE_TERENU, type KategoriaTerenu, type StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"

export const MIESIACE = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]
export const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
export const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
export const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })
/** Pole tekstowe → liczba albo `null` (puste/niepoprawne = nie wpisano, bez wartości domyślnej). */
export const n = (s: string) => liczba(s) ?? null
export const znak = (x: number) => (x > 0 ? "+" : x < 0 ? "−" : "") + f1(Math.abs(x))

/** Poziom werdyktu: `critical` → czerwony (źródło: 🔴), `warning` → żółty, sam `info` → zielony. */
export function poziomZOstrzezen(warnings: Warning[]): WerdyktPoziom {
  if (warnings.some((w) => w.level === "critical")) return "blad"
  if (warnings.some((w) => w.level === "warning")) return "uwaga"
  return "ok"
}

/** INVALID_INPUT — lista błędów danych zamiast wyniku. */
export function BledyDanych({ warnings }: { warnings: Warning[] }) {
  const t = useTranslate()
  return (
    <WerdyktPanel poziom="blad" etykieta="Sprawdź dane">
      <ul className="mt-2 space-y-1 text-small">
        {warnings.map((w, i) => (
          <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
        ))}
      </ul>
    </WerdyktPanel>
  )
}

export type WiatrSeed = { strefa: string; wysokoscNpmM: string; kategoria: string; phi: string }
export const WIATR_PUSTY: WiatrSeed = { strefa: "", wysokoscNpmM: "", kategoria: "", phi: "" }

export function wiatrZSeeda(s: WiatrSeed, wysokoscPvgis: number | undefined) {
  return {
    strefaWiatrowa: s.strefa === "" ? null : (Number(s.strefa) as StrefaWiatrowa),
    wysokoscNpmM: n(s.wysokoscNpmM) ?? wysokoscPvgis ?? null,
    kategoriaTerenu: s.kategoria === "" ? null : (s.kategoria as KategoriaTerenu),
    wspolczynnikPhi: n(s.phi),
  }
}

const OPIS_TERENU: Record<KategoriaTerenu, string> = {
  "0": "0 — morze, brzeg otwarty na morze",
  I: "I — jeziora, teren płaski bez przeszkód",
  II: "II — niska roślinność, pojedyncze drzewa/budynki daleko od siebie",
  III: "III — wieś, przedmieścia, las, regularna zabudowa",
  IV: "IV — miasto (min. 15% zabudowy wyższej niż 15 m)",
}

/** Pola wiatru PN-EN 1991-1-4 — te same co M3/E9 (strefa NA.1, teren NA.3, φ z 7.3). */
export function PolaWiatru({ s, ustaw, wysokoscPvgis }: { s: WiatrSeed; ustaw: (p: keyof WiatrSeed, v: string) => void; wysokoscPvgis?: number }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-semibold">Wiatr w miejscu montażu</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <PoleSelect
          label="Strefa wiatrowa"
          value={s.strefa}
          onChange={(e) => ustaw("strefa", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="strefa" />}
        >
          <option value="">— wybierz —</option>
          <option value="1">Strefa 1</option>
          <option value="2">Strefa 2</option>
          <option value="3">Strefa 3</option>
        </PoleSelect>
        <Pole
          label="Wysokość terenu n.p.m."
          unit="m"
          type="number"
          inputMode="decimal"
          value={s.wysokoscNpmM}
          onChange={(e) => ustaw("wysokoscNpmM", e.target.value)}
          placeholder={wysokoscPvgis !== undefined ? String(wysokoscPvgis) : undefined}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="wysokoscNpm" />}
        />
      </div>
      <PoleSelect
        label="Teren wokół (kategoria terenu)"
        value={s.kategoria}
        onChange={(e) => ustaw("kategoria", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="teren" />}
      >
        <option value="">— wybierz —</option>
        {KATEGORIE_TERENU.map((k) => (
          <option key={k} value={k}>
            {OPIS_TERENU[k]}
          </option>
        ))}
      </PoleSelect>
      <Pole
        label="Zabudowa pod stelażem φ"
        type="number"
        inputMode="decimal"
        min={0}
        max={1}
        step={0.1}
        value={s.phi}
        onChange={(e) => ustaw("phi", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="zabudowa" />}
      />
    </section>
  )
}

export type StelazSeed = { dlugoscWzdluzSpaduM: string; szerokoscStelazaM: string; wysokoscDolnejKrawedziM: string; masaPaneliStelazaKg: string }
export const STELAZ_PUSTY: StelazSeed = { dlugoscWzdluzSpaduM: "", szerokoscStelazaM: "", wysokoscDolnejKrawedziM: "", masaPaneliStelazaKg: "" }

export function stelazZSeeda(s: StelazSeed) {
  return {
    dlugoscWzdluzSpaduM: n(s.dlugoscWzdluzSpaduM),
    szerokoscStelazaM: n(s.szerokoscStelazaM),
    wysokoscDolnejKrawedziM: n(s.wysokoscDolnejKrawedziM),
    // Drafts saved before D29 (28.09.2026) have no mass — treat as empty.
    masaPaneliStelazaKg: n(s.masaPaneliStelazaKg ?? ""),
  }
}

/** Result suffix: the ballast is on top of the entered panels + frame weight (D29). */
export function dopiskMasyWlasnej(s: StelazSeed): string {
  const masa = n(s.masaPaneliStelazaKg ?? "")
  return masa === null ? "" : ` ponad ciężar paneli i stelaża (${masa.toLocaleString("pl-PL")} kg)`
}

export function PolaStelaza({ s, ustaw, poleKrawedzi }: { s: StelazSeed; ustaw: (p: keyof StelazSeed, v: string) => void; poleKrawedzi: "krawedzRegulowany" | "krawedzDachPlaski" }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Pole
        label="Długość wzdłuż spadku L"
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.dlugoscWzdluzSpaduM}
        onChange={(e) => ustaw("dlugoscWzdluzSpaduM", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="dlugoscL" />}
      />
      <Pole
        label="Szerokość stelaża"
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.szerokoscStelazaM}
        onChange={(e) => ustaw("szerokoscStelazaM", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="szerokosc" />}
      />
      <Pole
        label="Dolna krawędź nad terenem"
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.wysokoscDolnejKrawedziM}
        onChange={(e) => ustaw("wysokoscDolnejKrawedziM", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole={poleKrawedzi} />}
      />
      <Pole
        label="Masa paneli i stelaża (opcjonalnie)"
        unit="kg"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.masaPaneliStelazaKg ?? ""}
        onChange={(e) => ustaw("masaPaneliStelazaKg", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="masa" />}
      />
    </div>
  )
}

/**
 * Tabela napromieniowania kąt 0–90° × miesiąc dla azymutu (krok ciężki M3/E1, Web Worker) — wspólna
 * dla trybów "Pionowy" i "Stelaż regulowany". Ważna tylko dla bieżącej lokalizacji, danych i azymutu.
 */
export function useTabelaNapromieniowania(azymutTekst: string) {
  const { lokalizacja, dane } = useLokalizacjaProjektu()
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [tabela, setTabela] = useState<{ klucz: string; t: TabelaNapromieniowania | null } | null>(null)
  const azymut = liczba(azymutTekst)
  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, azymut])
  const aktualna = tabela !== null && tabela.klucz === klucz ? tabela.t : null

  async function policz() {
    if (!lokalizacja || !dane || azymut === undefined) return
    const r = await uruchom({
      typ: "tabela-napromieniowania",
      wejscie: { szerokoscGeograficzna: lokalizacja.szerokosc, dlugoscGeograficzna: lokalizacja.dlugosc, daneGodzinowe: dane.dane.rekordy, azymutDeg: azymut },
    })
    if (r) setTabela({ klucz, t: r.wynik.value })
  }

  return {
    tabela: aktualna,
    policz,
    liczy: obliczenia.liczy,
    blad: obliczenia.blad,
    mozna: !!lokalizacja && !!dane && azymut !== undefined && !obliczenia.liczy,
    nieaktualna: tabela !== null && tabela.klucz !== klucz,
    wysokoscPvgis: dane?.dane.meta.wysokoscNpmM,
  }
}

export function PoleAzymutu({ wartosc, ustaw, tab }: { wartosc: string; ustaw: (v: string) => void; tab: ReturnType<typeof useTabelaNapromieniowania> }) {
  return (
    <section className="flex flex-col gap-3">
      <Pole
        label="Azymut paneli"
        unit="°"
        type="number"
        inputMode="decimal"
        min={0}
        max={360}
        value={wartosc}
        onChange={(e) => ustaw(e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="azymut" />}
      />
      <Button className="min-h-11" disabled={!tab.mozna} onClick={tab.policz}>
        {tab.liczy ? "Liczę nasłonecznienie dla kątów 0–90°…" : "Policz nasłonecznienie"}
      </Button>
      {tab.blad && <p className="text-small text-werdykt-blad-foreground">{tab.blad}</p>}
      {tab.nieaktualna && !tab.liczy && <StanPusty tytul="Zmieniła się lokalizacja lub azymut — policz ponownie." />}
    </section>
  )
}
