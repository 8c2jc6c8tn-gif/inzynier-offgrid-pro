"use client"

import Link from "next/link"
import { useMemo } from "react"
import { TemperaturyZPvgis } from "@/components/lokalizacja/temperatury-z-pvgis"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft, useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { calculateMalyObiektCiepla } from "@/lib/core/modules/ogrzewanie/maly-obiekt-bilans-ciepla/calculator"
import { STREFY_KLIMATYCZNE, TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C, type StrefaKlimatyczna } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { KLUCZ_DRAFTU_MALY_OBIEKT, PUSTY_SEED_MALY_OBIEKT, wejscieMalegoObiektu, type SeedMalyObiekt } from "@/lib/obiekt/maly-obiekt-ciepla-draft"
import { KLUCZ_PROFILU_OBIEKTU, type ProfilObiektu } from "@/lib/obiekt/profil-obiektu"

const RZYMSKIE: Record<StrefaKlimatyczna, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" }
const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-${i + 1}`)

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

type WierszMiesiaca = { id: number; miesiac: number; temperatura: number; cieplo: number; prad: number | null; uzywany: boolean }

export default function BilansCieplaMalegoObiektuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<SeedMalyObiekt>(KLUCZ_DRAFTU_MALY_OBIEKT, PUSTY_SEED_MALY_OBIEKT)
  const profil = useOdczytDraftu<ProfilObiektu>(KLUCZ_PROFILU_OBIEKTU).dane
  const ustaw = <K extends keyof SeedMalyObiekt>(k: K, v: SeedMalyObiekt[K]) => setStan((s) => ({ ...s, [k]: v }))
  const pole = (k: Exclude<keyof SeedMalyObiekt, "miesiace" | "podloga" | "zrodlo">) => ({ value: stan[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => ustaw(k, e.target.value) })
  const liczbowe = { type: "number", inputMode: "decimal", min: 0 } as const

  const wynik = useMemo(() => calculateMalyObiektCiepla(wejscieMalegoObiektu(stan, profil?.miesiaceUzytkowania ?? [])), [stan, profil])
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : wynik.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"

  const wiersze: WierszMiesiaca[] = (v?.obciazenie.miesiace ?? []).map((m) => ({
    id: m.miesiac,
    miesiac: m.miesiac,
    temperatura: m.temperaturaSredniaC,
    cieplo: m.cieploKwh,
    prad: m.energiaElektrycznaKwh,
    uzywany: profil?.miesiaceUzytkowania?.[m.miesiac - 1] === true,
  }))
  const kolumny: Kolumna<WierszMiesiaca>[] = [
    { naglowek: t("UI-OBCCIE-MIESIAC"), render: (r) => t(MIESIACE[r.miesiac - 1]!) },
    { naglowek: t("UI-OBCCIE-SREDNIA-TEMP"), render: (r) => `${f1(r.temperatura)} °C`, liczbowa: true },
    { naglowek: t("UI-OBCCIE-CIEPLO-KWH"), render: (r) => f0(r.cieplo), liczbowa: true },
    { naglowek: t("UI-OBCCIE-PRAD-KWH"), render: (r) => (r.prad === null ? "—" : f0(r.prad)), liczbowa: true },
    { naglowek: t("UI-MOBIEKT-KOL-UZYTKOWANIE"), render: (r) => (r.uzywany ? t("UI-MOBIEKT-TAK") : t("UI-MOBIEKT-NIE")) },
  ]

  const komunikatEnergii = (() => {
    if (!v || stan.zrodlo !== "prad") return null
    if (v.energiaElektrycznaUzytkowanieKwh) return t("UI-MOBIEKT-ENERGIA-ROK", { rok: f0(v.rokUzytkowaniaKwh!), cop: stan.cop })
    if (stan.cop.trim() === "") return t("UI-MOBIEKT-ENERGIA-BRAK-COP")
    if (!v.obciazenie.miesiace || v.obciazenie.miesiace.length < 12) return t("UI-MOBIEKT-ENERGIA-BRAK-TEMP")
    return t("UI-MOBIEKT-ENERGIA-BRAK-MIESIECY")
  })()

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bilans-ciepla-malego-obiektu" />
      <NaglowekEkranu tytul={t("UI-MOBIEKT-TYTUL")} ekran="bilans-ciepla-malego-obiektu" wynik={wynik}>
        {t("UI-MOBIEKT-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-MOBIEKT-WYMIARY")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Pole id="mo-dlugosc" label={t("UI-MOBIEKT-DLUGOSC")} unit="m" {...liczbowe} {...pole("dlugoscM")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="dlugosc" />} />
          <Pole id="mo-szerokosc" label={t("UI-MOBIEKT-SZEROKOSC")} unit="m" {...liczbowe} {...pole("szerokoscM")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="szerokosc" />} />
          <Pole id="mo-wysokosc" label={t("UI-MOBIEKT-WYSOKOSC")} unit="m" {...liczbowe} {...pole("wysokoscM")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="wysokosc" />} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-MOBIEKT-PRZEGRODY")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Pole id="mo-u-scian" label={t("UI-MOBIEKT-U-SCIAN")} unit="W/(m²·K)" {...liczbowe} {...pole("uScianWM2K")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="uScian" />} />
          <Pole id="mo-u-dachu" label={t("UI-MOBIEKT-U-DACHU")} unit="W/(m²·K)" {...liczbowe} {...pole("uDachuWM2K")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="uDachu" />} />
          <Pole id="mo-u-podlogi" label={t("UI-MOBIEKT-U-PODLOGI")} unit="W/(m²·K)" {...liczbowe} {...pole("uPodlogiWM2K")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="uPodlogi" />} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <PoleSelect id="mo-podloga" label={t("UI-MOBIEKT-PODLOGA")} value={stan.podloga} onChange={(e) => ustaw("podloga", e.target.value as SeedMalyObiekt["podloga"])} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="podloga" />}>
            <option value="">{t("UI-WYBIERZ")}</option>
            <option value="powietrze">{t("UI-MOBIEKT-PODLOGA-POWIETRZE")}</option>
            <option value="inna">{t("UI-MOBIEKT-PODLOGA-INNA")}</option>
          </PoleSelect>
          {stan.podloga === "inna" && (
            <Pole id="mo-temp-pod-podloga" label={t("UI-MOBIEKT-TEMP-POD-PODLOGA")} unit="°C" type="number" inputMode="decimal" {...pole("temperaturaPodPodlogaC")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="tempPodPodloga" />} />
          )}
          <Pole id="mo-otwory" label={t("UI-MOBIEKT-OTWORY")} unit="m²" {...liczbowe} {...pole("otworyM2")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="otwory" />} />
          <Pole id="mo-u-otworow" label={t("UI-MOBIEKT-U-OTWORY")} unit="W/(m²·K)" {...liczbowe} {...pole("uOtworowWM2K")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="uOtworow" />} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-TEMPERATURY-POWIETRZE")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PoleSelect id="mo-strefa" label={t("UI-OBCCIE-STREFA-KLIMATYCZNA")} value={stan.strefa} onChange={(e) => ustaw("strefa", e.target.value)} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="strefa" />}>
            <option value="">{t("UI-WYBIERZ")}</option>
            {STREFY_KLIMATYCZNE.map((s) => (
              <option key={s} value={s}>
                {t("UI-OBCCIE-STREFA", { p: RZYMSKIE[s], p2: TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C[s] })}
              </option>
            ))}
          </PoleSelect>
          <Pole id="mo-temp-dom" label={t("UI-OBCCIE-TEMPERATURA-DOMU")} unit="°C" type="number" inputMode="decimal" {...pole("temperaturaWewnetrznaC")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="tempDom" />} />
          <Pole id="mo-wymiany" label={t("UI-OBCCIE-WYMIANY-POWIETRZA")} unit="1/h" {...liczbowe} {...pole("wymianyPowietrzaNaH")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="wymiany" />} />
          <Pole id="mo-odzysk" label={t("UI-OBCCIE-ODZYSK")} unit="%" {...liczbowe} max={100} {...pole("sprawnoscOdzyskuPct")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="odzysk" />} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-ZRODLO")}</h2>
        <PoleSelect id="mo-zrodlo" label={t("UI-OBCCIE-ZRODLO")} value={stan.zrodlo} onChange={(e) => ustaw("zrodlo", e.target.value as SeedMalyObiekt["zrodlo"])} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="zrodlo" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="prad">{t("UI-OBCCIE-ZRODLO-PRAD")}</option>
          <option value="paliwo">{t("UI-OBCCIE-ZRODLO-PALIWO")}</option>
        </PoleSelect>
        {stan.zrodlo === "paliwo" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Pole id="mo-paliwo-jednostka" label={t("UI-OBCCIE-PALIWO-JEDNOSTKA")} {...pole("paliwoJednostka")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="paliwoJednostka" />} />
            <Pole id="mo-paliwo-wo" label={t("UI-OBCCIE-PALIWO-WO")} unit="kWh" {...liczbowe} {...pole("paliwoWartoscOpalowaKwh")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="paliwoWo" />} />
            <Pole id="mo-paliwo-sprawnosc" label={t("UI-OBCCIE-PALIWO-SPRAWNOSC")} unit="%" {...liczbowe} max={100} {...pole("paliwoSprawnoscPct")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="paliwoSprawnosc" />} />
            <Pole id="mo-paliwo-zapas" label={t("UI-OBCCIE-PALIWO-ZAPAS")} {...liczbowe} {...pole("paliwoZapas")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="paliwoZapas" />} />
          </div>
        ) : (
          stan.zrodlo === "prad" && <Pole id="mo-cop" label={t("UI-OBCCIE-COP-OGRZEWANIA-OPCJONALNIE")} {...liczbowe} {...pole("cop")} pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="cop" />} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-OBCCIE-MIESIACE-OPCJONALNIE")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-OBCCIE-SREDNIA-TEMPERATURA-MIESIECY")}</p>
        <TemperaturyZPvgis onWstaw={(temperatury) => ustaw("miesiace", temperatury.map((temp) => temp.toFixed(1)))} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MIESIACE.map((m, i) => (
            <Pole
              key={m}
              id={`mo-miesiac-${i}`}
              label={t(m)}
              unit="°C"
              type="number"
              inputMode="decimal"
              value={stan.miesiace[i] ?? ""}
              onChange={(e) => ustaw("miesiace", (stan.miesiace.length === 12 ? stan.miesiace : Array(12).fill("")).map((x, j) => (j === i ? e.target.value : x)))}
              pomoc={<PomocPola ekran="bilans-ciepla-malego-obiektu" pole="miesiac" />}
            />
          ))}
        </div>
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-MOBIEKT-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">{t("UI-MOBIEKT-UZUPELNIJ")}</p>}
      {v && (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-MOBIEKT-WYNIK-ETYKIETA", { temp: v.obciazenie.temperaturaZewnetrznaC })}>
          <WynikGlowny>{f1(v.obciazenie.obciazenieW / 1000)} kW</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-MOBIEKT-WYNIK-POWIERZCHNIE", {
              sciany: f1(v.scianyNettoM2),
              dach: f1(v.dachM2),
              kubatura: f1(v.kubaturaM3),
              przenikanie: f0(v.obciazenie.strataPrzenikanieW),
              wentylacja: f0(v.obciazenie.strataWentylacjaW),
            })}
          </p>
          <p className="text-small">{t("UI-MOBIEKT-DOBA", { cieplo: f0(v.obciazenie.cieploDobaObliczeniowaKwh) })}</p>
          {komunikatEnergii && (
            <p className="mt-2 text-small">
              <strong>{t("UI-MOBIEKT-ENERGIA-TYTUL")}.</strong> {komunikatEnergii}
            </p>
          )}
          {wiersze.length > 0 && (
            <div className="mt-3">
              <KartaPorownawcza kolumny={kolumny} wiersze={wiersze} minWidth={420} />
            </div>
          )}
          {stan.zrodlo === "paliwo" && v.obciazenie.paliwo && (
            <div className="mt-3 flex flex-col gap-1 text-small">
              <p className="font-medium">{t("UI-OBCCIE-PALIWO-TYTUL")}</p>
              <p>
                {t("UI-OBCCIE-PALIWO-DOBA", {
                  cieplo: f0(v.obciazenie.paliwo.zapasCieplaKwh),
                  doba: f1(v.obciazenie.paliwo.zuzycieDobaObliczeniowaJedn),
                  jedn: v.obciazenie.paliwo.jednostka,
                  dni: f0(v.obciazenie.paliwo.dniPrzyTemperaturzeObliczeniowej),
                })}
              </p>
            </div>
          )}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} formulaKey={wynik.formulaKey} formulaParams={wynik.formulaParams} />
          <p className="mt-2 text-small">
            <Link href="/kalkulatory/porownywarka-paneli" className="underline">
              {t("UI-MOBIEKT-DALEJ")}
            </Link>
          </p>
        </WerdyktPanel>
      )}
    </main>
  )
}
