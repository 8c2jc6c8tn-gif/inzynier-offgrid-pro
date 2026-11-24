"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { RozbicieKwot, useSymbolWaluty } from "@/components/waluta-pola"
import type { ObciazenieCieplneResult } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { calculateRaportEfektywnosci } from "@/lib/core/modules/ogrzewanie/raport-efektywnosci-budynku/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

type Pola = "powierzchnia" | "cieploRok" | "cena"
type Stan = Record<Pola, string>

const STAN_POCZATKOWY: Stan = { powierzchnia: "", cieploRok: "", cena: "" }

const r0 = (x: number) => Math.round(x)

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 1: raport efektywności i ranking strat (dawne 5.40, 5.67). Losses come from
 * the Screen 1 result; the yearly heat defaults to the Screen 1 monthly sum when the field is empty.
 */
export function SekcjaRaportEfektywnosci({ wynik, cop }: { wynik: ObciazenieCieplneResult; cop: number }) {
  const t = useTranslate()
  const symbol = useSymbolWaluty()
  const [stan, setStan, waluty] = usePersistedDraft<Stan>("obciazenie-cieplne.raport", STAN_POCZATKOWY, { kwoty: ["cena"] })
  // The price typed in another currency is converted to the working currency (NBP) for the calculator.
  const cenaRobocza = waluty.stanRoboczy.cena
  const wCeny = waluty.pole("cena")
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const cieploAuto = wynik.cieploSumaMiesiecyKwh
  const wentylacja = t("UI-M6D-RAP-WENTYLACJA")
  const result = useMemo(
    () =>
      calculateRaportEfektywnosci({
        pozycje: [
          ...wynik.przegrody.map((p, i) => ({ nazwa: p.nazwa || `#${i + 1}`, strataW: p.strataW })),
          { nazwa: wentylacja, strataW: wynik.strataWentylacjaW },
        ],
        cieploRokKwh: liczba(stan.cieploRok) ?? cieploAuto ?? 0,
        powierzchniaM2: liczba(stan.powierzchnia) ?? 0,
        cop,
        cenaZlKwh: liczba(cenaRobocza) ?? 0,
      }),
    [stan, cenaRobocza, wynik, cop, cieploAuto, wentylacja],
  )
  const v = result.value
  const najwieksza = v.ranking[0]

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-RAP-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-RAP-OPIS")}</p>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-RAP-POWIERZCHNIA")} unit="m²" {...pole("powierzchnia")} pomoc={<PomocPola ekran="m6d-raport-efektywnosci" pole="powierzchnia" />} />
        <Pole
          label={t("UI-M6D-RAP-CIEPLO-ROK")}
          unit="kWh"
          {...pole("cieploRok")}
          placeholder={cieploAuto !== null ? String(r0(cieploAuto)) : undefined}
          pomoc={<PomocPola ekran="m6d-raport-efektywnosci" pole="cieploRok" />}
        />
      </div>
      <Pole label={t("UI-M6D-RAP-CENA")} unit={t("UI-J-ZL-KWH", { waluta: symbol(wCeny.kod) })} {...pole("cena")} waluta={wCeny} pomoc={<PomocPola ekran="m6d-raport-efektywnosci" pole="cena" />} />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : najwieksza ? (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6D-RAP-W-OK")}>
          <WynikGlowny>{t("UI-M6D-RAP-WYNIK", { nazwa: najwieksza.nazwa, pct: r0(najwieksza.udzialPct) })}</WynikGlowny>
          <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-small">
            {v.ranking.map((p, i) => (
              <li key={i}>{t("UI-M6D-RAP-POZYCJA", { nazwa: p.nazwa, w: r0(p.strataW), pct: r0(p.udzialPct) })}</li>
            ))}
          </ol>
          {v.wskaznikKwhM2Rok !== null && <p className="mt-2 text-small">{t("UI-M6D-RAP-WSKAZNIK", { kwh: r0(v.wskaznikKwhM2Rok) })}</p>}
          {v.energiaElRokKwh !== null && <p className="mt-1 text-small">{t("UI-M6D-RAP-PRAD", { kwh: r0(v.energiaElRokKwh) })}</p>}
          {v.kosztRokZl !== null && <p className="mt-1 text-small">{t("UI-M6D-RAP-KOSZT", { zl: r0(v.kosztRokZl) })}</p>}
          <RozbicieKwot rozbicie={waluty.rozbicie} />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          <p className="mt-2 text-small">
            <Link href="/kalkulatory/cop-pompy-ciepla" className="underline">
              {t("UI-M6D-RAP-LINK-POKRYCIE")}
            </Link>
          </p>
        </WerdyktPanel>
      ) : null}
    </section>
  )
}
