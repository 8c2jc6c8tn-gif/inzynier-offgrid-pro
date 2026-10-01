"use client"

import { useMemo } from "react"
import { calculateLongTermStorage } from "@/lib/core/modules/baterie/long-term-storage/calculator"
import {
  CHECKLIST_ITEMS,
  SOC_ZALECANY_MAX_PCT,
  SOC_ZALECANY_MIN_PCT,
  TEMPERATURA_MIN_BEZPIECZNA_C,
} from "@/lib/core/modules/baterie/long-term-storage/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  socDocelowyPct: string
  temperaturaMinC: string
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  socDocelowyPct: "",
  temperaturaMinC: "",
  potwierdzoneIds: [],
}

export default function LongTermStoragePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("long-term-storage", STAN_POCZATKOWY)
  const { socDocelowyPct, temperaturaMinC, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setSocDocelowyPct = (a: string | ((p: string) => string)) => setPole("socDocelowyPct", a)
  const setTemperaturaMinC = (a: string | ((p: string) => string)) => setPole("temperaturaMinC", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () =>
      calculateLongTermStorage({
        socDocelowyPct: socDocelowyPct === "" ? 0 : Number(socDocelowyPct),
        temperaturaMinC: temperaturaMinC === "" ? null : Number(temperaturaMinC),
        potwierdzoneIds,
      }),
    [socDocelowyPct, temperaturaMinC, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/long-term-storage" />
      <NaglowekEkranu
        tytul={t("UI-LONTERSTO-TRYB-LONG-TERM")}
        ekran="long-term-storage" wynik={result}
        parametry={{ socMin: SOC_ZALECANY_MIN_PCT, socMax: SOC_ZALECANY_MAX_PCT, tMin: TEMPERATURA_MIN_BEZPIECZNA_C }}
      >
        {t("UI-LONTERSTO-BATERIA-ODSTAWIONA-DLUZEJ")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-LONTERSTO-DOCELOWY-SOC-PRZED")}
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={socDocelowyPct}
          onChange={(e) => setSocDocelowyPct(e.target.value)}
          pomoc={<PomocPola ekran="long-term-storage" pole="soc" params={{ socMin: SOC_ZALECANY_MIN_PCT, socMax: SOC_ZALECANY_MAX_PCT, tMin: TEMPERATURA_MIN_BEZPIECZNA_C }} />}
        />
        <Pole
          label={t("UI-LONTERSTO-NAJNIZSZA-SPODZIEWANA-TEMPER")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaMinC}
          onChange={(e) => setTemperaturaMinC(e.target.value)}
          pomoc={<PomocPola ekran="long-term-storage" pole="temperatura" params={{ socMin: SOC_ZALECANY_MIN_PCT, socMax: SOC_ZALECANY_MAX_PCT, tMin: TEMPERATURA_MIN_BEZPIECZNA_C }} />}
        />
      </div>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {result.status === "INCOMPLETE" && result.warnings.length === 0 && (
        <p className="text-small text-muted-foreground">
          {socDocelowyPct === "" || temperaturaMinC === ""
            ? t("UI-LONTERSTO-WPISZ-SOC-TEMPERATURE")
            : t("UI-LONTERSTO-POTWIERDZONO-CZYNNOSCI", { potwierdzoneCzynnosci: result.value.potwierdzoneCzynnosci, razemCzynnosci: result.value.razemCzynnosci })}
        </p>
      )}

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-LONTERSTO-OCENIC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null &&
        poziom !== "blad" && (
          <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? t("UI-LONTERSTO-GOTOWE-ODSTAWIENIA") : undefined}>
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
