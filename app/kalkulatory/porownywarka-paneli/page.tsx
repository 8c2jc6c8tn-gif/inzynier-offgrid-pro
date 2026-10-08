"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
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
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import { KRYTERIA, MAKS_PANELI_W_ZESTAWIE, MIESIACE_ZIMOWE_POROWNYWARKI, PRZYKLADOWE_OKNA_TANIE_G12, type KryteriumId } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import type { DanePanelu, KryteriaWybor, OknoStrefy, PorownywarkaInput, WycenaKwh } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { calculatePorownywarkaPaneli, type WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { domyslnyWyborKryteriow } from "@/lib/core/modules/pv/porownywarka-paneli/kryteria"
import { useSymbolWaluty, useTranslate } from "@/lib/i18n/language-context"
import { liczba, powierzchnieZModelu } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { przeliczPola, przeliczPoleTekst } from "@/lib/waluta/przelicz"

type PanelSeed = {
  id: string
  /** Catalogue entry the numbers were taken from; cleared when a datasheet number is edited by hand. */
  katalogId: string
  nazwa: string
  moc: string
  cena: string
  gamma: string
  noct: string
  spr200: string
  deg1: string
  degLin: string
  bifacjalny: boolean
}

type RodzajWyceny = "" | "siec" | "dzienNoc" | "reczna" | "agregat"

type FormularzStan = {
  powierzchniaId: string
  nachylenie: string
  azymut: string
  albedo: string
  liczbaPaneli: string
  panele: PanelSeed[]
  wycena: RodzajWyceny
  stawka: string
  cenaDzien: string
  cenaNoc: string
  okno1Od: string
  okno1Do: string
  okno2Od: string
  okno2Do: string
  agrMoc: string
  agrObc: string
  agrLh: string
  agrCena: string
  kryteria: KryteriaWybor
}

const PANEL_PUSTY = (id: string): PanelSeed => ({
  id,
  katalogId: "",
  nazwa: "",
  moc: "",
  cena: "",
  gamma: "",
  noct: "",
  spr200: "",
  deg1: "",
  degLin: "",
  bifacjalny: false,
})

const STAN_POCZATKOWY: FormularzStan = {
  powierzchniaId: "",
  nachylenie: "",
  azymut: "",
  albedo: "",
  liczbaPaneli: "",
  panele: [PANEL_PUSTY("p1"), PANEL_PUSTY("p2")],
  wycena: "",
  stawka: "",
  cenaDzien: "",
  cenaNoc: "",
  okno1Od: String(PRZYKLADOWE_OKNA_TANIE_G12[0].odH),
  okno1Do: String(PRZYKLADOWE_OKNA_TANIE_G12[0].doH),
  okno2Od: String(PRZYKLADOWE_OKNA_TANIE_G12[1].odH),
  okno2Do: String(PRZYKLADOWE_OKNA_TANIE_G12[1].doH),
  agrMoc: "",
  agrObc: "",
  agrLh: "",
  agrCena: "",
  kryteria: domyslnyWyborKryteriow(),
}

/** Money typed in the display currency follows the currency switch (the panel prices live in a list, so a custom converter). */
const KWOTY_PROSTE = przeliczPola<FormularzStan>("stawka", "cenaDzien", "cenaNoc", "agrCena")
const KWOTY = (stan: FormularzStan, wspolczynnik: number): FormularzStan => ({
  ...KWOTY_PROSTE(stan, wspolczynnik),
  panele: stan.panele.map((p) => ({ ...p, cena: przeliczPoleTekst(p.cena, wspolczynnik) })),
})

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

type Zakladka = "miesiace" | "oplacalnosc" | "gwiazdki" | "zalozenia"
const ZAKLADKI: Zakladka[] = ["miesiace", "oplacalnosc", "gwiazdki", "zalozenia"]
const ETYKIETY_ZAKLADEK: Record<Zakladka, string> = {
  miesiace: "UI-PORP-TAB-MIESIACE",
  oplacalnosc: "UI-PORP-TAB-OPLACALNOSC",
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
  const [zakladka, setZakladka] = useState<Zakladka>("miesiace")
  const ustaw = <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))
  const ustawPanel = (id: string, z: Partial<PanelSeed>) =>
    setStan((prev) => ({
      ...prev,
      panele: prev.panele.map((p) => {
        if (p.id !== id) return p
        // A hand-edited datasheet number no longer matches the catalogue card, so the card stops being shown as its source.
        const zmienionaDana = (["moc", "gamma", "noct", "spr200", "deg1", "degLin"] as const).some((k) => k in z && z[k] !== p[k])
        return { ...p, ...z, ...(zmienionaDana && !("katalogId" in z) ? { katalogId: "" } : {}) }
      }),
    }))

  const powierzchnie = useMemo(() => powierzchnieZModelu(skaner.value), [skaner.value])

  const wejscie: PorownywarkaInput = useMemo(() => {
    const nachylenie = liczba(stan.nachylenie)
    const azymut = liczba(stan.azymut)
    const albedo = liczba(stan.albedo)
    const panele: DanePanelu[] = stan.panele.flatMap((p, i) => {
      const moc = liczba(p.moc)
      if (moc === undefined) return []
      return [
        {
          id: p.id,
          nazwa: p.nazwa.trim() || t("UI-PORP-PANEL-N", { n: i + 1 }),
          pmaxW: moc,
          cenaBruttoZl: liczba(p.cena) ?? null,
          gammaPctNaC: liczba(p.gamma) ?? null,
          noctC: liczba(p.noct) ?? null,
          sprawnoscWzglednaPrzy200WPct: liczba(p.spr200) ?? null,
          degradacjaPierwszyRokPct: liczba(p.deg1) ?? null,
          degradacjaLiniowaPctNaRok: liczba(p.degLin) ?? null,
          bifacjalny: p.bifacjalny,
        },
      ]
    })
    const stawka = liczba(stan.stawka)
    const mocKw = liczba(stan.agrMoc)
    const obc = liczba(stan.agrObc)
    const lh = liczba(stan.agrLh)
    const cenaPaliwa = liczba(stan.agrCena)
    const cenaDzien = liczba(stan.cenaDzien)
    const cenaNoc = liczba(stan.cenaNoc)
    // A window with only one hour typed is incomplete (never guessed); both empty = no such window.
    const okno = (od: string, do_: string): OknoStrefy | null | "niekompletne" => {
      const a = liczba(od)
      const b = liczba(do_)
      return a !== undefined && b !== undefined ? { odH: a, doH: b } : a === undefined && b === undefined ? null : "niekompletne"
    }
    const okna = [okno(stan.okno1Od, stan.okno1Do), okno(stan.okno2Od, stan.okno2Do)]
    const oknaTanie = okna.filter((o): o is OknoStrefy => o !== null && o !== "niekompletne")
    const wycena: WycenaKwh | null =
      stan.wycena === "dzienNoc" && cenaDzien !== undefined && cenaNoc !== undefined && !okna.includes("niekompletne")
        ? { rodzaj: "dzienNoc", zlKwhDzien: cenaDzien, zlKwhNoc: cenaNoc, oknaTanie }
        : (stan.wycena === "siec" || stan.wycena === "reczna") && stawka !== undefined
        ? { rodzaj: stan.wycena, zlKwh: stawka }
        : stan.wycena === "agregat" && mocKw !== undefined && obc !== undefined && lh !== undefined && cenaPaliwa !== undefined
          ? { rodzaj: "agregat", mocKw, obciazeniePct: obc, zuzycieLH: lh, cenaPaliwaZlL: cenaPaliwa }
          : null
    return {
      ...(lokalizacja ? { szerokoscGeograficzna: lokalizacja.szerokosc, dlugoscGeograficzna: lokalizacja.dlugosc } : {}),
      ...(dane ? { daneGodzinowe: dane.dane.rekordy } : {}),
      miejsce: nachylenie !== undefined && azymut !== undefined ? { nachylenieDeg: nachylenie, azymutDeg: azymut, ...(albedo !== undefined ? { albedo } : {}) } : null,
      liczbaPaneli: liczba(stan.liczbaPaneli) ?? null,
      panele,
      wycena,
      kryteria: stan.kryteria,
    }
  }, [stan, lokalizacja, dane, t])

  const result = useMemo(() => calculatePorownywarkaPaneli(wejscie), [wejscie])

  if (!wczytano) return <StanLadowania linie={6} />

  const v = result.value
  const brakTemperaturyWDanych = dane !== null && !dane.dane.rekordy.some((r) => r.tempC !== undefined)
  const nazwaPanelu = (id: string) => v.panele.find((p) => p.id === id)?.nazwa ?? ""
  const wynikGotowy = result.status === "VALID" || result.status === "VALID_WITH_WARNINGS"

  function wybierzPowierzchnie(id: string) {
    const p = powierzchnie.find((x) => x.id === id)
    setStan((prev) => ({
      ...prev,
      powierzchniaId: id,
      ...(p ? { nachylenie: String(p.nachylenieDeg), azymut: String(p.azymutDeg) } : {}),
    }))
  }

  function wstawZKatalogu(idPanelu: string, idKatalogu: string) {
    const k = KATALOG_PANELI_PV.find((x) => x.id === idKatalogu)
    if (!k) return
    const tekst = (x: number | null) => (x === null ? "" : String(x))
    ustawPanel(idPanelu, {
      nazwa: k.nazwa,
      moc: String(k.pmaxW),
      gamma: tekst(k.gammaPctNaC),
      noct: tekst(k.noctC),
      spr200: tekst(k.sprawnoscWzglednaPrzy200WPct),
      deg1: tekst(k.degradacjaPierwszyRokPct),
      degLin: tekst(k.degradacjaLiniowaPctNaRok),
      bifacjalny: k.bifacjalny,
      katalogId: k.id,
    })
  }

  function dodajPanel() {
    setStan((prev) => {
      const numer = Math.max(0, ...prev.panele.map((p) => Number(p.id.slice(1)))) + 1
      return { ...prev, panele: [...prev.panele, PANEL_PUSTY(`p${numer}`)] }
    })
  }

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

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-PORP-KROK-MIEJSCE")}</h2>
        {powierzchnie.length > 0 && (
          <PoleSelect
            label={t("UI-PORP-MIEJSCE-Z-PROJEKTU")}
            value={stan.powierzchniaId}
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
            value={stan.nachylenie}
            onChange={(e) => ustaw("nachylenie", e.target.value)}
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
            value={stan.azymut}
            onChange={(e) => ustaw("azymut", e.target.value)}
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
          value={stan.albedo}
          onChange={(e) => ustaw("albedo", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="albedo" />}
        />
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-PORP-ALBEDO-PODPIS")}</p>
        <Pole
          label={t("UI-PORP-LICZBA")}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={stan.liczbaPaneli}
          onChange={(e) => ustaw("liczbaPaneli", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="liczbaPaneli" />}
        />
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-PORP-LICZBA-PODPIS")}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-PORP-KROK-PANELE")}</h2>
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
          <p className="text-small text-muted-foreground">{t("UI-PORP-UZUPELNIJ")}</p>
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
                          ["UI-PORP-ZIMA-KWH", (p: WynikPanelu) => `${f1(p.zimaKwh)} kWh`],
                          ["UI-PORP-ZIMA-TANIA", (p: WynikPanelu) => (p.zimaTaniaKwh === null ? null : `${f1(p.zimaTaniaKwh)} kWh`)],
                          ["UI-PORP-ROK-KWH", (p: WynikPanelu) => `${f0(p.rokKwh)} kWh`],
                          ["UI-PORP-CENA-RAZEM", (p: WynikPanelu) => (p.cenaRazemZl === null ? null : `${f0(p.cenaRazemZl)} ${waluta}`)],
                          ["UI-PORP-CENA-ZA-WP", (p: WynikPanelu) => (p.cenaZaWpZl === null ? null : `${f2(p.cenaZaWpZl)} ${waluta}/Wp`)],
                          ["UI-PORP-KOSZT-ZIMOWEJ-KWH", (p: WynikPanelu) => (p.kosztZimowejKwhZl === null ? null : `${f2(p.kosztZimowejKwhZl)} ${waluta}/kWh`)],
                          ["UI-PORP-WARTOSC-ROK", (p: WynikPanelu) => (p.wartoscRokZl === null ? null : `${f0(p.wartoscRokZl)} ${waluta}`)],
                          ["UI-PORP-WARTOSC-ZIMA", (p: WynikPanelu) => (p.wartoscZimaZl === null ? null : `${f0(p.wartoscZimaZl)} ${waluta}`)],
                          ["UI-PORP-ZWROT", (p: WynikPanelu) => (p.okresZwrotuLat === null ? null : t("UI-PORP-LATA", { x: f1(p.okresZwrotuLat) }))],
                          ["UI-PORP-MOC-25", (p: WynikPanelu) => (p.moc25LatPct === null ? null : `${f1(p.moc25LatPct)}%`)],
                        ] as [string, (p: WynikPanelu) => string | null][]
                      ).map(([klucz, wartosc]) => (
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
                <p className="text-caption text-muted-foreground">{t("UI-PORP-OPLACALNOSC-NOTA")}</p>
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
