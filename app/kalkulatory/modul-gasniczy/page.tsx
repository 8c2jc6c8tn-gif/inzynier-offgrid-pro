"use client"

import { useMemo } from "react"
import { calculateModulGasniczy } from "@/lib/core/modules/bezpieczenstwo/modul-gasniczy/calculator"
import { MIN_CZUJNIKOW_POTWIERDZENIA } from "@/lib/core/modules/bezpieczenstwo/modul-gasniczy/constants"
import type { MagazynWStrefie, SrodekGasniczy, StanModuluGasniczego } from "@/lib/core/modules/bezpieczenstwo/modul-gasniczy/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  srodek: SrodekGasniczy | ""
  magazynWStrefie: MagazynWStrefie | ""
  liczbaCzujnikowPotwierdzenia: string
  odcinaWentylacjeIKlapy: boolean
  stanModulu: StanModuluGasniczego | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  srodek: "",
  magazynWStrefie: "",
  liczbaCzujnikowPotwierdzenia: "",
  odcinaWentylacjeIKlapy: false,
  stanModulu: "",
}

/** Sekwencja dowódcy akcji AI — 1:1 ze źródła (Tresc_Modul_8, Ekran 4, B.2; Biblia v2.0 §8.9). */
const SEKWENCJA = [
  "UI-MODGAS-ODLACZ-ZASILANIE-BATERII",
  "UI-MODGAS-WYLACZ-WENTYLACJE-MECHANICZN",
  "UI-MODGAS-ZWOLNIJ-ZAMKI",
  "UI-MODGAS-URUCHOM-OSWIETLENIE-EWAKUACY",
  "UI-MODGAS-ODLACZ-ZBEDNE-OBWODY",
  "UI-MODGAS-URUCHOM-MODUL-GASNICZY",
]

export default function ModulGasniczyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("modul-gasniczy", STAN_POCZATKOWY)
  const ustaw = <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))

  const result = useMemo(
    () =>
      calculateModulGasniczy({
        srodek: stan.srodek === "" ? null : stan.srodek,
        magazynWStrefie: stan.magazynWStrefie === "" ? null : stan.magazynWStrefie,
        liczbaCzujnikowPotwierdzenia: stan.liczbaCzujnikowPotwierdzenia === "" ? null : Number(stan.liczbaCzujnikowPotwierdzenia),
        odcinaWentylacjeIKlapy: stan.odcinaWentylacjeIKlapy,
        stanModulu: stan.stanModulu === "" ? null : stan.stanModulu,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/modul-gasniczy" />
      <NaglowekEkranu
        tytul={t("UI-MODGAS-MODUL-GASNICZY")}
        ekran="modul-gasniczy"
        parametry={{ minCzujnikow: MIN_CZUJNIKOW_POTWIERDZENIA }}
        wynik={result}
      >
        {t("UI-MODGAS-CZLOWIEK-MOZE-ZDAZYC")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-MODGAS-SRODEK-GASNICZY")}
          value={stan.srodek}
          onChange={(e) => ustaw("srodek", e.target.value as FormularzStan["srodek"])}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="srodek" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="mgla-wodna">{t("UI-MODGAS-MGLA-WODNA")}</option>
          <option value="specjalny-magazyn-energii">{t("UI-MODGAS-SRODEK-MAGAZYNOW-ENERGII")}</option>
          <option value="gaz-obojetny">{t("UI-MODGAS-GAZ-OBOJETNY")}</option>
          <option value="aerozol">{t("UI-MODGAS-AEROZOL")}</option>
          <option value="proszek">{t("UI-MODGAS-PROSZEK")}</option>
          <option value="co2">CO2</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-MODGAS-MAGAZYN-ENERGII-STREFIE")}
          value={stan.magazynWStrefie}
          onChange={(e) => ustaw("magazynWStrefie", e.target.value as FormularzStan["magazynWStrefie"])}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="magazyn" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="brak">{t("UI-MODGAS-BRAK-MAGAZYNU-STREFIE")}</option>
          <option value="lifepo4">{t("UI-MODGAS-LIFEPO4")}</option>
          <option value="inna">{t("UI-MODGAS-INNA-CHEMIA")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-MODGAS-CZUJNIKI-POTWIERDZAJACE-ALAR")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={stan.liczbaCzujnikowPotwierdzenia}
          onChange={(e) => ustaw("liczbaCzujnikowPotwierdzenia", e.target.value)}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="czujniki" params={{ minCzujnikow: MIN_CZUJNIKOW_POTWIERDZENIA }} />}
        />
        <PoleCheckbox
          id="gasz-odciecie-wentylacji"
          label={t("UI-MODGAS-GASZENIE-ODCINA-WENTYLACJE")}
          checked={stan.odcinaWentylacjeIKlapy}
          onChange={(e) => ustaw("odcinaWentylacjeIKlapy", e.target.checked)}
        />
        <PoleSelect
          label={t("UI-MODGAS-STAN-MODULU")}
          value={stan.stanModulu}
          onChange={(e) => ustaw("stanModulu", e.target.value as FormularzStan["stanModulu"])}
          pomoc={<PomocPola ekran="modul-gasniczy" pole="stanModulu" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="sprawny">{t("UI-MODGAS-SPRAWNY-NALADOWANY")}</option>
          <option value="rozladowany">{t("UI-MODGAS-ROZLADOWANY")}</option>
        </PoleSelect>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-MODGAS-OCENIC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-MODGAS-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-MODGAS-GASZENIE-MOZE-ZADZIALAC") : hasWarning ? t("UI-MODGAS-BRAKI-KONFIGURACJI") : t("UI-MODGAS-KONFIGURACJA-ZGODNA")}
        >
          <WynikGlowny>{t("UI-MODGAS-BRAKI", { liczbaBrakow: result.value.liczbaBrakow })}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-body font-medium">{t("UI-MODGAS-KOLEJNOSC-DZIALAN-WYKRYCIU")}</h2>
        <ol className="list-decimal pl-5 text-small">
          {SEKWENCJA.map((krok) => (
            <li key={krok}>{t(krok)}</li>
          ))}
        </ol>
        <p className="text-caption text-muted-foreground">
          {t("UI-MODGAS-KOLEJNOSC-ZNACZENIE-WYKONUJE")}
        </p>
      </section>
    </main>
  )
}
