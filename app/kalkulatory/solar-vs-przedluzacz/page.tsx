"use client"

import { useMemo } from "react"
import { calculateSolarVsPrzedluzacz } from "@/lib/core/modules/kalkulator-mobilny/solar-vs-przedluzacz/calculator"
import type { SolarVsPrzedluzaczInput } from "@/lib/core/modules/kalkulator-mobilny/solar-vs-przedluzacz/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { RozbicieKwot, useSymbolWaluty } from "@/components/waluta-pola"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof SolarVsPrzedluzaczInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  kosztPrzedluzaczaZl: "",
  zuzycieKwhRok: "",
  cenaEnergiiZlKwh: "",
  oplatyStaleZlRok: "",
  kosztZestawuZl: "",
  eksploatacjaZestawuZlRok: "",
  horyzontLat: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

/** Money fields: each keeps the currency it was typed in. */
const KWOTY: readonly (keyof FormularzStan)[] = ["kosztPrzedluzaczaZl", "cenaEnergiiZlKwh", "oplatyStaleZlRok", "kosztZestawuZl", "eksploatacjaZestawuZlRok"]

export default function SolarVsPrzedluzaczPage() {
  const t = useTranslate()
  const symbol = useSymbolWaluty()
  const [stan, setStan, waluty] = usePersistedDraft<FormularzStan>("solar-vs-przedluzacz", STAN_POCZATKOWY, { kwoty: KWOTY })
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))
  /** Currency picker and the unit with the field's currency symbol for one money field. */
  const kwota = (pole: keyof FormularzStan, jednostka: string) => {
    const waluta = waluty.pole(pole)
    return { waluta, unit: t(jednostka, { waluta: symbol(waluta.kod) }) }
  }
  // Amounts typed in another currency are converted to the working currency (NBP) for the calculator.
  const r = waluty.stanRoboczy

  const result = useMemo(
    () =>
      calculateSolarVsPrzedluzacz({
        kosztPrzedluzaczaZl: liczba(r.kosztPrzedluzaczaZl),
        zuzycieKwhRok: liczba(stan.zuzycieKwhRok),
        cenaEnergiiZlKwh: liczba(r.cenaEnergiiZlKwh),
        oplatyStaleZlRok: liczba(r.oplatyStaleZlRok),
        kosztZestawuZl: liczba(r.kosztZestawuZl),
        eksploatacjaZestawuZlRok: liczba(r.eksploatacjaZestawuZlRok),
        horyzontLat: liczba(stan.horyzontLat),
      }),
    [stan, r],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const zwrot = result.value.zwrotLat

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/solar-vs-przedluzacz" />
      <NaglowekEkranu tytul={t("UI-M12-SP-TYTUL")} ekran="solar-vs-przedluzacz" wynik={result}>
        {t("UI-M12-SP-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label={t("UI-M12-SP-PRZEDLUZACZ")} {...kwota("kosztPrzedluzaczaZl", "UI-M12-J-ZL")} type="number" inputMode="decimal" min={0} value={stan.kosztPrzedluzaczaZl} onChange={ustaw("kosztPrzedluzaczaZl")} pomoc={<PomocPola ekran="solar-vs-przedluzacz" pole="przedluzacz" />} />
        <Pole label={t("UI-M12-SP-ZUZYCIE")} unit={t("UI-M12-J-KWH-ROK")} type="number" inputMode="decimal" min={0} value={stan.zuzycieKwhRok} onChange={ustaw("zuzycieKwhRok")} pomoc={<PomocPola ekran="solar-vs-przedluzacz" pole="zuzycie" />} />
        <Pole label={t("UI-M12-SP-CENA")} {...kwota("cenaEnergiiZlKwh", "UI-M12-J-ZL-KWH")} type="number" inputMode="decimal" min={0} value={stan.cenaEnergiiZlKwh} onChange={ustaw("cenaEnergiiZlKwh")} pomoc={<PomocPola ekran="solar-vs-przedluzacz" pole="cena" />} />
        <Pole label={t("UI-M12-SP-OPLATY")} {...kwota("oplatyStaleZlRok", "UI-M12-J-ZL-ROK")} type="number" inputMode="decimal" min={0} value={stan.oplatyStaleZlRok} onChange={ustaw("oplatyStaleZlRok")} pomoc={<PomocPola ekran="solar-vs-przedluzacz" pole="oplaty" />} />
        <Pole label={t("UI-M12-SP-ZESTAW")} {...kwota("kosztZestawuZl", "UI-M12-J-ZL")} type="number" inputMode="decimal" min={0} value={stan.kosztZestawuZl} onChange={ustaw("kosztZestawuZl")} pomoc={<PomocPola ekran="solar-vs-przedluzacz" pole="zestaw" />} />
        <Pole label={t("UI-M12-SP-EKSPLOATACJA")} {...kwota("eksploatacjaZestawuZlRok", "UI-M12-J-ZL-ROK")} type="number" inputMode="decimal" min={0} value={stan.eksploatacjaZestawuZlRok} onChange={ustaw("eksploatacjaZestawuZlRok")} pomoc={<PomocPola ekran="solar-vs-przedluzacz" pole="eksploatacja" />} />
        <Pole label={t("UI-M12-SP-HORYZONT")} unit={t("UI-M12-J-LAT")} type="number" inputMode="decimal" min={0} value={stan.horyzontLat} onChange={ustaw("horyzontLat")} pomoc={<PomocPola ekran="solar-vs-przedluzacz" pole="horyzont" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasWarning ? "uwaga" : "ok"}
          etykieta={t(result.value.tanszy === "zestaw" ? "UI-M12-SP-W-ZESTAW" : "UI-M12-SP-W-PRZEDLUZACZ")}
        >
          <WynikGlowny>
            {zwrot === null ? t("UI-M12-SP-ZWROT-NIGDY") : zwrot === 0 ? t("UI-M12-SP-ZWROT-OD-RAZU") : t("UI-M12-SP-ZWROT", { lat: r1(zwrot) })}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M12-SP-SZCZEGOLY", {
              lat: liczba(stan.horyzontLat),
              p: Math.round(result.value.tcoPrzedluzaczZl),
              z: Math.round(result.value.tcoZestawZl),
              r: Math.round(result.value.kosztRocznySieciZl),
            })}
          </p>
          <RozbicieKwot rozbicie={waluty.rozbicie} />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
