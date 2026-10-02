"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useOnline } from "@/lib/lokalizacja/use-online"
import { useTranslate } from "@/lib/i18n/language-context"

const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/**
 * Monthly mean outdoor temperatures from the saved PVGIS TMY of the project location (T2m, ERA5)
 * — fills the "months" fields of heat screens (M6/E1) instead of typing them. Values are inserted
 * into editable fields, never used silently: the user sees and can correct them.
 */
export function TemperaturyZPvgis({ onWstaw }: { onWstaw: (temperatury: number[]) => void }) {
  const t = useTranslate()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const online = useOnline()
  if (!wczytano) return null

  if (!lokalizacja) {
    return (
      <p className="text-small text-muted-foreground">
        {t("UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC")}{" "}
        <Link href="/kalkulatory/lokalizacja-i-klimat" className="underline">
          {t("UI-TEMZPVG-EKRANIE-LOKALIZACJI")}
        </Link>{" "}{t("UI-TEMZPVG-ALBO-ZBIERZ")}{" "}
        <Link href="/kalkulatory/skaner-dzialki" className="underline">
          {t("UI-TEMZPVG-MODEL-DZIALKI")}
        </Link>
        .
      </p>
    )
  }

  const temperatury = dane?.dane.temperaturyMiesieczneC
  if (dane && temperatury) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border p-3">
        <p className="text-small">
          {t("UI-TEMZPVG-SREDNIE-MIESIECZNE-TEMPERATU", { bazaMeteo: dane.dane.meta.bazaMeteo, rokOd: dane.dane.meta.rokOd, rokDo: dane.dane.meta.rokDo, p: f1(Math.min(...temperatury)), p2: f1(Math.max(...temperatury)) })}
        </p>
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => onWstaw(temperatury)}>
          {t("UI-TEMZPVG-WSTAW-TEMPERATURY-PVGIS")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <p className="text-small text-muted-foreground">
        {dane
          ? t("UI-TEMZPVG-DANE-PVGIS-ZAPISANE", { p: new Date(dane.pobrano).toLocaleDateString("pl-PL") })
          : t("UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC-2")}
      </p>
      <Button
        variant="outline"
        className="min-h-11 w-fit"
        disabled={tmy.pobiera || !online}
        onClick={() => tmy.pobierz(lokalizacja.szerokosc, lokalizacja.dlugosc)}
      >
        {tmy.pobiera ? t("UI-TEMZPVG-POBIERAM-PVGIS") : t("UI-TEMZPVG-POBIERZ-DANE-PVGIS")}
      </Button>
      {!online && <p className="text-small">{t("UI-TEMZPVG-BRAK-POLACZENIA-POBIERZ")}</p>}
      {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
    </div>
  )
}
