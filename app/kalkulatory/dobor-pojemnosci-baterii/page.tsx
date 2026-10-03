"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { calculateDoborPojemnosci } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import {
  DOD_LIFEPO4_TYPOWY_MAX_PCT,
  DOD_LIFEPO4_TYPOWY_MIN_PCT,
  SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT,
} from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { useProfilSprzetu } from "@/lib/profil-sprzetu/use-profil-sprzetu"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  zapotrzebowanieDoboweKwh: string
  dniAutonomii: string
  sprawnoscFalownikaPct: string
  dodPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieDoboweKwh: "",
  dniAutonomii: "",
  sprawnoscFalownikaPct: String(SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT),
  dodPct: "",
}

export default function DoborPojemnosciBateriiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-pojemnosci-baterii", STAN_POCZATKOWY)
  const { zapotrzebowanieDoboweKwh, dniAutonomii, sprawnoscFalownikaPct, dodPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieDoboweKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieDoboweKwh", a)
  const setDniAutonomii = (a: string | ((p: string) => string)) => setPole("dniAutonomii", a)
  const setSprawnoscFalownikaPct = (a: string | ((p: string) => string)) => setPole("sprawnoscFalownikaPct", a)
  const setDodPct = (a: string | ((p: string) => string)) => setPole("dodPct", a)

  const result = useMemo(
    () =>
      calculateDoborPojemnosci({
        zapotrzebowanieDoboweKwh: zapotrzebowanieDoboweKwh === "" ? 0 : Number(zapotrzebowanieDoboweKwh),
        dniAutonomii: dniAutonomii === "" ? 0 : Number(dniAutonomii),
        sprawnoscFalownikaPct: sprawnoscFalownikaPct === "" ? 0 : Number(sprawnoscFalownikaPct),
        dodPct: dodPct === "" ? 0 : Number(dodPct),
      }),
    [zapotrzebowanieDoboweKwh, dniAutonomii, sprawnoscFalownikaPct, dodPct],
  )

  // Profil sprzętu (docs/zrodla/Zasady_UX_Doradca_v2_1.md, §10) — wynik tego ekranu zasila
  // domyślne wypełnienie Ekranu 6 (starzenie-degradacja), a jego bufor starzeniowy wraca tutaj
  // jako uzupełnienie rekomendacji (assumption BUFOR-STARZENIOWY-NIE-DOLICZONY poniżej).
  const { profil, zapiszBaterie } = useProfilSprzetu()
  useEffect(() => {
    if (result.status !== "VALID") return
    zapiszBaterie({
      pojemnoscUzytecznaDzisKwh: result.value.pojemnoscUzytecznaKwh,
      pojemnoscUzytecznaDzisZaktualizowanoIso: new Date().toISOString(),
    })
  }, [result, zapiszBaterie])
  const bufor = profil.bateria

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-pojemnosci-baterii" />
      <NaglowekEkranu tytul={t("UI-DOBPOJBAT-DOBOR-POJEMNOSCI-BATERII")} ekran="dobor-pojemnosci-baterii" wynik={result}>
        {t("UI-DOBPOJBAT-BATERIA-NIGDY-100")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-DOBPOJBAT-ZAPOTRZEBOWANIE-DOBOWE")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieDoboweKwh}
          onChange={(e) => setZapotrzebowanieDoboweKwh(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="zapotrzebowanie" />}
        />
        <Pole
          label={t("UI-DOBPOJBAT-DNI-AUTONOMII")}
          unit={t("UI-J-DNI")}
          type="number"
          inputMode="decimal"
          min={0}
          value={dniAutonomii}
          onChange={(e) => setDniAutonomii(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="dniAutonomii" />}
        />
        <Pole
          label={t("UI-DOBPOJBAT-SPRAWNOSC-FALOWNIKA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscFalownikaPct}
          onChange={(e) => setSprawnoscFalownikaPct(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="sprawnosc" params={{ sprawnosc: SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT }} />}
        />
        <Pole
          label={t("UI-DOBPOJBAT-DOD-GLEBOKOSC-ROZLADOWANIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={dodPct}
          onChange={(e) => setDodPct(e.target.value)}
          pomoc={<PomocPola ekran="dobor-pojemnosci-baterii" pole="dod" params={{ dodMin: DOD_LIFEPO4_TYPOWY_MIN_PCT, dodMax: DOD_LIFEPO4_TYPOWY_MAX_PCT }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-DOBPOJBAT-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-DOBPOJBAT-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-DOBPOJBAT-WYMAGANA-POJEMNOSC-UZYTECZNA")}>
          <WynikGlowny>{result.value.pojemnoscUzytecznaKwh.toFixed(1)} kWh</WynikGlowny>
          {bufor?.pojemnoscPoczatkowaZBuforemKwh !== undefined &&
          bufor.pojemnoscUzytecznaDzisKwh === result.value.pojemnoscUzytecznaKwh ? (
            <p className="mt-1 text-small">
              {t("UI-DOBPOJBAT-UWZGLEDNIENIEM-STARZENIA-OGN", { buforHoryzontLata: bufor.buforHoryzontLata ?? "—" })}
              <strong>{bufor.pojemnoscPoczatkowaZBuforemKwh.toFixed(1)} kWh</strong> {t("UI-DOBPOJBAT-POJEMNOSCI-POCZATKOWEJ-ZAMOW")}
            </p>
          ) : (
            <p className="mt-1 text-small text-muted-foreground">
              {t("UI-DOBPOJBAT-POJEMNOSC-POTRZEBNA-DZIS")}
              <Link href="/kalkulatory/starzenie-degradacja" className="underline">
                {t("UI-DOBPOJBAT-EKRAN-STARZENIE-DEGRADACJA")}
              </Link>
              .
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
