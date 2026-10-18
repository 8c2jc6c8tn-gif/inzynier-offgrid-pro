"use client"

import { useId, useMemo } from "react"
import { calculateUrzadzenie12vBezposrednio } from "@/lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio/calculator"
import type { Urzadzenie12vBezposrednioInput } from "@/lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio/input"
import {
  NAPIECIE_LADOWANIA_12V_BIBLIA_V,
  NAPIECIE_LADOWANIA_12V_TRESC_V,
} from "@/lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  napiecieSystemuV: Urzadzenie12vBezposrednioInput["napiecieSystemuV"]
  napiecieUrzadzeniaV: string
  tolerancjaPct: string
  /** Optional: drafts saved before 1.1.0 do not have it (usePersistedDraft does not merge with initial values). */
  maksNapiecieLadowaniaV?: string
  przezStabilizator: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieSystemuV: 0,
  napiecieUrzadzeniaV: "",
  tolerancjaPct: "",
  maksNapiecieLadowaniaV: "",
  przezStabilizator: false,
}

export default function Urzadzenie12vBezposrednioPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("urzadzenie-12v-bezposrednio", STAN_POCZATKOWY)
  const idStabilizator = useId()
  const maksLadowania = stan.maksNapiecieLadowaniaV ?? ""

  const result = useMemo(
    () =>
      calculateUrzadzenie12vBezposrednio({
        napiecieSystemuV: stan.napiecieSystemuV,
        napiecieUrzadzeniaV: stan.napiecieUrzadzeniaV === "" ? 0 : Number(stan.napiecieUrzadzeniaV),
        tolerancjaPct: stan.tolerancjaPct === "" ? null : Number(stan.tolerancjaPct),
        maksNapiecieLadowaniaV: maksLadowania === "" ? null : Number(maksLadowania),
        przezStabilizator: stan.przezStabilizator,
      }),
    [stan, maksLadowania],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/urzadzenie-12v-bezposrednio" />
      <NaglowekEkranu
        tytul={t("UI-URZ12VBEZ-MOGE-PODLACZYC-URZADZENIE")}
        ekran="urzadzenie-12v-bezposrednio"
        wynik={result}
      >
        {t("UI-URZ12VBEZ-AKUMULATORZE-UPROSZCZENIE-RE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-URZ12VBEZ-NAPIECIE-INSTALACJI-AKUMULAT")}
          value={stan.napiecieSystemuV}
          onChange={(e) =>
            setStan((prev) => ({ ...prev, napiecieSystemuV: Number(e.target.value) as FormularzStan["napiecieSystemuV"] }))
          }
          pomoc={<PomocPola ekran="urzadzenie-12v-bezposrednio" pole="napiecieInstalacji" />}
        >
          <option value={0}>{t("UI-WYBIERZ")}</option>
          <option value={12}>12 V</option>
          <option value={24}>24 V</option>
        </PoleSelect>
        <NapiecieZProfilu
          aktualne={String(stan.napiecieSystemuV)}
          dozwolone={[12, 24]}
          onUzyj={(v) => setStan((prev) => ({ ...prev, napiecieSystemuV: Number(v) as FormularzStan["napiecieSystemuV"] }))}
        />
        <Pole
          label={t("UI-URZ12VBEZ-NAPIECIE-URZADZENIA")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.napiecieUrzadzeniaV}
          onChange={(e) => setStan((prev) => ({ ...prev, napiecieUrzadzeniaV: e.target.value }))}
          pomoc={<PomocPola ekran="urzadzenie-12v-bezposrednio" pole="napiecieUrzadzenia" />}
        />
        <Pole
          label={t("UI-URZ12VBEZ-TOLERANCJA-NAPIECIA-URZADZEN")}
          unit="± %"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.tolerancjaPct}
          onChange={(e) => setStan((prev) => ({ ...prev, tolerancjaPct: e.target.value }))}
          pomoc={<PomocPola ekran="urzadzenie-12v-bezposrednio" pole="tolerancja" />}
        />
        <Pole
          label={t("UI-URZ12VBEZ-MAKS-NAPIECIE-LADOWANIA")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={maksLadowania}
          onChange={(e) => setStan((prev) => ({ ...prev, maksNapiecieLadowaniaV: e.target.value }))}
          pomoc={
            <PomocPola
              ekran="urzadzenie-12v-bezposrednio"
              pole="napiecieLadowania"
              params={{ ladowanieMin: NAPIECIE_LADOWANIA_12V_TRESC_V, ladowanieMax: NAPIECIE_LADOWANIA_12V_BIBLIA_V }}
            />
          }
        />
        <PoleCheckbox
          id={idStabilizator}
          label={t("UI-URZ12VBEZ-ZASILAM-STABILIZATOR-PRZETWO")}
          checked={stan.przezStabilizator}
          onChange={(e) => setStan((prev) => ({ ...prev, przezStabilizator: e.target.checked }))}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-URZ12VBEZ-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-URZ12VBEZ-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : "ok"}
          etykieta={hasCritical ? t("UI-URZ12VBEZ-PODLACZAJ-WPROST") : stan.przezStabilizator ? t("UI-URZ12VBEZ-STABILIZATOR") : t("UI-URZ12VBEZ-MOZNA-PODLACZYC-WPROST")}
        >
          <WynikGlowny>
            {f1(v.urzadzenieMinV)}–{f1(v.urzadzenieMaxV)} V
          </WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-URZ12VBEZ-URZADZENIE-ZNOSI-AKUMULATOR", { urzadzenieMinV: f1(v.urzadzenieMinV), urzadzenieMaxV: f1(v.urzadzenieMaxV), akuMinV: f1(v.akuMinV), akuMaxV: f1(v.akuMaxV) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
