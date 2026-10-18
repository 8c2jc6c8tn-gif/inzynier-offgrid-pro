"use client"

import { useMemo } from "react"
import { calculatePrognozaMiesieczna } from "@/lib/core/modules/ai/prognoza-miesieczna/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { WykresPrognozyMiesiecznej } from "@/components/prognozy/wykres-prognozy-miesiecznej"
import { useTranslate, useFormatLiczby, useFormaty } from "@/lib/i18n/language-context"

type FormularzStan = {
  historia: string[]
  degradacjaPct: string
  miesiacStartu: string
  miesiecyNaprzod: string
  odchyleniePct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  historia: Array.from({ length: 12 }, () => ""),
  degradacjaPct: "",
  miesiacStartu: "",
  miesiecyNaprzod: "",
  odchyleniePct: "",
}

const KLUCZE_MIESIECY = Array.from({ length: 12 }, (_, i) => `UI-MIES-${String(i + 1).padStart(2, "0")}`)

// Empty field = no data (never a default): the engine treats `null` as "not entered".
const liczba = (s: string): number | null => (s.trim() === "" ? null : Number(s))

export default function PrognozaMiesiecznaPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const { f0 } = useFormaty()
  const f1 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("prognoza-miesieczna", STAN_POCZATKOWY)
  const ustaw = (pole: Exclude<keyof FormularzStan, "historia">) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))
  const ustawMiesiac = (m: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, historia: Array.from({ length: 12 }, (_, i) => (i === m ? e.target.value : (prev.historia[i] ?? ""))) }))
  const historia = Array.from({ length: 12 }, (_, i) => stan.historia[i] ?? "")

  const result = useMemo(
    () =>
      calculatePrognozaMiesieczna({
        produkcjaHistoriaKwh: Array.from({ length: 12 }, (_, i) => liczba(stan.historia[i] ?? "")),
        degradacjaRocznaPct: liczba(stan.degradacjaPct),
        miesiacStartu: liczba(stan.miesiacStartu),
        miesiecyNaprzod: liczba(stan.miesiecyNaprzod),
        odchylenieMeteoPct: liczba(stan.odchyleniePct),
      }),
    [stan],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical") ? "blad" : result.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"
  const etykieta = { blad: t("UI-PROGMIES-BLAD"), uwaga: t("UI-PROGMIES-W-UWAGA"), ok: t("UI-PROGMIES-W-OK") }[poziom]
  const v = result.value
  const maScenariusze = v.wiersze.some((w) => w.dolnaKwh !== null)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/prognoza-miesieczna" />
      <NaglowekEkranu tytul={t("UI-PROGMIES-TYTUL")} ekran="prognoza-miesieczna" wynik={result} ilustracja="pogoda">
        {t("UI-PROGMIES-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium text-muted-foreground">{t("UI-PROGMIES-HISTORIA")}</p>
        <p className="text-small text-muted-foreground">{t("UI-PROGMIES-HISTORIA-INFO")}</p>
        <div className="grid grid-cols-2 gap-3">
          {historia.map((wartosc, m) => (
            <Pole key={m} label={t(KLUCZE_MIESIECY[m]!)} unit="kWh" type="number" inputMode="decimal" min={0} value={wartosc} onChange={ustawMiesiac(m)} pomoc={<PomocPola ekran="prognoza-miesieczna" pole="produkcjaMiesiaca" />} />
          ))}
        </div>

        <p className="text-small font-medium text-muted-foreground">{t("UI-PROGMIES-PANELE")}</p>
        <Pole label={t("UI-PROGMIES-DEGRADACJA")} unit={t("UI-PROGMIES-J-PROC-ROK")} type="number" inputMode="decimal" min={0} max={100} value={stan.degradacjaPct} onChange={ustaw("degradacjaPct")} pomoc={<PomocPola ekran="prognoza-miesieczna" pole="degradacja" />} />

        <p className="text-small font-medium text-muted-foreground">{t("UI-PROGMIES-ZAKRES")}</p>
        <PoleSelect label={t("UI-PROGMIES-START")} value={stan.miesiacStartu} onChange={ustaw("miesiacStartu")} pomoc={<PomocPola ekran="prognoza-miesieczna" pole="miesiacStartu" />}>
          <option value="">{t("UI-PROGMIES-WYBIERZ")}</option>
          {KLUCZE_MIESIECY.map((k, i) => (
            <option key={k} value={String(i + 1)}>
              {t(k)}
            </option>
          ))}
        </PoleSelect>
        <Pole label={t("UI-PROGMIES-NAPRZOD")} unit={t("UI-PROGMIES-MIES")} type="number" inputMode="numeric" min={1} max={12} step={1} value={stan.miesiecyNaprzod} onChange={ustaw("miesiecyNaprzod")} pomoc={<PomocPola ekran="prognoza-miesieczna" pole="miesiecyNaprzod" />} />
        <Pole label={t("UI-PROGMIES-ODCHYLENIE")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.odchyleniePct} onChange={ustaw("odchyleniePct")} pomoc={<PomocPola ekran="prognoza-miesieczna" pole="odchylenie" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PROGMIES-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-PROGMIES-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>{f0(v.sumaPrognozyKwh)} kWh</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-PROGMIES-PODSUMOWANIE", { mies: String(v.liczbaMiesiecyZDanymi), historia: f0(v.sumaHistoriiKwh) })}</p>
          {v.zmianaPct !== null && <p className="text-small">{t("UI-PROGMIES-ZMIANA", { zmiana: f1(v.zmianaPct) })}</p>}
          <WykresPrognozyMiesiecznej wiersze={v.wiersze} />
          <div className="mt-2 overflow-x-auto rounded-lg border">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">{t("UI-PROGMIES-TAB-MIESIAC")}</th>
                  <th className="p-2 font-medium">{t("UI-PROGMIES-TAB-HISTORIA")}</th>
                  <th className="p-2 font-medium">{t("UI-PROGMIES-TAB-PROGNOZA")}</th>
                  {maScenariusze && <th className="p-2 font-medium">{t("UI-PROGMIES-TAB-ZAKRES")}</th>}
                </tr>
              </thead>
              <tbody>
                {v.wiersze.map((w, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-2">{t(KLUCZE_MIESIECY[w.miesiac - 1]!)}</td>
                    <td className="p-2">{w.historiaKwh === null ? "—" : f0(w.historiaKwh)}</td>
                    <td className="p-2">{w.prognozaKwh === null ? "—" : f0(w.prognozaKwh)}</td>
                    {maScenariusze && <td className="p-2">{w.dolnaKwh === null || w.gornaKwh === null ? "—" : `${f0(w.dolnaKwh)}–${f0(w.gornaKwh)}`}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
