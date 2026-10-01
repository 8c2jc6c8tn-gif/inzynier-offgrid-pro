"use client"

import { useMemo } from "react"
import { calculateZlaczaMc4 } from "@/lib/core/modules/okablowanie/zlacza-mc4/calculator"
import { PRODUCENCI_MC4 } from "@/lib/core/modules/okablowanie/zlacza-mc4/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  producentZenski: string
  producentMeski: string
}

const STAN_POCZATKOWY: FormularzStan = { producentZenski: "", producentMeski: "" }

export default function ZlaczaMc4Page() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zlacza-mc4", STAN_POCZATKOWY)
  const { producentZenski, producentMeski } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const result = useMemo(
    () => calculateZlaczaMc4({ producentZenski, producentMeski }),
    [producentZenski, producentMeski],
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
    invalid: t("UI-ZLAMC4-POLICZYC"),
    incomplete: t("UI-ZLAMC4-WYBIERZ-PRODUCENTA-OBU"),
    red: t("UI-ZLAMC4-ZABRONIONE-RYZYKO-LUKOWANIA"),
    green: result.value.zgodne ? t("UI-ZLAMC4-ZLACZA-ZGODNE") : t("UI-ZLAMC4-ZGODNOSCI-POTWIERDZIC"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zlacza-mc4" />
      <NaglowekEkranu tytul={t("UI-ZLAMC4-ZLACZA-MC4")} ekran="zlacza-mc4" wynik={result}>
        {t("UI-ZLAMC4-MC4-WYGLADA-UNIWERSALNIE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-ZLAMC4-ZLACZKA-ZENSKA-PRODUCENT")}
          value={producentZenski}
          onChange={(e) => setPole("producentZenski", e.target.value)}
          pomoc={<PomocPola ekran="zlacza-mc4" pole="zenska" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {PRODUCENCI_MC4.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-ZLAMC4-ZLACZKA-MESKA-PRODUCENT")}
          value={producentMeski}
          onChange={(e) => setPole("producentMeski", e.target.value)}
          pomoc={<PomocPola ekran="zlacza-mc4" pole="meska" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {PRODUCENCI_MC4.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </PoleSelect>
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>{result.value.zgodne ? t("UI-ZLAMC4-KOMPLET-JEDNEGO-PRODUCENTA") : t("UI-ZLAMC4-LACZ-ROZNYCH-PRODUCENTOW")}</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
