"use client"

import { useMemo } from "react"
import { calculateWylaczniki } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/calculator"
import type { CelOchrony, TypRcd } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { PROG_OCHRONA_OSOB_MA, PROG_OCHRONA_POZAROWA_MA } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  falownikHybrydowy: boolean
  odbiornikiZSilnikami: boolean
  zainstalowanyTyp: TypRcd | ""
  celOchrony: CelOchrony
  progMa: string
}

const STAN_POCZATKOWY: FormularzStan = {
  falownikHybrydowy: false,
  odbiornikiZSilnikami: false,
  zainstalowanyTyp: "",
  celOchrony: "osob",
  progMa: "",
}

export default function WylacznikiRcdPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wylaczniki-rcd", STAN_POCZATKOWY)
  const { falownikHybrydowy, odbiornikiZSilnikami, zainstalowanyTyp, celOchrony, progMa } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setFalownikHybrydowy = (a: boolean | ((p: boolean) => boolean)) => setPole("falownikHybrydowy", a)
  const setOdbiornikiZSilnikami = (a: boolean | ((p: boolean) => boolean)) => setPole("odbiornikiZSilnikami", a)
  const setZainstalowanyTyp = (a: (TypRcd | "") | ((p: TypRcd | "") => TypRcd | "")) => setPole("zainstalowanyTyp", a)
  const setCelOchrony = (a: CelOchrony | ((p: CelOchrony) => CelOchrony)) => setPole("celOchrony", a)
  const setProgMa = (a: string | ((p: string) => string)) => setPole("progMa", a)

  const result = useMemo(
    () =>
      calculateWylaczniki({
        falownikHybrydowy,
        odbiornikiZSilnikami,
        zainstalowanyTyp: zainstalowanyTyp === "" ? null : zainstalowanyTyp,
        celOchrony,
        progMa: progMa === "" ? 0 : Number(progMa),
      }),
    [falownikHybrydowy, odbiornikiZSilnikami, zainstalowanyTyp, celOchrony, progMa],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-WYLRCD-POLICZYC"),
    incomplete: t("UI-WYLRCD-WYPELNIJ-WSZYSTKIE-POLA"),
    red: t("UI-WYLRCD-ZABRONIONE-RCD-SPELNIA"),
    green: t("UI-WYLRCD-RCD-DOBRANY-POPRAWNIE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wylaczniki-rcd" />
      <NaglowekEkranu
        tytul={t("UI-WYLRCD-WYLACZNIKI-RCD")}
        ekran="wylaczniki-rcd"
        wynik={result}
        parametry={{ progOsob: PROG_OCHRONA_OSOB_MA, progPozar: PROG_OCHRONA_POZAROWA_MA }}
      >
        {t("UI-WYLRCD-RCD-STRAZNIK-KTORY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="falownik-hybrydowy"
          label={t("UI-WYLRCD-FALOWNIK-GENERUJE-SKLADOWA")}
          checked={falownikHybrydowy}
          onChange={(e) => setFalownikHybrydowy(e.target.checked)}
        />
        <PoleCheckbox
          id="odbiorniki-z-silnikami"
          label={t("UI-WYLRCD-OBWODZIE-ODBIORNIKI-SILNIKAM")}
          checked={odbiornikiZSilnikami}
          onChange={(e) => setOdbiornikiZSilnikami(e.target.checked)}
        />
        <PoleSelect
          label={t("UI-WYLRCD-ZAINSTALOWANY-TYP-RCD")}
          value={zainstalowanyTyp}
          onChange={(e) => setZainstalowanyTyp(e.target.value as TypRcd)}
          pomoc={<PomocPola ekran="wylaczniki-rcd" pole="typ" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="AC">{t("UI-WYLRCD-TYP")}</option>
          <option value="A">{t("UI-WYLRCD-TYP-2")}</option>
          <option value="B">{t("UI-WYLRCD-TYP-3")}</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-WYLRCD-CEL-OCHRONY-TEGO")}
          value={celOchrony}
          onChange={(e) => setCelOchrony(e.target.value as CelOchrony)}
          pomoc={<PomocPola ekran="wylaczniki-rcd" pole="cel" params={{ progOsob: PROG_OCHRONA_OSOB_MA, progPozar: PROG_OCHRONA_POZAROWA_MA }} />}
        >
          <option value="osob">{t("UI-WYLRCD-OCHRONA-OSOB")}</option>
          <option value="pozarowa">{t("UI-WYLRCD-OCHRONA-PRZECIWPOZAROWA-300")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-WYLRCD-PRAD-ROZNICOWY-ZAINSTALOWANE")}
          unit="mA"
          type="number"
          inputMode="decimal"
          min={0}
          value={progMa}
          onChange={(e) => setProgMa(e.target.value)}
          pomoc={<PomocPola ekran="wylaczniki-rcd" pole="prad" params={{ progOsob: PROG_OCHRONA_OSOB_MA, progPozar: PROG_OCHRONA_POZAROWA_MA }} />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>{t("UI-WYLRCD-WYMAGANY-PROG", { progWymaganyMa: result.value.progWymaganyMa })}</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
