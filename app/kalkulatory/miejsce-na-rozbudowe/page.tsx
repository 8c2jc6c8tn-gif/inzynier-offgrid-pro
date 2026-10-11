"use client"

import { useMemo } from "react"
import { calculateMiejsceNaRozbudowe } from "@/lib/core/modules/kalkulator-mobilny/miejsce-na-rozbudowe/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  miejsceDlugoscMm: string
  miejsceSzerokoscMm: string
  miejsceWysokoscMm: string
  elementDlugoscMm: string
  elementSzerokoscMm: string
  elementWysokoscMm: string
  odstepMiedzyMm: string
  marginesMm: string
  moznaPietrowac: boolean
  planowanaLiczba: string
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsceDlugoscMm: "",
  miejsceSzerokoscMm: "",
  miejsceWysokoscMm: "",
  elementDlugoscMm: "",
  elementSzerokoscMm: "",
  elementWysokoscMm: "",
  odstepMiedzyMm: "",
  marginesMm: "",
  moznaPietrowac: false,
  planowanaLiczba: "",
}

// Empty field = no data (never a default): the engine treats `null` as "not entered".
const liczba = (s: string): number | null => (s.trim() === "" ? null : Number(s))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function MiejsceNaRozbudowePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("miejsce-na-rozbudowe", STAN_POCZATKOWY)
  const ustaw = (pole: Exclude<keyof FormularzStan, "moznaPietrowac">) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateMiejsceNaRozbudowe({
        miejsceDlugoscMm: liczba(stan.miejsceDlugoscMm),
        miejsceSzerokoscMm: liczba(stan.miejsceSzerokoscMm),
        miejsceWysokoscMm: liczba(stan.miejsceWysokoscMm),
        elementDlugoscMm: liczba(stan.elementDlugoscMm),
        elementSzerokoscMm: liczba(stan.elementSzerokoscMm),
        elementWysokoscMm: liczba(stan.elementWysokoscMm),
        odstepMiedzyMm: liczba(stan.odstepMiedzyMm),
        marginesPrzyScianieMm: liczba(stan.marginesMm),
        moznaPietrowac: stan.moznaPietrowac,
        planowanaLiczba: liczba(stan.planowanaLiczba),
      }),
    [stan],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical") ? "blad" : result.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"
  const etykieta = { blad: t("UI-MIEJROZ-BLAD"), uwaga: t("UI-MIEJROZ-W-UWAGA"), ok: t("UI-MIEJROZ-W-OK") }[poziom]
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/miejsce-na-rozbudowe" />
      <NaglowekEkranu tytul={t("UI-MIEJROZ-TYTUL")} ekran="miejsce-na-rozbudowe" wynik={result}>
        {t("UI-MIEJROZ-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium text-muted-foreground">{t("UI-MIEJROZ-MIEJSCE")}</p>
        <p className="text-small text-muted-foreground">{t("UI-MIEJROZ-MIEJSCE-INFO")}</p>
        <Pole label={t("UI-MIEJROZ-MIEJSCE-DLUGOSC")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.miejsceDlugoscMm} onChange={ustaw("miejsceDlugoscMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="miejsceDlugosc" />} />
        <Pole label={t("UI-MIEJROZ-MIEJSCE-SZEROKOSC")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.miejsceSzerokoscMm} onChange={ustaw("miejsceSzerokoscMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="miejsceSzerokosc" />} />
        <Pole label={t("UI-MIEJROZ-MIEJSCE-WYSOKOSC")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.miejsceWysokoscMm} onChange={ustaw("miejsceWysokoscMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="miejsceWysokosc" />} />

        <p className="text-small font-medium text-muted-foreground">{t("UI-MIEJROZ-ELEMENT")}</p>
        <p className="text-small text-muted-foreground">{t("UI-MIEJROZ-ELEMENT-INFO")}</p>
        <Pole label={t("UI-MIEJROZ-ELEMENT-DLUGOSC")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.elementDlugoscMm} onChange={ustaw("elementDlugoscMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="elementDlugosc" />} />
        <Pole label={t("UI-MIEJROZ-ELEMENT-SZEROKOSC")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.elementSzerokoscMm} onChange={ustaw("elementSzerokoscMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="elementSzerokosc" />} />
        <Pole label={t("UI-MIEJROZ-ELEMENT-WYSOKOSC")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.elementWysokoscMm} onChange={ustaw("elementWysokoscMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="elementWysokosc" />} />
        <div className="flex items-center gap-3">
          <input
            id="miejsce-na-rozbudowe-pietrowanie"
            type="checkbox"
            className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
            checked={stan.moznaPietrowac}
            onChange={(e) => setStan((prev) => ({ ...prev, moznaPietrowac: e.target.checked }))}
          />
          <label htmlFor="miejsce-na-rozbudowe-pietrowanie" className="flex-1 text-small font-medium">
            {t("UI-MIEJROZ-PIETROWANIE")}
          </label>
          <PomocPola ekran="miejsce-na-rozbudowe" pole="moznaPietrowac" />
        </div>

        <p className="text-small font-medium text-muted-foreground">{t("UI-MIEJROZ-ODSTEPY")}</p>
        <p className="text-small text-muted-foreground">{t("UI-MIEJROZ-ODSTEPY-INFO")}</p>
        <Pole label={t("UI-MIEJROZ-ODSTEP-MIEDZY")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.odstepMiedzyMm} onChange={ustaw("odstepMiedzyMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="odstepMiedzy" />} />
        <Pole label={t("UI-MIEJROZ-MARGINES")} unit="mm" type="number" inputMode="decimal" min={0} value={stan.marginesMm} onChange={ustaw("marginesMm")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="margines" />} />

        <p className="text-small font-medium text-muted-foreground">{t("UI-MIEJROZ-PLAN")}</p>
        <Pole label={t("UI-MIEJROZ-PLANOWANA")} unit={t("UI-MIEJROZ-SZT")} type="number" inputMode="numeric" min={1} step={1} value={stan.planowanaLiczba} onChange={ustaw("planowanaLiczba")} pomoc={<PomocPola ekran="miejsce-na-rozbudowe" pole="planowanaLiczba" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-MIEJROZ-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-MIEJROZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>
            {f0(v.maksSztuk)} {t("UI-MIEJROZ-SZT")}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-MIEJROZ-UKLAD", { kolumny: f0(v.kolumny), rzedy: f0(v.rzedy), warstwy: f0(v.warstwy) })}
          </p>
          <p className="text-small">{t(v.uklad === "wzdluz" ? "UI-MIEJROZ-UKLAD-WZDLUZ" : "UI-MIEJROZ-UKLAD-WSZERZ")}</p>
          <p className="text-small">{t("UI-MIEJROZ-WYKORZYSTANIE", { pct: f1(v.wykorzystanieMiejscaPct) })}</p>
          {v.zmiesciSiePlan !== null && v.brakujeSztuk !== null && (
            <p className="text-small">
              {v.zmiesciSiePlan ? t("UI-MIEJROZ-PLAN-OK", { plan: stan.planowanaLiczba }) : t("UI-MIEJROZ-PLAN-BRAK", { plan: stan.planowanaLiczba, brak: f0(v.brakujeSztuk) })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
