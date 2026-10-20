"use client"

import { useMemo, useState } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { BalastWarunki, ETYKIETA_WARUNKU } from "@/components/wzorce/balast-warunki"
import { PrzelicznikTarcia } from "@/components/wzorce/przelicznik-tarcia"
import { WyborMetodyCf } from "@/components/wzorce/wybor-metody-cf"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useDenominacja } from "@/lib/waluta/use-waluta"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { KATEGORIE_TERENU, type KategoriaTerenu, type StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { calculateZlotySrodek, type PunktKata } from "@/lib/core/modules/pv/zloty-srodek/calculator"
import { CENA_BALASTU_PODPOWIEDZ_ZL_KG } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"

type FormularzStan = {
  azymutDeg: string
  strefa: string
  wysokoscNpmM: string
  kategoria: string
  wysokoscKonstrukcjiM: string
  powierzchniaM2: string
  phi: string
  masaPaneliStelaza: string
  dlugoscSpadku: string
  wspolczynnikTarcia: string
  glebokoscPodstawy: string
  metodaCf?: string
  cenaBalastu: string
  mocKwp: string
  pr: string
  cenaKwh: string
  lata: string
  nachylenieDeg: string
}

const STAN_POCZATKOWY: FormularzStan = {
  azymutDeg: "",
  strefa: "",
  wysokoscNpmM: "",
  kategoria: "",
  wysokoscKonstrukcjiM: "",
  powierzchniaM2: "",
  phi: "",
  masaPaneliStelaza: "",
  dlugoscSpadku: "",
  wspolczynnikTarcia: "",
  glebokoscPodstawy: "",
  metodaCf: "",
  cenaBalastu: String(CENA_BALASTU_PODPOWIEDZ_ZL_KG),
  mocKwp: "",
  pr: "",
  cenaKwh: "",
  lata: "",
  nachylenieDeg: "",
}

/** Money fields converted when the display currency changes. */
const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("cenaBalastu", "cenaKwh")

const OPIS_TERENU: Record<KategoriaTerenu, string> = {
  "0": "UI-TYPMON-COMWSP-MORZE",
  I: "UI-TYPMON-COMWSP-JEZIORA-TEREN-PLASKI",
  II: "UI-TYPMON-COMWSP-NISKA-ROSLINNOSC-POJEDYNCZE",
  III: "UI-TYPMON-COMWSP-III-WIES-PRZEDMIESCIA",
  IV: "UI-TYPMON-COMWSP-MIASTO-MIN-ZABUDOWY",
}

/**
 * Jedna wielkość w funkcji kąta 0–90° (mała seria wykresów zamiast jednego z trzema osiami — produkcja,
 * wiatr i śnieg mają różne jednostki). `null` = brak danych normowych: przerwa w linii, nie zero.
 */
/** Ballast of one angle under each condition, the heaviest highlighted — the same view as in the other wind/ballast calculators. */
function BalastPunktu({ p, t, f }: { p: PunktKata; t: (kod: string, params?: Record<string, string | number>) => string; f: (x: number) => string }) {
  if (p.balastKg === null) return null
  return (
    <div className="mt-1">
      <BalastWarunki
        warunki={{ oderwanie: p.balastOderwanieKg, przesuw: p.balastPrzesuwKg, przewracanie: p.balastPrzewracanieKg }}
        rozstrzyga={p.warunekRozstrzygajacy}
        t={t}
        f={f}
        oderwanieNieDotyczy={p.balastOderwanieKg === null}
        podejscieEc7={p.podejscieEc7Przesuw}
      />
    </div>
  )
}

function WykresKatowy({
  tytul,
  wartosci,
  jednostka,
  formatuj,
  rekomendacja,
  wybrany,
}: {
  tytul: string
  wartosci: (number | null)[]
  jednostka: string
  formatuj: (x: number) => string
  rekomendacja: number | null
  wybrany: number | null
}) {
  const t = useTranslate()
  const W = 360
  const H = 110
  const liczby = wartosci.filter((v): v is number => v !== null)
  const max = Math.max(...liczby, 1e-9)
  const x = (k: number) => (k / 90) * (W - 20) + 10
  const y = (v: number) => H - 8 - (v / max) * (H - 20)
  let d = ""
  wartosci.forEach((v, k) => {
    if (v === null) return
    d += `${k === 0 || wartosci[k - 1] === null ? "M" : "L"}${x(k).toFixed(1)},${y(v).toFixed(1)} `
  })
  const znacznik = (k: number | null, klasa: string, opis: string) =>
    k !== null && wartosci[k] !== null && wartosci[k] !== undefined ? (
      <circle cx={x(k)} cy={y(wartosci[k]!)} r={5} className={klasa} strokeWidth={2}>
        <title>{`${opis} ${k}°: ${formatuj(wartosci[k]!)} ${jednostka}`}</title>
      </circle>
    ) : null
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="text-small font-medium">
        {tytul} <span className="text-muted-foreground">[{jednostka}]</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full text-foreground" role="img" aria-label={t("UI-ZLOSRO-ZALEZNOSCI-KATA", { tytul })}>
        <line x1={10} y1={H - 8} x2={W - 10} y2={H - 8} className="stroke-muted-foreground/40" strokeWidth={1} />
        <path d={d} className="fill-none stroke-sky-500" strokeWidth={2} />
        {wartosci.map((v, k) =>
          v !== null && (wartosci[k - 1] ?? null) === null && (wartosci[k + 1] ?? null) === null ? (
            <circle key={k} cx={x(k)} cy={y(v)} r={4} className="fill-sky-500">
              <title>{`${k}°: ${formatuj(v)} ${jednostka}`}</title>
            </circle>
          ) : null,
        )}
        {znacznik(rekomendacja, "fill-background stroke-sky-700", "Rekomendacja")}
        {znacznik(wybrany, "fill-foreground stroke-background", t("UI-ZLOSRO-KAT-2"))}
        {[0, 30, 60, 90].map((k) => (
          <text key={k} x={x(k)} y={H + 10} textAnchor="middle" className="fill-muted-foreground text-[9px]">
            {k}°
          </text>
        ))}
      </svg>
    </figure>
  )
}

export default function ZlotySrodekPage() {
  const t = useTranslate()
  const { f0, f1, f2 } = useFormaty()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const denominacja = useDenominacja()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("zloty-srodek", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [tabela, setTabela] = useState<{ klucz: string; t: TabelaNapromieniowania | null } | null>(null)
  const ustaw = (pole: keyof FormularzStan, v: string) => setStan((prev) => ({ ...prev, [pole]: v }))

  const azymut = liczba(stan.azymutDeg)
  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, azymut])
  const aktualna = tabela !== null && tabela.klucz === klucz ? tabela : null
  const wysokoscPvgis = dane?.dane.meta.wysokoscNpmM

  async function policzTabele() {
    if (!lokalizacja || !dane || azymut === undefined) return
    const r = await uruchom({
      typ: "tabela-napromieniowania",
      wejscie: {
        szerokoscGeograficzna: lokalizacja.szerokosc,
        dlugoscGeograficzna: lokalizacja.dlugosc,
        daneGodzinowe: dane.dane.rekordy,
        azymutDeg: azymut,
      },
    })
    if (r) setTabela({ klucz, t: r.wynik.value })
  }

  const n = (s: string) => liczba(s) ?? null
  const strefa = stan.strefa === "" ? null : (Number(stan.strefa) as StrefaWiatrowa)
  const kategoria = stan.kategoria === "" ? null : (stan.kategoria as KategoriaTerenu)
  const wysokoscNpm = n(stan.wysokoscNpmM) ?? wysokoscPvgis ?? null
  const result = useMemo(
    () =>
      calculateZlotySrodek({
        tabela: aktualna?.t ?? null,
        strefaWiatrowa: strefa,
        wysokoscNpmM: wysokoscNpm,
        kategoriaTerenu: kategoria,
        wysokoscKonstrukcjiM: n(stan.wysokoscKonstrukcjiM),
        powierzchniaPaneliM2: n(stan.powierzchniaM2),
        wspolczynnikPhi: n(stan.phi),
        // Drafts saved before D29 (28.09.2026) have no mass — treat as empty.
        masaPaneliStelazaKg: n(stan.masaPaneliStelaza ?? ""),
        // Drafts saved before the stability check have no slope length / friction / footprint depth — treat as empty.
        dlugoscWzdluzSpaduM: n(stan.dlugoscSpadku ?? ""),
        wspolczynnikTarcia: n(stan.wspolczynnikTarcia ?? ""),
        glebokoscPodstawyM: n(stan.glebokoscPodstawy ?? ""),
        metodaCf: stan.metodaCf === "trend" ? "trend" : "liniowa",
        cenaBalastuZlKg: n(stan.cenaBalastu),
        mocInstalacjiKwp: n(stan.mocKwp),
        wspolczynnikPr: n(stan.pr),
        cenaEnergiiZlKwh: n(stan.cenaKwh),
        liczbaLat: n(stan.lata),
        nachylenieDeg: n(stan.nachylenieDeg),
      }),
    [aktualna, strefa, wysokoscNpm, kategoria, stan],
  )

  if (!wczytano) return <StanLadowania linie={6} />
  const r = result.value
  const punkt = (k: number | null): PunktKata | null => (r && k !== null ? (r.punkty[k] ?? null) : null)
  const rek = punkt(r?.rekomendacjaDeg ?? null)
  const opt = punkt(r?.optimumEnergiiDeg ?? null)
  const wyb = punkt(r?.wybranyDeg ?? null)
  const hMax = opt?.napromieniowanieRoczneKwhM2 ?? 1
  const katyTabeli = r ? [...new Set([0, 5, 10, 15, 20, 25, 30, r.optimumEnergiiDeg, r.wybranyDeg ?? 0, 90])].sort((a, b) => a - b) : []

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zloty-srodek" />
      <NaglowekEkranu tytul={t("UI-ZLOSRO-ZLOTY-SRODEK-KAT")} ekran="zloty-srodek" wynik={result}>
        {t("UI-ZLOSRO-KAT-KTORY-DAJE")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-ZLOSRO-KIERUNEK-PANELI")}</h2>
        <Pole
          label={t("UI-ZLOSRO-AZYMUT-PANELI")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={360}
          value={stan.azymutDeg}
          onChange={(e) => ustaw("azymutDeg", e.target.value)}
          pomoc={<PomocPola ekran="zloty-srodek" pole="azymut" />}
        />
        <Button className="min-h-11" disabled={!lokalizacja || !dane || azymut === undefined || obliczenia.liczy} onClick={policzTabele}>
          {obliczenia.liczy ? t("UI-ZLOSRO-LICZE-NASLONECZNIENIE-KATOW") : t("UI-ZLOSRO-POLICZ-NASLONECZNIENIE")}
        </Button>
        {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
        {tabela && !aktualna && !obliczenia.liczy && <StanPusty tytul={t("UI-ZLOSRO-ZMIENILA-LOKALIZACJA-AZYMUT")} />}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-ZLOSRO-WIATR-MIEJSCU-MONTAZU")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PoleSelect
            label={t("UI-ZLOSRO-STREFA-WIATROWA")}
            value={stan.strefa}
            onChange={(e) => ustaw("strefa", e.target.value)}
            pomoc={<PomocPola ekran="typ-montazu-pola" pole="strefa" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            <option value="1">{t("UI-ZLOSRO-STREFA")}</option>
            <option value="2">{t("UI-ZLOSRO-STREFA-2")}</option>
            <option value="3">{t("UI-ZLOSRO-STREFA-3")}</option>
          </PoleSelect>
          <Pole
            label={t("UI-ZLOSRO-WYSOKOSC-TERENU")}
            unit="m"
            type="number"
            inputMode="decimal"
            value={stan.wysokoscNpmM}
            onChange={(e) => ustaw("wysokoscNpmM", e.target.value)}
            placeholder={wysokoscPvgis !== undefined ? String(wysokoscPvgis) : undefined}
            pomoc={<PomocPola ekran="typ-montazu-pola" pole="wysokoscNpm" />}
          />
        </div>
        <PoleSelect
          label={t("UI-ZLOSRO-TEREN-WOKOL-KATEGORIA")}
          value={stan.kategoria}
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
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label={t("UI-ZLOSRO-WYSOKOSC-GORNEJ-KRAWEDZI")}
            unit="m"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.wysokoscKonstrukcjiM}
            onChange={(e) => ustaw("wysokoscKonstrukcjiM", e.target.value)}
            pomoc={<PomocPola ekran="zloty-srodek" pole="wysokoscStelaza" />}
          />
          <Pole
            label={t("UI-ZLOSRO-POWIERZCHNIA-PANELI-STELAZU")}
            unit="m²"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.powierzchniaM2}
            onChange={(e) => ustaw("powierzchniaM2", e.target.value)}
            pomoc={<PomocPola ekran="zloty-srodek" pole="powierzchnia" />}
          />
        </div>
        <Pole
          label={t("UI-ZLOSRO-ZABUDOWA-POD-STELAZEM")}
          type="number"
          inputMode="decimal"
          min={0}
          max={1}
          step={0.1}
          value={stan.phi}
          onChange={(e) => ustaw("phi", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="zabudowa" />}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-ZLOSRO-BALAST-WYCENA-ENERGII")}</h2>
        <Pole
          label={t("UI-ZLOSRO-MASA-PANELI-STELAZA")}
          unit="kg"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.masaPaneliStelaza ?? ""}
          onChange={(e) => ustaw("masaPaneliStelaza", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="masa" />}
        />
        <Pole
          label={t("UI-ZLOSRO-DLUGOSC-SPADKU")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.dlugoscSpadku ?? ""}
          onChange={(e) => ustaw("dlugoscSpadku", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="dlugoscL" />}
        />
        <Pole
          label={t("UI-ZLOSRO-TARCIE")}
          type="number"
          inputMode="decimal"
          min={0}
          step={0.05}
          value={stan.wspolczynnikTarcia ?? ""}
          onChange={(e) => ustaw("wspolczynnikTarcia", e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="tarcie" />}
        />
        <PrzelicznikTarcia onUzyj={(mu) => ustaw("wspolczynnikTarcia", String(mu))} />
        <Pole
          label={t("UI-ZLOSRO-GLEBOKOSC-PODSTAWY")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.glebokoscPodstawy ?? ""}
          onChange={(e) => ustaw("glebokoscPodstawy", e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="glebokoscPodstawy" />}
        />
        <WyborMetodyCf metoda={stan.metodaCf === "trend" ? "trend" : "liniowa"} onChange={(m) => ustaw("metodaCf", m)} t={t} f={f2} />
        <p className="text-small text-muted-foreground">{t("UI-ZLOSRO-STATECZNOSC-OPIS")}</p>
        <Pole
          label={t("UI-ZLOSRO-CENA-BALASTU")}
          unit={t("UI-ZLOSRO-ZL-KG")}
          type="number"
          inputMode="decimal"
          min={0}
          step={0.1}
          value={stan.cenaBalastu}
          onChange={(e) => ustaw("cenaBalastu", e.target.value)}
          pomoc={<PomocPola ekran="zloty-srodek" pole="cenaBalastu" params={{ cena: Number((CENA_BALASTU_PODPOWIEDZ_ZL_KG * denominacja.kurs).toPrecision(3)) }} />}
        />
        <p className="text-small text-muted-foreground">
          {t("UI-ZLOSRO-ZEBY-APLIKACJA-WSKAZALA")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label={t("UI-ZLOSRO-MOC-PANELI-STELAZU")}
            unit="kWp"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.mocKwp}
            onChange={(e) => ustaw("mocKwp", e.target.value)}
            pomoc={<PomocPola ekran="zloty-srodek" pole="moc" />}
          />
          <Pole
            label={t("UI-ZLOSRO-WSPOLCZYNNIK-WYDAJNOSCI")}
            type="number"
            inputMode="decimal"
            min={0}
            max={1}
            step={0.01}
            value={stan.pr}
            onChange={(e) => ustaw("pr", e.target.value)}
            pomoc={<PomocPola ekran="zloty-srodek" pole="pr" />}
          />
          <Pole
            label={t("UI-ZLOSRO-WARTOSC-KWH")}
            unit={t("UI-J-ZL")}
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={stan.cenaKwh}
            onChange={(e) => ustaw("cenaKwh", e.target.value)}
            pomoc={<PomocPola ekran="zloty-srodek" pole="wartoscKwh" />}
          />
          <Pole
            label={t("UI-ZLOSRO-OKRES-ANALIZY")}
            unit={t("UI-J-LAT")}
            type="number"
            inputMode="numeric"
            min={1}
            value={stan.lata}
            onChange={(e) => ustaw("lata", e.target.value)}
            pomoc={<PomocPola ekran="zloty-srodek" pole="okres" />}
          />
        </div>
      </section>

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-ZLOSRO-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      {result.status === "INCOMPLETE" && aktualna && (
        <StanPusty tytul={t("UI-ZLOSRO-UZUPELNIJ-DANE-WIATRU")} />
      )}

      {r && (
        <WerdyktPanel poziom="uwaga" etykieta={rek ? t("UI-ZLOSRO-ZLOTY-SRODEK", { nachylenieDeg: rek.nachylenieDeg }) : t("UI-ZLOSRO-POROWNANIE-KATOW")}>
          {rek ? (
            <>
              <WynikGlowny>{rek.nachylenieDeg}°</WynikGlowny>
              <p className="text-small">
                {t("UI-ZLOSRO-MASZ-ENERGII-NAJLEPSZEGO", { nachylenieDeg: rek.nachylenieDeg, p: f1((100 * rek.napromieniowanieRoczneKwhM2) / hMax), optimumEnergiiDeg: r.optimumEnergiiDeg, p2: f0(rek.silaWiatruN!) })}
                {stan.masaPaneliStelaza ? ` ${t("UI-ZLOSRO-PONAD-CIEZAR-PANELI")}` : ""}{" "}
                <strong>{f0(Math.ceil(rek.balastKg!))} kg</strong> {t("UI-ZLOSRO-BILANS-OKRESIE-ANALIZY", { p: f0(rek.kosztBalastuZl!), p2: f0(rek.bilansZl!) })}
              </p>
              <BalastPunktu p={rek} t={t} f={f0} />
            </>
          ) : (
            <p className="text-small">{t("UI-ZLOSRO-NAJWIECEJ-ENERGII-DAJE", { optimumEnergiiDeg: r.optimumEnergiiDeg })}</p>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}

          <div className="mt-3 flex flex-col gap-1 text-small font-medium">
            <div className="flex items-center gap-1">
              <label htmlFor="suwak-zs">
                {t("UI-ZLOSRO-SPRAWDZ-DOWOLNY-KAT", { p: stan.nachylenieDeg === "" ? "—" : `${stan.nachylenieDeg}°` })}
              </label>
              <PomocPola ekran="zloty-srodek" pole="katSprawdz" />
            </div>
            <input
              id="suwak-zs"
              type="range"
              min={0}
              max={90}
              step={1}
              value={stan.nachylenieDeg === "" ? (r.rekomendacjaDeg ?? r.optimumEnergiiDeg) : stan.nachylenieDeg}
              onChange={(e) => ustaw("nachylenieDeg", e.target.value)}
              className="min-h-11 w-full accent-sky-600"
            />
          </div>
          {wyb && (
            <p className="text-small">
              {t("UI-ZLOSRO-ENERGIA-MAKSIMUM-SNIEG", { nachylenieDeg: wyb.nachylenieDeg, p: f1((100 * wyb.napromieniowanieRoczneKwhM2) / hMax), mu1: f2(wyb.mu1) })}
              {wyb.silaWiatruN !== null && t("UI-ZLOSRO-WIATR-NAJGORSZEGO-USTAWIENIA", { silaWiatruN: f0(wyb.silaWiatruN), p: f0(wyb.procentSilyMaks!) })}
              {wyb.balastKg !== null ? t("UI-ZLOSRO-BALAST", { balastKg: f0(Math.ceil(wyb.balastKg)), p: f0(wyb.kosztBalastuZl!) }) : ""}.
              {wyb.szacunek && t("UI-ZLOSRO-SZACUNEK-ZNACZNIK")}
            </p>
          )}
          {wyb && wyb !== rek && <BalastPunktu p={wyb} t={t} f={f0} />}

          <div className="mt-3 flex flex-col gap-4">
            <WykresKatowy
              tytul={t("UI-ZLOSRO-ENERGIA-ROKU")}
              wartosci={r.punkty.map((p) => (100 * p.napromieniowanieRoczneKwhM2) / hMax)}
              jednostka={t("UI-ZLOSRO-MAKSIMUM")}
              formatuj={f1}
              rekomendacja={r.rekomendacjaDeg}
              wybrany={r.wybranyDeg}
            />
            <WykresKatowy
              tytul={t("UI-ZLOSRO-SILA-WIATRU-ODRYWAJACA")}
              wartosci={r.punkty.map((p) => p.silaWiatruN)}
              jednostka="N"
              formatuj={f0}
              rekomendacja={r.rekomendacjaDeg}
              wybrany={r.wybranyDeg}
            />
            <WykresKatowy
              tytul={t("UI-ZLOSRO-SNIEG-ZOSTAJACY-PANELU")}
              wartosci={r.punkty.map((p) => p.mu1)}
              jednostka={t("UI-ZLOSRO-OBCIAZENIE-GRUNTU")}
              formatuj={f2}
              rekomendacja={r.rekomendacjaDeg}
              wybrany={r.wybranyDeg}
            />
            <p className="text-caption text-muted-foreground">
              {t("UI-ZLOSRO-WYKRES-WIATRU-PRZERWE")}
            </p>
          </div>

          <h3 className="mt-3 font-semibold">{t("UI-ZLOSRO-TABELA-KATOW")}</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[320px] text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">{t("UI-ZLOSRO-KAT")}</th>
                  <th className="p-2 text-right font-medium">{t("UI-ZLOSRO-ENERGIA")}</th>
                  <th className="p-2 text-right font-medium">{t("UI-ZLOSRO-WIATR")}</th>
                  <th className="p-2 text-right font-medium">{t("UI-ZLOSRO-BALAST-PROJ")}</th>
                  {r.punkty.some((q) => q.statecznosc) && <th className="p-2 text-left font-medium">{t("UI-ZLOSRO-ROZSTRZYGA")}</th>}
                  <th className="p-2 text-right font-medium">{t("UI-ZLOSRO-KOSZT")}</th>
                </tr>
              </thead>
              <tbody>
                {katyTabeli.map((k) => {
                  const p = r.punkty[k]!
                  return (
                    <tr key={k} className={`border-b last:border-0 ${k === r.rekomendacjaDeg ? "font-semibold" : ""}`}>
                      <td className="p-2">{k}°{p.szacunek ? " 🔎" : ""}</td>
                      <td className="p-2 text-right font-mono">{f1((100 * p.napromieniowanieRoczneKwhM2) / hMax)}%</td>
                      <td className="p-2 text-right font-mono">{p.silaWiatruN === null ? "—" : f0(p.silaWiatruN)}</td>
                      <td className="p-2 text-right font-mono">{p.balastKg === null ? "—" : f0(Math.ceil(p.balastKg))}</td>
                      {r.punkty.some((q) => q.statecznosc) && (
                        <td className="p-2">{p.statecznosc && p.warunekRozstrzygajacy !== null ? t(ETYKIETA_WARUNKU[p.warunekRozstrzygajacy]) : "—"}</td>
                      )}
                      <td className="p-2 text-right font-mono">{p.kosztBalastuZl === null ? "—" : f0(p.kosztBalastuZl)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {r.punkty.some((p) => p.szacunek) && <p className="text-caption">{t("UI-ZLOSRO-LEGENDA-SZACUNEK")}</p>}
          <p className="text-caption">
            {t("UI-ZLOSRO-CISNIENIE-WIATRU-STELAZU", { qpPa: f0(r.qpPa), qbPa: f0(r.qbPa), ce: f2(r.ce) })}
          </p>

          <h3 className="mt-3 font-semibold">{t("UI-ZLOSRO-ZROBIC-BALAST-KOTWIENIE")}</h3>
          <ul className="list-disc pl-5 text-small">
            <li>
              <strong>{t("UI-ZLOSRO-BLOCZKI-BALASTOWE-ODLANE")}</strong> {t("UI-ZLOSRO-BETON-PROSTYCH-SZALUNKACH")}
            </li>
            <li>
              <strong>{t("UI-ZLOSRO-SLUPKI-KOTWICZACE-GRUNCIE")}</strong> {t("UI-ZLOSRO-ZAMIAST-CIEZARU-SLUPKI")}
            </li>
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
