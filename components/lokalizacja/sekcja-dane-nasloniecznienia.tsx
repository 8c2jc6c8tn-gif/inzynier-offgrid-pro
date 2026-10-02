"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StanPusty } from "@/components/ui/stany"
import type { ZapisTmy } from "@/lib/lokalizacja/dane-tmy"
import type { LokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useOnline } from "@/lib/lokalizacja/use-online"
import { useTranslate } from "@/lib/i18n/language-context"

const f3 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 3 })

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
  dane: ZapisTmy | null
  tmy: { pobiera: boolean; blad: string | null; pobierz: (szerokosc: number, dlugosc: number) => Promise<void> }
}) {
  const t = useTranslate()
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
              {t("UI-SEKDANNAS-TYPOWY-ROK-METEOROLOGICZNY", { bazaPromieniowania: dane.dane.meta.bazaPromieniowania, rokOd: dane.dane.meta.rokOd, rokDo: dane.dane.meta.rokDo, p: new Date(dane.pobrano).toLocaleDateString("pl-PL") })}
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
          {!online && !dane && <p className="text-small">{t("UI-SEKDANNAS-BRAK-POLACZENIA-POBIERZ")}</p>}
          {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
        </>
      )}
    </section>
  )
}
