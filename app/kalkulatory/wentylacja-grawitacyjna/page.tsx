"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWentylacjaGrawitacyjna } from "@/lib/core/modules/ogrzewanie/wentylacja-grawitacyjna/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = "kubatura" | "wymiany" | "pozostale" | "sprawnosc" | "dni"
type PolaTemperatur = "tWew" | "tZewn"
type FormularzStan = Record<PolaLiczbowe | PolaTemperatur, string> & { szczelny: boolean }

const STAN_POCZATKOWY: FormularzStan = {
  kubatura: "",
  wymiany: "",
  tWew: "",
  tZewn: "",
  szczelny: false,
  pozostale: "",
  sprawnosc: "",
  dni: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temperatura = (s: string) => (s === "" ? null : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function WentylacjaGrawitacyjnaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wentylacja-grawitacyjna", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe | PolaTemperatur, bezMin = false) => ({
    type: "number",
    inputMode: "decimal" as const,
    ...(bezMin ? {} : { min: 0 }),
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateWentylacjaGrawitacyjna({
        kubaturaM3: liczba(stan.kubatura),
        wymianyNaDobe: liczba(stan.wymiany),
        tWewC: temperatura(stan.tWew),
        tZewnC: temperatura(stan.tZewn),
        stratyPozostaleW: liczba(stan.pozostale),
        sprawnoscOdzyskuPct: liczba(stan.sprawnosc),
        dni: liczba(stan.dni),
        szczelnyDom: stan.szczelny,
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wentylacja-grawitacyjna" />
      <NaglowekEkranu tytul={t("UI-M6-WGR-TYTUL")} ekran="wentylacja-grawitacyjna" wynik={result}>
        {t("UI-M6-WGR-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-WGR-BUDYNEK")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-WGR-KUBATURA")} unit="m³" {...pole("kubatura")} pomoc={<PomocPola ekran="wentylacja-grawitacyjna" pole="kubatura" />} />
          <Pole label={t("UI-M6-WGR-WYMIANY")} unit={t("UI-M6-WGR-J-NA-DOBE")} {...pole("wymiany")} pomoc={<PomocPola ekran="wentylacja-grawitacyjna" pole="wymiany" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-WGR-T-WEW")} unit="°C" {...pole("tWew", true)} pomoc={<PomocPola ekran="wentylacja-grawitacyjna" pole="tWew" />} />
          <Pole label={t("UI-M6-WGR-T-ZEWN")} unit="°C" {...pole("tZewn", true)} pomoc={<PomocPola ekran="wentylacja-grawitacyjna" pole="tZewn" />} />
        </div>
        <div className="flex items-center gap-2">
          <PoleCheckbox
            id="wentylacja-grawitacyjna-szczelny"
            className="flex-1"
            label={t("UI-M6-WGR-SZCZELNY")}
            checked={stan.szczelny}
            onChange={(e) => setStan((prev) => ({ ...prev, szczelny: e.target.checked }))}
          />
          <PomocPola ekran="wentylacja-grawitacyjna" pole="szczelny" />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-WGR-OPCJE")}</legend>
        <Pole label={t("UI-M6-WGR-POZOSTALE")} unit="W" {...pole("pozostale")} pomoc={<PomocPola ekran="wentylacja-grawitacyjna" pole="pozostale" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-WGR-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnosc")} pomoc={<PomocPola ekran="wentylacja-grawitacyjna" pole="sprawnosc" />} />
          <Pole label={t("UI-M6-WGR-DNI")} {...pole("dni")} pomoc={<PomocPola ekran="wentylacja-grawitacyjna" pole="dni" />} />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-WGR-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-WGR-W-UWAGA" : "UI-M6-WGR-W-OK")}>
          <WynikGlowny>{t("UI-M6-WGR-WYNIK", { kwh: r2(v.stratyDobaKwh), w: Math.round(v.stratyW) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M6-WGR-STRUMIEN", { m3h: r1(v.strumienM3H), n: r2(v.wymianyNaGodzine) })}</li>
            {v.stratyOkresKwh !== null && <li>{t("UI-M6-WGR-OKRES", { kwh: r1(v.stratyOkresKwh) })}</li>}
            {v.udzialPct !== null && <li>{t("UI-M6-WGR-UDZIAL", { pct: r1(v.udzialPct) })}</li>}
            {v.stratyRekuperacjaDobaKwh !== null && <li>{t("UI-M6-WGR-REK", { kwh: r2(v.stratyRekuperacjaDobaKwh) })}</li>}
            {v.udzialRekuperacjaPct !== null && <li>{t("UI-M6-WGR-REK-UDZIAL", { pct: r1(v.udzialRekuperacjaPct) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/infiltracja-powietrza" className="text-small underline">
          {t("UI-M6-WGR-LINK-E12")}
        </Link>
        <Link href="/kalkulatory/wentylacja-porownanie" className="text-small underline">
          {t("UI-M6-WGR-LINK-E20")}
        </Link>
      </div>
    </main>
  )
}
