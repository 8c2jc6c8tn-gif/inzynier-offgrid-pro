"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { calculateDeficytyMiesieczne } from "@/lib/core/modules/stress-test/deficyty-miesieczne/calculator"
import type {
  RodzajDanychHistorii,
  ZrodloHistorii,
} from "@/lib/core/modules/stress-test/deficyty-miesieczne/input"
import { formatujHistorie } from "@/lib/core/modules/stress-test/deficyty-miesieczne/formatuj-historie"
import { parsujHistorie } from "@/lib/core/modules/stress-test/deficyty-miesieczne/parsuj-historie"
import { brakujaceDni, dataDnia, uzupelnijDni } from "@/lib/core/modules/stress-test/deficyty-miesieczne/brakujace-dni"
import { dobowaEnergiaKwh } from "@/lib/core/telemetria/dobowa-energia"
import type { ProbkaTelemetrii } from "@/lib/core/telemetria/probka"
import { pustyRejestr, type Rejestr } from "@/lib/core/telemetria/rejestr"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { IndexedDbMagazynProbek } from "@/lib/adapters/telemetria/magazyn-probek"
import { wczytajRejestr } from "@/lib/adapters/telemetria/rejestr-zrodel"
import { kluczPv, type StanPvMagazynu } from "@/components/siec/pv-magazyn"
import { KLUCZ_BLEDU_SERIESCALC, odczytajOdpowiedzSeriescalc } from "@/lib/lokalizacja/dane-seriescalc"
import { OPTYMALNE_OBCIAZENIE_PCT } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/constants"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { wejscieDeficytow } from "@/lib/stress-test/wejscie-deficytow"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect, PoleTekst } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KLUCZE_MIESIECY, useZuzycieMiesieczne } from "@/components/siec/zuzycie-miesieczne"
import { DNI_W_MIESIACU } from "@/lib/core/modules/stress-test/deficyty-miesieczne/constants"

type PolaAgregatu = "moc" | "zuzycie" | "cena" | "serwis" | "zapas"
type PolaHistorii =
  | "horyzontDni"
  | "histKwp"
  | "histPr"
  | "histPopyt"
  | "histOkno"
  | "histPercentyl"
  | "histProg"
  | "histNoc"
  | "histMagPoj"
  | "histMagSpr"
  | "histMagStan"
type PolaPvgis = "pvgisLat" | "pvgisLon" | "pvgisNach" | "pvgisAzym" | "pvgisOd" | "pvgisDo"
type FormularzStan = Record<PolaAgregatu | PolaHistorii | PolaPvgis, string> & {
  deficyty: string[]
  /** "" = month by month; "3" | "7" | "14" | "miesiac" | "wlasny". */
  horyzont: string
  histDane: string
  histZrodlo: ZrodloHistorii
  histRodzaj: RodzajDanychHistorii
  /** Demand entry mode (owner decision D74 pkt 6): one annual average or 12 monthly values. */
  histPopytTryb: "jeden" | "miesiace"
  histPopytMiesiace: string[]
  /** Values typed for missing days, keyed "rok-dzien" (owner decision 2 A+B, 05.10.2026); "" = still missing. */
  histBraki: Record<string, string>
  /** Telemetry import (owner decision 3): source, PV power channel and the user's sample-gap limit [min]. */
  telZrodlo: string
  telKanal: string
  telPrzerwaMin: string
}

const STAN_POCZATKOWY: FormularzStan = {
  deficyty: Array.from({ length: 12 }, () => ""),
  moc: "",
  zuzycie: "",
  cena: "",
  serwis: "",
  zapas: "",
  horyzont: "",
  horyzontDni: "",
  histDane: "",
  histZrodlo: "wpisane-reczne",
  histRodzaj: "produkcja-pv-kwh",
  histKwp: "",
  histPr: "",
  histPopyt: "",
  histPopytTryb: "jeden",
  histPopytMiesiace: Array.from({ length: 12 }, () => ""),
  histBraki: {},
  telZrodlo: "",
  telKanal: "",
  telPrzerwaMin: "",
  histOkno: "",
  histPercentyl: "",
  histProg: "",
  histNoc: "",
  histMagPoj: "",
  histMagSpr: "",
  histMagStan: "",
  // Full range of the PVGIS-SARAH3 database (2005–2023); tilt and azimuth are never assumed.
  pvgisLat: "",
  pvgisLon: "",
  pvgisNach: "",
  pvgisAzym: "",
  pvgisOd: "2005",
  pvgisDo: "2023",
}

const KWOTY = przeliczPola<FormularzStan>("cena", "serwis")

const POLA: { pole: PolaAgregatu; label: string; unit: string }[] = [
  { pole: "moc", label: "UI-M7-DEFM-MOC", unit: "kW" },
  { pole: "zuzycie", label: "UI-M7-DEFM-ZUZYCIE", unit: "l/h" },
  { pole: "cena", label: "UI-M7-DEFM-CENA", unit: "UI-J-ZL-L" },
  { pole: "serwis", label: "UI-M7-DEFM-SERWIS", unit: "UI-M7-DEFM-J-ZL-H" },
  { pole: "zapas", label: "UI-M7-DEFM-ZAPAS", unit: "l" },
]

const ZRODLA: { wartosc: ZrodloHistorii; label: string }[] = [
  { wartosc: "wpisane-reczne", label: "UI-M7-DEFM-ZR-RECZNE" },
  { wartosc: "pvgis-seriescalc", label: "UI-M7-DEFM-ZR-PVGIS" },
  { wartosc: "pomiar-budynku", label: "UI-M7-DEFM-ZR-BUDYNEK" },
  { wartosc: "pomiar-miejscowosci", label: "UI-M7-DEFM-ZR-MIEJSCOWOSC" },
]

const HORYZONTY: { wartosc: string; label: string }[] = [
  { wartosc: "", label: "UI-M7-DEFM-H-BRAK" },
  { wartosc: "3", label: "UI-M7-DEFM-H-3" },
  { wartosc: "7", label: "UI-M7-DEFM-H-7" },
  { wartosc: "14", label: "UI-M7-DEFM-H-14" },
  { wartosc: "miesiac", label: "UI-M7-DEFM-H-MIESIAC" },
  { wartosc: "wlasny", label: "UI-M7-DEFM-H-WLASNY" },
]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
/** Missing days listed for manual filling at once; the rest appear after these are filled. */
const MAKS_BRAKOW = 31
const r1 = (x: number) => Math.round(x * 10) / 10
const POLA_PVGIS: { pole: PolaPvgis; label: string; unit: string; min: number; max: number; krok?: number }[] = [
  { pole: "pvgisLat", label: "UI-M7-DEFM-PVGIS-LAT", unit: "°", min: -90, max: 90, krok: 0.0001 },
  { pole: "pvgisLon", label: "UI-M7-DEFM-PVGIS-LON", unit: "°", min: -180, max: 180, krok: 0.0001 },
  { pole: "pvgisNach", label: "UI-M7-DEFM-PVGIS-NACH", unit: "°", min: 0, max: 90 },
  { pole: "pvgisAzym", label: "UI-M7-DEFM-PVGIS-AZYM", unit: "°", min: -180, max: 180 },
  { pole: "pvgisOd", label: "UI-M7-DEFM-PVGIS-OD", unit: "", min: 2005, max: 2023 },
  { pole: "pvgisDo", label: "UI-M7-DEFM-PVGIS-DO", unit: "", min: 2005, max: 2023 },
]

export default function DeficytyMiesiecznePage() {
  const t = useTranslate()
  const [zapisany, setStan, info] = usePersistedDraft<FormularzStan>("deficyty-miesieczne", STAN_POCZATKOWY, KWOTY)
  // A draft saved before the history fields existed lacks them — fill from the defaults.
  const stan = useMemo<FormularzStan>(() => ({ ...STAN_POCZATKOWY, ...zapisany }), [zapisany])
  const wklejone = useMemo(() => parsujHistorie(stan.histDane), [stan.histDane])
  const { zuzycie: zuzycieMiesieczne } = useZuzycieMiesieczne("dom")
  const [pvgisPobiera, setPvgisPobiera] = useState(false)
  const [pvgisKomunikat, setPvgisKomunikat] = useState<{ blad: boolean; tekst: string } | null>(null)
  const { dane: pvM14 } = useOdczytDraftu<StanPvMagazynu>(kluczPv("dom"))
  const sprawnoscM14 = pvM14?.sprawnoscProcent?.trim() ?? ""
  const braki = useMemo(() => brakujaceDni(wklejone.lata), [wklejone])

  const [rejestr, setRejestr] = useState<Rejestr>(pustyRejestr())
  const [probkiTel, setProbkiTel] = useState<ProbkaTelemetrii[]>([])
  const [telLiczy, setTelLiczy] = useState(false)
  const [telKomunikat, setTelKomunikat] = useState<{ blad: boolean; tekst: string } | null>(null)
  const magazynProbek = useMemo(() => new IndexedDbMagazynProbek(), [])
  useEffect(() => {
    let aktywny = true
    wczytajRejestr(indexedDbStorageAdapter).then((w) => aktywny && setRejestr(w.rejestr))
    return () => {
      aktywny = false
    }
  }, [])
  const telZrodloId = (rejestr.zrodla.find((z) => z.id === stan.telZrodlo) ?? rejestr.zrodla[0])?.id
  useEffect(() => {
    let aktywny = true
    const start = setTimeout(async () => {
      if (!telZrodloId) return setProbkiTel([])
      const dane = await magazynProbek.zakres(telZrodloId, -Infinity, Infinity)
      if (aktywny) setProbkiTel(dane)
    }, 0)
    return () => {
      aktywny = false
      clearTimeout(start)
    }
  }, [telZrodloId, magazynProbek])
  const kanalyMocy = useMemo(
    () => [...new Set(probkiTel.filter((p) => p.wielkosc === "moc").map((p) => p.kanal))].sort(),
    [probkiTel],
  )
  const telKanal = kanalyMocy.includes(stan.telKanal) ? stan.telKanal : kanalyMocy[0]

  const result = useMemo(() => calculateDeficytyMiesieczne(wejscieDeficytow(stan, wklejone.lata)), [stan, wklejone])
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")
  const h = v.historia
  const zh = v.zapasZHistorii
  const ustaw = <K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) =>
    setStan((prev) => ({ ...STAN_POCZATKOWY, ...prev, [pole]: wartosc }))

  const uzupelnijBraki = () => {
    const wpisy = braki
      .map((b) => ({ ...b, tekst: (stan.histBraki[`${b.rok}-${b.dzien}`] ?? "").trim().replace(",", ".") }))
      .filter((b) => b.tekst !== "")
      .map((b) => ({ rok: b.rok, dzien: b.dzien, wartosc: Number(b.tekst) }))
    if (wpisy.length === 0) return
    setStan((prev) => ({
      ...STAN_POCZATKOWY,
      ...prev,
      histDane: formatujHistorie(uzupelnijDni(wklejone.lata, wpisy)),
      histBraki: {},
    }))
  }

  const wstawZTelemetrii = () => {
    const przerwa = Number(stan.telPrzerwaMin.replace(",", "."))
    if (stan.telPrzerwaMin.trim() === "" || !(przerwa > 0)) {
      setTelKomunikat({ blad: true, tekst: t("UI-M7-DEFM-TEL-BRAK-PRZERWY") })
      return
    }
    setTelLiczy(true)
    try {
      const lata = dobowaEnergiaKwh(
        probkiTel.filter((p) => p.kanal === telKanal),
        przerwa * 60_000,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )
      const dni = lata.reduce((n, r) => n + r.dni.filter((d) => d !== null).length, 0)
      if (dni === 0) {
        setTelKomunikat({ blad: true, tekst: t("UI-M7-DEFM-TEL-PUSTO") })
        return
      }
      const brakiTel = lata.reduce((n, r) => n + r.dni.filter((d) => d === null).length, 0)
      setStan((prev) => ({
        ...STAN_POCZATKOWY,
        ...prev,
        histDane: formatujHistorie(lata),
        histZrodlo: "pomiar-budynku",
        histRodzaj: "produkcja-pv-kwh",
        histBraki: {},
      }))
      setTelKomunikat({ blad: false, tekst: t("UI-M7-DEFM-TEL-OK", { lata: lata.length, dni, braki: brakiTel }) })
    } finally {
      setTelLiczy(false)
    }
  }

  const pvgisKompletne = POLA_PVGIS.every(({ pole }) => stan[pole].trim() !== "")

  const pobierzZPvgis = async () => {
    if (!pvgisKompletne) {
      setPvgisKomunikat({ blad: true, tekst: t("UI-M7-DEFM-PVGIS-BRAK-DANYCH") })
      return
    }
    setPvgisPobiera(true)
    setPvgisKomunikat(null)
    try {
      const q = new URLSearchParams({
        lat: stan.pvgisLat,
        lon: stan.pvgisLon,
        od: stan.pvgisOd,
        do: stan.pvgisDo,
        nachylenie: stan.pvgisNach,
        azymut: stan.pvgisAzym,
      })
      const odp = await fetch(`/api/pvgis/seriescalc?${q}`)
      const w = odczytajOdpowiedzSeriescalc(await odp.json().catch(() => null))
      if (!w.ok) {
        setPvgisKomunikat({ blad: true, tekst: t(KLUCZ_BLEDU_SERIESCALC[w.kod]) })
        return
      }
      setStan((prev) => ({
        ...STAN_POCZATKOWY,
        ...prev,
        histDane: formatujHistorie(w.dane.lata),
        histZrodlo: "pvgis-seriescalc",
        histRodzaj: "naswietlenie-kwh-m2",
      }))
      setPvgisKomunikat({
        blad: false,
        tekst: t("UI-M7-DEFM-PVGIS-OK", { lata: w.dane.lata.length, baza: w.dane.meta.bazaPromieniowania }),
      })
    } catch {
      setPvgisKomunikat({ blad: true, tekst: t(KLUCZ_BLEDU_SERIESCALC.SIEC) })
    } finally {
      setPvgisPobiera(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/deficyty-miesieczne" />
      <NaglowekEkranu
        tytul={t("UI-M7-DEFM-TYTUL")}
        ekran="deficyty-miesieczne"
        wynik={result}
        parametry={{ procent: OPTYMALNE_OBCIAZENIE_PCT }}
      >
        {t("UI-M7-DEFM-OPIS")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DEFM-DEFICYTY")}</legend>
        <p className="text-caption text-muted-foreground">{t("UI-M7-DEFM-DEFICYTY-NOTATKA")}</p>
        <div className="grid grid-cols-3 gap-3">
          {KLUCZE_MIESIECY.map((klucz, i) => (
            <Pole
              key={klucz}
              label={t(klucz)}
              unit="kWh"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.deficyty[i] ?? ""}
              onChange={(e) =>
                setStan((prev) => ({
                  ...STAN_POCZATKOWY,
                  ...prev,
                  deficyty: prev.deficyty.map((d, j) => (j === i ? e.target.value : d)),
                }))
              }
              pomoc={<PomocPola ekran="deficyty-miesieczne" pole="deficyt" />}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DEFM-AGREGAT")}</legend>
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={t(label)}
            unit={unit.startsWith("UI-") ? t(unit) : unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => ustaw(pole, e.target.value)}
            pomoc={<PomocPola ekran="deficyty-miesieczne" pole={pole} />}
          />
        ))}
        <PoleSelect
          label={t("UI-M7-DEFM-HORYZONT")}
          value={stan.horyzont}
          onChange={(e) => ustaw("horyzont", e.target.value)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="horyzont" />}
        >
          {HORYZONTY.map((o) => (
            <option key={o.wartosc} value={o.wartosc}>
              {t(o.label)}
            </option>
          ))}
        </PoleSelect>
        {stan.horyzont === "wlasny" && (
          <Pole
            label={t("UI-M7-DEFM-HORYZONT-DNI")}
            unit={t("UI-J-DNI")}
            type="number"
            inputMode="numeric"
            min={1}
            max={366}
            value={stan.horyzontDni}
            onChange={(e) => ustaw("horyzontDni", e.target.value)}
            pomoc={<PomocPola ekran="deficyty-miesieczne" pole="horyzontDni" />}
          />
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DEFM-HIST-TYTUL")}</legend>
        <section className="flex flex-col gap-3 rounded-md border border-border p-3">
          <p className="text-small font-medium">{t("UI-M7-DEFM-PVGIS-TYTUL")}</p>
          <p className="text-caption text-muted-foreground">{t("UI-M7-DEFM-PVGIS-NOTATKA")}</p>
          <div className="grid grid-cols-2 gap-3">
            {POLA_PVGIS.map(({ pole, label, unit, min, max, krok }) => (
              <Pole
                key={pole}
                label={t(label)}
                unit={unit}
                type="number"
                inputMode="decimal"
                min={min}
                max={max}
                step={krok}
                value={stan[pole]}
                onChange={(e) => ustaw(pole, e.target.value)}
                pomoc={<PomocPola ekran="deficyty-miesieczne" pole={pole} />}
              />
            ))}
          </div>
          <Button className="min-h-11" disabled={pvgisPobiera} onClick={pobierzZPvgis}>
            {pvgisPobiera ? t("UI-M7-DEFM-PVGIS-POBIERA") : t("UI-M7-DEFM-PVGIS-PRZYCISK")}
          </Button>
          {pvgisKomunikat && (
            <p className={pvgisKomunikat.blad ? "text-small text-werdykt-blad-foreground" : "text-small"}>{pvgisKomunikat.tekst}</p>
          )}
        </section>
        <section className="flex flex-col gap-3 rounded-md border border-border p-3">
          <p className="text-small font-medium">{t("UI-M7-DEFM-TEL-TYTUL")}</p>
          <p className="text-caption text-muted-foreground">{t("UI-M7-DEFM-TEL-NOTATKA")}</p>
          {rejestr.zrodla.length === 0 ? (
            <p className="text-small">
              {t("UI-M7-DEFM-TEL-BRAK-ZRODEL")}{" "}
              <Link href="/kalkulatory/zrodla-telemetrii" className="underline">
                →
              </Link>
            </p>
          ) : (
            <>
              <PoleSelect
                label={t("UI-M7-DEFM-TEL-ZRODLO")}
                value={telZrodloId ?? ""}
                onChange={(e) => ustaw("telZrodlo", e.target.value)}
                pomoc={<PomocPola ekran="deficyty-miesieczne" pole="telZrodlo" />}
              >
                {rejestr.zrodla.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nazwa}
                  </option>
                ))}
              </PoleSelect>
              {kanalyMocy.length === 0 ? (
                <p className="text-small">{t("UI-M7-DEFM-TEL-BRAK-KANALOW")}</p>
              ) : (
                <>
                  <PoleSelect
                    label={t("UI-M7-DEFM-TEL-KANAL")}
                    value={telKanal ?? ""}
                    onChange={(e) => ustaw("telKanal", e.target.value)}
                    pomoc={<PomocPola ekran="deficyty-miesieczne" pole="telKanal" />}
                  >
                    {kanalyMocy.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </PoleSelect>
                  <Pole
                    label={t("UI-M7-DEFM-TEL-PRZERWA")}
                    unit="min"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={stan.telPrzerwaMin}
                    onChange={(e) => ustaw("telPrzerwaMin", e.target.value)}
                    pomoc={<PomocPola ekran="deficyty-miesieczne" pole="telPrzerwa" />}
                  />
                  <Button className="min-h-11" disabled={telLiczy} onClick={wstawZTelemetrii}>
                    {telLiczy ? t("UI-M7-DEFM-TEL-POBIERA") : t("UI-M7-DEFM-TEL-PRZYCISK")}
                  </Button>
                </>
              )}
            </>
          )}
          {telKomunikat && (
            <p className={telKomunikat.blad ? "text-small text-werdykt-blad-foreground" : "text-small"}>{telKomunikat.tekst}</p>
          )}
        </section>
        <PoleTekst
          label={t("UI-M7-DEFM-HIST-DANE")}
          podpis={t("UI-M7-DEFM-HIST-DANE-PODPIS")}
          spellCheck={false}
          value={stan.histDane}
          onChange={(e) => ustaw("histDane", e.target.value)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histDane" />}
        />
        {wklejone.nieczytelneLinie.length > 0 && (
          <p className="text-caption text-muted-foreground">
            {t("UI-M7-DEFM-HIST-NIECZYTELNE", { linie: wklejone.nieczytelneLinie.join(", ") })}
          </p>
        )}
        {braki.length > 0 && (
          <section className="flex flex-col gap-3 rounded-md border border-border p-3">
            <p className="text-small font-medium">{t("UI-M7-DEFM-BRAKI-TYTUL", { liczba: braki.length })}</p>
            <p className="text-caption text-muted-foreground">{t("UI-M7-DEFM-BRAKI-NOTATKA")}</p>
            <div className="grid grid-cols-2 gap-3">
              {braki.slice(0, MAKS_BRAKOW).map((b) => {
                const k = `${b.rok}-${b.dzien}`
                return (
                  <Pole
                    key={k}
                    label={dataDnia(b.rok, b.dzien)}
                    unit={stan.histRodzaj === "naswietlenie-kwh-m2" ? "kWh/m²" : t("UI-J-KWH-DOBA")}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={stan.histBraki[k] ?? ""}
                    onChange={(e) => ustaw("histBraki", { ...stan.histBraki, [k]: e.target.value })}
                    pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histBrak" />}
                  />
                )
              })}
            </div>
            {braki.length > MAKS_BRAKOW && (
              <p className="text-caption text-muted-foreground">
                {t("UI-M7-DEFM-BRAKI-WIECEJ", { pokazane: MAKS_BRAKOW, liczba: braki.length })}
              </p>
            )}
            <Button type="button" variant="outline" onClick={uzupelnijBraki}>
              {t("UI-M7-DEFM-BRAKI-PRZYCISK")}
            </Button>
          </section>
        )}
        <PoleSelect
          label={t("UI-M7-DEFM-HIST-ZRODLO")}
          value={stan.histZrodlo}
          onChange={(e) => ustaw("histZrodlo", e.target.value as ZrodloHistorii)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histZrodlo" />}
        >
          {ZRODLA.map((z) => (
            <option key={z.wartosc} value={z.wartosc}>
              {t(z.label)}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-M7-DEFM-HIST-RODZAJ")}
          value={stan.histRodzaj}
          onChange={(e) => ustaw("histRodzaj", e.target.value as RodzajDanychHistorii)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histRodzaj" />}
        >
          <option value="produkcja-pv-kwh">{t("UI-M7-DEFM-RODZAJ-PRODUKCJA")}</option>
          <option value="naswietlenie-kwh-m2">{t("UI-M7-DEFM-RODZAJ-NASWIETLENIE")}</option>
        </PoleSelect>
        {stan.histRodzaj === "naswietlenie-kwh-m2" && (
          <>
            <Pole
              label={t("UI-M7-DEFM-HIST-KWP")}
              unit="kWp"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.histKwp}
              onChange={(e) => ustaw("histKwp", e.target.value)}
              pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histKwp" />}
            />
            <Pole
              label={t("UI-M7-DEFM-HIST-PR")}
              type="number"
              inputMode="decimal"
              min={0}
              max={1}
              step={0.01}
              value={stan.histPr}
              onChange={(e) => ustaw("histPr", e.target.value)}
              pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histPr" />}
            />
          </>
        )}
        <PoleSelect
          label={t("UI-M7-DEFM-POPYT-TRYB")}
          value={stan.histPopytTryb}
          onChange={(e) => ustaw("histPopytTryb", e.target.value as FormularzStan["histPopytTryb"])}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histPopytTryb" />}
        >
          <option value="jeden">{t("UI-M7-DEFM-POPYT-JEDNO")}</option>
          <option value="miesiace">{t("UI-M7-DEFM-POPYT-MIESIACE")}</option>
        </PoleSelect>
        {stan.histPopytTryb === "miesiace" ? (
          <>
            {zuzycieMiesieczne && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  ustaw(
                    "histPopytMiesiace",
                    zuzycieMiesieczne.map((kwh, i) => String(Math.round((kwh / DNI_W_MIESIACU[i]!) * 100) / 100)),
                  )
                }
              >
                {t("UI-M7-DEFM-POPYT-WSTAW")}
              </Button>
            )}
            <div className="grid grid-cols-3 gap-3">
              {KLUCZE_MIESIECY.map((klucz, i) => (
                <Pole
                  key={klucz}
                  label={t(klucz)}
                  unit={t("UI-J-KWH-DOBA")}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={stan.histPopytMiesiace[i] ?? ""}
                  onChange={(e) =>
                    ustaw(
                      "histPopytMiesiace",
                      stan.histPopytMiesiace.map((d, j) => (j === i ? e.target.value : d)),
                    )
                  }
                  pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histPopytMiesiac" />}
                />
              ))}
            </div>
            {stan.histPopytMiesiace.some((x) => x === "") && (
              <p className="text-caption text-muted-foreground">{t("UI-M7-DEFM-POPYT-NIEPELNE")}</p>
            )}
          </>
        ) : (
          <Pole
            label={t("UI-M7-DEFM-HIST-POPYT")}
            unit={t("UI-J-KWH-DOBA")}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.histPopyt}
            onChange={(e) => ustaw("histPopyt", e.target.value)}
            pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histPopyt" />}
          />
        )}
        <Pole
          label={t("UI-M7-DEFM-HIST-OKNO")}
          unit={t("UI-J-DNI")}
          type="number"
          inputMode="numeric"
          min={1}
          max={366}
          value={stan.histOkno}
          onChange={(e) => ustaw("histOkno", e.target.value)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histOkno" />}
        />
        <Pole
          label={t("UI-M7-DEFM-HIST-PERCENTYL")}
          unit="%"
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          value={stan.histPercentyl}
          onChange={(e) => ustaw("histPercentyl", e.target.value)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histPercentyl" />}
        />
        <Pole
          label={t("UI-M7-DEFM-HIST-PROG")}
          unit="%"
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          value={stan.histProg}
          onChange={(e) => ustaw("histProg", e.target.value)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histProg" />}
        />
        <Pole
          label={t("UI-M7-DEFM-HIST-NOC")}
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={stan.histNoc}
          onChange={(e) => ustaw("histNoc", e.target.value)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histNoc" />}
        />
        <Pole
          label={t("UI-M7-DEFM-HIST-MAG-POJ")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.histMagPoj}
          onChange={(e) => ustaw("histMagPoj", e.target.value)}
          pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histMagPoj" />}
        />
        {liczba(stan.histMagPoj) > 0 && (
          <>
            <Pole
              label={t("UI-M7-DEFM-HIST-MAG-SPR")}
              unit="%"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={stan.histMagSpr}
              onChange={(e) => ustaw("histMagSpr", e.target.value)}
              pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histMagSpr" />}
            />
            {sprawnoscM14 !== "" && sprawnoscM14 !== stan.histMagSpr && (
              <Button type="button" variant="outline" onClick={() => ustaw("histMagSpr", sprawnoscM14)}>
                {t("UI-M7-DEFM-MAG-SPR-WSTAW", { procent: sprawnoscM14 })}
              </Button>
            )}
            <Pole
              label={t("UI-M7-DEFM-HIST-MAG-STAN")}
              unit="%"
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={stan.histMagStan}
              onChange={(e) => ustaw("histMagStan", e.target.value)}
              pomoc={<PomocPola ekran="deficyty-miesieczne" pole="histMagStan" />}
            />
          </>
        )}
        <p className="text-caption text-muted-foreground">{t("UI-M7-DEFM-LADOWANIE-NOTATKA")}</p>
        <Link href="/kalkulatory/ladowanie-z-agregatu" className="text-small underline">
          {t("UI-M7-DEFM-LINK-LADOWANIE")}
        </Link>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-DEFM-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-DEFM-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M7-DEFM-W-UWAGA" : "UI-M7-DEFM-W-OK")}>
          <WynikGlowny>
            {t("UI-M7-DEFM-WYNIK", { godziny: r1(v.sumaGodzin), litry: r1(v.sumaPaliwaL), zl: Math.round(v.sumaKosztZl) })}
          </WynikGlowny>

          {v.lancuch && (
            <div className="mt-3 flex flex-col gap-1 text-small">
              <p className="font-medium">{t("UI-M7-DEFM-LANCUCH-TYTUL")}</p>
              <p>
                {t("UI-M7-DEFM-LANCUCH-MOC", { kw: r1(v.lancuch.mocUzytecznaKw), procent: OPTYMALNE_OBCIAZENIE_PCT })}
              </p>
              <p>
                {t("UI-M7-DEFM-LANCUCH-LKWH", {
                  l: Math.round(v.lancuch.litryNaKwh * 1000) / 1000,
                  zl: Math.round(v.lancuch.kosztPaliwaNaKwhZl * 100) / 100,
                })}
              </p>
              <p>
                {t("UI-M7-DEFM-LANCUCH-ENERGIA", {
                  kwh: r1(v.lancuch.energiaKwh),
                  godziny: r1(v.lancuch.godzinyPracy),
                  litry: r1(v.lancuch.paliwoL),
                })}
              </p>
            </div>
          )}

          <table className="mt-3 w-full text-small tabular-nums">
            <thead>
              <tr className="text-left">
                <th className="font-medium">{t("UI-M7-DEFM-K-MIESIAC")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-DEFICYT")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-GODZINY")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-PALIWO")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-KOSZT")}</th>
              </tr>
            </thead>
            <tbody>
              {v.miesiace.map((m) => (
                <tr key={m.miesiac}>
                  <td>{t(KLUCZE_MIESIECY[m.miesiac - 1]!)}</td>
                  <td>{r1(m.deficytKwh)}</td>
                  <td>{r1(m.godzinyPracy)}</td>
                  <td>{r1(m.paliwoL)}</td>
                  <td>{Math.round(m.kosztZl)}</td>
                </tr>
              ))}
              {v.miesiaceBezDanych.map((m) => (
                <tr key={`brak-${m}`} className="text-muted-foreground">
                  <td>{t(KLUCZE_MIESIECY[m - 1]!)}</td>
                  <td colSpan={4}>{t("UI-M7-DEFM-BRAK-DANYCH")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {v.horyzonty.length > 0 && v.miesiacNajdluzszy !== null && (
            <div className="mt-4">
              <p className="text-small font-medium">
                {t("UI-M7-DEFM-HOR-TYTUL", { miesiac: t(KLUCZE_MIESIECY[v.miesiacNajdluzszy - 1]!) })}
              </p>
              <table className="mt-1 w-full text-small tabular-nums">
                <thead>
                  <tr className="text-left">
                    <th className="font-medium">{t("UI-M7-DEFM-K-HORYZONT")}</th>
                    <th className="font-medium">{t("UI-M7-DEFM-K-GODZINY")}</th>
                    <th className="font-medium">{t("UI-M7-DEFM-K-PALIWO")}</th>
                    <th className="font-medium">{t("UI-M7-DEFM-K-ZAPAS")}</th>
                  </tr>
                </thead>
                <tbody>
                  {v.horyzonty.map((x) => (
                    <tr key={x.klucz} className={x.wybrany ? "font-medium" : undefined}>
                      <td>
                        {x.klucz === "miesiac"
                          ? t("UI-M7-DEFM-HOR-MIESIAC", { dni: x.dni })
                          : t("UI-M7-DEFM-HOR-DNI", { dni: x.dni })}
                      </td>
                      <td>{r1(x.godzinyPracy)}</td>
                      <td>{r1(x.paliwoL)}</td>
                      <td>
                        {x.zapasWystarcza === null
                          ? "—"
                          : t(x.zapasWystarcza ? "UI-M7-DEFM-ZAPAS-TAK" : "UI-M7-DEFM-ZAPAS-NIE")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {h && (
            <div className="mt-4 flex flex-col gap-2 text-small">
              <p className="font-medium">{t("UI-M7-DEFM-HIST-WYNIK-TYTUL")}</p>
              <p>
                {t("UI-M7-DEFM-HIST-ZRODLO-INFO", {
                  zrodlo: t(ZRODLA.find((z) => z.wartosc === h.zrodlo)!.label),
                  lata: h.liczbaLat,
                  dni: h.liczbaDniZDanymi,
                })}
              </p>
              {zh && (
                <p>
                  {zh.litryPercentyl !== null
                    ? t("UI-M7-DEFM-HIST-OKNO-WYNIK", {
                        okno: zh.oknoDni,
                        min: r1(zh.litryMin),
                        med: r1(zh.litryMediana),
                        p: zh.percentylPct,
                        perc: r1(zh.litryPercentyl),
                        max: r1(zh.litryMax),
                      })
                    : t("UI-M7-DEFM-HIST-OKNO-BEZ-P", {
                        okno: zh.oknoDni,
                        min: r1(zh.litryMin),
                        med: r1(zh.litryMediana),
                        max: r1(zh.litryMax),
                      })}
                </p>
              )}
              {zh && zh.lataPokryte !== null && (
                <p>{t("UI-M7-DEFM-HIST-LATA-POKRYTE", { pokryte: zh.lataPokryte, lata: zh.lata })}</p>
              )}
              {h.serie && (
                <p>
                  {h.serie.rozklad.percentyl !== null
                    ? t("UI-M7-DEFM-HIST-SERIE", {
                        dni: h.serie.najdluzszaDni,
                        min: h.serie.rozklad.min,
                        med: h.serie.rozklad.mediana,
                        p: stan.histPercentyl,
                        perc: h.serie.rozklad.percentyl,
                      })
                    : t("UI-M7-DEFM-HIST-SERIE-BEZ-P", {
                        dni: h.serie.najdluzszaDni,
                        min: h.serie.rozklad.min,
                        med: h.serie.rozklad.mediana,
                        max: h.serie.rozklad.max,
                      })}
                </p>
              )}
              {h.miesiace.length > 0 && (
                <>
                  <p className="font-medium">{t("UI-M7-DEFM-HIST-MIES-TYTUL")}</p>
                  <table className="w-full tabular-nums">
                    <thead>
                      <tr className="text-left">
                        <th className="font-medium">{t("UI-M7-DEFM-K-MIESIAC")}</th>
                        <th className="font-medium">{t("UI-M7-DEFM-K-MIN")}</th>
                        <th className="font-medium">{t("UI-M7-DEFM-K-MED")}</th>
                        <th className="font-medium">{t("UI-M7-DEFM-K-MAX")}</th>
                        <th className="font-medium">{t("UI-M7-DEFM-K-LATA")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {h.miesiace.map((m) => (
                        <tr key={m.miesiac}>
                          <td>{t(KLUCZE_MIESIECY[m.miesiac - 1]!)}</td>
                          <td>{r1(m.deficytKwh.min)}</td>
                          <td>{r1(m.deficytKwh.mediana)}</td>
                          <td>{r1(m.deficytKwh.max)}</td>
                          <td>{m.liczbaLat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}

          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/agregat-pradotworczy" className="text-small underline">
        {t("UI-M7-DEFM-LINK-M2")}
      </Link>
    </main>
  )
}
