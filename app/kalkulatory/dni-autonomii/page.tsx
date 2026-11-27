"use client"

import { useEffect, useMemo } from "react"
import { calculateDniAutonomii } from "@/lib/core/modules/zapotrzebowanie/dni-autonomii/calculator"
import { OPCJE_DNI_AUTONOMII } from "@/lib/core/modules/zapotrzebowanie/dni-autonomii/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  /** Number field since 26.11.2026 (was a select 1/2/3/5/7 kept as a number under the legacy key `dniAutonomii`). */
  dni: string
  /** Legacy (select era): read once into `dni`, then cleared. */
  dniAutonomii?: number
  zapotrzebowanieDoboweKwh: string
  sprawnoscFalownikaPct: string
  dodPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dni: "",
  zapotrzebowanieDoboweKwh: "",
  sprawnoscFalownikaPct: "",
  dodPct: "",
}

export default function DniAutonomiiPage() {
  const t = useTranslate()
  const [stan, setStan, , wczytano, projekt] = usePersistedDraft<FormularzStan>("dni-autonomii", STAN_POCZATKOWY, {
    // `dni` is a number field linked to the project (owner decision 26.11.2026); 1/2/3/5/7 are only the typical values in its help.
    projekt: { dni: "dniAutonomii", zapotrzebowanieDoboweKwh: "zapotrzebowanieDoboweKwh", sprawnoscFalownikaPct: "sprawnoscFalownikaPct", dodPct: "dodPct" },
  })
  const { dni, zapotrzebowanieDoboweKwh, sprawnoscFalownikaPct, dodPct } = stan

  // A draft from the select era keeps the choice as a number under `dniAutonomii` — carry it into the field once.
  const dawneDni = stan.dniAutonomii
  useEffect(() => {
    if (!wczytano || dawneDni === undefined) return
    setStan((prev) => ({ ...prev, dni: prev.dni === "" && dawneDni > 0 ? String(dawneDni) : prev.dni, dniAutonomii: undefined }))
  }, [wczytano, dawneDni, setStan])

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDni = (a: string | ((p: string) => string)) => setPole("dni", a)
  const setZapotrzebowanieDoboweKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieDoboweKwh", a)
  const setSprawnoscFalownikaPct = (a: string | ((p: string) => string)) => setPole("sprawnoscFalownikaPct", a)
  const setDodPct = (a: string | ((p: string) => string)) => setPole("dodPct", a)

  const result = useMemo(
    () =>
      calculateDniAutonomii({
        dniAutonomii: dni === "" ? 0 : Number(dni),
        zapotrzebowanieDoboweKwh: zapotrzebowanieDoboweKwh === "" ? 0 : Number(zapotrzebowanieDoboweKwh),
        sprawnoscFalownikaPct: sprawnoscFalownikaPct === "" ? 0 : Number(sprawnoscFalownikaPct),
        dodPct: dodPct === "" ? 0 : Number(dodPct),
      }),
    [dni, zapotrzebowanieDoboweKwh, sprawnoscFalownikaPct, dodPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dni-autonomii" />
      <NaglowekEkranu tytul={t("UI-DNIAUT-DNI-AUTONOMII")} ekran="dni-autonomii">
        {t("UI-DNIAUT-WIECEJ-DNI-BEZ")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-DNIAUT-DNI-AUTONOMII")}
          unit={t("UI-J-DNI")}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          projekt={projekt.pole("dni")}
          pomoc={<PomocPola ekran="dni-autonomii" pole="dni" params={{ opcje: OPCJE_DNI_AUTONOMII.join(", ") }} />}
        />

        <p className="text-small text-muted-foreground">
          {t("UI-DNIAUT-OPCJONALNIE-PODGLAD-ZYWO")}
        </p>
        <Pole
          label={t("UI-DNIAUT-ZAPOTRZEBOWANIE-DOBOWE")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieDoboweKwh}
          onChange={(e) => setZapotrzebowanieDoboweKwh(e.target.value)}
          projekt={projekt.pole("zapotrzebowanieDoboweKwh")}
          pomoc={<PomocPola ekran="dni-autonomii" pole="zapotrzebowanie" />}
        />
        <Pole
          label={t("UI-DNIAUT-SPRAWNOSC-FALOWNIKA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscFalownikaPct}
          onChange={(e) => setSprawnoscFalownikaPct(e.target.value)}
          projekt={projekt.pole("sprawnoscFalownikaPct")}
          pomoc={<PomocPola ekran="dni-autonomii" pole="sprawnosc" />}
        />
        <Pole
          label={t("UI-DNIAUT-DOD-GLEBOKOSC-ROZLADOWANIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={dodPct}
          onChange={(e) => setDodPct(e.target.value)}
          projekt={projekt.pole("dodPct")}
          pomoc={<PomocPola ekran="dni-autonomii" pole="dod" />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-DNIAUT-WYBIERZ-DNI-AUTONOMII")}</p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-DNIAUT-SPRAWDZ-WPISANE-OPCJONALNE")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-DNIAUT-WYBRANE-DNI-AUTONOMII")}>
          <WynikGlowny>
            {result.value.dniAutonomii} {result.value.dniAutonomii === 1 ? t("UI-DNIAUT-DZIEN") : t("UI-J-DNI")}
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
