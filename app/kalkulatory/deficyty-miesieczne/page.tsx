"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateDeficytyMiesieczne } from "@/lib/core/modules/stress-test/deficyty-miesieczne/calculator"
import type {
  DeficytyMiesieczneInput,
  RodzajDanychHistorii,
  ZrodloHistorii,
} from "@/lib/core/modules/stress-test/deficyty-miesieczne/input"
import { parsujHistorie } from "@/lib/core/modules/stress-test/deficyty-miesieczne/parsuj-historie"
import { OPTYMALNE_OBCIAZENIE_PCT } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect, PoleTekst } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KLUCZE_MIESIECY } from "@/components/siec/zuzycie-miesieczne"

type PolaAgregatu = "moc" | "zuzycie" | "cena" | "serwis" | "zapas"
type PolaHistorii = "horyzontDni" | "histKwp" | "histPr" | "histPopyt" | "histOkno" | "histPercentyl" | "histProg"
type FormularzStan = Record<PolaAgregatu | PolaHistorii, string> & {
  deficyty: string[]
  /** "" = month by month; "3" | "7" | "14" | "miesiac" | "wlasny". */
  horyzont: string
  histDane: string
  histZrodlo: ZrodloHistorii
  histRodzaj: RodzajDanychHistorii
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
  histOkno: "",
  histPercentyl: "",
  histProg: "",
}

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
const r1 = (x: number) => Math.round(x * 10) / 10

export default function DeficytyMiesiecznePage() {
  const t = useTranslate()
  const [zapisany, setStan] = usePersistedDraft<FormularzStan>("deficyty-miesieczne", STAN_POCZATKOWY)
  // A draft saved before the history fields existed lacks them — fill from the defaults.
  const stan = useMemo<FormularzStan>(() => ({ ...STAN_POCZATKOWY, ...zapisany }), [zapisany])
  const wklejone = useMemo(() => parsujHistorie(stan.histDane), [stan.histDane])

  const result = useMemo(() => {
    const wejscie: DeficytyMiesieczneInput = {
      deficytyKwh: stan.deficyty.map(liczba),
      mocAgregatuKw: liczba(stan.moc),
      zuzyciePaliwaLH: liczba(stan.zuzycie),
      cenaPaliwaZlL: liczba(stan.cena),
      kosztSerwisuZlH: liczba(stan.serwis),
      zapasPaliwaL: liczba(stan.zapas),
    }
    if (stan.horyzont === "miesiac") wejscie.horyzont = { rodzaj: "miesiac" }
    else if (stan.horyzont === "wlasny") {
      if (stan.horyzontDni !== "") wejscie.horyzont = { rodzaj: "dni", dni: liczba(stan.horyzontDni) }
    } else if (stan.horyzont !== "") wejscie.horyzont = { rodzaj: "dni", dni: Number(stan.horyzont) }

    if (wklejone.lata.length > 0) {
      wejscie.historia = {
        zrodlo: stan.histZrodlo,
        rodzaj: stan.histRodzaj,
        lata: wklejone.lata,
        ...(stan.histRodzaj === "naswietlenie-kwh-m2"
          ? { przeliczenie: { mocPvKwp: liczba(stan.histKwp), wspolczynnikPr: liczba(stan.histPr) } }
          : {}),
      }
      if (stan.histPopyt !== "") wejscie.zapotrzebowanieDobaKwh = Array.from({ length: 12 }, () => liczba(stan.histPopyt))
      wejscie.analizaHistorii = {
        oknoDni: liczba(stan.histOkno),
        percentylPct: liczba(stan.histPercentyl),
        progSlabegoDniaPct: liczba(stan.histProg),
      }
    }
    return calculateDeficytyMiesieczne(wejscie)
  }, [stan, wklejone])
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")
  const h = v.historia
  const zh = v.zapasZHistorii
  const ustaw = <K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) =>
    setStan((prev) => ({ ...STAN_POCZATKOWY, ...prev, [pole]: wartosc }))

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

          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/agregat-pradotworczy" className="text-small underline">
        {t("UI-M7-DEFM-LINK-M2")}
      </Link>
    </main>
  )
}
