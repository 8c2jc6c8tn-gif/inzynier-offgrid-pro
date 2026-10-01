"use client"

import { useMemo } from "react"
import { calculatePozycjonowanieOgniw } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/calculator"
import { DOCISK_MAX_KGF, DOCISK_MIN_KGF } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  dociskKgf: string
  luzNaPeczenie: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  dociskKgf: "",
  luzNaPeczenie: false,
}

export default function PozycjonowanieOgniwPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pozycjonowanie-ogniw", STAN_POCZATKOWY)
  const { dociskKgf, luzNaPeczenie } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDociskKgf = (a: string | ((p: string) => string)) => setPole("dociskKgf", a)
  const setLuzNaPeczenie = (a: boolean | ((p: boolean) => boolean)) => setPole("luzNaPeczenie", a)

  const result = useMemo(
    () =>
      calculatePozycjonowanieOgniw({
        dociskKgf: dociskKgf === "" ? 0 : Number(dociskKgf),
        luzNaPeczenie,
      }),
    [dociskKgf, luzNaPeczenie],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : hasCritical
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pozycjonowanie-ogniw" />
      <NaglowekEkranu tytul={t("UI-POZOGN-POZYCJONOWANIE-OGNIW-KOMPRES")} ekran="pozycjonowanie-ogniw">
        {t("UI-POZOGN-OGNIWA-LUBIA-BYC")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-POZOGN-ZASTOSOWANY-DOCISK-PAKIET")}
          unit={t("UI-POZOGN-KGF")}
          type="number"
          inputMode="decimal"
          value={dociskKgf}
          onChange={(e) => setDociskKgf(e.target.value)}
          pomoc={<PomocPola ekran="pozycjonowanie-ogniw" pole="docisk" params={{ dociskMin: DOCISK_MIN_KGF, dociskMax: DOCISK_MAX_KGF }} />}
        />
        <PoleCheckbox
          id="luz-peczenie"
          checked={luzNaPeczenie}
          onChange={(e) => setLuzNaPeczenie(e.target.checked)}
          label={t("UI-POZOGN-ZOSTAWIONO-MIN-LUZU")}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-POZOGN-WPISZ-ZASTOSOWANY-DOCISK")}
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={
              result.status === "INVALID_INPUT"
                ? t("UI-POZOGN-OCENIC-SPRAWDZ-WPISANE")
                : poziom === "ok"
                  ? t("UI-POZOGN-DOCISK-PRAWIDLOWY")
                  : hasCritical
                    ? t("UI-POZOGN-DOCISK-POZA-ZAKRESEM")
                    : t("UI-POZOGN-BRAKUJE-POTWIERDZENIA-LUZU")
            }
          >
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-1 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
