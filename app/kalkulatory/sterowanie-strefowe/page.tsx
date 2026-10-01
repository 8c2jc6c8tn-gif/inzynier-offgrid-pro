"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateSterowanieStrefowe } from "@/lib/core/modules/ogrzewanie/sterowanie-strefowe/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; hWK: string; tKomfortC: string; tObnizonaC: string; godzinObnizenia: string }

type PolaLiczbowe = "tZewnC" | "liczbaSilownikow" | "mocSilownikaW" | "godzinPracySilownikow" | "mocSterownikowW" | "copOgrzewania"

type FormularzStan = Record<PolaLiczbowe, string> & { strefy: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = {
  strefy: [],
  tZewnC: "",
  liczbaSilownikow: "",
  mocSilownikaW: "",
  godzinPracySilownikow: "",
  mocSterownikowW: "",
  copOgrzewania: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temperatura = (s: string) => (s === "" ? null : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function SterowanieStrefowePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("sterowanie-strefowe", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, strefy: prev.strefy.map((s) => (s.id === id ? { ...s, ...zmiana } : s)) }))

  const result = useMemo(
    () =>
      calculateSterowanieStrefowe({
        strefy: stan.strefy.map((s) => ({
          nazwa: s.nazwa,
          hWK: liczba(s.hWK),
          tKomfortC: temperatura(s.tKomfortC),
          tObnizonaC: temperatura(s.tObnizonaC),
          godzinObnizenia: liczba(s.godzinObnizenia),
        })),
        tZewnC: temperatura(stan.tZewnC),
        liczbaSilownikow: liczba(stan.liczbaSilownikow),
        mocSilownikaW: liczba(stan.mocSilownikaW),
        godzinPracySilownikow: liczba(stan.godzinPracySilownikow),
        mocSterownikowW: liczba(stan.mocSterownikowW),
        copOgrzewania: liczba(stan.copOgrzewania),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sterowanie-strefowe" />
      <NaglowekEkranu tytul={t("UI-M6-STR-TYTUL")} ekran="sterowanie-strefowe" wynik={result}>
        {t("UI-M6-STR-OPIS")}
      </NaglowekEkranu>

      <Pole label={t("UI-M6-STR-TZEWN")} unit="°C" type="number" inputMode="decimal" value={stan.tZewnC} onChange={(e) => setStan((prev) => ({ ...prev, tZewnC: e.target.value }))} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="tZewn" />} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-STR-STREFY")}</legend>
        <ul className="flex flex-col gap-4">
          {stan.strefy.map((s, i) => (
            <li key={s.id} className="flex flex-col gap-3 rounded-md border p-3">
              <Pole label={t("UI-M6-STR-STREFA", { n: i + 1 })} value={s.nazwa} onChange={(e) => aktualizuj(s.id, { nazwa: e.target.value })} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="nazwa" />} />
              <Pole label={t("UI-M6-STR-H")} unit="W/K" type="number" inputMode="decimal" min={0} value={s.hWK} onChange={(e) => aktualizuj(s.id, { hWK: e.target.value })} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="h" />} />
              <div className="grid grid-cols-2 gap-3">
                <Pole label={t("UI-M6-STR-KOMFORT")} unit="°C" type="number" inputMode="decimal" value={s.tKomfortC} onChange={(e) => aktualizuj(s.id, { tKomfortC: e.target.value })} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="komfort" />} />
                <Pole label={t("UI-M6-STR-OBNIZONA")} unit="°C" type="number" inputMode="decimal" value={s.tObnizonaC} onChange={(e) => aktualizuj(s.id, { tObnizonaC: e.target.value })} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="obnizona" />} />
              </div>
              <Pole label={t("UI-M6-STR-GODZIN")} unit={t("UI-M6-J-H-DOBE")} type="number" inputMode="decimal" min={0} max={24} value={s.godzinObnizenia} onChange={(e) => aktualizuj(s.id, { godzinObnizenia: e.target.value })} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="godzin" />} />
              <button
                type="button"
                onClick={() => setStan((prev) => ({ ...prev, strefy: prev.strefy.filter((x) => x.id !== s.id) }))}
                className="self-start text-caption text-muted-foreground underline"
                aria-label={t("UI-M6-STR-USUN-ETYKIETA", { n: i + 1 })}
              >
                {t("UI-M6-STR-USUN")}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({ ...prev, strefy: [...prev.strefy, { id: crypto.randomUUID(), nazwa: "", hWK: "", tKomfortC: "", tObnizonaC: "", godzinObnizenia: "" }] }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-M6-STR-DODAJ")}
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-STR-STEROWANIE")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-STR-LICZBA-SILOWNIKOW")} unit={t("UI-J-SZT")} {...pole("liczbaSilownikow")} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="liczbaSilownikow" />} />
          <Pole label={t("UI-M6-STR-MOC-SILOWNIKA")} unit="W" {...pole("mocSilownikaW")} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="mocSilownika" />} />
        </div>
        <Pole label={t("UI-M6-STR-GODZIN-SILOWNIKOW")} unit={t("UI-M6-J-H-DOBE")} max={24} {...pole("godzinPracySilownikow")} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="godzinSilownikow" />} />
        <Pole label={t("UI-M6-STR-MOC-STEROWNIKOW")} unit="W" {...pole("mocSterownikowW")} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="mocSterownikow" />} />
        <Pole label={t("UI-M6-STR-COP")} {...pole("copOgrzewania")} pomoc={<PomocPola ekran="sterowanie-strefowe" pole="cop" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-STR-W-UWAGA" : v.bilansPraduKwh === null ? "UI-M6-STR-W-PALIWO" : "UI-M6-STR-W-OK")}>
          <WynikGlowny>
            {t("UI-M6-STR-WYNIK", { pct: r1(v.oszczednoscPct), kwh: r2(v.oszczednoscCieplaKwh), bez: r1(v.cieploBezStrefKwh), ze: r1(v.cieploZeStrefamiKwh) })}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {v.bilansPraduKwh !== null && v.oszczednoscPraduKwh !== null
              ? t("UI-M6-STR-PRAD", { zysk: r2(v.oszczednoscPraduKwh), ster: r2(v.pradSterowaniaKwh), bilans: r2(v.bilansPraduKwh) })
              : t("UI-M6-STR-STEROWANIE-PRAD", { ster: r2(v.pradSterowaniaKwh) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/obciazenie-cieplne" className="text-small underline">
          {t("UI-M6-STR-LINK-E1")}
        </Link>
        <Link href="/kalkulatory/pojemnosc-cieplna" className="text-small underline">
          {t("UI-M6-STR-LINK-E8")}
        </Link>
      </div>
    </main>
  )
}
