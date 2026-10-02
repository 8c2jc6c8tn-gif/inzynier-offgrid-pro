"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateDoborMocyPompy } from "@/lib/core/modules/ogrzewanie/dobor-mocy-pompy/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useWynikEkranu1 } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

type Pola = "zapotrzebowanie" | "mocProj" | "tProj" | "tWewn" | "tDrugi" | "mocDrugi" | "dogrzew"
type Stan = Record<Pola, string>

const STAN_POCZATKOWY: Stan = { zapotrzebowanie: "", mocProj: "", tProj: "", tWewn: "", tDrugi: "", mocDrugi: "", dogrzew: "" }
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2B — dokładka do Ekranu 5: dobór mocy pompy do budynku (dawne 5.27) i podział pompa/dogrzewanie (5.67). */
export function SekcjaDoborMocy() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("cop-pompy-ciepla.dobor-mocy", STAN_POCZATKOWY)
  const e1 = useWynikEkranu1()
  const pole = (klucz: Pola, min: number | undefined = 0) => ({
    type: "number",
    inputMode: "decimal" as const,
    min,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  // Empty field = the value from Screen 1 (source: „z zapotrzebowania na ciepło (5.2) i strat ciepła budynku (5.1)”).
  const zE1 = e1 ? r2(e1.obciazenieW / 1000) : undefined
  const zapotrzebowanie = liczba(stan.zapotrzebowanie) ?? zE1 ?? 0
  const tProj = liczba(stan.tProj) ?? e1?.temperaturaZewnetrznaC ?? null
  const tWewn = liczba(stan.tWewn) ?? e1?.temperaturaWewnetrznaC ?? null
  // "" = unknown (also for drafts saved before this field existed).
  const dogrzew = stan.dogrzew === "jest" ? true : stan.dogrzew === "brak" ? false : null
  const result = useMemo(
    () =>
      calculateDoborMocyPompy({
        zapotrzebowanieKw: zapotrzebowanie,
        mocPompyProjKw: liczba(stan.mocProj) ?? 0,
        tProjC: tProj,
        tWewnC: tWewn,
        tDrugiC: liczba(stan.tDrugi) ?? null,
        mocPompyDrugiKw: liczba(stan.mocDrugi) ?? 0,
        maDogrzew: dogrzew,
      }),
    [zapotrzebowanie, tProj, tWewn, stan.mocProj, stan.tDrugi, stan.mocDrugi, dogrzew],
  )
  const v = result.value
  const stop = result.warnings.some((w) => w.level === "critical")

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-DMP-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-DMP-OPIS")}</p>
      <div className="grid grid-cols-2 gap-3">
        <Pole
          label={t("UI-M6D-DMP-ZAPOTRZEBOWANIE")}
          unit="kW"
          placeholder={zE1 !== undefined ? String(zE1) : undefined}
          {...pole("zapotrzebowanie")}
          pomoc={<PomocPola ekran="m6d-dobor-mocy-pompy" pole="zapotrzebowanie" />}
        />
        <Pole label={t("UI-M6D-DMP-MOC-PROJ")} unit="kW" {...pole("mocProj")} pomoc={<PomocPola ekran="m6d-dobor-mocy-pompy" pole="mocProj" />} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Pole
          label={t("UI-M6D-DMP-T-PROJ")}
          unit="°C"
          placeholder={e1 ? String(e1.temperaturaZewnetrznaC) : undefined}
          {...pole("tProj", undefined)}
          pomoc={<PomocPola ekran="m6d-dobor-mocy-pompy" pole="tProj" />}
        />
        <Pole
          label={t("UI-M6D-DMP-T-WEWN")}
          unit="°C"
          placeholder={e1 ? String(e1.temperaturaWewnetrznaC) : undefined}
          {...pole("tWewn", undefined)}
          pomoc={<PomocPola ekran="m6d-dobor-mocy-pompy" pole="tWewn" />}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-DMP-T-DRUGI")} unit="°C" {...pole("tDrugi", undefined)} pomoc={<PomocPola ekran="m6d-dobor-mocy-pompy" pole="tDrugi" />} />
        <Pole label={t("UI-M6D-DMP-MOC-DRUGI")} unit="kW" {...pole("mocDrugi")} pomoc={<PomocPola ekran="m6d-dobor-mocy-pompy" pole="mocDrugi" />} />
      </div>
      <PoleSelect
        label={t("UI-M6D-DMP-DOGREW")}
        value={stan.dogrzew ?? ""}
        onChange={(e) => setStan((prev) => ({ ...prev, dogrzew: e.target.value }))}
        pomoc={<PomocPola ekran="m6d-dobor-mocy-pompy" pole="maDogrzew" />}
      >
        <option value="">{t("UI-M6D-DMP-DOGREW-NIEZNANY")}</option>
        <option value="jest">{t("UI-M6D-DMP-DOGREW-JEST")}</option>
        <option value="brak">{t("UI-M6D-DMP-DOGREW-BRAK")}</option>
      </PoleSelect>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-DMP-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={stop ? "blad" : v.dogrzewanieKw > 0 ? "uwaga" : "ok"}
          etykieta={t(stop ? "UI-M6D-DMP-W-STOP" : v.dogrzewanieKw > 0 ? "UI-M6D-DMP-W-UWAGA" : "UI-M6D-DMP-W-OK")}
        >
          <WynikGlowny>
            {v.dogrzewanieKw > 0
              ? t("UI-M6D-DMP-WYNIK-BRAK", { kw: r2(v.dogrzewanieKw) })
              : t("UI-M6D-DMP-WYNIK-OK", { kw: r2(v.zapasKw) })}
          </WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M6D-DMP-POKRYCIE", { pompa: r1(v.pokryciePompaPct), dogrzewanie: r1(v.pokrycieDogrzewaniePct) })}</li>
            {v.punktBiwalentnyC !== null && <li>{t("UI-M6D-DMP-BIWALENTNY", { t: r1(v.punktBiwalentnyC) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
      <Link href="/kalkulatory/bufor-ciepla" className="text-small underline">
        {t("UI-M6D-DMP-LINK-BUFOR")}
      </Link>
    </section>
  )
}
