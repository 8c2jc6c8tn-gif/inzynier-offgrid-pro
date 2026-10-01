"use client"

import { useMemo } from "react"
import { calculateStringBox } from "@/lib/core/modules/okablowanie/string-box/calculator"
import { BEZPIECZNIK_STRINGOWY_MAX_A, BEZPIECZNIK_STRINGOWY_MIN_A } from "@/lib/core/modules/okablowanie/string-box/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  liczbaStringow: number
  liczbaWejscSkrzynki: number
  bezpiecznikStringowyA: number
  maSkrzynkeIp66: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  liczbaStringow: 0,
  liczbaWejscSkrzynki: 0,
  bezpiecznikStringowyA: 0,
  maSkrzynkeIp66: false,
}

export default function StringBoxPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("string-box", STAN_POCZATKOWY)
  const { liczbaStringow, liczbaWejscSkrzynki, bezpiecznikStringowyA, maSkrzynkeIp66 } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setLiczbaStringow = (a: number | ((p: number) => number)) => setPole("liczbaStringow", a)
  const setLiczbaWejscSkrzynki = (a: number | ((p: number) => number)) => setPole("liczbaWejscSkrzynki", a)
  const setBezpiecznikStringowyA = (a: number | ((p: number) => number)) => setPole("bezpiecznikStringowyA", a)
  const setMaSkrzynkeIp66 = (a: boolean | ((p: boolean) => boolean)) => setPole("maSkrzynkeIp66", a)

  const result = useMemo(
    () =>
      calculateStringBox({
        liczbaStringow,
        liczbaWejscSkrzynki,
        bezpiecznikStringowyA,
        maSkrzynkeIp66,
      }),
    [liczbaStringow, liczbaWejscSkrzynki, bezpiecznikStringowyA, maSkrzynkeIp66],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasCritical
          ? "blad"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? t("UI-STRBOX-POLICZYC-SPRAWDZ-WPISANE")
      : hasCritical
        ? t("UI-STRBOX-ZABRONIONE-STRING-BOX")
        : t("UI-STRBOX-STRING-BOX-GOTOWY")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/string-box" />
      <NaglowekEkranu
        tytul={t("UI-STRBOX-STRING-BOX-ARRAY")}
        ekran="string-box" wynik={result}
        parametry={{ bezpMin: BEZPIECZNIK_STRINGOWY_MIN_A, bezpMax: BEZPIECZNIK_STRINGOWY_MAX_A }}
      >
        {t("UI-STRBOX-STRING-BOX-WEZEL")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-STRBOX-LICZBA-STRINGOW")}
        type="number"
        inputMode="numeric"
        min={0}
        value={liczbaStringow || ""}
        onChange={(e) => setLiczbaStringow(Number(e.target.value))}
        pomoc={<PomocPola ekran="string-box" pole="stringi" />}
      />

      <Pole
        label={t("UI-STRBOX-LICZBA-WEJSC-SKRZYNKI")}
        type="number"
        inputMode="numeric"
        min={0}
        value={liczbaWejscSkrzynki || ""}
        onChange={(e) => setLiczbaWejscSkrzynki(Number(e.target.value))}
        pomoc={<PomocPola ekran="string-box" pole="wejscia" />}
      />

      <Pole
        label={t("UI-STRBOX-BEZPIECZNIK-STRINGOWY")}
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={bezpiecznikStringowyA || ""}
        onChange={(e) => setBezpiecznikStringowyA(Number(e.target.value))}
        pomoc={<PomocPola ekran="string-box" pole="bezpiecznik" params={{ bezpMin: BEZPIECZNIK_STRINGOWY_MIN_A, bezpMax: BEZPIECZNIK_STRINGOWY_MAX_A }} />}
      />

      <PoleCheckbox
        id="skrzynka-ip66"
        label={t("UI-STRBOX-SKRZYNKA-STOPIEN-OCHRONY")}
        checked={maSkrzynkeIp66}
        onChange={(e) => setMaSkrzynkeIp66(e.target.checked)}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">{t("UI-STRBOX-WPISZ-LICZBE-STRINGOW")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
