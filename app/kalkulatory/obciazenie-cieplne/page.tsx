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
import { KIERUNKI_STRUMIENIA, type KierunekStrumienia } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/u-z-warstw"
import {
  KLUCZ_DRAFTU_OBCIAZENIA,
  podgladUZWarstw,
  wejscieObciazenia,
  type OtworSeed,
  type PrzegrodaSeed,
  type SeedObciazenia as Seed,
  type WarstwaSeed,
  type ZrodloCieplaSeed,
} from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"
import { SekcjaRaportEfektywnosci } from "./sekcja-raport-efektywnosci"

const RZYMSKIE: Record<StrefaKlimatyczna, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" }
const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-${i + 1}`)

const nowaPrzegroda = (nazwa: string, kierunek: KierunekStrumienia | "" = ""): PrzegrodaSeed => ({
  nazwa,
  powierzchniaM2: "",
  uWM2K: "",
  zewnetrzna: true,
  temperaturaPoDrugiejStronieC: "",
  warstwy: [],
  kierunek,
})
const nowyOtwor = (nazwa: string): OtworSeed => ({ nazwa, powierzchniaM2: "", uWM2K: "" })
const nowaWarstwa = (): WarstwaSeed => ({ nazwa: "", gruboscMm: "", lambdaWmK: "", oporM2KW: "" })

const KLUCZE_KIERUNKU: Record<KierunekStrumienia, string> = {
  poziomo: "UI-OBCCIE-KIERUNEK-POZIOMO",
  "w-gore": "UI-OBCCIE-KIERUNEK-W-GORE",
  "w-dol": "UI-OBCCIE-KIERUNEK-W-DOL",
}

const stanPoczatkowy = (t: (k: string) => string): Seed => ({
  przegrody: [nowaPrzegroda(t("UI-OBCCIE-SCIANY-ZEWNETRZNE"), "poziomo"), nowaPrzegroda(t("UI-OBCCIE-DACH-STROP"), "w-gore")],
  otwory: [nowyOtwor(t("UI-OBCCIE-OTWOR-DOMYSLNA-OKNA")), nowyOtwor(t("UI-OBCCIE-OTWOR-DOMYSLNA-DRZWI"))],
  temperaturaWewnetrznaC: "",
  strefa: "",
  kubaturaM3: "",
  wymianyPowietrzaNaH: "",
  cop: "",
  sprawnoscOdzyskuPct: "",
  zrodlo: "",
  paliwoJednostka: "",
  paliwoWartoscOpalowaKwh: "",
  paliwoSprawnoscPct: "",
  paliwoZapas: "",
  miesiace: Array(12).fill(""),
})

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f3 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 3 })

/** Optional "U from layers" of one partition: direction of the heat flow, layer rows and a live U preview. */
function WarstwyPrzegrody({ p, i, ustaw }: { p: PrzegrodaSeed; i: number; ustaw: (z: Partial<PrzegrodaSeed>) => void }) {
  const t = useTranslate()
  const warstwy = p.warstwy ?? []
  const podglad = podgladUZWarstw(p)
  const ustawWarstwe = (j: number, z: Partial<WarstwaSeed>) => ustaw({ warstwy: warstwy.map((w, k) => (k === j ? { ...w, ...z } : w)) })
  return (
    <details className="rounded-md border p-3" open={warstwy.length > 0}>
      <summary className="min-h-11 cursor-pointer font-medium">{t("UI-OBCCIE-WARSTWY-TYTUL")}</summary>
      <div className="mt-2 flex flex-col gap-3">
        <p className="text-small text-muted-foreground">{t("UI-OBCCIE-WARSTWY-OPIS")}</p>
        <PoleSelect
          id={`przegroda-${i}-kierunek`}
          label={t("UI-OBCCIE-KIERUNEK-STRUMIENIA")}
          value={p.kierunek ?? ""}
          onChange={(e) => ustaw({ kierunek: e.target.value })}
          pomoc={<PomocPola ekran="obciazenie-cieplne" pole="kierunek" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {KIERUNKI_STRUMIENIA.map((k) => (
            <option key={k} value={k}>
              {t(KLUCZE_KIERUNKU[k])}
            </option>
          ))}
        </PoleSelect>
        {warstwy.map((w, j) => (
          <div key={j} className="flex flex-col gap-3 rounded-md border p-3">
            <Pole
              id={`przegroda-${i}-warstwa-${j}-nazwa`}
              label={t("UI-OBCCIE-WARSTWA-NAZWA", { p: j + 1 })}
              value={w.nazwa}
              onChange={(e) => ustawWarstwe(j, { nazwa: e.target.value })}
              pomoc={<PomocPola ekran="obciazenie-cieplne" pole="warstwaNazwa" />}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Pole
                id={`przegroda-${i}-warstwa-${j}-grubosc`}
                label={t("UI-OBCCIE-WARSTWA-GRUBOSC")}
                unit="mm"
                type="number"
                inputMode="decimal"
                min={0}
                value={w.gruboscMm}
                onChange={(e) => ustawWarstwe(j, { gruboscMm: e.target.value })}
                pomoc={<PomocPola ekran="obciazenie-cieplne" pole="warstwaGrubosc" />}
              />
              <Pole
                id={`przegroda-${i}-warstwa-${j}-lambda`}
                label={t("UI-OBCCIE-WARSTWA-LAMBDA")}
                unit="W/(m·K)"
                type="number"
                inputMode="decimal"
                min={0}
                value={w.lambdaWmK}
                onChange={(e) => ustawWarstwe(j, { lambdaWmK: e.target.value })}
                pomoc={<PomocPola ekran="obciazenie-cieplne" pole="warstwaLambda" />}
              />
              <Pole
                id={`przegroda-${i}-warstwa-${j}-opor`}
                label={t("UI-OBCCIE-WARSTWA-OPOR")}
                unit="m²·K/W"
                type="number"
                inputMode="decimal"
                min={0}
                value={w.oporM2KW}
                onChange={(e) => ustawWarstwe(j, { oporM2KW: e.target.value })}
                pomoc={<PomocPola ekran="obciazenie-cieplne" pole="warstwaOpor" />}
              />
            </div>
            <Button variant="ghost" className="min-h-11 w-fit" onClick={() => ustaw({ warstwy: warstwy.filter((_, k) => k !== j) })}>
              {t("UI-OBCCIE-USUN-WARSTWE")}
            </Button>
          </div>
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => ustaw({ warstwy: [...warstwy, nowaWarstwa()] })}>
          {t("UI-OBCCIE-DODAJ-WARSTWE")}
        </Button>
        {warstwy.length > 0 && (
          <p className="text-small" role="status">
            {podglad
              ? t("UI-OBCCIE-U-Z-WARSTW", { u: f3(podglad.uWM2K), r: f3(podglad.oporCalkowityM2KW) })
              : t("UI-OBCCIE-U-Z-WARSTW-NIEPELNE")}
            {podglad && p.uWM2K.trim() !== "" && <> {t("UI-OBCCIE-U-WPISANE-WYGRYWA")}</>}
          </p>
        )}
      </div>
    </details>
  )
}

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
      <WarstwyPrzegrody p={p} i={i} ustaw={ustaw} />
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

  const otwory = stan.otwory ?? []
  const ustawOtwor = (i: number, z: Partial<OtworSeed>) => setStan((s) => ({ ...s, otwory: (s.otwory ?? []).map((o, j) => (j === i ? { ...o, ...z } : o)) }))
  const brakOtworow = otwory.every((o) => o.powierzchniaM2.trim() === "" && o.uWM2K.trim() === "")

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
        <h2 className="font-semibold">{t("UI-OBCCIE-OTWORY")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-OBCCIE-OTWORY-OPIS")}</p>
        {otwory.map((o, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border p-3">
            <Pole id={`otwor-${i}-nazwa`} label={t("UI-OBCCIE-NAZWA")} value={o.nazwa} onChange={(e) => ustawOtwor(i, { nazwa: e.target.value })} pomoc={<PomocPola ekran="obciazenie-cieplne" pole="nazwa" />} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Pole
                id={`otwor-${i}-powierzchnia`}
                label={t("UI-OBCCIE-POWIERZCHNIA")}
                unit="m²"
                type="number"
                inputMode="decimal"
                min={0}
                value={o.powierzchniaM2}
                onChange={(e) => ustawOtwor(i, { powierzchniaM2: e.target.value })}
                pomoc={<PomocPola ekran="obciazenie-cieplne" pole="powierzchnia" />}
              />
              <Pole
                id={`otwor-${i}-u`}
                label={t("UI-OBCCIE-WSPOLCZYNNIK")}
                unit="W/(m²·K)"
                type="number"
                inputMode="decimal"
                min={0}
                value={o.uWM2K}
                onChange={(e) => ustawOtwor(i, { uWM2K: e.target.value })}
                pomoc={<PomocPola ekran="obciazenie-cieplne" pole="u" />}
              />
            </div>
            <Button variant="ghost" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, otwory: otwory.filter((_, j) => j !== i) }))}>
              {t("UI-OBCCIE-USUN-OTWOR")}
            </Button>
          </div>
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, otwory: [...otwory, nowyOtwor("")] }))}>
          {t("UI-OBCCIE-DODAJ-OTWOR")}
        </Button>
        {brakOtworow && <p className="text-small text-muted-foreground">{t("UI-OBCCIE-OTWORY-BRAK")}</p>}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-WENTYLACJA")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
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
            label={t("UI-OBCCIE-ODZYSK")}
            unit="%"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            value={stan.sprawnoscOdzyskuPct ?? ""}
            onChange={(e) => ustaw("sprawnoscOdzyskuPct", e.target.value)}
            pomoc={<PomocPola ekran="obciazenie-cieplne" pole="odzysk" />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-ZRODLO")}</h2>
        <PoleSelect
          label={t("UI-OBCCIE-ZRODLO")}
          value={stan.zrodlo ?? ""}
          onChange={(e) => ustaw("zrodlo", e.target.value as ZrodloCieplaSeed)}
          pomoc={<PomocPola ekran="obciazenie-cieplne" pole="zrodlo" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="prad">{t("UI-OBCCIE-ZRODLO-PRAD")}</option>
          <option value="paliwo">{t("UI-OBCCIE-ZRODLO-PALIWO")}</option>
        </PoleSelect>
        {stan.zrodlo !== "paliwo" ? (
          <Pole
            label={t("UI-OBCCIE-COP-OGRZEWANIA-OPCJONALNIE")}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.cop}
            onChange={(e) => ustaw("cop", e.target.value)}
            pomoc={<PomocPola ekran="obciazenie-cieplne" pole="cop" />}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Pole
              label={t("UI-OBCCIE-PALIWO-JEDNOSTKA")}
              value={stan.paliwoJednostka ?? ""}
              onChange={(e) => ustaw("paliwoJednostka", e.target.value)}
              pomoc={<PomocPola ekran="obciazenie-cieplne" pole="paliwoJednostka" />}
            />
            <Pole
              label={t("UI-OBCCIE-PALIWO-WO")}
              unit="kWh"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.paliwoWartoscOpalowaKwh ?? ""}
              onChange={(e) => ustaw("paliwoWartoscOpalowaKwh", e.target.value)}
              pomoc={<PomocPola ekran="obciazenie-cieplne" pole="paliwoWo" />}
            />
            <Pole
              label={t("UI-OBCCIE-PALIWO-SPRAWNOSC")}
              unit="%"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              value={stan.paliwoSprawnoscPct ?? ""}
              onChange={(e) => ustaw("paliwoSprawnoscPct", e.target.value)}
              pomoc={<PomocPola ekran="obciazenie-cieplne" pole="paliwoSprawnosc" />}
            />
            <Pole
              label={t("UI-OBCCIE-PALIWO-ZAPAS")}
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.paliwoZapas ?? ""}
              onChange={(e) => ustaw("paliwoZapas", e.target.value)}
              pomoc={<PomocPola ekran="obciazenie-cieplne" pole="paliwoZapas" />}
            />
          </div>
        )}
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
          {stan.zrodlo === "paliwo" && (
            <div className="mt-3 flex flex-col gap-1 text-small">
              <p className="font-medium">{t("UI-OBCCIE-PALIWO-TYTUL")}</p>
              {v.paliwo ? (
                <>
                  <p>
                    {t("UI-OBCCIE-PALIWO-DOBA", {
                      cieplo: f0(v.paliwo.zapasCieplaKwh),
                      doba: f1(v.paliwo.zuzycieDobaObliczeniowaJedn),
                      jedn: v.paliwo.jednostka,
                      dni: f0(v.paliwo.dniPrzyTemperaturzeObliczeniowej),
                    })}
                  </p>
                  {v.paliwo.zuzycieRokJedn !== null && v.paliwo.pokrycieRokuPct !== null ? (
                    <p>
                      {t("UI-OBCCIE-PALIWO-ROK", { rok: f0(v.paliwo.zuzycieRokJedn), jedn: v.paliwo.jednostka, proc: f0(v.paliwo.pokrycieRokuPct) })}{" "}
                      {v.paliwo.brakJedn !== null && v.paliwo.brakJedn > 0
                        ? t("UI-OBCCIE-PALIWO-BRAK", { brak: f0(v.paliwo.brakJedn), jedn: v.paliwo.jednostka })
                        : t("UI-OBCCIE-PALIWO-WYSTARCZY")}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">{t("UI-OBCCIE-PALIWO-BEZ-MIESIECY")}</p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">{t("UI-OBCCIE-PALIWO-NIEKOMPLETNE")}</p>
              )}
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
            ,{" "}
            <Link href="/kalkulatory/porownywarka-paneli" className="underline">
              {t("UI-OBCCIE-DALEJ-ZIMA-PANELE")}
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}
      {v && <SekcjaRaportEfektywnosci wynik={v} cop={wejscieObciazenia(stan).cop ?? 0} />}
    </main>
  )
}
