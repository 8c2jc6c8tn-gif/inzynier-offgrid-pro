"use client"

import { useMemo, useState } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import { calculateOdstepRzedow, type OdstepRzedowResult } from "@/lib/core/modules/pv/odstep-rzedow/calculator"
import { OKNO_PROJEKTOWE_DOMYSLNE } from "@/lib/core/modules/pv/odstep-rzedow/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba, powierzchnieZModelu } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
/** Solar-time hour 9.5 → "9:30". */
const godz = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`

type Stan = {
  powierzchniaId: string
  nachylenie: string
  azymut: string
  albedo: string
  katalogId: string
  uklad: "pionowy" | "poziomy"
  dlugoscPanelu: string
  szerokoscPanelu: string
  panelowWPionie: string
  oknoOd: string
  oknoDo: string
  odstep: string
  docelowaStrata: string
  liczbaRzedow: string
}

const STAN_POCZATKOWY: Stan = {
  powierzchniaId: "",
  nachylenie: "",
  azymut: "180",
  albedo: "",
  katalogId: "",
  uklad: "pionowy",
  dlugoscPanelu: "",
  szerokoscPanelu: "",
  panelowWPionie: "1",
  oknoOd: String(OKNO_PROJEKTOWE_DOMYSLNE.odH),
  oknoDo: String(OKNO_PROJEKTOWE_DOMYSLNE.doH),
  odstep: "",
  docelowaStrata: "",
  liczbaRzedow: "",
}

type Zakladka = "katy" | "krzywa" | "schemat" | "zalozenia"
const ZAKLADKI: Zakladka[] = ["katy", "krzywa", "schemat", "zalozenia"]
const ETYKIETY: Record<Zakladka, string> = {
  katy: "UI-ODRZ-TAB-KATY",
  krzywa: "UI-ODRZ-TAB-KRZYWA",
  schemat: "UI-ODRZ-TAB-SCHEMAT",
  zalozenia: "UI-ODRZ-TAB-ZALOZENIA",
}

/** Cross-section of two rows to scale: the ray of the sun that sets the pitch starts at the first row's upper edge. */
function Schemat({ v, odstepM }: { v: OdstepRzedowResult; odstepM: number }) {
  const t = useTranslate()
  const d = v.rzutPoziomyM
  const h = v.wysokoscGornejKrawedziM
  const zasieg = v.wspolczynnikCienia * h
  const xMaks = Math.max(odstepM + d, d + zasieg) * 1.04
  const W = 360
  const lewy = 8
  const s = (W - 2 * lewy) / xMaks
  const wys = Math.max(60, h * s + 34)
  const grunt = wys - 22
  const x = (m: number) => lewy + m * s
  const y = (m: number) => grunt - m * s
  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${wys}`} className="w-full text-foreground" role="img" aria-label={t("UI-ODRZ-SCHEMAT-ARIA")}>
        <line x1={0} x2={W} y1={grunt} y2={grunt} className="stroke-border" strokeWidth={1} />
        {[0, odstepM].map((p, i) => (
          <line key={i} x1={x(p)} y1={y(0)} x2={x(p + d)} y2={y(h)} style={{ stroke: "var(--seria-1)" }} strokeWidth={4} strokeLinecap="round" />
        ))}
        {zasieg > 0 && (
          <>
            <line x1={x(d)} y1={y(h)} x2={x(d + zasieg)} y2={y(0)} className="stroke-foreground" strokeWidth={1} strokeDasharray="4 3" />
            <circle cx={x(d + zasieg)} cy={y(0)} r={3} style={{ fill: "var(--seria-2)" }} />
            <text x={Math.min(x(d + zasieg), W - lewy)} y={grunt + 14} textAnchor="end" className="fill-muted-foreground text-[9px]">
              {t("UI-ODRZ-SCHEMAT-CIEN", { x: f1(zasieg) })}
            </text>
          </>
        )}
        <line x1={x(0)} x2={x(odstepM)} y1={grunt + 6} y2={grunt + 6} className="stroke-muted-foreground" strokeWidth={1} />
        <text x={x(0)} y={grunt + 18} className="fill-muted-foreground text-[9px]">
          {t("UI-ODRZ-SCHEMAT-ODSTEP", { odstep: f1(odstepM) })}
        </text>
      </svg>
      <figcaption className="text-caption text-muted-foreground">{t("UI-ODRZ-SCHEMAT-OPIS")}</figcaption>
    </figure>
  )
}

export default function OdstepRzedowPage() {
  const t = useTranslate()
  const { skaner, lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<Stan>("odstep-rzedow", STAN_POCZATKOWY)
  const [zakladka, setZakladka] = useState<Zakladka>("katy")
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))
  const powierzchnie = useMemo(() => powierzchnieZModelu(skaner.value), [skaner.value])

  const bokMm = liczba(stan.uklad === "pionowy" ? stan.dlugoscPanelu : stan.szerokoscPanelu)
  const wPionie = liczba(stan.panelowWPionie)
  const dlugoscStoluM = bokMm !== undefined && wPionie !== undefined ? (bokMm / 1000) * wPionie : null
  const odstepWpisany = liczba(stan.odstep) ?? null

  const result = useMemo(
    () =>
      calculateOdstepRzedow({
        szerokoscGeograficzna: lokalizacja?.szerokosc ?? null,
        dlugoscGeograficzna: lokalizacja?.dlugosc ?? null,
        nachylenieDeg: liczba(stan.nachylenie) ?? null,
        azymutDeg: liczba(stan.azymut) ?? null,
        dlugoscWzdluzSpaduM: dlugoscStoluM,
        oknoOdH: liczba(stan.oknoOd) ?? null,
        oknoDoH: liczba(stan.oknoDo) ?? null,
        odstepM: odstepWpisany,
        docelowaStrataZimaPct: liczba(stan.docelowaStrata) ?? null,
        liczbaRzedow: liczba(stan.liczbaRzedow) ?? null,
        ...(liczba(stan.albedo) !== undefined ? { albedo: liczba(stan.albedo)! } : {}),
        ...(dane ? { daneGodzinowe: dane.dane.rekordy } : {}),
      }),
    [lokalizacja, stan, dlugoscStoluM, odstepWpisany, dane],
  )

  if (!wczytano) return <StanLadowania linie={6} />

  const v = result.value
  const wynikGotowy = result.status === "VALID" || result.status === "VALID_WITH_WARNINGS"

  function wybierzPowierzchnie(id: string) {
    const p = powierzchnie.find((x) => x.id === id)
    setStan((prev) => ({ ...prev, powierzchniaId: id, ...(p ? { nachylenie: String(p.nachylenieDeg), azymut: String(p.azymutDeg) } : {}) }))
  }

  function wybierzZKatalogu(id: string) {
    const k = KATALOG_PANELI_PV.find((x) => x.id === id)
    setStan((prev) => ({
      ...prev,
      katalogId: id,
      ...(k && k.dlugoscMm !== null && k.szerokoscMm !== null ? { dlugoscPanelu: String(k.dlugoscMm), szerokoscPanelu: String(k.szerokoscMm) } : {}),
    }))
  }

  const od = godz(liczba(stan.oknoOd) ?? 0)
  const doH = godz(liczba(stan.oknoDo) ?? 0)
  const zad = v?.zadanyOdstep ?? null
  const strata = zad?.strata ?? null
  const tabela = v?.tabelaKatow ?? []
  const maStraty = tabela.some((w) => w.strata !== null)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/odstep-rzedow" />
      <NaglowekEkranu tytul={t("UI-ODRZ-TYTUL")} ekran="odstep-rzedow" wynik={wynikGotowy ? result : null}>
        {t("UI-ODRZ-OPIS")}
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />
      {lokalizacja === null && (
        <p role="status" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small text-werdykt-uwaga-foreground">
          {t("UI-ODRZ-BRAK-LOKALIZACJI")}
        </p>
      )}
      {lokalizacja !== null && dane === null && (
        <p role="status" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small text-werdykt-uwaga-foreground">
          {t("UI-ODRZ-BRAK-DANYCH-POGODOWYCH")}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-ODRZ-KROK-PANELE")}</h2>
        {powierzchnie.length > 0 && (
          <PoleSelect
            label={t("UI-ODRZ-POWIERZCHNIA")}
            value={stan.powierzchniaId}
            onChange={(e) => wybierzPowierzchnie(e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="powierzchnia" />}
          >
            <option value="">{t("UI-ODRZ-POWIERZCHNIA-WLASNA")}</option>
            {powierzchnie.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.nazwa} (${p.nachylenieDeg}°, ${p.azymutDeg}°)`}
              </option>
            ))}
          </PoleSelect>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-ODRZ-NACHYLENIE")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={90}
            step="any"
            value={stan.nachylenie}
            onChange={(e) => ustaw("nachylenie", e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="nachylenie" />}
          />
          <Pole
            label={t("UI-ODRZ-AZYMUT")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={360}
            step="any"
            value={stan.azymut}
            onChange={(e) => ustaw("azymut", e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="azymut" />}
          />
        </div>
        <Pole
          label={t("UI-ODRZ-ALBEDO")}
          type="number"
          inputMode="decimal"
          min={0}
          max={1}
          step="any"
          value={stan.albedo}
          onChange={(e) => ustaw("albedo", e.target.value)}
          pomoc={<PomocPola ekran="odstep-rzedow" pole="albedo" />}
        />
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-ODRZ-ALBEDO-PODPIS")}</p>
        <PoleSelect
          label={t("UI-ODRZ-Z-KATALOGU")}
          value={stan.katalogId}
          onChange={(e) => wybierzZKatalogu(e.target.value)}
          pomoc={<PomocPola ekran="odstep-rzedow" pole="katalog" />}
        >
          <option value="">{t("UI-ODRZ-KATALOG-WYBIERZ")}</option>
          {KATALOG_PANELI_PV.filter((k) => k.dlugoscMm !== null && k.szerokoscMm !== null).map((k) => (
            <option key={k.id} value={k.id}>
              {k.nazwa}
            </option>
          ))}
        </PoleSelect>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-ODRZ-DLUGOSC-PANELU")}
            unit="mm"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={stan.dlugoscPanelu}
            onChange={(e) => setStan((prev) => ({ ...prev, dlugoscPanelu: e.target.value, katalogId: "" }))}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="dlugoscPanelu" />}
          />
          <Pole
            label={t("UI-ODRZ-SZEROKOSC-PANELU")}
            unit="mm"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={stan.szerokoscPanelu}
            onChange={(e) => setStan((prev) => ({ ...prev, szerokoscPanelu: e.target.value, katalogId: "" }))}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="szerokoscPanelu" />}
          />
        </div>
        <div className="flex flex-col gap-3">
          <PoleSelect
            label={t("UI-ODRZ-UKLAD")}
            value={stan.uklad}
            onChange={(e) => ustaw("uklad", e.target.value as Stan["uklad"])}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="uklad" />}
          >
            <option value="pionowy">{t("UI-ODRZ-UKLAD-PION")}</option>
            <option value="poziomy">{t("UI-ODRZ-UKLAD-POZIOM")}</option>
          </PoleSelect>
          <Pole
            label={t("UI-ODRZ-PANELE-W-PIONIE")}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={stan.panelowWPionie}
            onChange={(e) => ustaw("panelowWPionie", e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="panelowWPionie" />}
          />
        </div>
        {dlugoscStoluM !== null && <p className="text-small">{t("UI-ODRZ-DLUGOSC-STOLU", { l: f2(dlugoscStoluM) })}</p>}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-ODRZ-KROK-REGULA")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-ODRZ-OKNO-OD")}
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step="any"
            value={stan.oknoOd}
            onChange={(e) => ustaw("oknoOd", e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="oknoOd" />}
          />
          <Pole
            label={t("UI-ODRZ-OKNO-DO")}
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step="any"
            value={stan.oknoDo}
            onChange={(e) => ustaw("oknoDo", e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="oknoDo" />}
          />
        </div>
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-ODRZ-OKNO-PODPIS")}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-ODRZ-KROK-OPCJE")}</h2>
        <Pole
          label={t("UI-ODRZ-ODSTEP")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={stan.odstep}
          onChange={(e) => ustaw("odstep", e.target.value)}
          pomoc={<PomocPola ekran="odstep-rzedow" pole="odstep" />}
        />
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-ODRZ-ODSTEP-PODPIS")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-ODRZ-DOCELOWA")}
            unit="%"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="any"
            value={stan.docelowaStrata}
            onChange={(e) => ustaw("docelowaStrata", e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="docelowaStrata" />}
          />
          <Pole
            label={t("UI-ODRZ-LICZBA-RZEDOW")}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={stan.liczbaRzedow}
            onChange={(e) => ustaw("liczbaRzedow", e.target.value)}
            pomoc={<PomocPola ekran="odstep-rzedow" pole="liczbaRzedow" />}
          />
        </div>
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-ODRZ-DOCELOWA-PODPIS")}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-ODRZ-KROK-WYNIK")}</h2>
        {result.status === "INVALID_INPUT" ? (
          <WerdyktPanel poziom="blad" etykieta={t("UI-ODRZ-BLAD")}>
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : result.status === "INCOMPLETE" || v === null ? (
          <div className="flex flex-col gap-2">
            <p className="text-small text-muted-foreground">{t("UI-ODRZ-UZUPELNIJ")}</p>
            {result.warnings.length > 0 && <WynikSzczegoly assumptions={[]} warnings={result.warnings} />}
          </div>
        ) : (
          <>
            <WerdyktPanel poziom={result.status === "VALID" ? "ok" : "uwaga"} etykieta={t("UI-ODRZ-WERDYKT")}>
              <WynikGlowny>
                {t("UI-ODRZ-GC-ODSTEP", { od, do: doH, odstep: f1(v.odstepWymaganyM), przerwa: f1(v.przerwaWymaganaM), zab: f0(v.wspolczynnikZabudowy * 100) })}
              </WynikGlowny>
              {v.decydujaca ? (
                <p className="mt-1 text-small">
                  {t("UI-ODRZ-GC-DECYDUJE", { czas: godz(v.decydujaca.czasSlonecznyH), wys: f1(v.decydujaca.wysokoscSloncaDeg), az: f0(v.decydujaca.azymutSloncaDeg) })}
                </p>
              ) : (
                <p className="mt-1 text-small">{t("UI-ODRZ-GC-BEZ-CIENIA", { odstep: f1(v.rzutPoziomyM) })}</p>
              )}
              {zad && (
                <p className="mt-1 text-small">
                  {zad.bezCieniaWOknie
                    ? t("UI-ODRZ-GC-ZADANY-BEZ", { odstep: f1(zad.odstepM), od, do: doH })
                    : t("UI-ODRZ-GC-ZADANY-CIEN", { odstep: f1(zad.odstepM), proc: f0(zad.maksCzescZacieniona * 100), czas: zad.czasMaksH === null ? "—" : godz(zad.czasMaksH) })}
                </p>
              )}
              {strata && (
                <p className="mt-1 text-small">
                  {t("UI-ODRZ-GC-STRATA", { zima: f1(strata.zimaPct), rok: f1(strata.rokPct) })}
                  {v.wagaRzedowZacienianych < 1 && liczba(stan.liczbaRzedow) !== undefined && (
                    <> {t("UI-ODRZ-GC-STRATA-SREDNIA", { n: liczba(stan.liczbaRzedow)!, zima: f1(strata.zimaPct * v.wagaRzedowZacienianych), rok: f1(strata.rokPct * v.wagaRzedowZacienianych) })}</>
                  )}
                </p>
              )}
              {v.odstepDlaStraty && (
                <p className="mt-1 text-small">
                  {t("UI-ODRZ-GC-DLA-STRATY", { cel: f1(v.odstepDlaStraty.docelowaPct), odstep: f2(v.odstepDlaStraty.odstepM), przerwa: f2(v.odstepDlaStraty.przerwaM) })}
                </p>
              )}
              {v.najlepszyKatNaGruncieDeg !== null && (
                <p className="mt-1 text-small">{t("UI-ODRZ-GC-NAJLEPSZY-KAT", { kat: f0(v.najlepszyKatNaGruncieDeg) })}</p>
              )}
              <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
            </WerdyktPanel>

            <div role="tablist" aria-label={t("UI-ODRZ-KROK-WYNIK")} className="flex flex-wrap gap-2">
              {ZAKLADKI.map((z) => (
                <Button key={z} role="tab" aria-selected={z === zakladka} variant={z === zakladka ? "default" : "outline"} className="min-h-11" onClick={() => setZakladka(z)}>
                  {t(ETYKIETY[z])}
                </Button>
              ))}
            </div>

            {zakladka === "katy" && (
              <div className="flex flex-col gap-2">
                <p className="text-caption text-muted-foreground">
                  {zad ? t("UI-ODRZ-KATY-OPIS-ODSTEP", { odstep: f1(zad.odstepM) }) : t("UI-ODRZ-KATY-OPIS-REGULA")}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="text-left">
                        <th className="p-1 font-medium">{t("UI-ODRZ-COL-KAT")}</th>
                        <th className="p-1 font-medium">{t("UI-ODRZ-COL-ODSTEP")}</th>
                        <th className="p-1 font-medium">{t("UI-ODRZ-COL-PRZERWA")}</th>
                        <th className="p-1 font-medium">{t("UI-ODRZ-COL-ZABUDOWA")}</th>
                        {maStraty && <th className="p-1 font-medium">{t("UI-ODRZ-COL-STRATA-ZIMA")}</th>}
                        {maStraty && <th className="p-1 font-medium">{t("UI-ODRZ-COL-ZIMA-PO")}</th>}
                        {maStraty && <th className="p-1 font-medium">{t("UI-ODRZ-COL-ZIMA-GRUNT")}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {tabela.map((w) => {
                        const twoj = w.katDeg === liczba(stan.nachylenie)
                        const najlepszy = w.katDeg === v.najlepszyKatNaGruncieDeg
                        return (
                          <tr key={w.katDeg} className={`border-t align-top ${twoj ? "font-semibold" : ""} ${najlepszy ? "bg-werdykt-ok-bg" : ""}`}>
                            <td className="p-1">
                              {w.katDeg}°{twoj ? ` · ${t("UI-ODRZ-KAT-TWOJ")}` : ""}
                              {najlepszy ? ` · ${t("UI-ODRZ-KAT-NAJLEPSZY")}` : ""}
                            </td>
                            <td className="p-1 tabular-nums">{f2(w.odstepWymaganyM)}</td>
                            <td className="p-1 tabular-nums">{f2(w.przerwaWymaganaM)}</td>
                            <td className="p-1 tabular-nums">{f0(w.wspolczynnikZabudowy * 100)}</td>
                            {maStraty &&
                              (w.odstepZaMaly ? (
                                <td className="p-1 italic text-muted-foreground" colSpan={3}>
                                  {t("UI-ODRZ-ZA-MALY")}
                                </td>
                              ) : (
                                <>
                                  <td className="p-1 tabular-nums">{w.strata ? f1(w.strata.zimaPct) : "—"}</td>
                                  <td className="p-1 tabular-nums">{w.strata ? f1(w.strata.zimaPoCieniuKwhM2) : "—"}</td>
                                  <td className="p-1 tabular-nums">{w.zimaNaM2GruntuKwh === null ? "—" : f1(w.zimaNaM2GruntuKwh)}</td>
                                </>
                              ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {zakladka === "krzywa" && (
              <div className="flex flex-col gap-2">
                {v.krzywaStrat === null ? (
                  <p className="text-small text-muted-foreground">{t("UI-ODRZ-KRZYWA-WYMAGA")}</p>
                ) : (
                  <>
                    <p className="text-caption text-muted-foreground">{t("UI-ODRZ-KRZYWA-OPIS")}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-small">
                        <thead>
                          <tr className="text-left">
                            <th className="p-1 font-medium">{t("UI-ODRZ-KRZYWA-COL-PRZERWA")}</th>
                            <th className="p-1 font-medium">{t("UI-ODRZ-KRZYWA-COL-ODSTEP")}</th>
                            <th className="p-1 font-medium">{t("UI-ODRZ-KRZYWA-COL-ZIMA")}</th>
                            <th className="p-1 font-medium">{t("UI-ODRZ-KRZYWA-COL-ROK")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {v.krzywaStrat.map((p) => (
                            <tr key={p.odstepM} className="border-t">
                              <td className="p-1 tabular-nums">{f2(p.przerwaM)}</td>
                              <td className="p-1 tabular-nums">{f2(p.odstepM)}</td>
                              <td className="p-1 tabular-nums">{f1(p.strata.zimaPct)}</td>
                              <td className="p-1 tabular-nums">{f1(p.strata.rokPct)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {zakladka === "schemat" && <Schemat v={v} odstepM={zad?.odstepM ?? v.odstepWymaganyM} />}

            {zakladka === "zalozenia" && <WynikSzczegoly assumptions={result.assumptions} warnings={[]} />}
          </>
        )}
      </section>
    </main>
  )
}
