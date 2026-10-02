"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateGwcPompaCiepla } from "@/lib/core/modules/ogrzewanie/gwc-pompa-ciepla/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

type Pola = "parownik" | "moc" | "copBez" | "copZ" | "cieplo"
type Stan = Record<Pola, string>

const STAN_POCZATKOWY: Stan = { parownik: "", moc: "", copBez: "", copZ: "", cieplo: "" }
const r0 = (x: number) => Math.round(x)
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 4: GWC jako wsparcie pompy ciepła (dawne 5.54). Air flow and temperature
 * rise come from the Screen 4 fields above, so they are not typed twice.
 */
export function SekcjaGwcPompaCiepla({ strumienM3H, przyrostK }: { strumienM3H: number; przyrostK: number }) {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("gwc.pompa-ciepla", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const result = useMemo(
    () =>
      calculateGwcPompaCiepla({
        strumienGwcM3H: strumienM3H,
        przyrostGwcK: przyrostK,
        strumienParownikaM3H: liczba(stan.parownik) ?? 0,
        mocPompyKw: liczba(stan.moc) ?? 0,
        copBezGwc: liczba(stan.copBez) ?? 0,
        copZGwc: liczba(stan.copZ) ?? 0,
        cieploKwh: liczba(stan.cieplo) ?? 0,
      }),
    [stan, strumienM3H, przyrostK],
  )
  const v = result.value

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-GWP-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-GWP-OPIS")}</p>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-GWP-PAROWNIK")} unit="m³/h" {...pole("parownik")} pomoc={<PomocPola ekran="m6d-gwc-pompa-ciepla" pole="parownik" />} />
        <Pole label={t("UI-M6D-GWP-MOC")} unit="kW" {...pole("moc")} pomoc={<PomocPola ekran="m6d-gwc-pompa-ciepla" pole="moc" />} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-GWP-COP-BEZ")} {...pole("copBez")} pomoc={<PomocPola ekran="m6d-gwc-pompa-ciepla" pole="copBez" />} />
        <Pole label={t("UI-M6D-GWP-COP-Z")} {...pole("copZ")} pomoc={<PomocPola ekran="m6d-gwc-pompa-ciepla" pole="copZ" />} />
      </div>
      <Pole label={t("UI-M6D-GWP-CIEPLO")} unit="kWh" {...pole("cieplo")} pomoc={<PomocPola ekran="m6d-gwc-pompa-ciepla" pole="cieplo" />} />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-GWP-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6D-GWP-W-OK")}>
          <WynikGlowny>{t("UI-M6D-GWP-WYNIK", { dt: r1(v.wzrostTempParownikaK) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M6D-GWP-UDZIAL", { gwc: r2(v.mocGwcKw), dolne: r2(v.mocDolnegoZrodlaKw), pct: r0(v.udzialGwcPct) })}
          </p>
          {v.wzrostCopPct !== null && <p className="mt-1 text-small">{t("UI-M6D-GWP-COP", { pct: r1(v.wzrostCopPct) })}</p>}
          {v.oszczednoscKwh !== null && <p className="mt-1 text-small">{t("UI-M6D-GWP-OSZCZEDNOSC", { kwh: r0(v.oszczednoscKwh) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </section>
  )
}
