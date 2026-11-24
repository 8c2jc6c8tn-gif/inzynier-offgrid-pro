"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculatePanelKampera } from "@/lib/core/modules/kalkulator-mobilny/panel-kampera/calculator"
import type { PanelKamperaInput } from "@/lib/core/modules/kalkulator-mobilny/panel-kampera/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { RozbicieKwot, useSymbolWaluty } from "@/components/waluta-pola"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = Exclude<keyof PanelKamperaInput, "elastycznyBezSzczeliny">

type FormularzStan = Record<PolaLiczbowe, string> & { elastycznyBezSzczeliny: "" | "tak" | "nie" }

const STAN_POCZATKOWY: FormularzStan = {
  elastycznyMocW: "",
  elastycznyMasaKg: "",
  elastycznyCenaZl: "",
  elastycznyGwarancjaLat: "",
  sztywnyMocW: "",
  sztywnyMasaKg: "",
  sztywnyCenaZl: "",
  sztywnyGwarancjaLat: "",
  elastycznyBezSzczeliny: "",
}

/** Money fields: each keeps the currency it was typed in. */
const KWOTY = ["elastycznyCenaZl", "sztywnyCenaZl"]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

export default function PanelKamperaPage() {
  const t = useTranslate()
  const symbol = useSymbolWaluty()
  const [stan, setStan, waluty] = usePersistedDraft<FormularzStan>("panel-kampera", STAN_POCZATKOWY, { kwoty: KWOTY })
  // Prices typed in another currency are converted to the working currency (NBP) for the calculator.
  const r = waluty.stanRoboczy
  const wElastyczny = waluty.pole("elastycznyCenaZl")
  const wSztywny = waluty.pole("sztywnyCenaZl")
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculatePanelKampera({
        elastycznyMocW: liczba(stan.elastycznyMocW),
        elastycznyMasaKg: liczba(stan.elastycznyMasaKg),
        elastycznyCenaZl: liczba(r.elastycznyCenaZl),
        elastycznyGwarancjaLat: liczba(stan.elastycznyGwarancjaLat),
        sztywnyMocW: liczba(stan.sztywnyMocW),
        sztywnyMasaKg: liczba(stan.sztywnyMasaKg),
        sztywnyCenaZl: liczba(r.sztywnyCenaZl),
        sztywnyGwarancjaLat: liczba(stan.sztywnyGwarancjaLat),
        elastycznyBezSzczeliny: stan.elastycznyBezSzczeliny === "" ? null : stan.elastycznyBezSzczeliny === "tak",
      }),
    [stan, r],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value
  const wiersz = (w: typeof v.sztywny) => ({ wkg: r2(w.wNaKg), zlw: r2(w.zlNaW), zlwrok: r2(w.zlNaWRok) })

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/panel-kampera" />
      <NaglowekEkranu tytul={t("UI-M12-PK-TYTUL")} ekran="panel-kampera" wynik={result}>
        {t("UI-M12-PK-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-PK-ELASTYCZNY")}</legend>
        <Pole label={t("UI-M12-DK-PANEL-MOC")} unit="W" {...pole("elastycznyMocW")} pomoc={<PomocPola ekran="panel-kampera" pole="moc" />} />
        <Pole label={t("UI-M12-AKK-MASA")} unit="kg" {...pole("elastycznyMasaKg")} pomoc={<PomocPola ekran="panel-kampera" pole="masa" />} />
        <Pole label={t("UI-M12-AKK-CENA")} unit={t("UI-M12-J-ZL", { waluta: symbol(wElastyczny.kod) })} {...pole("elastycznyCenaZl")} waluta={wElastyczny} pomoc={<PomocPola ekran="panel-kampera" pole="cena" />} />
        <Pole label={t("UI-M12-PK-GWARANCJA")} unit={t("UI-M12-J-LAT")} {...pole("elastycznyGwarancjaLat")} pomoc={<PomocPola ekran="panel-kampera" pole="gwarancja" />} />
        <PoleSelect
          label={t("UI-M12-PK-BEZ-SZCZELINY")}
          value={stan.elastycznyBezSzczeliny}
          onChange={(e) => setStan((prev) => ({ ...prev, elastycznyBezSzczeliny: e.target.value as FormularzStan["elastycznyBezSzczeliny"] }))}
          pomoc={<PomocPola ekran="panel-kampera" pole="bezSzczeliny" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="tak">{t("UI-TAK")}</option>
          <option value="nie">{t("UI-NIE")}</option>
        </PoleSelect>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-PK-SZTYWNY")}</legend>
        <Pole label={t("UI-M12-DK-PANEL-MOC")} unit="W" {...pole("sztywnyMocW")} pomoc={<PomocPola ekran="panel-kampera" pole="moc" />} />
        <Pole label={t("UI-M12-AKK-MASA")} unit="kg" {...pole("sztywnyMasaKg")} pomoc={<PomocPola ekran="panel-kampera" pole="masa" />} />
        <Pole label={t("UI-M12-AKK-CENA")} unit={t("UI-M12-J-ZL", { waluta: symbol(wSztywny.kod) })} {...pole("sztywnyCenaZl")} waluta={wSztywny} pomoc={<PomocPola ekran="panel-kampera" pole="cena" />} />
        <Pole label={t("UI-M12-PK-GWARANCJA")} unit={t("UI-M12-J-LAT")} {...pole("sztywnyGwarancjaLat")} pomoc={<PomocPola ekran="panel-kampera" pole="gwarancja" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-PK-W-UWAGA" : "UI-M12-PK-W-OK")}>
          <p className="text-small">{t("UI-M12-PK-WIERSZ-ELASTYCZNY", wiersz(v.elastyczny))}</p>
          <p className="mt-1 text-small">{t("UI-M12-PK-WIERSZ-SZTYWNY", wiersz(v.sztywny))}</p>
          <RozbicieKwot rozbicie={waluty.rozbicie} />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          <p className="mt-2 text-small">
            <Link className="underline" href="/kalkulatory/wplyw-temperatury">
              {t("UI-M12-PK-LINK-TEMPERATURA")}
            </Link>
          </p>
        </WerdyktPanel>
      )}
    </main>
  )
}
