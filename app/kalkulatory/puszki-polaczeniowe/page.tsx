"use client"

import { useMemo } from "react"
import { calculatePuszkiPolaczeniowe } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/calculator"
import { ETYKIETY_MIEJSC } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/constants"
import type { MiejsceMontazu } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  miejsceMontazu: MiejsceMontazu | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsceMontazu: "",
}

export default function PuszkiPolaczenioweePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("puszki-polaczeniowe", STAN_POCZATKOWY)
  const { miejsceMontazu } = stan
  const setMiejsceMontazu = (a: (MiejsceMontazu | "") | ((p: MiejsceMontazu | "") => MiejsceMontazu | "")) =>
    setStan((prev) => ({ ...prev, miejsceMontazu: typeof a === "function" ? a(prev.miejsceMontazu) : a }))

  const result = useMemo(
    () => calculatePuszkiPolaczeniowe({ miejsceMontazu: miejsceMontazu === "" ? null : miejsceMontazu }),
    [miejsceMontazu],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/puszki-polaczeniowe" />
      <NaglowekEkranu tytul={t("UI-PUSPOL-PUSZKI-POLACZENIOWE")} ekran="puszki-polaczeniowe" wynik={result}>
        {t("UI-PUSPOL-KAZDE-POLACZENIE-POTENCJALNY")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-PUSPOL-MIEJSCE-MONTAZU")}
        value={miejsceMontazu}
        onChange={(e) => setMiejsceMontazu(e.target.value as MiejsceMontazu)}
        pomoc={<PomocPola ekran="puszki-polaczeniowe" pole="miejsce" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {(Object.keys(ETYKIETY_MIEJSC) as MiejsceMontazu[]).map((m) => (
          <option key={m} value={m}>
            {ETYKIETY_MIEJSC[m]}
          </option>
        ))}
      </PoleSelect>

      {result.status === "VALID" && result.value.wymaganyTyp && (
        <WerdyktPanel poziom="ok" etykieta={t("UI-PUSPOL-WYMAGANY-TYP-PUSZKI")}>
          <WynikGlowny>{result.value.wymaganyTyp}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
