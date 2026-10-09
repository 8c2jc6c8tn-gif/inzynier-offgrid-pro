"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { RankingKatalogu } from "@/components/porownywarka-paneli/ranking"
import { ZestawyPorownan } from "@/components/porownywarka-paneli/zestawy"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useZuzycieMiesieczne } from "@/components/siec/zuzycie-miesieczne"
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import { KRYTERIA, MAKS_PANELI_W_ZESTAWIE, MIESIACE_ZIMOWE_POROWNYWARKI, type KryteriumId } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import { calculatePorownywarkaPaneli, type ScenariuszWiecejPaneli, type WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { useSymbolWaluty, useTranslate } from "@/lib/i18n/language-context"
import type { ProfilSprzetuPanelu } from "@/lib/profil-sprzetu/types"
import { useProfilSprzetu } from "@/lib/profil-sprzetu/use-profil-sprzetu"
import {
  aktywneMiejsce,
  budujWejscie,
  kolejnyId,
  KWOTY,
  MIEJSCE_PUSTE,
  migrujStarySzkic,
  PANEL_PUSTY,
  seedZDanych,
  seedZKatalogu,
  STAN_POCZATKOWY,
  type FormularzStan,
  type MiejsceSeed,
  type PanelSeed,
  type RodzajWyceny,
} from "@/lib/porownywarka-paneli/stan"
import { liczba, powierzchnieZModelu } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

type Zakladka = "miesiace" | "oplacalnosc" | "wiecej" | "nadwyzka" | "miejsca" | "gwiazdki" | "zalozenia"
const ZAKLADKI: Zakladka[] = ["miesiace", "oplacalnosc", "wiecej", "nadwyzka", "miejsca", "gwiazdki", "zalozenia"]

/** Name suggestions for an installation place (U19) — translated keys, offered through a datalist. */
const PODPOWIEDZI_MIEJSC = ["UI-PORP-MIEJSCE-POD-1", "UI-PORP-MIEJSCE-POD-2", "UI-PORP-MIEJSCE-POD-3", "UI-PORP-MIEJSCE-POD-4", "UI-PORP-MIEJSCE-POD-5", "UI-PORP-MIEJSCE-POD-6", "UI-PORP-MIEJSCE-POD-7", "UI-PORP-MIEJSCE-POD-8"]
const ETYKIETY_ZAKLADEK: Record<Zakladka, string> = {
  miesiace: "UI-PORP-TAB-MIESIACE",
  oplacalnosc: "UI-PORP-TAB-OPLACALNOSC",
  wiecej: "UI-PORP-TAB-WIECEJ",
  nadwyzka: "UI-PORP-TAB-NADWYZKA",
  miejsca: "UI-PORP-TAB-MIEJSCA",
  gwiazdki: "UI-PORP-TAB-GWIAZDKI",
  zalozenia: "UI-PORP-TAB-ZALOZENIA",
}

const KOLOR_SERII = ["var(--seria-1)", "var(--seria-2)", "var(--seria-3)", "var(--seria-4)"]

/** Rounds the axis maximum up to 1, 2 or 5 × 10^k so the grid labels are readable numbers. */
function ladnyMaks(x: number): number {
  if (x <= 0) return 1
  const rzad = 10 ** Math.floor(Math.log10(x))
  const m = x / rzad
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * rzad
}

/** Grouped monthly bars (one bar per panel), winter months highlighted. Colour never carries identity alone: legend + table view. */
function WykresMiesiecy({ panele }: { panele: WynikPanelu[] }) {
  const t = useTranslate()
  const W = 360
  const H = 170
  const lewy = 34
  const dol = 20
  const gora = 8
  const maks = ladnyMaks(Math.max(...panele.flatMap((p) => p.miesiaceKwh)))
  const gw = (W - lewy - 4) / 12
  const n = panele.length
  const bw = Math.min(12, (gw - 4 - (n - 1) * 2) / n)
  const y = (v: number) => H - dol - (v / maks) * (H - dol - gora)
  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-foreground" role="img" aria-label={t("UI-PORP-WYKRES")}>
        {MIESIACE_ZIMOWE_POROWNYWARKI.map((m) => (
          <rect key={m} x={lewy + m * gw} y={gora} width={gw} height={H - dol - gora} className="fill-foreground" opacity={0.08} />
        ))}
        {[0, 0.5, 1].map((u) => (
          <g key={u}>
            <line x1={lewy} x2={W - 4} y1={y(u * maks)} y2={y(u * maks)} className="stroke-border" strokeWidth={0.5} opacity={0.6} />
            <text x={lewy - 4} y={y(u * maks) + 3} textAnchor="end" className="fill-muted-foreground text-[9px]">
              {f0(u * maks)}
            </text>
          </g>
        ))}
        {Array.from({ length: 12 }, (_, m) => {
          const szer = n * bw + (n - 1) * 2
          const x0 = lewy + m * gw + (gw - szer) / 2
          return (
            <g key={m}>
              {panele.map((p, i) => {
                const v = p.miesiaceKwh[m]!
                return <rect key={p.id} x={x0 + i * (bw + 2)} y={y(v)} width={bw} height={Math.max(0, H - dol - y(v))} rx={2} style={{ fill: KOLOR_SERII[i] }} />
              })}
              <text x={lewy + m * gw + gw / 2} y={H - 6} textAnchor="middle" className="fill-muted-foreground text-[9px]">
                {t(`UI-MIESIAC-SKR-${m + 1}`)}
              </text>
              <rect x={lewy + m * gw} y={gora} width={gw} height={H - dol - gora} className="fill-transparent">
                <title>{`${t(`UI-MIESIAC-SKR-${m + 1}`)}: ${panele.map((p) => `${p.nazwa} ${f1(p.miesiaceKwh[m]!)} kWh`).join(" · ")}`}</title>
              </rect>
            </g>
          )
        })}
      </svg>
      <figcaption className="flex flex-col gap-1 text-small">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {panele.map((p, i) => (
            <li key={p.id} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: KOLOR_SERII[i] }} aria-hidden="true" />
              {p.nazwa}
            </li>
          ))}
          <li className="flex items-center gap-1.5 text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded-sm border bg-foreground/10" aria-hidden="true" />
            {t("UI-PORP-WYKRES-ZIMA")}
          </li>
        </ul>
        <span className="text-caption text-muted-foreground">{t("UI-PORP-WYKRES-PODPIS")}</span>
      </figcaption>
      <details>
        <summary className="cursor-pointer text-small underline">{t("UI-PORP-TABELA")}</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="text-left">
                <th className="p-1" />
                {panele.map((p) => (
                  <th key={p.id} className="p-1 font-medium">
                    {p.nazwa}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, m) => (
                <tr key={m} className={MIESIACE_ZIMOWE_POROWNYWARKI.includes(m) ? "bg-muted/60" : ""}>
                  <th className="p-1 text-left font-normal">{t(`UI-MIESIAC-${m + 1}`)}</th>
                  {panele.map((p) => (
                    <td key={p.id} className="p-1 tabular-nums">
                      {f1(p.miesiaceKwh[m]!)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}

export default function PorownywarkaPaneliPage() {
  const t = useTranslate()
  const waluta = useSymbolWaluty()
  const { skaner, lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("porownywarka-paneli", STAN_POCZATKOWY, KWOTY)
  const { zuzycie } = useZuzycieMiesieczne("dom")
  const [zakladka, setZakladka] = useState<Zakladka>("miesiace")
  const { profil, zapiszPanel } = useProfilSprzetu()
  /** U14: saving the primary panel is always asked first, never automatic. */
  const [doZapisuId, setDoZapisuId] = useState<string | null>(null)
  const [zapisanoId, setZapisanoId] = useState<string | null>(null)
  const ustaw = <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))
  /** Edits the active place (U19): every field of step 1 belongs to the place, not to the form. */
  const ustawMiejsce = <K extends keyof MiejsceSeed>(pole: K, v: MiejsceSeed[K]) =>
    setStan((prev) => {
      const id = aktywneMiejsce(prev).id
      return { ...prev, miejsca: prev.miejsca.map((m) => (m.id === id ? { ...m, [pole]: v } : m)) }
    })
  const ustawPanel = (id: string, z: Partial<PanelSeed>) =>
    setStan((prev) => ({
      ...prev,
      panele: prev.panele.map((p) => {
        if (p.id !== id) return p
        // A hand-edited datasheet number no longer matches the catalogue card, so the card stops being shown as its source.
        const zmienionaDana = (["moc", "gamma", "noct", "spr200", "deg1", "degLin", "dlugosc", "szerokosc", "masa"] as const).some((k) => k in z && z[k] !== p[k])
        return { ...p, ...z, ...(zmienionaDana && !("katalogId" in z) ? { katalogId: "" } : {}) }
      }),
    }))

  // A draft saved before A2 kept the angles and the number of panels on the form itself (one place) — move them into place 1.
  useEffect(() => {
    const przeniesiony = migrujStarySzkic(stan)
    if (przeniesiony) setStan(przeniesiony)
  }, [stan, setStan])

  const miejsce = aktywneMiejsce(stan)
  const powierzchnie = useMemo(() => powierzchnieZModelu(skaner.value), [skaner.value])

  const wejscie = useMemo(() => budujWejscie({ stan, miejsce: aktywneMiejsce(stan), lokalizacja, dane, zuzycie, t }), [stan, lokalizacja, dane, zuzycie, t])

  /** The same panels in every saved place (U18) — computed only while that tab is open. */
  const wynikiMiejsc = useMemo(
    () =>
      zakladka === "miejsca"
        ? stan.miejsca.map((m) => ({ id: m.id, wynik: calculatePorownywarkaPaneli(budujWejscie({ stan, miejsce: m, lokalizacja, dane, zuzycie, t })) }))
        : [],
    [zakladka, stan, lokalizacja, dane, zuzycie, t],
  )

  const result = useMemo(() => calculatePorownywarkaPaneli(wejscie), [wejscie])

  if (!wczytano) return <StanLadowania linie={6} />

  const v = result.value
  const brakTemperaturyWDanych = dane !== null && !dane.dane.rekordy.some((r) => r.tempC !== undefined)
  const nazwaPanelu = (id: string) => v.panele.find((p) => p.id === id)?.nazwa ?? ""
  const wynikGotowy = result.status === "VALID" || result.status === "VALID_WITH_WARNINGS"

  function wybierzPowierzchnie(id: string) {
    const p = powierzchnie.find((x) => x.id === id)
    ustawMiejsce("powierzchniaId", id)
    if (p) {
      ustawMiejsce("nachylenie", String(p.nachylenieDeg))
      ustawMiejsce("azymut", String(p.azymutDeg))
    }
  }

  const nazwaMiejsca = (m: MiejsceSeed) => m.nazwa.trim() || t("UI-PORP-MIEJSCE-N", { n: stan.miejsca.findIndex((x) => x.id === m.id) + 1 })

  function dodajMiejsce() {
    setStan((prev) => {
      const id = kolejnyId("m", prev.miejsca)
      return { ...prev, miejsca: [...prev.miejsca, MIEJSCE_PUSTE(id)], aktywneMiejsceId: id }
    })
  }

  function usunMiejsce() {
    setStan((prev) => {
      if (prev.miejsca.length < 2) return prev
      const id = aktywneMiejsce(prev).id
      const reszta = prev.miejsca.filter((m) => m.id !== id)
      return { ...prev, miejsca: reszta, aktywneMiejsceId: reszta[0]!.id }
    })
  }

  function wstawZKatalogu(idPanelu: string, idKatalogu: string) {
    const k = KATALOG_PANELI_PV.find((x) => x.id === idKatalogu)
    if (k) ustawPanel(idPanelu, seedZKatalogu(k))
  }

  /** Ranking → comparison: the chosen catalogue panels replace the panel list (a price already typed for the same panel stays). */
  function wstawZRankingu(idKatalogu: string[]) {
    setStan((prev) => ({
      ...prev,
      panele: idKatalogu.flatMap((id, i) => {
        const k = KATALOG_PANELI_PV.find((x) => x.id === id)
        if (!k) return []
        return [{ ...PANEL_PUSTY(`p${i + 1}`), ...seedZKatalogu(k), cena: prev.panele.find((x) => x.katalogId === id)?.cena ?? "" }]
      }),
    }))
  }

  function dodajPanel() {
    setStan((prev) => ({ ...prev, panele: [...prev.panele, PANEL_PUSTY(kolejnyId("p", prev.panele))] }))
  }

  /** The primary panel saved in the equipment profile goes into the comparison as one more panel (U14, the way back). */
  function dodajPanelPodstawowy() {
    const pod = profil.panel
    if (!pod) return
    setStan((prev) => ({ ...prev, panele: [...prev.panele, { ...PANEL_PUSTY(kolejnyId("p", prev.panele)), ...seedZDanych(pod.podstawowy, pod.katalogId ?? "") }] }))
  }

  /** Only after the user confirmed: a snapshot of the panel (without the price) goes to the equipment profile. */
  function zapiszJakoPodstawowy(id: string) {
    const dane = wejscie.panele.find((p) => p.id === id)
    if (!dane) return
    const bezCeny: Partial<typeof dane> = { ...dane }
    delete bezCeny.cenaBruttoZl
    zapiszPanel({ podstawowy: bezCeny as ProfilSprzetuPanelu["podstawowy"], katalogId: stan.panele.find((p) => p.id === id)?.katalogId || null, zapisanoIso: new Date().toISOString() })
    setDoZapisuId(null)
    setZapisanoId(id)
  }

  /** "o 12,3 kWh więcej" / "o 4,5 kWh mniej" — the sign sits in the wording, so the year and the winter may differ in direction. */
  const roznicaKwhTekst = (x: number) => t(x >= 0 ? "UI-PORP-SC-WIECEJ" : "UI-PORP-SC-MNIEJ", { kwh: f1(Math.abs(x)) })
  const roznicaZlTekst = (x: number) => t(x >= 0 ? "UI-PORP-SC-ZL-WIECEJ" : "UI-PORP-SC-ZL-MNIEJ", { zl: f0(Math.abs(x)), waluta })
  const najlepszyScenariusz: ScenariuszWiecejPaneli | null =
    v.scenariusze.filter((x) => x.dodatkowePanele > 0).sort((a, b) => b.przewagaZimaKwh - a.przewagaZimaKwh)[0] ?? null
  const panelZNadwyzka = v.panele.find((p) => p.id === v.roznicaZimowa?.liderId) ?? v.panele[0] ?? null

  const naglowekWyniku = (() => {
    if (!v.roznicaZimowa) return t("UI-PORP-GC-JEDEN-PANEL")
    const r = v.roznicaZimowa
    return t("UI-PORP-GC-ZIMA", { lider: nazwaPanelu(r.liderId), drugi: nazwaPanelu(r.drugiId), kwh: f1(r.roznicaKwh) })
  })()

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/porownywarka-paneli" />
      <NaglowekEkranu tytul={t("UI-PORP-TYTUL")} ekran="porownywarka-paneli" wynik={wynikGotowy ? result : null}>
        {t("UI-PORP-OPIS")}
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />
      {brakTemperaturyWDanych && (
        <p role="status" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small text-werdykt-uwaga-foreground">
          {t("UI-PORP-TEMP-BRAK")}
        </p>
      )}

      <ZestawyPorownan stan={stan} onWczytaj={(zapisany) => setStan(zapisany)} />

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-PORP-KROK-MIEJSCE")}</h2>
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <PoleSelect
            label={t("UI-PORP-MIEJSCE-AKTYWNE")}
            value={miejsce.id}
            onChange={(e) => ustaw("aktywneMiejsceId", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="miejsceWybor" />}
          >
            {stan.miejsca.map((m) => (
              <option key={m.id} value={m.id}>
                {nazwaMiejsca(m)}
              </option>
            ))}
          </PoleSelect>
          <Pole
            label={t("UI-PORP-MIEJSCE-NAZWA")}
            type="text"
            list="porp-nazwy-miejsc"
            value={miejsce.nazwa}
            onChange={(e) => ustawMiejsce("nazwa", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="miejsceNazwa" />}
          />
          <datalist id="porp-nazwy-miejsc">
            {PODPOWIEDZI_MIEJSC.map((k) => (
              <option key={k} value={t(k)} />
            ))}
          </datalist>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="min-h-11" onClick={dodajMiejsce}>
              {t("UI-PORP-MIEJSCE-DODAJ")}
            </Button>
            {stan.miejsca.length > 1 && (
              <Button variant="outline" className="min-h-11" onClick={usunMiejsce}>
                {t("UI-PORP-MIEJSCE-USUN")}
              </Button>
            )}
          </div>
        </div>
        {powierzchnie.length > 0 && (
          <PoleSelect
            label={t("UI-PORP-MIEJSCE-Z-PROJEKTU")}
            value={miejsce.powierzchniaId}
            onChange={(e) => wybierzPowierzchnie(e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="miejsce" />}
          >
            <option value="">{t("UI-PORP-MIEJSCE-WLASNE")}</option>
            {powierzchnie.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.nazwa} (${p.nachylenieDeg}°, ${p.azymutDeg}°)`}
              </option>
            ))}
          </PoleSelect>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-PORP-NACHYLENIE")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={90}
            step="any"
            value={miejsce.nachylenie}
            onChange={(e) => ustawMiejsce("nachylenie", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="nachylenie" />}
          />
          <Pole
            label={t("UI-PORP-AZYMUT")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={360}
            step="any"
            value={miejsce.azymut}
            onChange={(e) => ustawMiejsce("azymut", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="azymut" />}
          />
        </div>
        <Pole
          label={t("UI-PORP-ALBEDO")}
          type="number"
          inputMode="decimal"
          min={0}
          max={1}
          step="any"
          value={miejsce.albedo}
          onChange={(e) => ustawMiejsce("albedo", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="albedo" />}
        />
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-PORP-ALBEDO-PODPIS")}</p>
        <Pole
          label={t("UI-PORP-LICZBA")}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={miejsce.liczbaPaneli}
          onChange={(e) => ustawMiejsce("liczbaPaneli", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="liczbaPaneli" />}
        />
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-PORP-LICZBA-PODPIS")}</p>
        <fieldset className="flex flex-col gap-3 rounded-lg border p-4">
          <legend className="px-1 text-small font-medium">{t("UI-PORP-WYM-TYTUL")}</legend>
          <div className="grid grid-cols-3 gap-3">
            <Pole
              label={t("UI-PORP-WYM-DLUGOSC")}
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={miejsce.wymDlugosc}
              onChange={(e) => ustawMiejsce("wymDlugosc", e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="miejsceDlugosc" />}
            />
            <Pole
              label={t("UI-PORP-WYM-SZEROKOSC")}
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={miejsce.wymSzerokosc}
              onChange={(e) => ustawMiejsce("wymSzerokosc", e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="miejsceSzerokosc" />}
            />
            <Pole
              label={t("UI-PORP-WYM-MARGINES")}
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={miejsce.wymMargines}
              onChange={(e) => ustawMiejsce("wymMargines", e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="miejsceMargines" />}
            />
          </div>
          <PoleSelect
            label={t("UI-PORP-WYM-MONTAZ")}
            value={miejsce.montaz}
            onChange={(e) => ustawMiejsce("montaz", e.target.value as MiejsceSeed["montaz"])}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="montaz" />}
          >
            <option value="rownolegly">{t("UI-PORP-MONTAZ-ROWNOLEGLY")}</option>
            <option value="pochylony-na-konstrukcji">{t("UI-PORP-MONTAZ-POCHYLONY")}</option>
          </PoleSelect>
          {miejsce.montaz === "pochylony-na-konstrukcji" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Pole
                  label={t("UI-PORP-OKNO-OD")}
                  unit="h"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={24}
                  step="any"
                  placeholder="9"
                  value={miejsce.oknoOd ?? ""}
                  onChange={(e) => ustawMiejsce("oknoOd", e.target.value)}
                  pomoc={<PomocPola ekran="porownywarka-paneli" pole="oknoOdstepu" />}
                />
                <Pole
                  label={t("UI-PORP-OKNO-DO")}
                  unit="h"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={24}
                  step="any"
                  placeholder="15"
                  value={miejsce.oknoDo ?? ""}
                  onChange={(e) => ustawMiejsce("oknoDo", e.target.value)}
                  pomoc={<PomocPola ekran="porownywarka-paneli" pole="oknoOdstepu" />}
                />
              </div>
              <p className="text-caption text-muted-foreground">{t("UI-PORP-OKNO-PODPIS")}</p>
            </>
          )}
          <p className="text-caption text-muted-foreground">{t("UI-PORP-WYM-PODPIS")}</p>
        </fieldset>
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <PoleCheckbox
                id="uzyj-zuzycia"
                label={t("UI-PORP-ZUZYCIE-UZYJ")}
                checked={stan.uzyjZuzycia}
                onChange={(e) => ustaw("uzyjZuzycia", e.target.checked)}
              />
            </div>
            <PomocPola ekran="porownywarka-paneli" pole="uzyjZuzycia" />
          </div>
          {stan.uzyjZuzycia &&
            (zuzycie ? (
              <p className="text-caption text-muted-foreground">{t("UI-PORP-ZUZYCIE-JEST", { kwh: f0(zuzycie.reduce((a, b) => a + b, 0)) })}</p>
            ) : (
              <p role="status" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small text-werdykt-uwaga-foreground">
                {t("UI-PORP-ZUZYCIE-BRAK")}{" "}
                <Link href="/kalkulatory/zuzycie-miesieczne" className="underline">
                  {t("UI-PORP-ZUZYCIE-LINK")}
                </Link>
              </p>
            ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-PORP-KROK-PANELE")}</h2>
        <RankingKatalogu
          szerokosc={lokalizacja?.szerokosc}
          dlugosc={lokalizacja?.dlugosc}
          dane={dane?.dane.rekordy}
          miejsce={wejscie.miejsce}
          wymiary={wejscie.wymiaryMiejsca ?? null}
          maks={MAKS_PANELI_W_ZESTAWIE}
          onWstaw={wstawZRankingu}
        />
        {profil.panel && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-small">
            <span className="flex-1">{t("UI-PORP-PODSTAWOWY-JEST", { nazwa: profil.panel.podstawowy.nazwa })}</span>
            <Button variant="outline" className="min-h-11" disabled={stan.panele.length >= MAKS_PANELI_W_ZESTAWIE} onClick={dodajPanelPodstawowy}>
              {t("UI-PORP-PODSTAWOWY-DODAJ")}
            </Button>
          </div>
        )}
        {stan.panele.map((p, i) => (
          <fieldset key={p.id} className="flex flex-col gap-3 rounded-lg border p-4">
            <legend className="px-1 text-small font-medium">{t("UI-PORP-PANEL-N", { n: i + 1 })}</legend>
            <PoleSelect
              label={t("UI-PORP-Z-KATALOGU")}
              value=""
              onChange={(e) => wstawZKatalogu(p.id, e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="katalog" />}
            >
              <option value="">{t("UI-PORP-KATALOG-WYBIERZ")}</option>
              {KATALOG_PANELI_PV.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nazwa}
                </option>
              ))}
            </PoleSelect>
            {p.katalogId !== "" && (
              <ul className="-mt-1 flex flex-col gap-1 text-small">
                {(KATALOG_PANELI_PV.find((k) => k.id === p.katalogId)?.kartaObrazy ?? []).map((obraz, n, wszystkie) => (
                  <li key={obraz}>
                    <a href={obraz} target="_blank" rel="noopener noreferrer" className="underline">
                      {wszystkie.length > 1 ? t("UI-PORP-KARTA-STRONA", { n: n + 1 }) : t("UI-PORP-KARTA-ZOBACZ")}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <Pole
              label={t("UI-PORP-NAZWA")}
              type="text"
              value={p.nazwa}
              onChange={(e) => ustawPanel(p.id, { nazwa: e.target.value })}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="nazwa" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Pole
                label={t("UI-PORP-MOC")}
                unit="W"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={p.moc}
                onChange={(e) => ustawPanel(p.id, { moc: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="moc" />}
              />
              <Pole
                label={t("UI-PORP-CENA")}
                unit={waluta}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={p.cena}
                onChange={(e) => ustawPanel(p.id, { cena: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="cena" />}
              />
              <Pole
                label={t("UI-PORP-GAMMA")}
                unit="%/°C"
                type="number"
                inputMode="decimal"
                step="any"
                value={p.gamma}
                onChange={(e) => ustawPanel(p.id, { gamma: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="gamma" />}
              />
              <Pole
                label={t("UI-PORP-NOCT")}
                unit="°C"
                type="number"
                inputMode="decimal"
                step="any"
                value={p.noct}
                onChange={(e) => ustawPanel(p.id, { noct: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="noct" />}
              />
              <Pole
                label={t("UI-PORP-SPR200")}
                unit="%"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step="any"
                value={p.spr200}
                onChange={(e) => ustawPanel(p.id, { spr200: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="sprawnosc200" />}
              />
              <Pole
                label={t("UI-PORP-DEG1")}
                unit="%"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={p.deg1}
                onChange={(e) => ustawPanel(p.id, { deg1: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="degradacja1" />}
              />
              <Pole
                label={t("UI-PORP-DEGLIN")}
                unit={t("UI-J-PROC-ROK")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={p.degLin}
                onChange={(e) => ustawPanel(p.id, { degLin: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="degradacjaLiniowa" />}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Pole
                label={t("UI-PORP-DLUGOSC-PANELU")}
                unit="mm"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={p.dlugosc}
                onChange={(e) => ustawPanel(p.id, { dlugosc: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="dlugoscPanelu" />}
              />
              <Pole
                label={t("UI-PORP-SZEROKOSC-PANELU")}
                unit="mm"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={p.szerokosc}
                onChange={(e) => ustawPanel(p.id, { szerokosc: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="szerokoscPanelu" />}
              />
              <Pole
                label={t("UI-PORP-MASA-PANELU")}
                unit="kg"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={p.masa}
                onChange={(e) => ustawPanel(p.id, { masa: e.target.value })}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="masaPanelu" />}
              />
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PoleCheckbox
                  id={`bifacjalny-${p.id}`}
                  label={t("UI-PORP-BIFACJALNY")}
                  hint={t("UI-PORP-BIFACJALNY-PODPIS")}
                  checked={p.bifacjalny}
                  onChange={(e) => ustawPanel(p.id, { bifacjalny: e.target.checked })}
                />
              </div>
              <PomocPola ekran="porownywarka-paneli" pole="bifacjalny" />
            </div>
            {stan.panele.length > 1 && (
              <Button
                variant="outline"
                className="min-h-11 self-start"
                onClick={() => setStan((prev) => ({ ...prev, panele: prev.panele.filter((x) => x.id !== p.id) }))}
              >
                {t("UI-PORP-USUN")}
              </Button>
            )}
          </fieldset>
        ))}
        {stan.panele.length < MAKS_PANELI_W_ZESTAWIE ? (
          <Button variant="outline" className="min-h-11 self-start" onClick={dodajPanel}>
            {t("UI-PORP-DODAJ")}
          </Button>
        ) : (
          <p className="text-small text-muted-foreground">{t("UI-PORP-MAKS-PANELI")}</p>
        )}

        <PoleSelect
          label={t("UI-PORP-WYCENA-RODZAJ")}
          value={stan.wycena}
          onChange={(e) => ustaw("wycena", e.target.value as RodzajWyceny)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="wycenaRodzaj" />}
        >
          <option value="">{t("UI-PORP-WYCENA-BEZ")}</option>
          <option value="siec">{t("UI-PORP-WYCENA-SIEC")}</option>
          <option value="dzienNoc">{t("UI-PORP-WYCENA-DZIENNOC")}</option>
          <option value="agregat">{t("UI-PORP-WYCENA-AGREGAT")}</option>
          <option value="reczna">{t("UI-PORP-WYCENA-RECZNA")}</option>
        </PoleSelect>
        {(stan.wycena === "siec" || stan.wycena === "reczna") && (
          <Pole
            label={t("UI-PORP-STAWKA")}
            unit={`${waluta}/kWh`}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={stan.stawka}
            onChange={(e) => ustaw("stawka", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="stawka" />}
          />
        )}
        {stan.wycena === "dzienNoc" && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 items-end gap-3">
              <Pole
                label={t("UI-PORP-CENA-DZIEN")}
                unit={`${waluta}/kWh`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={stan.cenaDzien}
                onChange={(e) => ustaw("cenaDzien", e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="stawkaDzien" />}
              />
              <Pole
                label={t("UI-PORP-CENA-NOC")}
                unit={`${waluta}/kWh`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={stan.cenaNoc}
                onChange={(e) => ustaw("cenaNoc", e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="stawkaNoc" />}
              />
              <Pole
                label={t("UI-PORP-OKNO1-OD")}
                unit="h"
                type="number"
                inputMode="numeric"
                min={0}
                max={24}
                step={1}
                value={stan.okno1Od}
                onChange={(e) => ustaw("okno1Od", e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="strefaTania" />}
              />
              <Pole
                label={t("UI-PORP-OKNO1-DO")}
                unit="h"
                type="number"
                inputMode="numeric"
                min={0}
                max={24}
                step={1}
                value={stan.okno1Do}
                onChange={(e) => ustaw("okno1Do", e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="strefaTania" />}
              />
              <Pole
                label={t("UI-PORP-OKNO2-OD")}
                unit="h"
                type="number"
                inputMode="numeric"
                min={0}
                max={24}
                step={1}
                value={stan.okno2Od}
                onChange={(e) => ustaw("okno2Od", e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="strefaTania" />}
              />
              <Pole
                label={t("UI-PORP-OKNO2-DO")}
                unit="h"
                type="number"
                inputMode="numeric"
                min={0}
                max={24}
                step={1}
                value={stan.okno2Do}
                onChange={(e) => ustaw("okno2Do", e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="strefaTania" />}
              />
            </div>
            {[
              [stan.okno1Od, stan.okno1Do],
              [stan.okno2Od, stan.okno2Do],
            ].some(([od, do_]) => (liczba(od!) === undefined) !== (liczba(do_!) === undefined)) && (
              <p role="alert" className="text-small text-werdykt-blad-foreground">
                {t("UI-PORP-OKNO-NIEKOMPLETNE")}
              </p>
            )}
            <p className="text-caption text-muted-foreground">{t("UI-PORP-STREFY-PODPIS")}</p>
          </div>
        )}
        {stan.wycena === "agregat" && (
          <div className="grid grid-cols-2 gap-3">
            <Pole
              label={t("UI-PORP-AGR-MOC")}
              unit="kW"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={stan.agrMoc}
              onChange={(e) => ustaw("agrMoc", e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="agregatMoc" />}
            />
            <Pole
              label={t("UI-PORP-AGR-OBC")}
              unit="%"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="any"
              value={stan.agrObc}
              onChange={(e) => ustaw("agrObc", e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="agregatObciazenie" />}
            />
            <Pole
              label={t("UI-PORP-AGR-LH")}
              unit="l/h"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={stan.agrLh}
              onChange={(e) => ustaw("agrLh", e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="agregatZuzycie" />}
            />
            <Pole
              label={t("UI-PORP-AGR-CENA")}
              unit={`${waluta}/l`}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={stan.agrCena}
              onChange={(e) => ustaw("agrCena", e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="agregatCena" />}
            />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-PORP-KROK-WYNIK")}</h2>
        {result.status === "INVALID_INPUT" ? (
          <WerdyktPanel poziom="blad" etykieta={t("UI-PORP-BLAD")}>
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : result.status === "INCOMPLETE" ? (
          <div className="flex flex-col gap-2">
            <p className="text-small text-muted-foreground">{t("UI-PORP-UZUPELNIJ")}</p>
            {result.warnings.length > 0 && <WynikSzczegoly assumptions={[]} warnings={result.warnings} />}
          </div>
        ) : (
          <>
            <WerdyktPanel poziom={result.status === "VALID" ? "ok" : "uwaga"} etykieta={t("UI-PORP-WERDYKT")}>
              <WynikGlowny>{naglowekWyniku}</WynikGlowny>
              {v.roznicaZimowa && (
                <p className="mt-1 text-small">
                  {v.roznicaZimowa.roznicaZl !== null && v.wycenaStrefowa !== null
                    ? t("UI-PORP-GC-ZIMA-ZL-STREFY", {
                        dzien: f2(v.wycenaStrefowa.zlKwhDzien),
                        noc: f2(v.wycenaStrefowa.zlKwhNoc),
                        zl: f0(v.roznicaZimowa.roznicaZl),
                      })
                    : v.roznicaZimowa.roznicaZl !== null && v.stawkaZlKwh !== null
                      ? t("UI-PORP-GC-ZIMA-ZL", { stawka: f2(v.stawkaZlKwh), zl: f0(v.roznicaZimowa.roznicaZl) })
                      : t("UI-PORP-GC-ZIMA-BRAK-STAWKI")}
                </p>
              )}
              {najlepszyScenariusz && (
                <p className="mt-1 text-small">
                  {t("UI-PORP-GC-WIECEJ", {
                    tanszy: nazwaPanelu(najlepszyScenariusz.tanszyId),
                    drozszy: nazwaPanelu(najlepszyScenariusz.drozszyId),
                    x: najlepszyScenariusz.dodatkowePanele,
                    zima: roznicaKwhTekst(najlepszyScenariusz.przewagaZimaKwh),
                  })}
                </p>
              )}
              {panelZNadwyzka && panelZNadwyzka.nadwyzkaRokKwh !== null && panelZNadwyzka.nadwyzkaRokKwh > 0 && panelZNadwyzka.nadwyzkaUlamek !== null && (
                <p className="mt-1 text-small">
                  {t("UI-PORP-GC-NADWYZKA", { kwh: f0(panelZNadwyzka.nadwyzkaRokKwh), proc: f0(panelZNadwyzka.nadwyzkaUlamek * 100) })}
                </p>
              )}
              <div className="mt-2 text-small">
                <p className="font-medium">{t("UI-PORP-ZAKRES-TYTUL")}</p>
                <ul className="list-disc pl-5">
                  <li>{t(v.zakresModelu.temperatura ? "UI-PORP-ZAKRES-TEMP-TAK" : "UI-PORP-ZAKRES-TEMP-NIE")}</li>
                  <li>{t(v.zakresModelu.slabeSwiatlo ? "UI-PORP-ZAKRES-SWIATLO-TAK" : "UI-PORP-ZAKRES-SWIATLO-NIE")}</li>
                </ul>
              </div>
              <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
            </WerdyktPanel>

            <div role="tablist" aria-label={t("UI-PORP-KROK-WYNIK")} className="flex flex-wrap gap-2">
              {ZAKLADKI.map((z) => (
                <Button
                  key={z}
                  role="tab"
                  aria-selected={z === zakladka}
                  variant={z === zakladka ? "default" : "outline"}
                  className="min-h-11"
                  onClick={() => setZakladka(z)}
                >
                  {t(ETYKIETY_ZAKLADEK[z])}
                </Button>
              ))}
            </div>

            {zakladka === "miesiace" && <WykresMiesiecy panele={v.panele} />}

            {zakladka === "oplacalnosc" && (
              <div className="flex flex-col gap-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="text-left">
                        <th className="p-1" />
                        {v.panele.map((p) => (
                          <th key={p.id} className="p-1 font-medium">
                            {p.nazwa}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        [
                          ["UI-PORP-LICZBA-SZTUK", (p: WynikPanelu) => `${p.liczbaPaneli}`],
                          [
                            "UI-PORP-UKLAD-RZEDOW",
                            (p: WynikPanelu) =>
                              p.rozmieszczenie === null
                                ? null
                                : t("UI-PORP-UKLAD-RZEDOW-WART", {
                                    rzedy: p.rozmieszczenie.rzedy,
                                    stoly: p.rozmieszczenie.stolowWRzedzie,
                                    k: p.rozmieszczenie.panelowNaStole,
                                    odstep: f2(p.rozmieszczenie.odstepM),
                                  }),
                          ],
                          ["UI-PORP-MOC-KWP", (p: WynikPanelu) => `${f2(p.mocKwp)} kWp`],
                          ["UI-PORP-MASA-RAZEM", (p: WynikPanelu) => (p.masaRazemKg === null ? null : `${f0(p.masaRazemKg)} kg`)],
                          ["UI-PORP-ZIMA-KWH", (p: WynikPanelu) => `${f1(p.zimaKwh)} kWh`],
                          ["UI-PORP-ZIMA-TANIA", (p: WynikPanelu) => (p.zimaTaniaKwh === null ? null : `${f1(p.zimaTaniaKwh)} kWh`)],
                          ["UI-PORP-ROK-KWH", (p: WynikPanelu) => `${f0(p.rokKwh)} kWh`],
                          ["UI-PORP-UZYTECZNA-ROK", (p: WynikPanelu) => (p.uzytecznaRokKwh === null ? null : `${f0(p.uzytecznaRokKwh)} kWh`)],
                          [
                            "UI-PORP-NADWYZKA-ROK",
                            (p: WynikPanelu) =>
                              p.nadwyzkaRokKwh === null || p.nadwyzkaUlamek === null
                                ? null
                                : t("UI-PORP-NADWYZKA-WART", { kwh: f0(p.nadwyzkaRokKwh), proc: f0(p.nadwyzkaUlamek * 100) }),
                          ],
                          ["UI-PORP-CENA-RAZEM", (p: WynikPanelu) => (p.cenaRazemZl === null ? null : `${f0(p.cenaRazemZl)} ${waluta}`)],
                          ["UI-PORP-CENA-ZA-WP", (p: WynikPanelu) => (p.cenaZaWpZl === null ? null : `${f2(p.cenaZaWpZl)} ${waluta}/Wp`)],
                          ["UI-PORP-KOSZT-ZIMOWEJ-KWH", (p: WynikPanelu) => (p.kosztZimowejKwhZl === null ? null : `${f2(p.kosztZimowejKwhZl)} ${waluta}/kWh`)],
                          ["UI-PORP-WARTOSC-ROK", (p: WynikPanelu) => (p.wartoscRokZl === null ? null : `${f0(p.wartoscRokZl)} ${waluta}`)],
                          ["UI-PORP-WARTOSC-ZIMA", (p: WynikPanelu) => (p.wartoscZimaZl === null ? null : `${f0(p.wartoscZimaZl)} ${waluta}`)],
                          ["UI-PORP-ZWROT", (p: WynikPanelu) => (p.okresZwrotuLat === null ? null : t("UI-PORP-LATA", { x: f1(p.okresZwrotuLat) }))],
                          ["UI-PORP-MOC-25", (p: WynikPanelu) => (p.moc25LatPct === null ? null : `${f1(p.moc25LatPct)}%`)],
                        ] as [string, (p: WynikPanelu) => string | null][]
                      )
                        .filter(([klucz]) => klucz !== "UI-PORP-UKLAD-RZEDOW" || v.panele.some((p) => p.rozmieszczenie !== null))
                        .map(([klucz, wartosc]) => (
                        <tr key={klucz} className="border-t">
                          <th className="p-1 text-left font-normal">{t(klucz)}</th>
                          {v.panele.map((p) => (
                            <td key={p.id} className="p-1 tabular-nums">
                              {wartosc(p) ?? <span className="text-muted-foreground">{t("UI-PORP-BRAK-DANYCH")}</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-caption text-muted-foreground">{t(v.zUzytecznoscia ? "UI-PORP-OPLACALNOSC-NOTA-UZYT" : "UI-PORP-OPLACALNOSC-NOTA")}</p>
              </div>
            )}

            {zakladka === "wiecej" && (
              <div className="flex flex-col gap-4">
                {v.panele.length < 2 ? (
                  <p className="text-small text-muted-foreground">{t("UI-PORP-SC-JEDEN")}</p>
                ) : v.scenariusze.length === 0 ? (
                  <p className="text-small text-muted-foreground">{t("UI-PORP-SC-BRAK")}</p>
                ) : (
                  v.scenariusze.map((sc) => {
                    const tanszy = nazwaPanelu(sc.tanszyId)
                    const drozszy = nazwaPanelu(sc.drozszyId)
                    return (
                      <div key={sc.tanszyId} className="flex flex-col gap-1 rounded-lg border p-4 text-small">
                        <p className="font-medium">
                          {sc.dodatkowePanele > 0
                            ? t("UI-PORP-SC-ZOSTAJE", { tanszy, drozszy, zl: f0(sc.oszczednoscZl), waluta, x: sc.dodatkowePanele })
                            : t("UI-PORP-SC-ZA-MALO", { tanszy, drozszy, zl: f0(sc.oszczednoscZl), waluta, cena: f0(sc.cenaSztukiTanszegoZl) })}
                        </p>
                        {sc.dodatkowePanele > 0 && (
                          <>
                            <p>{t("UI-PORP-SC-ENERGIA", { rok: f0(sc.dodatkoweRokKwh), zima: f0(sc.dodatkoweZimaKwh) })}</p>
                            <p>
                              {t("UI-PORP-SC-POROWNANIE", {
                                tanszy,
                                drozszy,
                                rok: roznicaKwhTekst(sc.przewagaRokKwh),
                                zima: roznicaKwhTekst(sc.przewagaZimaKwh),
                              })}
                            </p>
                            {sc.przewagaRokZl !== null && sc.przewagaZimaZl !== null && (
                              <p>{t("UI-PORP-SC-ZL", { rok: roznicaZlTekst(sc.przewagaRokZl), zima: roznicaZlTekst(sc.przewagaZimaZl) })}</p>
                            )}
                            <p className="text-muted-foreground">
                              {!sc.miejsceSprawdzone
                                ? t("UI-PORP-SC-MIEJSCE-NIEZNANE")
                                : sc.naScianie > 0 && sc.wTymSamymMiejscu === 0
                                  ? t("UI-PORP-SC-SCIANA-WSZYSTKIE", { sciana: sc.naScianie })
                                  : sc.naScianie > 0
                                    ? t("UI-PORP-SC-SCIANA", { miejsce: sc.wTymSamymMiejscu, sciana: sc.naScianie })
                                    : t("UI-PORP-SC-MIEJSCE-OK")}
                            </p>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
                <p className="text-caption text-muted-foreground">{t("UI-PORP-SC-NOTA")}</p>
              </div>
            )}

            {zakladka === "nadwyzka" && (
              <div className="flex flex-col gap-3 text-small">
                {!v.zUzytecznoscia ? (
                  <>
                    <p className="text-muted-foreground">{t("UI-PORP-NADW-SUCHY")}</p>
                    <Link href="/kalkulatory/zuzycie-miesieczne" className="underline">
                      {t("UI-PORP-ZUZYCIE-LINK")}
                    </Link>
                  </>
                ) : (
                  <>
                    <ul className="flex flex-col gap-1">
                      {v.panele.map((p) =>
                        p.uzytecznaRokKwh === null || p.nadwyzkaRokKwh === null || p.nadwyzkaUlamek === null ? null : (
                          <li key={p.id}>
                            {t("UI-PORP-NADW-TEKST", {
                              panel: p.nazwa,
                              uzyt: f0(p.uzytecznaRokKwh),
                              rok: f0(p.rokKwh),
                              nadw: f0(p.nadwyzkaRokKwh),
                              proc: f0(p.nadwyzkaUlamek * 100),
                            })}
                          </li>
                        ),
                      )}
                    </ul>
                    <p>{t("UI-PORP-NADW-NIE-STRATA")}</p>
                    <ul className="flex list-disc flex-col gap-1 pl-5">
                      <li>
                        <Link href="/kalkulatory/grzalka-cwu" className="underline">
                          {t("UI-PORP-NADW-L-CWU")}
                        </Link>
                      </li>
                      <li>
                        <Link href="/kalkulatory/bojler-cwu" className="underline">
                          {t("UI-PORP-NADW-L-BOJLER")}
                        </Link>
                      </li>
                      <li>
                        <Link href="/kalkulatory/grzalki-dachowe" className="underline">
                          {t("UI-PORP-NADW-L-DACH")}
                        </Link>
                      </li>
                      <li>
                        <Link href="/kalkulatory/basen" className="underline">
                          {t("UI-PORP-NADW-L-BASEN")}
                        </Link>
                      </li>
                      <li>{t("UI-PORP-NADW-SZKLARNIA")}</li>
                      <li>{t("UI-PORP-NADW-SYSTEM24")}</li>
                    </ul>
                  </>
                )}
              </div>
            )}

            {zakladka === "miejsca" && (
              <div className="flex flex-col gap-3 text-small">
                {stan.miejsca.length < 2 && <p className="text-muted-foreground">{t("UI-PORP-MIEJSCA-JEDNO")}</p>}
                {(() => {
                  const kompletne = wynikiMiejsc.filter((x) => x.wynik.value.panele.length > 0)
                  const naglowek = kompletne[0]?.wynik.value.panele
                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-small">
                        <thead>
                          <tr className="text-left">
                            <th className="p-1" />
                            {(naglowek ?? []).map((p) => (
                              <th key={p.id} className="p-1 font-medium">
                                {p.nazwa}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stan.miejsca.map((m) => {
                            const w = wynikiMiejsc.find((x) => x.id === m.id)?.wynik
                            const gotowe = w && w.value.panele.length > 0
                            const najZima = gotowe ? Math.max(...w.value.panele.map((p) => p.zimaKwh)) : 0
                            return (
                              <tr key={m.id} className="border-t align-top">
                                <th className="p-1 text-left font-normal">{nazwaMiejsca(m)}</th>
                                {gotowe ? (
                                  w.value.panele.map((p) => (
                                    <td key={p.id} className={`p-1 tabular-nums ${p.zimaKwh === najZima ? "font-semibold" : ""}`}>
                                      {t("UI-PORP-MIEJSCA-KOMORKA", { zima: f0(p.zimaKwh), rok: f0(p.rokKwh), n: p.liczbaPaneli })}
                                    </td>
                                  ))
                                ) : (
                                  <td colSpan={Math.max(1, naglowek?.length ?? 1)} className="p-1 text-muted-foreground">
                                    {t("UI-PORP-MIEJSCA-UZUPELNIJ")}
                                  </td>
                                )}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                })()}
                <p className="text-caption text-muted-foreground">{t("UI-PORP-MIEJSCA-NOTA")}</p>
              </div>
            )}

            {zakladka === "gwiazdki" && (
              <div className="flex flex-col gap-4">
                {v.panele.length < 2 ? (
                  <p className="text-small text-muted-foreground">{t("UI-PORP-GWIAZDKI-JEDEN")}</p>
                ) : (
                  <>
                    <ul className="flex flex-col gap-2">
                      {v.panele.map((p, i) => {
                        const g = v.gwiazdki[i]
                        if (g === null || g === undefined) return null
                        return (
                          <li key={p.id} className="flex flex-col gap-1 text-small">
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="flex items-center gap-1.5">
                                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: KOLOR_SERII[i] }} aria-hidden="true" />
                                {p.nazwa}
                              </span>
                              <span className="font-semibold tabular-nums">
                                {f1(g)} / 10 <span className="font-normal text-muted-foreground">({t("UI-PORP-GWIAZDKI-RAZEM")})</span>
                              </span>
                            </span>
                            <div
                              role="meter"
                              aria-label={p.nazwa}
                              aria-valuemin={0}
                              aria-valuemax={10}
                              aria-valuenow={Math.round(g * 10) / 10}
                              className="h-2 w-full overflow-hidden rounded-full bg-muted"
                            >
                              <div className="h-full rounded-full" style={{ width: `${Math.min(100, g * 10)}%`, background: KOLOR_SERII[i] }} />
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="overflow-x-auto">
                      <table className="w-full text-small">
                        <thead>
                          <tr className="text-left">
                            <th className="p-1" />
                            {v.panele.map((p) => (
                              <th key={p.id} className="p-1 font-medium">
                                {p.nazwa}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {v.kryteria.map((k) => (
                            <tr key={k.id} className="border-t align-top">
                              <th className="p-1 text-left font-normal">
                                {t(`UI-PORP-K-${k.id as KryteriumId}`)}
                                {k.wagaEfektywna !== null && (
                                  <span className="block text-caption text-muted-foreground">{t("UI-PORP-KRYTERIUM-WAGA-EFEKT", { w: f1(k.wagaEfektywna) })}</span>
                                )}
                              </th>
                              {k.status === "policzone" ? (
                                k.punkty.map((pkt, i) => (
                                  <td key={v.panele[i]!.id} className="p-1 tabular-nums">
                                    {f1(pkt!)}
                                  </td>
                                ))
                              ) : (
                                <td colSpan={v.panele.length} className="p-1 text-muted-foreground">
                                  {k.status === "pominiete-brak-danych"
                                    ? t("UI-PORP-KRYTERIUM-POMINIETE", { panele: k.brakuje.join(", ") })
                                    : k.status === "odznaczone"
                                      ? t("UI-PORP-KRYTERIUM-ODZNACZONE")
                                      : t("UI-PORP-KRYTERIUM-OPISOWE")}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-caption text-muted-foreground">{t("UI-PORP-GWIAZDKI-NOTA")}</p>
                  </>
                )}
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-1 flex items-center gap-1.5 text-small font-medium">
                    {t("UI-PORP-KRYTERIA")}
                    <PomocPola ekran="porownywarka-paneli" pole="kryteria" />
                  </legend>
                  {KRYTERIA.filter((k) => k.kierunek !== null).map((k) => (
                    <PoleCheckbox
                      key={k.id}
                      id={`kryterium-${k.id}`}
                      label={t(`UI-PORP-K-${k.id}`)}
                      hint={t("UI-PORP-KRYTERIUM-WAGA", { w: f1(k.waga) })}
                      checked={stan.kryteria[k.id]}
                      onChange={(e) => setStan((prev) => ({ ...prev, kryteria: { ...prev.kryteria, [k.id]: e.target.checked } }))}
                    />
                  ))}
                </fieldset>
              </div>
            )}

            {zakladka === "zalozenia" && (
              <div className="rounded-lg border p-4 text-small">
                <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
              </div>
            )}

            <div className="flex flex-col gap-2 rounded-lg border p-4 text-small">
              <p className="font-medium">{t("UI-PORP-ZAPISZ-TYTUL")}</p>
              <p className="text-muted-foreground">{t("UI-PORP-ZAPISZ-OPIS")}</p>
              {v.panele.map((p) => (
                <div key={p.id} className="flex flex-col gap-2">
                  {doZapisuId === p.id ? (
                    <div role="alert" className="flex flex-col gap-2 rounded-md border p-3">
                      <p>{t("UI-PORP-ZAPISZ-PYTANIE", { nazwa: p.nazwa })}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button className="min-h-11" onClick={() => zapiszJakoPodstawowy(p.id)}>
                          {t("UI-PORP-ZAPISZ-TAK")}
                        </Button>
                        <Button variant="outline" className="min-h-11" onClick={() => setDoZapisuId(null)}>
                          {t("UI-PORP-ZAPISZ-NIE")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="h-auto min-h-11 max-w-full self-start whitespace-normal py-2 text-left" onClick={() => { setZapisanoId(null); setDoZapisuId(p.id) }}>
                      {t("UI-PORP-ZAPISZ-PRZYCISK", { nazwa: p.nazwa })}
                    </Button>
                  )}
                  {zapisanoId === p.id && <p role="status">{t("UI-PORP-ZAPISZ-GOTOWE", { nazwa: p.nazwa })}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <Link href="/kalkulatory/technologie-paneli" className="text-small underline">
        {t("UI-PORP-LINK-PANELE")}
      </Link>
      <Link href="/kalkulatory/orientacja-powierzchni" className="text-small underline">
        {t("UI-PORP-LINK-ORIENTACJA")}
      </Link>
    </main>
  )
}
