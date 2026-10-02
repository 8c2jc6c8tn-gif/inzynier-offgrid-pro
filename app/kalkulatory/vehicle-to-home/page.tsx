"use client"

import { useMemo } from "react"
import { calculateVehicleToHome } from "@/lib/core/modules/baterie/vehicle-to-home/calculator"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  wspieraV2h: boolean
  pojemnoscBaterEvKwh: string
  rezerwaNaDojazdKwh: string
  sprawnoscEfektywnaPct: string
  kosztWymianyBateriiZl: string
  liczbaCykli: string
}

const STAN_POCZATKOWY: FormularzStan = {
  wspieraV2h: false,
  pojemnoscBaterEvKwh: "",
  rezerwaNaDojazdKwh: "",
  sprawnoscEfektywnaPct: "",
  kosztWymianyBateriiZl: "",
  liczbaCykli: "",
}

/** Money fields converted when the display currency changes. */
const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("kosztWymianyBateriiZl")

export default function VehicleToHomePage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("vehicle-to-home", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const { wspieraV2h, pojemnoscBaterEvKwh, rezerwaNaDojazdKwh, sprawnoscEfektywnaPct, kosztWymianyBateriiZl, liczbaCykli } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setWspieraV2h = (a: boolean | ((p: boolean) => boolean)) => setPole("wspieraV2h", a)
  const setPojemnoscBaterEvKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscBaterEvKwh", a)
  const setRezerwaNaDojazdKwh = (a: string | ((p: string) => string)) => setPole("rezerwaNaDojazdKwh", a)
  const setSprawnoscEfektywnaPct = (a: string | ((p: string) => string)) => setPole("sprawnoscEfektywnaPct", a)
  const setKosztWymianyBateriiZl = (a: string | ((p: string) => string)) => setPole("kosztWymianyBateriiZl", a)
  const setLiczbaCykli = (a: string | ((p: string) => string)) => setPole("liczbaCykli", a)

  const result = useMemo(
    () =>
      calculateVehicleToHome({
        wspieraV2h,
        pojemnoscBaterEvKwh: pojemnoscBaterEvKwh === "" ? 0 : Number(pojemnoscBaterEvKwh),
        rezerwaNaDojazdKwh: rezerwaNaDojazdKwh === "" ? 0 : Number(rezerwaNaDojazdKwh),
        sprawnoscEfektywnaPct: sprawnoscEfektywnaPct === "" ? 0 : Number(sprawnoscEfektywnaPct),
        kosztWymianyBateriiZl: kosztWymianyBateriiZl === "" ? 0 : Number(kosztWymianyBateriiZl),
        liczbaCykli: liczbaCykli === "" ? 0 : Number(liczbaCykli),
      }),
    [wspieraV2h, pojemnoscBaterEvKwh, rezerwaNaDojazdKwh, sprawnoscEfektywnaPct, kosztWymianyBateriiZl, liczbaCykli],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/vehicle-to-home" />
      <NaglowekEkranu tytul={t("UI-VEHTOHOM-VEHICLE-HOME-V2H")} ekran="vehicle-to-home" wynik={result}>
        {t("UI-VEHTOHOM-AUTO-MOZE-BYC")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="wspiera-v2h"
          label={t("UI-VEHTOHOM-FALOWNIK-AUTO-WSPIERAJA")}
          checked={wspieraV2h}
          onChange={(e) => setWspieraV2h(e.target.checked)}
        />
        <Pole
          label={t("UI-VEHTOHOM-POJEMNOSC-BATERII-TRAKCYJNEJ")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscBaterEvKwh}
          onChange={(e) => setPojemnoscBaterEvKwh(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-VEHTOHOM-REZERWA-DOJAZD")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezerwaNaDojazdKwh}
          onChange={(e) => setRezerwaNaDojazdKwh(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="rezerwa" />}
        />
        <Pole
          label={t("UI-VEHTOHOM-SPRAWNOSC-EFEKTYWNA-DEGRADAC")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscEfektywnaPct}
          onChange={(e) => setSprawnoscEfektywnaPct(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="sprawnosc" />}
        />
        <Pole
          label={t("UI-VEHTOHOM-KOSZT-WYMIANY-BATERII")}
          unit={t("UI-J-ZL")}
          type="number"
          inputMode="decimal"
          min={0}
          value={kosztWymianyBateriiZl}
          onChange={(e) => setKosztWymianyBateriiZl(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="kosztWymiany" />}
        />
        <Pole
          label={t("UI-VEHTOHOM-LICZBA-CYKLI-ZYCIA")}
          unit={t("UI-VEHTOHOM-CYKLI")}
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaCykli}
          onChange={(e) => setLiczbaCykli(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="cykle" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-VEHTOHOM-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-VEHTOHOM-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"}
          etykieta={t("UI-VEHTOHOM-REALNIE-DOSTEPNA-POJEMNOSC")}
        >
          <WynikGlowny>{result.value.pojemnoscRealnaKwh.toFixed(1)} kWh</WynikGlowny>
          <p className="mt-2 text-small">
            {t("UI-VEHTOHOM-KOSZT-KWH-BATERII", { kosztZaKwh: result.value.kosztZaKwh.toFixed(2) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
