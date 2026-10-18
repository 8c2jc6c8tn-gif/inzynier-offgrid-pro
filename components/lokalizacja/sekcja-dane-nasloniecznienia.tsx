"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { czyPoprawnaTemperatura, czyPoprawneNadpisanie, nadpisaniePasuje, type NadpisanieNasloneczenia, type ZapisTmyZNadpisaniem } from "@/lib/lokalizacja/nadpisanie-nasloneczenia"
import type { LokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useOnline } from "@/lib/lokalizacja/use-online"
import { useFormatLiczby, useLanguage, useTranslate, useFormaty } from "@/lib/i18n/language-context"
import { formatujDate } from "@/lib/i18n/liczby"
const KLUCZE_MIESIECY = Array.from({ length: 12 }, (_, i) => `UI-MIES-${String(i + 1).padStart(2, "0")}`)

/** Own monthly radiation totals replacing the PVGIS ones (INFRA-2). Stores strings while typing; an empty or non-positive field means "no override". */
function NadpisanieMiesieczne({
  dane,
  nadpisanie,
  ustaw,
}: {
  dane: ZapisTmyZNadpisaniem
  nadpisanie: NadpisanieNasloneczenia | null
  ustaw: (ghiKwhM2: (number | null)[]) => void
}) {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const f2 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  // The parent remounts this component once the saved sums are read (`key`), so the initial state is the saved one.
  const [wpisy, setWpisy] = useState<string[]>(() =>
    nadpisaniePasuje(nadpisanie, dane.szerokosc, dane.dlugosc) ? nadpisanie.ghiKwhM2.map((v) => (v === null ? "" : String(v))) : Array(12).fill(""),
  )

  const zmien = (m: number, tekst: string) => {
    const nowe = wpisy.map((w, i) => (i === m ? tekst : w))
    setWpisy(nowe)
    ustaw(nowe.map((w) => (w.trim() === "" ? null : Number(w))))
  }
  const aktywne = dane.wspolczynniki.filter((k) => k !== null).length
  return (
    <details className="text-small">
      <summary className="cursor-pointer font-medium">{t("UI-SEKDANNAS-NADPISANIE-TYTUL")}</summary>
      <div className="mt-2 flex flex-col gap-3">
        <p className="flex items-start gap-2 text-muted-foreground">
          <span className="flex-1">{t("UI-SEKDANNAS-NADPISANIE-OPIS")}</span>
          <PomocPola ekran="nasloneczenie-miesieczne" pole="suma" />
        </p>
        <div className="grid grid-cols-2 gap-3">
          {KLUCZE_MIESIECY.map((klucz, m) => {
            const wpis = wpisy[m] ?? ""
            const niepoprawne = wpis.trim() !== "" && !czyPoprawneNadpisanie(Number(wpis))
            const k = dane.wspolczynniki[m]
            return (
              <div key={klucz} className="flex flex-col gap-1">
                <Pole
                  label={t(klucz)}
                  unit="kWh/m²"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={wpis}
                  placeholder={f1(dane.bazoweGhiKwhM2[m] ?? 0)}
                  onChange={(e) => zmien(m, e.target.value)}
                />
                <p className="text-caption text-muted-foreground">{t("UI-SEKDANNAS-NADPISANIE-PVGIS", { suma: f1(dane.bazoweGhiKwhM2[m] ?? 0) })}</p>
                {k !== null && k !== undefined && <p className="text-caption">{t("UI-SEKDANNAS-NADPISANIE-WSPOLCZYNNIK", { k: f2(k) })}</p>}
                {niepoprawne && <p className="text-caption text-werdykt-blad-foreground">{t("UI-SEKDANNAS-NADPISANIE-NIEPOPRAWNE")}</p>}
              </div>
            )
          })}
        </div>
        {aktywne > 0 && (
          <>
            <p className="font-medium">{t("UI-SEKDANNAS-NADPISANIE-AKTYWNE", { n: aktywne })}</p>
            <Button
              variant="outline"
              className="min-h-11 self-start"
              onClick={() => {
                setWpisy(Array(12).fill(""))
                ustaw(Array(12).fill(null))
              }}
            >
              {t("UI-SEKDANNAS-NADPISANIE-WYCZYSC")}
            </Button>
          </>
        )}
      </div>
    </details>
  )
}

/** Own monthly mean temperatures replacing the PVGIS ones: the hourly temperatures of the month are shifted so the mean equals the typed value. */
function NadpisanieTemperatur({
  dane,
  nadpisanie,
  ustaw,
}: {
  dane: ZapisTmyZNadpisaniem
  nadpisanie: NadpisanieNasloneczenia | null
  ustaw: (tempSrednieC: (number | null)[]) => void
}) {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const [wpisy, setWpisy] = useState<string[]>(() =>
    nadpisaniePasuje(nadpisanie, dane.szerokosc, dane.dlugosc) && nadpisanie.tempSrednieC
      ? nadpisanie.tempSrednieC.map((v) => (v === null ? "" : String(v)))
      : Array(12).fill(""),
  )
  const zmien = (m: number, tekst: string) => {
    const nowe = wpisy.map((w, i) => (i === m ? tekst : w))
    setWpisy(nowe)
    ustaw(nowe.map((w) => (w.trim() === "" ? null : Number(w))))
  }
  const aktywne = dane.przesunieciaTempK.filter((d) => d !== null).length
  return (
    <details className="text-small">
      <summary className="cursor-pointer font-medium">{t("UI-SEKDANNAS-TEMP-TYTUL")}</summary>
      <div className="mt-2 flex flex-col gap-3">
        <p className="flex items-start gap-2 text-muted-foreground">
          <span className="flex-1">{t("UI-SEKDANNAS-TEMP-OPIS")}</span>
          <PomocPola ekran="nasloneczenie-miesieczne" pole="temperatura" />
        </p>
        <div className="grid grid-cols-2 gap-3">
          {KLUCZE_MIESIECY.map((klucz, m) => {
            const wpis = wpisy[m] ?? ""
            const niepoprawne = wpis.trim() !== "" && !czyPoprawnaTemperatura(Number(wpis))
            const baza = dane.bazoweTempC[m] ?? null
            const dT = dane.przesunieciaTempK[m]
            return (
              <div key={klucz} className="flex flex-col gap-1">
                <Pole
                  label={t(klucz)}
                  unit="°C"
                  type="number"
                  inputMode="decimal"
                  value={wpis}
                  placeholder={baza === null ? "" : f1(baza)}
                  onChange={(e) => zmien(m, e.target.value)}
                />
                {baza !== null && <p className="text-caption text-muted-foreground">{t("UI-SEKDANNAS-TEMP-PVGIS", { temp: f1(baza) })}</p>}
                {dT !== null && dT !== undefined && <p className="text-caption">{t("UI-SEKDANNAS-TEMP-PRZESUNIECIE", { dt: f1(dT) })}</p>}
                {niepoprawne && <p className="text-caption text-werdykt-blad-foreground">{t("UI-SEKDANNAS-TEMP-NIEPOPRAWNE")}</p>}
              </div>
            )
          })}
        </div>
        {aktywne > 0 && (
          <>
            <p className="font-medium">{t("UI-SEKDANNAS-TEMP-AKTYWNE", { n: aktywne })}</p>
            <Button
              variant="outline"
              className="min-h-11 self-start"
              onClick={() => {
                setWpisy(Array(12).fill(""))
                ustaw(Array(12).fill(null))
              }}
            >
              {t("UI-SEKDANNAS-NADPISANIE-WYCZYSC")}
            </Button>
          </>
        )}
      </div>
    </details>
  )
}

/**
 * Sekcja "Dane nasłonecznienia" — lokalizacja projektu i pobranie PVGIS TMY (raz online, potem
 * offline). Wydzielona z Ekranu 4 M1; ta sama treść na każdym ekranie, który jej potrzebuje.
 */
export function SekcjaDanychNaslonecznienia({
  lokalizacja,
  dane,
  tmy,
}: {
  lokalizacja: LokalizacjaProjektu | null
  dane: ZapisTmyZNadpisaniem | null
  tmy: {
    pobiera: boolean
    blad: string | null
    pobierz: (szerokosc: number, dlugosc: number) => Promise<void>
    nadpisanie: NadpisanieNasloneczenia | null
    nadpisanieWczytano: boolean
    ustawNadpisanie: (ghiKwhM2: (number | null)[]) => void
    ustawNadpisanieTemperatur: (tempSrednieC: (number | null)[]) => void
  }
}) {
  const t = useTranslate()
  const jezyk = useLanguage()
  const { f3 } = useFormaty()
  const online = useOnline()
  return (
    <section className="flex flex-col gap-2 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-SEKDANNAS-DANE-NASLONECZNIENIA")}</h2>
      {!lokalizacja ? (
        <StanPusty tytul={t("UI-SEKDANNAS-BRAK-LOKALIZACJI-ZBIERZ")}>
          <div className="flex gap-3">
            <Link href="/kalkulatory/skaner-dzialki" className="underline">
              {t("UI-SEKDANNAS-EKRAN")}
            </Link>
            <Link href="/kalkulatory/lokalizacja-i-klimat" className="underline">
              {t("UI-SEKDANNAS-EKRAN-2")}
            </Link>
          </div>
        </StanPusty>
      ) : (
        <>
          <p className="text-small">
            {t("UI-SEKDANNAS-LOKALIZACJA", { szerokosc: f3(lokalizacja.szerokosc), dlugosc: f3(lokalizacja.dlugosc), zrodlo: lokalizacja.zrodlo })}
          </p>
          {dane ? (
            <p className="text-small text-muted-foreground">
              {t("UI-SEKDANNAS-TYPOWY-ROK-METEOROLOGICZNY", { bazaPromieniowania: dane.dane.meta.bazaPromieniowania, rokOd: dane.dane.meta.rokOd, rokDo: dane.dane.meta.rokDo, p: formatujDate(new Date(dane.pobrano), jezyk) })}
            </p>
          ) : (
            <p className="text-small text-muted-foreground">
              {t("UI-SEKDANNAS-POTRZEBNE-GODZINOWE-DANE")}
            </p>
          )}
          <Button
            variant={dane ? "outline" : "default"}
            className="min-h-11"
            disabled={tmy.pobiera || !online}
            onClick={() => tmy.pobierz(lokalizacja.szerokosc, lokalizacja.dlugosc)}
          >
            {tmy.pobiera ? t("UI-SEKDANNAS-POBIERAM-PVGIS") : dane ? t("UI-SEKDANNAS-POBIERZ-PONOWNIE") : t("UI-SEKDANNAS-POBIERZ-DANE-NASLONECZNIENIA")}
          </Button>
          {dane && <NadpisanieMiesieczne key={String(tmy.nadpisanieWczytano)} dane={dane} nadpisanie={tmy.nadpisanie} ustaw={tmy.ustawNadpisanie} />}
          {dane && <NadpisanieTemperatur key={`t-${String(tmy.nadpisanieWczytano)}`} dane={dane} nadpisanie={tmy.nadpisanie} ustaw={tmy.ustawNadpisanieTemperatur} />}
          {!online && !dane && <p className="text-small">{t("UI-SEKDANNAS-BRAK-POLACZENIA-POBIERZ")}</p>}
          {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
        </>
      )}
    </section>
  )
}
