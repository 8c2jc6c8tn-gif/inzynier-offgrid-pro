"use client"

import { useMemo } from "react"
import { calculatePanelDlaUrzadzenia } from "@/lib/core/modules/kalkulator-mobilny/panel-dla-urzadzenia/calculator"
import type { PanelDlaUrzadzeniaInput } from "@/lib/core/modules/kalkulator-mobilny/panel-dla-urzadzenia/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof PanelDlaUrzadzeniaInput, string>

const STAN_POCZATKOWY: FormularzStan = { mocUrzadzeniaW: "", godzinPracy: "", godzinSlonca: "", uzyskPct: "", posiadanyPanelW: "" }

const liczba = (s: string) => (s === "" ? 0 : Number(s))

export default function PanelDlaUrzadzeniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("panel-dla-urzadzenia", STAN_POCZATKOWY)
  const pole = (klucz: keyof FormularzStan) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculatePanelDlaUrzadzenia({
        mocUrzadzeniaW: liczba(stan.mocUrzadzeniaW),
        godzinPracy: liczba(stan.godzinPracy),
        godzinSlonca: liczba(stan.godzinSlonca),
        uzyskPct: liczba(stan.uzyskPct),
        posiadanyPanelW: liczba(stan.posiadanyPanelW),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/panel-dla-urzadzenia" />
      <NaglowekEkranu tytul={t("UI-M12-PU-TYTUL")} ekran="panel-dla-urzadzenia" wynik={result}>
        {t("UI-M12-PU-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label={t("UI-M12-PU-MOC")} unit="W" {...pole("mocUrzadzeniaW")} pomoc={<PomocPola ekran="panel-dla-urzadzenia" pole="moc" />} />
        <Pole label={t("UI-M12-PU-GODZIN-PRACY")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinPracy")} pomoc={<PomocPola ekran="panel-dla-urzadzenia" pole="godzinPracy" />} />
        <Pole label={t("UI-M12-WK-GODZIN-SLONCA")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinSlonca")} pomoc={<PomocPola ekran="panel-dla-urzadzenia" pole="godzinSlonca" />} />
        <Pole label={t("UI-M12-PU-UZYSK")} unit="%" max={100} {...pole("uzyskPct")} pomoc={<PomocPola ekran="panel-dla-urzadzenia" pole="uzysk" />} />
        <Pole label={t("UI-M12-PU-POSIADANY")} unit="W" {...pole("posiadanyPanelW")} pomoc={<PomocPola ekran="panel-dla-urzadzenia" pole="posiadany" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-PU-W-UWAGA" : "UI-M12-PU-W-OK")}>
          <WynikGlowny>{t("UI-M12-PU-WYNIK", { w: Math.ceil(v.minimalnaMocPaneluW) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M12-PU-SZCZEGOLY", { wh: Math.round(v.zuzycieWh) })}</p>
          {v.produkcjaPosiadanegoWh > 0 && (
            <p className="mt-1 text-small">{t("UI-M12-PU-POSIADANY-WYNIK", { wh: Math.round(v.produkcjaPosiadanegoWh) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
