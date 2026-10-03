"use client"

import { useMemo } from "react"
import { calculateScenariuszAutomatyzacji } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/automatyzacja/calculator"
import type { ScenariuszAutomatyzacjiInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/automatyzacja/input"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

export function AutomatyzacjaTab({
  input,
  onChange,
  sumaStandbyW,
}: {
  input: ScenariuszAutomatyzacjiInput
  onChange: (v: ScenariuszAutomatyzacjiInput) => void
  sumaStandbyW: number
}) {
  const t = useTranslate()
  const result = useMemo(() => calculateScenariuszAutomatyzacji(input), [input])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        {t("UI-WAMENE-COMAUTTAB-POROWNAJ-STANDBY-NORMALNYM")}
      </p>

      {sumaStandbyW > 0 && (
        <button
          type="button"
          onClick={() => onChange({ ...input, standbyReferencyjnyW: sumaStandbyW })}
          className="self-start text-caption text-muted-foreground underline hover:text-foreground"
        >
          {t("UI-WAMENE-COMAUTTAB-WPISZ-JAKO-REFERENCYJNY", { sumaStandbyW: sumaStandbyW.toFixed(1) })}
        </button>
      )}

      <Pole
        label={t("UI-WAMENE-COMAUTTAB-STANDBY-REFERENCYJNY-TRYB")}
        unit="W"
        type="number"
        inputMode="decimal"
        value={input.standbyReferencyjnyW || ""}
        onChange={(e) => onChange({ ...input, standbyReferencyjnyW: Number(e.target.value) })}
        pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standbyRef" />}
      />
      <Pole
        label={t("UI-WAMENE-COMAUTTAB-STANDBY-SCENARIUSZU")}
        unit="W"
        type="number"
        inputMode="decimal"
        value={input.standbyWScenariuszuW || ""}
        onChange={(e) => onChange({ ...input, standbyWScenariuszuW: Number(e.target.value) })}
        pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standbyScenariusz" />}
      />

      {result.status === "INCOMPLETE" ? (
        <StanPusty tytul={t("UI-WAMENE-COMAUTTAB-WPISZ-STANDBY-REFERENCYJNY")} />
      ) : (
        <WerdyktPanel poziom={poziomZStatusu(result.status)}>
          <WynikGlowny>{t("UI-WAMENE-COMAUTTAB-KWH-DOBE-MNIEJ", { redukcjaDobowaKwh: result.value.redukcjaDobowaKwh.toFixed(2) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-WAMENE-COMAUTTAB-REDUKCJA-POBORU", { redukcjaW: result.value.redukcjaW.toFixed(1) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <div className="rounded-md border border-dashed p-3 text-caption text-muted-foreground">
        <p>
          {t("UI-WAMENE-COMAUTTAB-REDUKCJA-POBORU-FALOWNIKA")}
          <span className="font-medium">{t("UI-WAMENE-COMAUTTAB-POBOR-WLASNY-FALOWNIKA")}</span> {t("UI-WAMENE-COMAUTTAB-MODUL-BEZ-POWIELANIA")}
        </p>
        <p className="mt-2">
          {t("UI-WAMENE-COMAUTTAB-DETEKCJA-URZADZEN-ALWAYS")}
        </p>
      </div>
    </div>
  )
}
