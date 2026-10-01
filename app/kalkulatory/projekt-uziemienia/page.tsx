"use client"

import { useMemo } from "react"
import { calculateProjektUziemienia } from "@/lib/core/modules/okablowanie/projekt-uziemienia/calculator"
import { ETYKIETA_CELU } from "@/lib/core/modules/okablowanie/projekt-uziemienia/constants"
import type { CelUziemienia } from "@/lib/core/modules/okablowanie/projekt-uziemienia/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  rezystywnoscGruntuOmM: string
  dlugoscPretaM: string
  srednicaPretaMm: string
  celUziemienia: CelUziemienia | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  rezystywnoscGruntuOmM: "",
  dlugoscPretaM: "3",
  srednicaPretaMm: "16",
  celUziemienia: "",
}

export default function ProjektUziemieniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("projekt-uziemienia", STAN_POCZATKOWY)
  const { rezystywnoscGruntuOmM, dlugoscPretaM, srednicaPretaMm, celUziemienia } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const result = useMemo(
    () =>
      calculateProjektUziemienia({
        rezystywnoscGruntuOmM: rezystywnoscGruntuOmM === "" ? 0 : Number(rezystywnoscGruntuOmM),
        dlugoscPretaM: dlugoscPretaM === "" ? 0 : Number(dlugoscPretaM),
        srednicaPretaMm: srednicaPretaMm === "" ? 0 : Number(srednicaPretaMm),
        celUziemienia: celUziemienia === "" ? null : celUziemienia,
      }),
    [rezystywnoscGruntuOmM, dlugoscPretaM, srednicaPretaMm, celUziemienia],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : result.status === "OUT_OF_SCOPE"
          ? "outOfScope"
          : hasCritical
            ? "red"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    outOfScope: "blad",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-PROUZI-POLICZYC"),
    incomplete: t("UI-PROUZI-WYPELNIJ-WSZYSTKIE-POLA"),
    outOfScope: t("UI-PROUZI-GEOMETRIA-PRETA-POZA"),
    red: t("UI-PROUZI-ZBYT-TRUDNY-GRUNT"),
    green: t("UI-PROUZI-UZIOM-ZAPROJEKTOWANY"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/projekt-uziemienia" />
      <NaglowekEkranu tytul={t("UI-PROUZI-PROJEKT-UZIEMIENIA")} ekran="projekt-uziemienia" wynik={result}>
        {t("UI-PROUZI-ZIEMIA-KABEL-JESLI")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-PROUZI-REZYSTYWNOSC-GRUNTU")}
          unit="Ω·m"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystywnoscGruntuOmM}
          onChange={(e) => setPole("rezystywnoscGruntuOmM", e.target.value)}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="rezystywnosc" />}
        />
        <Pole
          label={t("UI-PROUZI-DLUGOSC-POJEDYNCZEGO-PRETA")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={dlugoscPretaM}
          onChange={(e) => setPole("dlugoscPretaM", e.target.value)}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="dlugosc" />}
        />
        <Pole
          label={t("UI-PROUZI-SREDNICA-PRETA-UZIOMOWEGO")}
          unit="mm"
          type="number"
          inputMode="decimal"
          min={0}
          value={srednicaPretaMm}
          onChange={(e) => setPole("srednicaPretaMm", e.target.value)}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="srednica" />}
        />
        <PoleSelect
          label={t("UI-PROUZI-CEL-UZIEMIENIA")}
          value={celUziemienia}
          onChange={(e) => setPole("celUziemienia", e.target.value as CelUziemienia | "")}
          pomoc={<PomocPola ekran="projekt-uziemienia" pole="cel" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {(Object.keys(ETYKIETA_CELU) as CelUziemienia[]).map((cel) => (
            <option key={cel} value={cel}>
              {ETYKIETA_CELU[cel]}
            </option>
          ))}
        </PoleSelect>
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict === "green" && (
          <WynikGlowny>
            {result.value.liczbaPretowSzacowana} {result.value.liczbaPretowSzacowana === 1 ? t("UI-PROUZI-PRET-2") : t("UI-PROUZI-PRETY")} {t("UI-PROUZI-PRET", { rezystancjaJednegoPretaOm: result.value.rezystancjaJednegoPretaOm.toFixed(1) })}
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
