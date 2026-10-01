"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateSzybkaDiagnoza } from "@/lib/core/modules/kalkulator-mobilny/szybka-diagnoza/calculator"
import { OBJAWY, type ObjawDiagnozy } from "@/lib/core/modules/kalkulator-mobilny/szybka-diagnoza/constants"
import type { OdpowiedzKroku } from "@/lib/core/modules/kalkulator-mobilny/szybka-diagnoza/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = { objaw: ObjawDiagnozy | ""; odpowiedzi: Record<string, OdpowiedzKroku> }

const STAN_POCZATKOWY: FormularzStan = { objaw: "", odpowiedzi: {} }

const klucz = (rodzaj: "K" | "P", id: string) => `UI-M12-DG-${rodzaj}-${id.toUpperCase()}`

export default function SzybkaDiagnozaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("szybka-diagnoza", STAN_POCZATKOWY)
  const result = useMemo(() => calculateSzybkaDiagnoza({ objaw: stan.objaw === "" ? null : stan.objaw, odpowiedzi: stan.odpowiedzi }), [stan])
  const { kroki, aktualnyKrok, przyczyna } = result.value
  const odpowiedz = (id: string, odp: OdpowiedzKroku | null) =>
    setStan((prev) => {
      const odpowiedzi = { ...prev.odpowiedzi }
      if (odp === null) delete odpowiedzi[id]
      else odpowiedzi[id] = odp
      return { ...prev, odpowiedzi }
    })
  const krokPrzyczyny = kroki.find((k) => k.id === przyczyna)
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szybka-diagnoza" />
      <NaglowekEkranu tytul={t("UI-M12-DG-TYTUL")} ekran="szybka-diagnoza" wynik={result}>
        {t("UI-M12-DG-OPIS")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-M12-DG-OBJAW")}
        value={stan.objaw}
        onChange={(e) => setStan({ objaw: e.target.value as FormularzStan["objaw"], odpowiedzi: {} })}
        pomoc={<PomocPola ekran="szybka-diagnoza" pole="objaw" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {OBJAWY.map((o) => (
          <option key={o} value={o}>
            {t(`UI-M12-DG-OBJAW-${o.toUpperCase()}`)}
          </option>
        ))}
      </PoleSelect>

      {kroki.length > 0 && (
        <ol className="flex flex-col gap-3">
          {kroki.map((k, i) => {
            const odp = stan.odpowiedzi[k.id]
            return (
              <li key={k.id} className="flex flex-col gap-2 rounded-md border p-3 text-small">
                <span>
                  {i + 1}. {t(klucz("K", k.id))}
                </span>
                {k.id === aktualnyKrok ? (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => odpowiedz(k.id, "ok")}>
                      {t("UI-M12-DG-ODP-OK")}
                    </Button>
                    <Button variant="outline" onClick={() => odpowiedz(k.id, "problem")}>
                      {t("UI-M12-DG-ODP-PROBLEM")}
                    </Button>
                  </div>
                ) : (
                  <button type="button" onClick={() => odpowiedz(k.id, null)} className="self-start text-caption text-muted-foreground underline">
                    {t(odp === "problem" ? "UI-M12-DG-ODP-PROBLEM" : "UI-M12-DG-ODP-OK")} · {t("UI-M12-DG-ZMIEN")}
                  </button>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {stan.objaw === "" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : aktualnyKrok === null ? (
        <WerdyktPanel poziom={hasCritical ? "blad" : krokPrzyczyny ? "uwaga" : "ok"} etykieta={t(krokPrzyczyny ? "UI-M12-DG-W-PRZYCZYNA" : "UI-M12-DG-W-BRAK")}>
          {krokPrzyczyny && (
            <>
              <WynikGlowny>{t(klucz("P", krokPrzyczyny.id))}</WynikGlowny>
              {krokPrzyczyny.link && (
                <Link href={krokPrzyczyny.link} className="mt-1 block text-small underline">
                  {t("UI-M12-DG-PRZEJDZ")}
                </Link>
              )}
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
      )}
    </main>
  )
}
