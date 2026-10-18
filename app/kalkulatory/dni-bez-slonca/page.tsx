"use client"

import { useMemo } from "react"
import { calculateDniBezSlonca } from "@/lib/core/modules/kalkulator-mobilny/dni-bez-slonca/calculator"
import {
  DOD_LIFEPO4_TYPOWY_MAX_PCT,
  DOD_LIFEPO4_TYPOWY_MIN_PCT,
  SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT,
} from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"

type FormularzStan = {
  pojemnoscAh: string
  napiecieV: string
  dodPct: string
  sprawnoscPct: string
  zuzycieDoboweWh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscAh: "",
  napiecieV: "",
  dodPct: "",
  sprawnoscPct: "",
  zuzycieDoboweWh: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))

export default function DniBezSloncaPage() {
  const t = useTranslate()
  const { f0, f1 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dni-bez-slonca", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateDniBezSlonca({
        pojemnoscAh: liczba(stan.pojemnoscAh),
        napiecieV: liczba(stan.napiecieV),
        dodPct: liczba(stan.dodPct),
        sprawnoscPct: liczba(stan.sprawnoscPct),
        zuzycieDoboweWh: liczba(stan.zuzycieDoboweWh),
      }),
    [stan],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dni-bez-slonca" />
      <NaglowekEkranu tytul={t("UI-DNIBEZSLO-ILE-DNI-PRACY")} ekran="dni-bez-slonca" wynik={result}>
        {t("UI-DNIBEZSLO-ILE-POCHMURNYCH-DNI")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-DNIBEZSLO-POJEMNOSC-AKUMULATORA")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pojemnoscAh}
          onChange={ustaw("pojemnoscAh")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-DNIBEZSLO-NAPIECIE-AKUMULATORA")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.napiecieV}
          onChange={ustaw("napiecieV")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="napiecie" />}
        />
        <NapiecieZProfilu aktualne={stan.napiecieV} onUzyj={(v) => setStan((prev) => ({ ...prev, napiecieV: v }))} />
        <Pole
          label={t("UI-DNIBEZSLO-DOPUSZCZALNE-ROZLADOWANIE-DO")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.dodPct}
          onChange={ustaw("dodPct")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="dod" params={{ dodMin: DOD_LIFEPO4_TYPOWY_MIN_PCT, dodMax: DOD_LIFEPO4_TYPOWY_MAX_PCT }} />}
        />
        <Pole
          label={t("UI-DNIBEZSLO-SPRAWNOSC-PRZETWORNICY")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.sprawnoscPct}
          onChange={ustaw("sprawnoscPct")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="sprawnosc" params={{ sprawnosc: SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT }} />}
        />
        <Pole
          label={t("UI-DNIBEZSLO-ZUZYCIE-DOBE")}
          unit="Wh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zuzycieDoboweWh}
          onChange={ustaw("zuzycieDoboweWh")}
          pomoc={<PomocPola ekran="dni-bez-slonca" pole="zuzycie" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-DNIBEZSLO-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-DNIBEZSLO-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-DNIBEZSLO-PRACA-BEZ-DOLADOWANIA")}>
          <WynikGlowny>{t("UI-DNIBEZSLO-DNI", { dni: f1(result.value.dni) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-DNIBEZSLO-PELNYCH-DOB-ENERGIA", { pelneDoby: f0(result.value.pelneDoby), energiaDostepnaWh: f0(result.value.energiaDostepnaWh) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
