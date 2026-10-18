"use client"

import { useId, useMemo } from "react"
import { calculateOchronaPrzedRozladowaniem } from "@/lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/calculator"
import { OGNIWA_NA_12V, PROG_ODCIECIA_12V } from "@/lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/constants"
import type {
  ChemiaMalegoAkumulatora,
  OchronaPrzedRozladowaniemInput,
} from "@/lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  chemia: ChemiaMalegoAkumulatora | ""
  napiecieZnamionoweV: OchronaPrzedRozladowaniemInput["napiecieZnamionoweV"]
  maDozownik: boolean
  odbiornikMaWlasneZabezpieczenie: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  chemia: "",
  napiecieZnamionoweV: 0,
  maDozownik: false,
  odbiornikMaWlasneZabezpieczenie: false,
}

export default function OchronaPrzedRozladowaniemPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f2 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-przed-rozladowaniem", STAN_POCZATKOWY)
  const idDozownik = useId()
  const idZabezpieczenie = useId()

  const result = useMemo(
    () =>
      calculateOchronaPrzedRozladowaniem({
        chemia: stan.chemia === "" ? null : stan.chemia,
        napiecieZnamionoweV: stan.napiecieZnamionoweV,
        maDozownik: stan.maDozownik,
        odbiornikMaWlasneZabezpieczenie: stan.odbiornikMaWlasneZabezpieczenie,
      }),
    [stan],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const { progOdcieciaV, progNaOgniwoV, liczbaOgniw } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-przed-rozladowaniem" />
      <NaglowekEkranu
        tytul={t("UI-OCHPRZROZ-OCHRONA-PRZED-ROZLADOWANIEM")}
        ekran="ochrona-przed-rozladowaniem"
        wynik={result}
        parametry={{
          progAgm: PROG_ODCIECIA_12V.AGM ?? "—",
          progLfp: PROG_ODCIECIA_12V.LiFePO4 ?? "—",
          ogniwaOlow: OGNIWA_NA_12V.AGM,
          ogniwaLfp: OGNIWA_NA_12V.LiFePO4,
        }}
      >
        {t("UI-OCHPRZROZ-DOZOWNIK-NAPIECIA-LVD")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-OCHPRZROZ-TYP-AKUMULATORA")}
          value={stan.chemia}
          onChange={(e) => setStan((prev) => ({ ...prev, chemia: e.target.value as FormularzStan["chemia"] }))}
          pomoc={<PomocPola ekran="ochrona-przed-rozladowaniem" pole="typ" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="AGM">AGM</option>
          <option value="kwasowy">{t("UI-OCHPRZROZ-KWASOWY-ZALEWOWY")}</option>
          <option value={t("UI-OCHPRZROZ-LIFEPO4")}>{t("UI-OCHPRZROZ-LIFEPO4")}</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-OCHPRZROZ-NAPIECIE-ZNAMIONOWE")}
          value={stan.napiecieZnamionoweV}
          onChange={(e) =>
            setStan((prev) => ({
              ...prev,
              napiecieZnamionoweV: Number(e.target.value) as FormularzStan["napiecieZnamionoweV"],
            }))
          }
          pomoc={<PomocPola ekran="ochrona-przed-rozladowaniem" pole="napiecie" />}
        >
          <option value={0}>{t("UI-WYBIERZ")}</option>
          <option value={12}>12 V</option>
          <option value={24}>24 V</option>
          <option value={48}>48 V</option>
        </PoleSelect>
        <NapiecieZProfilu
          aktualne={String(stan.napiecieZnamionoweV)}
          dozwolone={[12, 24, 48]}
          onUzyj={(v) => setStan((prev) => ({ ...prev, napiecieZnamionoweV: Number(v) as FormularzStan["napiecieZnamionoweV"] }))}
        />
        <PoleCheckbox
          id={idDozownik}
          label={t("UI-OCHPRZROZ-MAM-DOZOWNIK-NAPIECIA")}
          checked={stan.maDozownik}
          onChange={(e) => setStan((prev) => ({ ...prev, maDozownik: e.target.checked }))}
        />
        <PoleCheckbox
          id={idZabezpieczenie}
          label={t("UI-OCHPRZROZ-ODBIORNIK-SAM-ODCINA")}
          hint={t("UI-OCHPRZROZ-LODOWKA-TURYSTYCZNA-WBUDOWAN")}
          checked={stan.odbiornikMaWlasneZabezpieczenie}
          onChange={(e) => setStan((prev) => ({ ...prev, odbiornikMaWlasneZabezpieczenie: e.target.checked }))}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-OCHPRZROZ-WYBIERZ-TYP-NAPIECIE")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : "ok"}
          etykieta={hasCritical ? t("UI-OCHPRZROZ-AKUMULATOR-BEZ-OCHRONY") : t("UI-OCHPRZROZ-PROG-ODCIECIA-DOZOWNIKA")}
        >
          <WynikGlowny>{progOdcieciaV === null ? t("UI-OCHPRZROZ-KARTY-PRODUCENTA") : `${f2(progOdcieciaV)} V`}</WynikGlowny>
          {progNaOgniwoV !== null && (
            <p className="mt-1 text-small">
              {t("UI-OCHPRZROZ-OGNIWO-OGNIW-SZEREGU", { progNaOgniwoV: f2(progNaOgniwoV), liczbaOgniw })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
