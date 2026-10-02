"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateDeficytyMiesieczne } from "@/lib/core/modules/stress-test/deficyty-miesieczne/calculator"
import { OPTYMALNE_OBCIAZENIE_PCT } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KLUCZE_MIESIECY } from "@/components/siec/zuzycie-miesieczne"

type PolaAgregatu = "moc" | "zuzycie" | "cena" | "serwis" | "zapas"
type FormularzStan = Record<PolaAgregatu, string> & { deficyty: string[] }

const STAN_POCZATKOWY: FormularzStan = {
  deficyty: Array.from({ length: 12 }, () => ""),
  moc: "",
  zuzycie: "",
  cena: "",
  serwis: "",
  zapas: "",
}

const POLA: { pole: PolaAgregatu; label: string; unit: string }[] = [
  { pole: "moc", label: "UI-M7-DEFM-MOC", unit: "kW" },
  { pole: "zuzycie", label: "UI-M7-DEFM-ZUZYCIE", unit: "l/h" },
  { pole: "cena", label: "UI-M7-DEFM-CENA", unit: "UI-J-ZL-L" },
  { pole: "serwis", label: "UI-M7-DEFM-SERWIS", unit: "UI-M7-DEFM-J-ZL-H" },
  { pole: "zapas", label: "UI-M7-DEFM-ZAPAS", unit: "l" },
]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function DeficytyMiesiecznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("deficyty-miesieczne", STAN_POCZATKOWY)
  const result = useMemo(
    () =>
      calculateDeficytyMiesieczne({
        deficytyKwh: stan.deficyty.map(liczba),
        mocAgregatuKw: liczba(stan.moc),
        zuzyciePaliwaLH: liczba(stan.zuzycie),
        cenaPaliwaZlL: liczba(stan.cena),
        kosztSerwisuZlH: liczba(stan.serwis),
        zapasPaliwaL: liczba(stan.zapas),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/deficyty-miesieczne" />
      <NaglowekEkranu
        tytul={t("UI-M7-DEFM-TYTUL")}
        ekran="deficyty-miesieczne"
        wynik={result}
        parametry={{ procent: OPTYMALNE_OBCIAZENIE_PCT }}
      >
        {t("UI-M7-DEFM-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DEFM-DEFICYTY")}</legend>
        <div className="grid grid-cols-3 gap-3">
          {KLUCZE_MIESIECY.map((klucz, i) => (
            <Pole
              key={klucz}
              label={t(klucz)}
              unit="kWh"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.deficyty[i] ?? ""}
              onChange={(e) =>
                setStan((prev) => ({ ...prev, deficyty: prev.deficyty.map((d, j) => (j === i ? e.target.value : d)) }))
              }
              pomoc={<PomocPola ekran="deficyty-miesieczne" pole="deficyt" />}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DEFM-AGREGAT")}</legend>
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={t(label)}
            unit={unit.startsWith("UI-") ? t(unit) : unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="deficyty-miesieczne" pole={pole} />}
          />
        ))}
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-DEFM-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-DEFM-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M7-DEFM-W-UWAGA" : "UI-M7-DEFM-W-OK")}>
          <WynikGlowny>
            {t("UI-M7-DEFM-WYNIK", { godziny: r1(v.sumaGodzin), litry: r1(v.sumaPaliwaL), zl: Math.round(v.sumaKosztZl) })}
          </WynikGlowny>
          <table className="mt-3 w-full text-small tabular-nums">
            <thead>
              <tr className="text-left">
                <th className="font-medium">{t("UI-M7-DEFM-K-MIESIAC")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-DEFICYT")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-GODZINY")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-PALIWO")}</th>
                <th className="font-medium">{t("UI-M7-DEFM-K-KOSZT")}</th>
              </tr>
            </thead>
            <tbody>
              {v.miesiace.map((m) => (
                <tr key={m.miesiac}>
                  <td>{t(KLUCZE_MIESIECY[m.miesiac - 1]!)}</td>
                  <td>{r1(m.deficytKwh)}</td>
                  <td>{r1(m.godzinyPracy)}</td>
                  <td>{r1(m.paliwoL)}</td>
                  <td>{Math.round(m.kosztZl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/agregat-pradotworczy" className="text-small underline">
        {t("UI-M7-DEFM-LINK-M2")}
      </Link>
    </main>
  )
}
