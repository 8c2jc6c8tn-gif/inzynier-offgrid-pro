"use client"

import Link from "next/link"
import { useMemo } from "react"
import { TemperaturyZPvgis } from "@/components/lokalizacja/temperatury-z-pvgis"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne, type MiesiacCiepla, type StrataPrzegrody } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import {
  STREFY_KLIMATYCZNE,
  TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C,
  type StrefaKlimatyczna,
} from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type PrzegrodaSeed, type SeedObciazenia as Seed } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"
import { SekcjaRaportEfektywnosci } from "./sekcja-raport-efektywnosci"

const RZYMSKIE: Record<StrefaKlimatyczna, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" }
const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-${i + 1}`)

const nowaPrzegroda = (nazwa: string): PrzegrodaSeed => ({ nazwa, powierzchniaM2: "", uWM2K: "", zewnetrzna: true, temperaturaPoDrugiejStronieC: "" })

const stanPoczatkowy = (t: (k: string) => string): Seed => ({
  przegrody: [nowaPrzegroda(t("UI-OBCCIE-SCIANY-ZEWNETRZNE")), nowaPrzegroda(t("UI-OBCCIE-OKNA-DRZWI")), nowaPrzegroda(t("UI-OBCCIE-DACH-STROP"))],
  temperaturaWewnetrznaC: "",
  strefa: "",
  kubaturaM3: "",
  wymianyPowietrzaNaH: "",
  cop: "",
  miesiace: Array(12).fill(""),
})

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

function KartaPrzegrody({ p, i, ustaw, usun }: { p: PrzegrodaSeed; i: number; ustaw: (z: Partial<PrzegrodaSeed>) => void; usun: () => void }) {
  const t = useTranslate()
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Pole id={`przegroda-${i}-nazwa`} label={t("UI-OBCCIE-NAZWA")} value={p.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="obciazenie-cieplne" pole="nazwa" />} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Pole
          id={`przegroda-${i}-powierzchnia`}
          label={t("UI-OBCCIE-POWIERZCHNIA")}
          unit="m²"
          type="number"
          inputMode="decimal"
          min={0}
          value={p.powierzchniaM2}
          onChange={(e) => ustaw({ powierzchniaM2: e.target.value })}
          pomoc={<PomocPola ekran="obciazenie-cieplne" pole="powierzchnia" />}
        />
        <Pole
          id={`przegroda-${i}-u`}
          label={t("UI-OBCCIE-WSPOLCZYNNIK")}
          unit="W/(m²·K)"
          type="number"
          inputMode="decimal"
          min={0}
          value={p.uWM2K}
          onChange={(e) => ustaw({ uWM2K: e.target.value })}
          pomoc={<PomocPola ekran="obciazenie-cieplne" pole="u" />}
        />
        <PoleSelect
          id={`przegroda-${i}-strona`}
          label={t("UI-OBCCIE-DRUGIEJ-STRONIE")}
          value={p.zewnetrzna ? "zewnatrz" : "inna"}
          onChange={(e) => ustaw({ zewnetrzna: e.target.value === "zewnatrz" })}
          pomoc={<PomocPola ekran="obciazenie-cieplne" pole="strona" />}
        >
          <option value="zewnatrz">{t("UI-OBCCIE-POWIETRZE-ZEWNETRZNE")}</option>
          <option value="inna">{t("UI-OBCCIE-GRUNT-NIEOGRZEWANE-POMIESZCZ")}</option>
        </PoleSelect>
        {!p.zewnetrzna && (
          <Pole
            id={`przegroda-${i}-temp`}
            label={t("UI-OBCCIE-TEMPERATURA-DRUGIEJ-STRONIE")}
            unit="°C"
            type="number"
            inputMode="decimal"
            value={p.temperaturaPoDrugiejStronieC}
            onChange={(e) => ustaw({ temperaturaPoDrugiejStronieC: e.target.value })}
            pomoc={<PomocPola ekran="obciazenie-cieplne" pole="tempStrona" />}
          />
        )}
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        {t("UI-OBCCIE-USUN-PRZEGRODE")}
      </Button>
    </div>
  )
}

export default function ObciazenieCieplnePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Seed>(KLUCZ_DRAFTU_OBCIAZENIA, stanPoczatkowy(t))
  const ustaw = <K extends keyof Seed>(k: K, v: Seed[K]) => setStan((s) => ({ ...s, [k]: v }))
  const ustawPrzegrode = (i: number, z: Partial<PrzegrodaSeed>) => setStan((s) => ({ ...s, przegrody: s.przegrody.map((p, j) => (j === i ? { ...p, ...z } : p)) }))

  const wynik = useMemo(() => calculateObciazenieCieplne(wejscieObciazenia(stan)), [stan])
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : "uwaga"

  const kolumnyPrzegrod: Kolumna<StrataPrzegrody & { id: number }>[] = [
    { naglowek: t("UI-OBCCIE-PRZEGRODA"), render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "U·A [W/K]", render: (r) => f1(r.htWK), liczbowa: true },
    { naglowek: t("UI-OBCCIE-DRUGIEJ-STRONIE"), render: (r) => `${f1(r.temperaturaPoDrugiejStronieC)} °C`, liczbowa: true },
    { naglowek: t("UI-OBCCIE-STRATA"), render: (r) => f0(r.strataW), liczbowa: true },
    { naglowek: t("UI-OBCCIE-UDZIAL"), render: (r) => `${f0(r.udzialPct)}%`, liczbowa: true },
  ]
  const kolumnyMiesiecy: Kolumna<MiesiacCiepla & { id: number }>[] = [
    { naglowek: t("UI-OBCCIE-MIESIAC"), render: (r) => t(MIESIACE[r.miesiac - 1]) },
    { naglowek: t("UI-OBCCIE-SREDNIA-TEMP"), render: (r) => `${f1(r.temperaturaSredniaC)} °C`, liczbowa: true },
    { naglowek: t("UI-OBCCIE-CIEPLO-KWH"), render: (r) => f0(r.cieploKwh), liczbowa: true },
    { naglowek: t("UI-OBCCIE-PRAD-KWH"), render: (r) => (r.energiaElektrycznaKwh === null ? "—" : f0(r.energiaElektrycznaKwh)), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/obciazenie-cieplne" />
      <NaglowekEkranu tytul={t("UI-OBCCIE-STRATY-CIEPLA-BUDYNKU")} ekran="obciazenie-cieplne" wynik={wynik}>
        {t("UI-OBCCIE-ILE-CIEPLA-UCIEKA")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-TEMPERATURY-POWIETRZE")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PoleSelect label={t("UI-OBCCIE-STREFA-KLIMATYCZNA")} value={stan.strefa} onChange={(e) => ustaw("strefa", e.target.value)} pomoc={<PomocPola ekran="obciazenie-cieplne" pole="strefa" />}>
            <option value="">{t("UI-WYBIERZ")}</option>
            {STREFY_KLIMATYCZNE.map((s) => (
              <option key={s} value={s}>
                {t("UI-OBCCIE-STREFA", { p: RZYMSKIE[s], p2: TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C[s] })}
              </option>
            ))}
          </PoleSelect>
          <Pole
            label={t("UI-OBCCIE-TEMPERATURA-DOMU")}
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaWewnetrznaC}
            onChange={(e) => ustaw("temperaturaWewnetrznaC", e.target.value)}
            pomoc={<PomocPola ekran="obciazenie-cieplne" pole="tempDom" />}
          />
          <Pole
            label={t("UI-OBCCIE-KUBATURA-OGRZEWANA")}
            unit="m³"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.kubaturaM3}
            onChange={(e) => ustaw("kubaturaM3", e.target.value)}
            pomoc={<PomocPola ekran="obciazenie-cieplne" pole="kubatura" />}
          />
          <Pole
            label={t("UI-OBCCIE-WYMIANY-POWIETRZA")}
            unit="1/h"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.wymianyPowietrzaNaH}
            onChange={(e) => ustaw("wymianyPowietrzaNaH", e.target.value)}
            pomoc={<PomocPola ekran="obciazenie-cieplne" pole="wymiany" />}
          />
          <Pole
            label={t("UI-OBCCIE-COP-OGRZEWANIA-OPCJONALNIE")}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.cop}
            onChange={(e) => ustaw("cop", e.target.value)}
            pomoc={<PomocPola ekran="obciazenie-cieplne" pole="cop" />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-PRZEGRODY")}</h2>
        {stan.przegrody.map((p, i) => (
          <KartaPrzegrody key={i} p={p} i={i} ustaw={(z) => ustawPrzegrode(i, z)} usun={() => setStan((s) => ({ ...s, przegrody: s.przegrody.filter((_, j) => j !== i) }))} />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, przegrody: [...s.przegrody, nowaPrzegroda("")] }))}>
          {t("UI-OBCCIE-DODAJ-PRZEGRODE")}
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-MIESIACE-OPCJONALNIE")}</h2>
        <p className="text-small text-muted-foreground">
          {t("UI-OBCCIE-SREDNIA-TEMPERATURA-MIESIECY")}
        </p>
        <TemperaturyZPvgis onWstaw={(temperatury) => ustaw("miesiace", temperatury.map((temp) => temp.toFixed(1)))} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MIESIACE.map((m, i) => (
            <Pole
              key={m}
              id={`miesiac-${i}`}
              label={t(m)}
              unit="°C"
              type="number"
              inputMode="decimal"
              value={stan.miesiace[i] ?? ""}
              onChange={(e) => ustaw("miesiace", stan.miesiace.map((x, j) => (j === i ? e.target.value : x)))}
              pomoc={<PomocPola ekran="obciazenie-cieplne" pole="miesiac" />}
            />
          ))}
        </div>
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-OBCCIE-SPRAWDZ-DANE")}>
          <ul className="mt-2 space-y-1 text-small">
            {wynik.warnings.map((w, i) => (
              <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">
          {t("UI-OBCCIE-WYBIERZ-STREFE-WPISZ")}
        </p>
      )}
      {v && (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-OBCCIE-STRATY-CIEPLA", { temperaturaZewnetrznaC: v.temperaturaZewnetrznaC })}>
          <WynikGlowny>{f1(v.obciazenieW / 1000)} kW</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-OBCCIE-PRZEGRODY-WYMIENIANYM-POWIET", { strataPrzenikanieW: f0(v.strataPrzenikanieW), strataWentylacjaW: f0(v.strataWentylacjaW) })} <strong>{t("UI-OBCCIE-KWH-CIEPLA", { cieploDobaObliczeniowaKwh: f0(v.cieploDobaObliczeniowaKwh) })}</strong>
            {v.energiaElektrycznaDobaKwh !== null && (
              <>
                {" "}{t("UI-OBCCIE-COP", { cop: stan.cop })} <strong>{t("UI-OBCCIE-KWH-PRADU", { energiaElektrycznaDobaKwh: f0(v.energiaElektrycznaDobaKwh) })}</strong>
              </>
            )}
            .
          </p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumnyPrzegrod} wiersze={v.przegrody.map((p, i) => ({ ...p, id: i }))} minWidth={480} />
          </div>
          {v.miesiace && (
            <div className="mt-3">
              <p className="text-small font-medium">{t("UI-OBCCIE-CIEPLO-MIESIACACH-RAZEM", { p: f0(v.cieploSumaMiesiecyKwh!) })}</p>
              <KartaPorownawcza kolumny={kolumnyMiesiecy} wiersze={v.miesiace.map((m) => ({ ...m, id: m.miesiac }))} minWidth={320} />
            </div>
          )}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} formulaKey={wynik.formulaKey} formulaParams={wynik.formulaParams} />
          <p className="mt-2 text-small">
            {t("UI-OBCCIE-DALEJ")}{" "}
            <Link href="/kalkulatory/zapotrzebowanie-co-cwu" className="underline">
              {t("UI-OBCCIE-CIEPLO-DOBE")}
            </Link>
            ,{" "}
            <Link href="/kalkulatory/koszty-ogrzewania" className="underline">
              {t("UI-OBCCIE-CZYM-NAJTANIEJ-GRZAC")}
            </Link>
            ,{" "}
            <Link href="/kalkulatory/liczba-paneli" className="underline">
              {t("UI-OBCCIE-ILE-PANELI-ZIME")}
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}
      {v && <SekcjaRaportEfektywnosci wynik={v} cop={wejscieObciazenia(stan).cop ?? 0} />}
    </main>
  )
}
