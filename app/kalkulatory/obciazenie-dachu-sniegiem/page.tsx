"use client"

import { useId, useMemo } from "react"
import { calculateObciazenieDachuSniegiem } from "@/lib/core/modules/stress-test/obciazenie-dachu-sniegiem/calculator"
import type { EkspozycjaTerenu, RodzajSniegu, StrefaSniegowa } from "@/lib/core/modules/pv/eurokod-1/snieg"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { PROG_ZBLIZANIA_DO_NOSNOSCI } from "@/lib/core/modules/stress-test/obciazenie-dachu-sniegiem/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  strefa: string
  wysokoscNpmM: string
  katDachuDeg: string
  ekspozycja: EkspozycjaTerenu
  barierkiLubAttyka: boolean
  nosnoscDachuKnM2: string
  gruboscWarstwyCm: string
  rodzajSniegu: RodzajSniegu | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  strefa: "",
  wysokoscNpmM: "",
  katDachuDeg: "",
  ekspozycja: "normalny",
  barierkiLubAttyka: false,
  nosnoscDachuKnM2: "",
  gruboscWarstwyCm: "",
  rodzajSniegu: "",
}

const liczbaLubNull = (s: string) => (s === "" ? null : Number(s))
const liczba = (s: string) => (s === "" ? 0 : Number(s))
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function ObciazenieDachuSniegiemPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("obciazenie-dachu-sniegiem", STAN_POCZATKOWY)
  const idBarierki = useId()
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateObciazenieDachuSniegiem({
        strefa: stan.strefa === "" ? null : (Number(stan.strefa) as StrefaSniegowa),
        wysokoscNpmM: liczbaLubNull(stan.wysokoscNpmM),
        katDachuDeg: liczbaLubNull(stan.katDachuDeg),
        ekspozycja: stan.ekspozycja,
        barierkiLubAttyka: stan.barierkiLubAttyka,
        nosnoscDachuKnM2: liczba(stan.nosnoscDachuKnM2),
        gruboscWarstwyCm: liczba(stan.gruboscWarstwyCm),
        rodzajSniegu: stan.rodzajSniegu === "" ? null : stan.rodzajSniegu,
      }),
    [stan],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/obciazenie-dachu-sniegiem" />
      <NaglowekEkranu
        tytul={t("UI-OBCDACSNI-OBCIAZENIE-DACHU-SNIEGIEM")}
        ekran="obciazenie-dachu-sniegiem"
        wynik={result}
        parametry={{ prog: Math.round(PROG_ZBLIZANIA_DO_NOSNOSCI * 100) }}
      >
        {t("UI-OBCDACSNI-ILE-SNIEGU-MUSI")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-OBCDACSNI-STREFA-OBCIAZENIA-SNIEGIEM")}
          value={stan.strefa}
          onChange={(e) => setStan((prev) => ({ ...prev, strefa: e.target.value }))}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="strefa" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="1">{t("UI-OBCDACSNI-STREFA")}</option>
          <option value="2">{t("UI-OBCDACSNI-STREFA-2")}</option>
          <option value="3">{t("UI-OBCDACSNI-STREFA-3")}</option>
          <option value="4">{t("UI-OBCDACSNI-STREFA-4")}</option>
          <option value="5">{t("UI-OBCDACSNI-STREFA-5")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-OBCDACSNI-WYSOKOSC-NAD-POZIOMEM")}
          unit="m"
          type="number"
          inputMode="decimal"
          value={stan.wysokoscNpmM}
          onChange={ustaw("wysokoscNpmM")}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="wysokosc" />}
        />
        <Pole
          label={t("UI-OBCDACSNI-KAT-SPADKU-DACHU")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={stan.katDachuDeg}
          onChange={ustaw("katDachuDeg")}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="kat" />}
        />
        <PoleSelect
          label={t("UI-OBCDACSNI-OTOCZENIE-BUDYNKU")}
          value={stan.ekspozycja}
          onChange={(e) => setStan((prev) => ({ ...prev, ekspozycja: e.target.value as EkspozycjaTerenu }))}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="otoczenie" />}
        >
          <option value="wystawiony">{t("UI-OBCDACSNI-WYSTAWIONY-WIATR")}</option>
          <option value="normalny">{t("UI-OBCDACSNI-NORMALNY")}</option>
          <option value="osloniety">{t("UI-OBCDACSNI-OSLONIETY-WIATRU")}</option>
        </PoleSelect>
        <PoleCheckbox
          id={idBarierki}
          label={t("UI-OBCDACSNI-BARIERKI-PRZECIWSNIEZNE-ATTY")}
          hint={t("UI-OBCDACSNI-SNIEG-ZSUWA-DACHU")}
          checked={stan.barierkiLubAttyka}
          onChange={(e) => setStan((prev) => ({ ...prev, barierkiLubAttyka: e.target.checked }))}
        />
        <Pole
          label={t("UI-OBCDACSNI-NOSNOSC-DACHU-SNIEG")}
          unit="kN/m²"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.nosnoscDachuKnM2}
          onChange={ustaw("nosnoscDachuKnM2")}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="nosnosc" />}
        />
        <Pole
          label={t("UI-OBCDACSNI-GRUBOSC-SNIEGU-DACHU")}
          unit="cm"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.gruboscWarstwyCm}
          onChange={ustaw("gruboscWarstwyCm")}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="grubosc" />}
        />
        <PoleSelect
          label={t("UI-OBCDACSNI-RODZAJ-SNIEGU")}
          value={stan.rodzajSniegu}
          onChange={(e) => setStan((prev) => ({ ...prev, rodzajSniegu: e.target.value as FormularzStan["rodzajSniegu"] }))}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="rodzajSniegu" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="swiezy">{t("UI-OBCDACSNI-SWIEZY")}</option>
          <option value="osiadly">{t("UI-OBCDACSNI-OSIADLY-KILKA-GODZIN")}</option>
          <option value="stary">{t("UI-OBCDACSNI-STARY-TYGODNIE-MIESIACE")}</option>
          <option value="mokry">{t("UI-OBCDACSNI-MOKRY")}</option>
        </PoleSelect>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-OBCDACSNI-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-OBCDACSNI-WYBIERZ-STREFE-WPISZ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={
            hasCritical
              ? t("UI-OBCDACSNI-DACH-MOZE-PRZENIESC")
              : hasWarning
                ? t("UI-OBCDACSNI-ZBLIZASZ-GRANICY-NOSNOSCI")
                : t("UI-OBCDACSNI-OBCIAZENIE-SNIEGIEM-DACHU")
          }
        >
          <WynikGlowny>{f2(v.sKnM2)} kN/m²</WynikGlowny>
          <p className="mt-1 text-small">
            ≈ {f0(v.sKgM2)} kg/m² · s<sub>k</sub> = {f2(v.skKnM2)} kN/m² · μ = {f2(v.mu)} · C<sub>e</sub> = {f2(v.ce)}
          </p>
          {v.wykorzystanieNormowePct !== null && (
            <p className="mt-1 text-small">{t("UI-OBCDACSNI-WYKORZYSTANIE-NOSNOSCI-NORMY", { wykorzystanieNormowePct: f0(v.wykorzystanieNormowePct) })}</p>
          )}
          {v.aktualneMaxKnM2 !== null && v.aktualneMinKnM2 !== null && v.aktualneMaxKgM2 !== null && (
            <p className="mt-1 text-small">
              {t("UI-OBCDACSNI-SNIEG-DACHU-TERAZ", { p: v.aktualneMinKnM2 === v.aktualneMaxKnM2
                ? `${f2(v.aktualneMaxKnM2)} kN/m²`
                : `${f2(v.aktualneMinKnM2)}–${f2(v.aktualneMaxKnM2)} kN/m²`, aktualneMaxKgM2: f0(v.aktualneMaxKgM2) })}
              {v.wykorzystanieAktualnePct !== null && ` ${t("UI-OBCDACSNI-NOSNOSCI", { wykorzystanieAktualnePct: f0(v.wykorzystanieAktualnePct) })}`}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
