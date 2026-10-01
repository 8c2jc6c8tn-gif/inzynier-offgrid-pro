"use client"

import { useMemo } from "react"
import { calculatePierwszeUruchomienie } from "@/lib/core/modules/montaz-baterii/pierwsze-uruchomienie/calculator"
import { CHECKLIST_ITEMS, PROG_TOP_BALANCING_V } from "@/lib/core/modules/montaz-baterii/pierwsze-uruchomienie/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { CZAS_TESTU_MIN, TEST_LADOWANIA_C_RATE } from "@/lib/core/modules/montaz-baterii/pierwsze-uruchomienie/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscAh: number
  napiecieNajwyzszegoOgniwaV: number
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscAh: 0,
  napiecieNajwyzszegoOgniwaV: 0,
  potwierdzoneIds: [],
}

export default function PierwszeUruchomieniePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pierwsze-uruchomienie", STAN_POCZATKOWY)
  const { pojemnoscAh, napiecieNajwyzszegoOgniwaV, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscAh = (a: number | ((p: number) => number)) => setPole("pojemnoscAh", a)
  const setNapiecieNajwyzszegoOgniwaV = (a: number | ((p: number) => number)) => setPole("napiecieNajwyzszegoOgniwaV", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () => calculatePierwszeUruchomienie({ pojemnoscAh, napiecieNajwyzszegoOgniwaV, potwierdzoneIds }),
    [pojemnoscAh, napiecieNajwyzszegoOgniwaV, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "INCOMPLETE" && pojemnoscAh === 0
        ? null
        : result.status === "VALID"
          ? "ok"
          : "uwaga"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? t("UI-PIEURU-POLICZYC-SPRAWDZ-WPISANE")
      : result.status === "VALID"
        ? t("UI-PIEURU-TEST-ZAKONCZONY-PAKIET")
        : t("UI-PIEURU-TEST-TOKU-KONTYNUUJ")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pierwsze-uruchomienie" />
      <NaglowekEkranu
        tytul={t("UI-PIEURU-PIERWSZE-URUCHOMIENIE-TEST")}
        ekran="pierwsze-uruchomienie" wynik={result}
        parametry={{ cRate: TEST_LADOWANIA_C_RATE, czas: CZAS_TESTU_MIN, prog: PROG_TOP_BALANCING_V }}
      >
        {t("UI-PIEURU-PIERWSZE-LADOWANIE-WLACZ")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-PIEURU-POJEMNOSC-PAKIETU")}
        unit="Ah"
        type="number"
        inputMode="decimal"
        min={0}
        value={pojemnoscAh || ""}
        onChange={(e) => setPojemnoscAh(Number(e.target.value))}
        pomoc={<PomocPola ekran="pierwsze-uruchomienie" pole="pojemnosc" params={{ cRate: TEST_LADOWANIA_C_RATE, czas: CZAS_TESTU_MIN, prog: PROG_TOP_BALANCING_V }} />}
      />

      {pojemnoscAh > 0 && (
        <p className="text-small">
          {t("UI-PIEURU-LADUJ-PRADEM-TESTOWYM")} <strong>{result.value.pradTestowyA} A</strong> {t("UI-PIEURU-MINUT")}
        </p>
      )}

      <Pole
        label={t("UI-PIEURU-NAPIECIE-NAJWYZEJ-NALADOWANE")}
        unit="V"
        type="number"
        inputMode="decimal"
        step="0.01"
        min={0}
        value={napiecieNajwyzszegoOgniwaV || ""}
        onChange={(e) => setNapiecieNajwyzszegoOgniwaV(Number(e.target.value))}
        pomoc={<PomocPola ekran="pierwsze-uruchomienie" pole="napiecieMax" params={{ cRate: TEST_LADOWANIA_C_RATE, czas: CZAS_TESTU_MIN, prog: PROG_TOP_BALANCING_V }} />}
      />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">{t("UI-PIEURU-WPISZ-POJEMNOSC-PAKIETU")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
