"use client"

import { useMemo } from "react"
import { calculateMontazMechaniczny } from "@/lib/core/modules/montaz-baterii/montaz-mechaniczny/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/montaz-mechaniczny/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { DOCISK_MAX_KGF, DOCISK_MIN_KGF } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  dociskKgf: number
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  dociskKgf: 0,
  potwierdzoneIds: [],
}

export default function MontazMechanicznyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("montaz-mechaniczny", STAN_POCZATKOWY)
  const { dociskKgf, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDociskKgf = (a: number | ((p: number) => number)) => setPole("dociskKgf", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () => calculateMontazMechaniczny({ dociskKgf, potwierdzoneIds }),
    [dociskKgf, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? t("UI-MONMEC-POLICZYC-SPRAWDZ-WPISANY")
      : result.status === "VALID_WITH_WARNINGS"
        ? t("UI-MONMEC-DOCISK-POZA-ZALECANYM")
        : t("UI-MONMEC-GOTOWE-MONTAZU-ELEKTRYCZNEGO")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/montaz-mechaniczny" />
      <NaglowekEkranu
        tytul={t("UI-MONMEC-MONTAZ-MECHANICZNY-SEPARACJA")}
        ekran="montaz-mechaniczny" wynik={result}
        parametry={{ dociskMin: DOCISK_MIN_KGF, dociskMax: DOCISK_MAX_KGF }}
      >
        {t("UI-MONMEC-ZANIM-OGNIWA-ZOSTANA")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-MONMEC-DOCISK-OGNIW-PRYZMATYCZNYCH")}
        unit={t("UI-MONMEC-KGF")}
        type="number"
        inputMode="decimal"
        min={0}
        value={dociskKgf || ""}
        onChange={(e) => setDociskKgf(Number(e.target.value))}
        pomoc={<PomocPola ekran="montaz-mechaniczny" pole="docisk" params={{ dociskMin: DOCISK_MIN_KGF, dociskMax: DOCISK_MAX_KGF }} />}
      />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">{t("UI-MONMEC-WPISZ-ZMIERZONY-DOCISK")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
