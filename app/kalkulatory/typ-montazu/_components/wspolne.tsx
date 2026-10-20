"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { BalastWarunki } from "@/components/wzorce/balast-warunki"
import { PrzelicznikTarcia } from "@/components/wzorce/przelicznik-tarcia"
import { WyborMetodyCf } from "@/components/wzorce/wybor-metody-cf"
import type { Warning } from "@/lib/core/calc-result"
import { KATEGORIE_TERENU, type KategoriaTerenu, type StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import type { PodejscieEc7 } from "@/lib/core/modules/pv/eurokod-7/przesuw"
import type { WarunekBalastu } from "@/lib/core/modules/pv/wiatr-powyzej-30/sila-i-balast"
import { useFormatLiczby, useFormaty, useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"

/** Short month names — `UI-MIESIAC-SKR-*` keys, render through `t()`. */
export const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-SKR-${i + 1}`)
/** Montaż-specific formatters on top of the shared roundings: a signed one-decimal value and a mass with the default precision. */
export function useFormatyMontazu() {
  const formatLiczbe = useFormatLiczby()
  const { f0, f1, f2 } = useFormaty()
  return {
    f0,
    f1,
    f2,
    fMasa: (x: number) => formatLiczbe(x),
    znak: (x: number) => (x > 0 ? "+" : x < 0 ? "−" : "") + f1(Math.abs(x)),
  }
}

/** Pole tekstowe → liczba albo `null` (puste/niepoprawne = nie wpisano, bez wartości domyślnej). */
export const n = (s: string) => liczba(s) ?? null

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
    <WerdyktPanel poziom="blad" etykieta={t("UI-TYPMON-COMWSP-SPRAWDZ-DANE")}>
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

export const OPIS_TERENU: Record<KategoriaTerenu, string> = {
  "0": "UI-TYPMON-COMWSP-MORZE",
  I: "UI-TYPMON-COMWSP-JEZIORA-TEREN-PLASKI",
  II: "UI-TYPMON-COMWSP-NISKA-ROSLINNOSC-POJEDYNCZE",
  III: "UI-TYPMON-COMWSP-III-WIES-PRZEDMIESCIA",
  IV: "UI-TYPMON-COMWSP-MIASTO-MIN-ZABUDOWY",
}

/** Pola wiatru PN-EN 1991-1-4 — te same co M3/E9 (strefa NA.1, teren NA.3, φ z 7.3). */
export function PolaWiatru({ s, ustaw, wysokoscPvgis }: { s: WiatrSeed; ustaw: (p: keyof WiatrSeed, v: string) => void; wysokoscPvgis?: number }) {
  const t = useTranslate()
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-semibold">{t("UI-TYPMON-COMWSP-WIATR-MIEJSCU-MONTAZU")}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <PoleSelect
          label={t("UI-TYPMON-COMWSP-STREFA-WIATROWA")}
          value={s.strefa}
          onChange={(e) => ustaw("strefa", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="strefa" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="1">{t("UI-TYPMON-COMWSP-STREFA")}</option>
          <option value="2">{t("UI-TYPMON-COMWSP-STREFA-2")}</option>
          <option value="3">{t("UI-TYPMON-COMWSP-STREFA-3")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-TYPMON-COMWSP-WYSOKOSC-TERENU")}
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
        label={t("UI-TYPMON-COMWSP-TEREN-WOKOL-KATEGORIA")}
        value={s.kategoria}
        onChange={(e) => ustaw("kategoria", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="teren" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {KATEGORIE_TERENU.map((k) => (
          <option key={k} value={k}>
            {t(OPIS_TERENU[k])}
          </option>
        ))}
      </PoleSelect>
      <Pole
        label={t("UI-TYPMON-COMWSP-ZABUDOWA-POD-STELAZEM")}
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

export type StelazSeed = { dlugoscWzdluzSpaduM: string; szerokoscStelazaM: string; wysokoscDolnejKrawedziM: string; masaPaneliStelazaKg: string; wspolczynnikTarcia: string; glebokoscPodstawyM: string; metodaCf?: string }
export const STELAZ_PUSTY: StelazSeed = { dlugoscWzdluzSpaduM: "", szerokoscStelazaM: "", wysokoscDolnejKrawedziM: "", masaPaneliStelazaKg: "", wspolczynnikTarcia: "", glebokoscPodstawyM: "", metodaCf: "" }

export function stelazZSeeda(s: StelazSeed) {
  return {
    dlugoscWzdluzSpaduM: n(s.dlugoscWzdluzSpaduM),
    szerokoscStelazaM: n(s.szerokoscStelazaM),
    wysokoscDolnejKrawedziM: n(s.wysokoscDolnejKrawedziM),
    // Drafts saved before D29 (28.09.2026) have no mass — treat as empty.
    masaPaneliStelazaKg: n(s.masaPaneliStelazaKg ?? ""),
    // Drafts saved before the stability check have no friction / footprint depth — treat as empty.
    wspolczynnikTarcia: n(s.wspolczynnikTarcia ?? ""),
    glebokoscPodstawyM: n(s.glebokoscPodstawyM ?? ""),
    // Drafts saved before D101 have no method — linear.
    metodaCf: s.metodaCf === "trend" ? ("trend" as const) : ("liniowa" as const),
  }
}

/** Ballast for each condition with the governing one highlighted, or a hint what to enter when only uplift was checked. */
export function BalastSkladniki({ w, t, f }: { w: { statecznosc: boolean; balastOderwanieKg: number | null; balastPrzesuwKg: number | null; balastPrzewracanieKg: number | null; warunekRozstrzygajacy: WarunekBalastu | null; podejscieEc7Przesuw: PodejscieEc7 | null }; t: (kod: string, params?: Record<string, string | number>) => string; f: (x: number) => string }) {
  return (
    <li>
      <BalastWarunki
        warunki={{ oderwanie: w.balastOderwanieKg, przesuw: w.balastPrzesuwKg, przewracanie: w.balastPrzewracanieKg }}
        rozstrzyga={w.warunekRozstrzygajacy}
        t={t}
        f={f}
        oderwanieNieDotyczy={w.balastOderwanieKg === null}
        podejscieEc7={w.podejscieEc7Przesuw}
      />
      {!w.statecznosc && <p className="text-small text-muted-foreground">{t("UI-TYPMON-COMWSP-BALAST-TYLKO-ODERWANIE")}</p>}
    </li>
  )
}

/** Result suffix: the ballast is on top of the entered panels + frame weight (D29). */
export function dopiskMasyWlasnej(s: StelazSeed, t: (kod: string, params?: Record<string, string | number>) => string, f: (x: number) => string): string {
  const masa = n(s.masaPaneliStelazaKg ?? "")
  return masa === null ? "" : " " + t("UI-TYPMON-COMWSP-PONAD-CIEZAR", { masa: f(masa) })
}

export function PolaStelaza({ s, ustaw, poleKrawedzi }: { s: StelazSeed; ustaw: (p: keyof StelazSeed, v: string) => void; poleKrawedzi: "krawedzRegulowany" | "krawedzDachPlaski" }) {
  const t = useTranslate()
  const { f2 } = useFormaty()
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Pole
        label={t("UI-TYPMON-COMWSP-DLUGOSC-WZDLUZ-SPADKU")}
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.dlugoscWzdluzSpaduM}
        onChange={(e) => ustaw("dlugoscWzdluzSpaduM", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="dlugoscL" />}
      />
      <Pole
        label={t("UI-TYPMON-COMWSP-SZEROKOSC-STELAZA")}
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.szerokoscStelazaM}
        onChange={(e) => ustaw("szerokoscStelazaM", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="szerokosc" />}
      />
      <Pole
        label={t("UI-TYPMON-COMWSP-DOLNA-KRAWEDZ-NAD")}
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.wysokoscDolnejKrawedziM}
        onChange={(e) => ustaw("wysokoscDolnejKrawedziM", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole={poleKrawedzi} />}
      />
      <Pole
        label={t("UI-TYPMON-COMWSP-MASA-PANELI-STELAZA")}
        unit="kg"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.masaPaneliStelazaKg ?? ""}
        onChange={(e) => ustaw("masaPaneliStelazaKg", e.target.value)}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="masa" />}
      />
      <Pole
        label={t("UI-TYPMON-COMWSP-TARCIE")}
        type="number"
        inputMode="decimal"
        min={0}
        step={0.05}
        value={s.wspolczynnikTarcia ?? ""}
        onChange={(e) => ustaw("wspolczynnikTarcia", e.target.value)}
        pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="tarcie" />}
      />
      <Pole
        label={t("UI-TYPMON-COMWSP-GLEBOKOSC-PODSTAWY")}
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        value={s.glebokoscPodstawyM ?? ""}
        onChange={(e) => ustaw("glebokoscPodstawyM", e.target.value)}
        pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="glebokoscPodstawy" />}
      />
      <div className="sm:col-span-3">
        <PrzelicznikTarcia onUzyj={(mu) => ustaw("wspolczynnikTarcia", String(mu))} />
      </div>
      <div className="sm:col-span-3">
        <WyborMetodyCf metoda={s.metodaCf === "trend" ? "trend" : "liniowa"} onChange={(m) => ustaw("metodaCf", m)} t={t} f={f2} />
      </div>
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
  const t = useTranslate()
  return (
    <section className="flex flex-col gap-3">
      <Pole
        label={t("UI-TYPMON-COMWSP-AZYMUT-PANELI")}
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
        {tab.liczy ? t("UI-TYPMON-COMWSP-LICZE-NASLONECZNIENIE-KATOW") : t("UI-TYPMON-COMWSP-POLICZ-NASLONECZNIENIE")}
      </Button>
      {tab.blad && <p className="text-small text-werdykt-blad-foreground">{tab.blad}</p>}
      {tab.nieaktualna && !tab.liczy && <StanPusty tytul={t("UI-TYPMON-COMWSP-ZMIENILA-LOKALIZACJA-AZYMUT")} />}
    </section>
  )
}
