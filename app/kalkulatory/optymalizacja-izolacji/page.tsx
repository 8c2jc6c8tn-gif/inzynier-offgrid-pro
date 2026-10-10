"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateOptymalizacjaIzolacji, type WynikWariantu } from "@/lib/core/modules/ogrzewanie/optymalizacja-izolacji/calculator"
import { LAT_ANALIZY } from "@/lib/core/modules/ogrzewanie/optymalizacja-izolacji/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { przeliczPoleTekst } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { KLUCZ_DRAFTU_OBCIAZENIA, uPrzegrodySeed, wejscieObciazenia, type SeedObciazenia } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

type WariantSeed = { nazwa: string; lambda: string; grubosc: string; cena: string }
type Seed = { przegroda: string; powierzchniaM2: string; uWM2K: string; warianty: WariantSeed[]; cenaCiepla: string }

const nowyWariant = (nazwa: string): WariantSeed => ({ nazwa, lambda: "", grubosc: "", cena: "" })
/** Materials named by the source: wełna, styropian, piana PUR, celuloza. */
const stanPoczatkowy = (t: (k: string) => string): Seed => ({
  przegroda: "",
  powierzchniaM2: "",
  uWM2K: "",
  warianty: [
    nowyWariant(t("UI-OPTIZO-WELNA-MINERALNA")),
    nowyWariant(t("UI-OPTIZO-STYROPIAN")),
    nowyWariant(t("UI-OPTIZO-PIANA-PUR")),
    nowyWariant(t("UI-OPTIZO-CELULOZA")),
  ],
  cenaCiepla: "",
})

/** Money fields: price per m² of each variant and the heat price. */
const przeliczKwotySeed = (s: Seed, wsp: number): Seed => ({
  ...s,
  warianty: s.warianty.map((w) => ({ ...w, cena: przeliczPoleTekst(w.cena, wsp) })),
  cenaCiepla: przeliczPoleTekst(s.cenaCiepla, wsp),
})

const n = (s: string) => liczba(s) ?? null
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const f3 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 3 })

function KartaWariantu({ w, i, ustaw, usun }: { w: WariantSeed; i: number; ustaw: (z: Partial<WariantSeed>) => void; usun: () => void }) {
  const t = useTranslate()
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Pole id={`wariant-${i}-nazwa`} label={t("UI-OPTIZO-MATERIAL")} value={w.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="material" />} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Pole
          id={`wariant-${i}-lambda`}
          label="λ"
          unit="W/(m·K)"
          type="number"
          inputMode="decimal"
          min={0}
          value={w.lambda}
          onChange={(e) => ustaw({ lambda: e.target.value })}
          pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="lambda" />}
        />
        <Pole
          id={`wariant-${i}-grubosc`}
          label={t("UI-OPTIZO-GRUBOSC")}
          unit="cm"
          type="number"
          inputMode="decimal"
          min={0}
          value={w.grubosc}
          onChange={(e) => ustaw({ grubosc: e.target.value })}
          pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="grubosc" />}
        />
        <Pole
          id={`wariant-${i}-cena`}
          label={t("UI-OPTIZO-CENA")}
          unit={t("UI-OPTIZO-ZL-M")}
          type="number"
          inputMode="decimal"
          min={0}
          value={w.cena}
          onChange={(e) => ustaw({ cena: e.target.value })}
          pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="cena" />}
        />
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        {t("UI-OPTIZO-USUN-WARIANT")}
      </Button>
    </div>
  )
}

export default function OptymalizacjaIzolacjiPage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<Seed>("optymalizacja-izolacji", stanPoczatkowy(t), przeliczKwotySeed)
  const ustaw = (z: Partial<Seed>) => setStan((s) => ({ ...s, ...z }))
  const ustawWariant = (i: number, z: Partial<WariantSeed>) =>
    setStan((s) => ({ ...s, warianty: s.warianty.map((w, j) => (j === i ? { ...w, ...z } : w)) }))
  const ekran1 = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)

  const wejscieE1 = useMemo(() => (ekran1.dane ? wejscieObciazenia(ekran1.dane) : null), [ekran1.dane])
  const ti = wejscieE1?.temperaturaWewnetrznaC ?? null
  const miesiace = useMemo(() => wejscieE1?.srednieTemperaturyMiesieczneC ?? [], [wejscieE1])
  const miesiaceKompletne = miesiace.length === 12 && miesiace.every((m) => m !== null)
  const przegrodyZewnetrzne = (ekran1.dane?.przegrody ?? []).map((p, i) => ({ ...p, i })).filter((p) => p.zewnetrzna)

  const wynik = useMemo(
    () =>
      calculateOptymalizacjaIzolacji({
        przegroda: { nazwa: stan.przegroda, powierzchniaM2: n(stan.powierzchniaM2), uWM2K: n(stan.uWM2K) },
        warianty: stan.warianty.map((w) => ({ nazwa: w.nazwa.trim(), lambdaWmK: n(w.lambda), gruboscCm: n(w.grubosc), cenaZlM2: n(w.cena) })),
        temperaturaWewnetrznaC: ti,
        srednieTemperaturyMiesieczneC: miesiace,
        cenaCieplaZlKwh: n(stan.cenaCiepla),
      }),
    [stan, ti, miesiace],
  )
  const v = wynik.value
  const najtanszy = v && v.najtanszyIndex !== null ? v.warianty[v.najtanszyIndex]! : null
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"

  const kolumny: Kolumna<WynikWariantu & { id: number }>[] = [
    { naglowek: t("UI-OPTIZO-WARIANT"), render: (r) => <span className="font-medium">{`${r.nazwa} ${f0(r.gruboscCm)} cm`}</span> },
    { naglowek: "U po [W/(m²·K)]", render: (r) => f3(r.uPoWM2K), liczbowa: true },
    { naglowek: t("UI-OPTIZO-OSZCZEDNOSC-KWH-ROK"), render: (r) => f0(r.oszczednoscKwhRok), liczbowa: true },
    { naglowek: t("UI-OPTIZO-KOSZT"), render: (r) => f0(r.kosztZl), liczbowa: true },
    { naglowek: t("UI-OPTIZO-KWH-LAT", { LAT_ANALIZY }), render: (r) => (r.kosztZaKwhZl === null ? "—" : f2(r.kosztZaKwhZl)), liczbowa: true },
    { naglowek: t("UI-OPTIZO-DODATKOWE-KWH"), render: (r) => (r.kosztKrancowyZaKwhZl === null ? "—" : f2(r.kosztKrancowyZaKwhZl)), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/optymalizacja-izolacji" />
      <NaglowekEkranu tytul={t("UI-OPTIZO-OPTYMALIZACJA-IZOLACJI")} ekran="optymalizacja-izolacji" wynik={wynik} parametry={{ lata: LAT_ANALIZY }}>
        {t("UI-OPTIZO-POROWNANIE-MATERIALOW-GRUBOS", { LAT_ANALIZY })}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="font-semibold">{t("UI-OPTIZO-PRZEGRODA-KLIMAT-EKRANU")}</h2>
        {!ekran1.wczytano ? null : ti === null || !miesiaceKompletne ? (
          <p className="text-small text-muted-foreground">
            {t("UI-OPTIZO-NA")}{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-OPTIZO-EKRANIE-STRATY-CIEPLA")}
            </Link>{" "}{t("UI-OPTIZO-WPISZ-TEMPERATURE-DOMU")}
          </p>
        ) : (
          <p className="text-small">
            {t("UI-OPTIZO-TEMPERATURA-DOMU-TEMPERATURY", { ti })}{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-OPTIZO-ZMIEN-EKRANIE")}
            </Link>
          </p>
        )}
        {przegrodyZewnetrzne.length > 0 && (
          <PoleSelect
            label={t("UI-OPTIZO-PRZEGRODA-EKRANU")}
            value={stan.przegroda}
            onChange={(e) => {
              const p = przegrodyZewnetrzne.find((x) => String(x.i) === e.target.value)
              ustaw(p ? { przegroda: e.target.value, powierzchniaM2: p.powierzchniaM2, uWM2K: uPrzegrodySeed(p) } : { przegroda: "" })
            }}
            pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="przegroda" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            {przegrodyZewnetrzne.map((p) => (
              <option key={p.i} value={String(p.i)}>
                {p.nazwa || t("UI-OPTIZO-PRZEGRODA", { p: p.i + 1 })}
              </option>
            ))}
          </PoleSelect>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label={t("UI-OPTIZO-POWIERZCHNIA-PRZEGRODY")}
            unit="m²"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.powierzchniaM2}
            onChange={(e) => ustaw({ powierzchniaM2: e.target.value })}
            pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="powierzchnia" />}
          />
          <Pole
            label={t("UI-OPTIZO-OBECNE")}
            unit="W/(m²·K)"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.uWM2K}
            onChange={(e) => ustaw({ uWM2K: e.target.value })}
            pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="u" />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OPTIZO-WARIANTY-IZOLACJI")}</h2>
        <p className="text-small text-muted-foreground">
          {t("UI-OPTIZO-KAZDEGO-WARIANTU-WPISZ")}
        </p>
        {stan.warianty.map((w, i) => (
          <KartaWariantu
            key={i}
            w={w}
            i={i}
            ustaw={(z) => ustawWariant(i, z)}
            usun={() => setStan((s) => ({ ...s, warianty: s.warianty.filter((_, j) => j !== i) }))}
          />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, warianty: [...s.warianty, nowyWariant("")] }))}>
          {t("UI-OPTIZO-DODAJ-WARIANT")}
        </Button>
        <Pole
          label={t("UI-OPTIZO-CENA-CIEPLA-OPCJONALNIE")}
          unit={t("UI-J-ZL-KWH")}
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.cenaCiepla}
          onChange={(e) => ustaw({ cenaCiepla: e.target.value })}
          pomoc={<PomocPola ekran="optymalizacja-izolacji" pole="cenaCiepla" />}
        />
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-OPTIZO-SPRAWDZ-DANE")}>
          <ul className="mt-2 space-y-1 text-small">
            {wynik.warnings.map((w, i) => (
              <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && ti !== null && miesiaceKompletne && (
        <p className="text-small text-muted-foreground">
          {t("UI-OPTIZO-WPISZ-POWIERZCHNIE-PRZEGRODY")}
        </p>
      )}
      {v && (
        <WerdyktPanel
          poziom={poziom}
          etykieta={najtanszy ? t("UI-OPTIZO-NAJTANSZA-ZAOSZCZEDZONA-KWH", { nazwa: najtanszy.nazwa, gruboscCm: f0(najtanszy.gruboscCm) }) : t("UI-OPTIZO-BRAK-OSZCZEDNOSCI")}
        >
          {najtanszy && najtanszy.kosztZaKwhZl !== null && <WynikGlowny>{t("UI-OPTIZO-KWH", { kosztZaKwhZl: f2(najtanszy.kosztZaKwhZl) })}</WynikGlowny>}
          <p className="mt-1 text-small">
            {t("UI-OPTIZO-DZIS-PRZEGRODE-UCIEKA", { strataRocznaPrzedKwh: f0(v.strataRocznaPrzedKwh) })}
            {najtanszy && (
              <>
                {" "}{t("UI-OPTIZO-TEN-WARIANT-OSZCZEDZA", { oszczednoscKwhRok: f0(najtanszy.oszczednoscKwhRok), kosztZl: f0(najtanszy.kosztZl) })}
              </>
            )}
          </p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.warianty.map((w, i) => ({ ...w, id: i }))} minWidth={560} />
          </div>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} formulaKey={wynik.formulaKey} formulaParams={wynik.formulaParams} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
