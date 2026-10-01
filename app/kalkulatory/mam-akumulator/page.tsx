"use client"

import { useMemo } from "react"
import { calculateMamAkumulator } from "@/lib/core/modules/kalkulator-mobilny/mam-akumulator/calculator"
import type { ChemiaAkumulatora } from "@/lib/core/modules/kalkulator-mobilny/mam-akumulator/input"
import { DOD_LIFEPO4_TYPOWY_MAX_PCT, DOD_LIFEPO4_TYPOWY_MIN_PCT } from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; mocW: string }

type FormularzStan = {
  chemia: ChemiaAkumulatora | ""
  pojemnoscAh: string
  napiecieV: string
  dodPct: string
  sprawnoscPct: string
  maksPradA: string
  urzadzenia: Wiersz[]
}

const STAN_POCZATKOWY: FormularzStan = {
  chemia: "",
  pojemnoscAh: "",
  napiecieV: "",
  dodPct: "",
  sprawnoscPct: "",
  maksPradA: "",
  urzadzenia: [],
}

const CHEMIE: { id: ChemiaAkumulatora; label: string }[] = [
  { id: "agm", label: "UI-M12-MA-CHEMIA-AGM" },
  { id: "lifepo4", label: "UI-M12-MA-CHEMIA-LIFEPO4" },
  { id: "kwasowy", label: "UI-M12-MA-CHEMIA-KWASOWY" },
]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function MamAkumulatorPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("mam-akumulator", STAN_POCZATKOWY)
  const ustaw = (pole: Exclude<keyof FormularzStan, "urzadzenia">) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))

  const result = useMemo(
    () =>
      calculateMamAkumulator({
        chemia: stan.chemia === "" ? null : stan.chemia,
        pojemnoscAh: liczba(stan.pojemnoscAh),
        napiecieV: liczba(stan.napiecieV),
        dodPct: liczba(stan.dodPct),
        sprawnoscPct: liczba(stan.sprawnoscPct),
        maksPradA: liczba(stan.maksPradA),
        urzadzenia: stan.urzadzenia.map((u, i) => ({
          nazwa: u.nazwa.trim() || t("UI-M12-MA-URZADZENIE", { n: i + 1 }),
          mocW: liczba(u.mocW),
        })),
      }),
    [stan, t],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/mam-akumulator" />
      <NaglowekEkranu tytul={t("UI-M12-MA-TYTUL")} ekran="mam-akumulator" wynik={result}>
        {t("UI-M12-MA-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect label={t("UI-M12-MA-CHEMIA")} value={stan.chemia} onChange={ustaw("chemia")} pomoc={<PomocPola ekran="mam-akumulator" pole="chemia" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {CHEMIE.map((o) => (
            <option key={o.id} value={o.id}>
              {t(o.label)}
            </option>
          ))}
        </PoleSelect>
        <Pole label={t("UI-M12-MA-POJEMNOSC")} unit="Ah" type="number" inputMode="decimal" min={0} value={stan.pojemnoscAh} onChange={ustaw("pojemnoscAh")} pomoc={<PomocPola ekran="mam-akumulator" pole="pojemnosc" />} />
        <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" type="number" inputMode="decimal" min={0} value={stan.napiecieV} onChange={ustaw("napiecieV")} pomoc={<PomocPola ekran="mam-akumulator" pole="napiecie" />} />
        <Pole
          label={t("UI-M12-MA-DOD")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.dodPct}
          onChange={ustaw("dodPct")}
          pomoc={<PomocPola ekran="mam-akumulator" pole="dod" params={{ min: DOD_LIFEPO4_TYPOWY_MIN_PCT, max: DOD_LIFEPO4_TYPOWY_MAX_PCT }} />}
        />
        <Pole label={t("UI-M12-MA-SPRAWNOSC")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.sprawnoscPct} onChange={ustaw("sprawnoscPct")} pomoc={<PomocPola ekran="mam-akumulator" pole="sprawnosc" />} />
        <Pole label={t("UI-M12-MA-MAKS-PRAD")} unit="A" type="number" inputMode="decimal" min={0} value={stan.maksPradA} onChange={ustaw("maksPradA")} pomoc={<PomocPola ekran="mam-akumulator" pole="maksPrad" />} />
      </div>

      <ul className="flex flex-col gap-4">
        {stan.urzadzenia.map((u, i) => (
          <li key={u.id} className="flex flex-col gap-3 rounded-md border p-3">
            <div className="grid grid-cols-2 gap-3">
              <Pole
                label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })}
                placeholder={t("UI-M12-MA-NAZWA-PRZYKLAD")}
                value={u.nazwa}
                onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
                pomoc={<PomocPola ekran="mam-akumulator" pole="nazwa" />}
              />
              <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={u.mocW} onChange={(e) => aktualizuj(u.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="mam-akumulator" pole="moc" />} />
            </div>
            <button
              type="button"
              onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
              className="self-start text-caption text-muted-foreground underline"
              aria-label={t("UI-M12-MA-USUN-ETYKIETA", { n: i + 1 })}
            >
              {t("UI-M12-MA-USUN")}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setStan((prev) => ({ ...prev, urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", mocW: "" }] }))}
        className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
      >
        {t("UI-M12-MA-DODAJ")}
      </button>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-MA-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-MA-W-UWAGA" : "UI-M12-MA-W-OK")}>
          <WynikGlowny>{t("UI-M12-MA-ENERGIA", { wh: Math.round(result.value.energiaUzytecznaWh) })}</WynikGlowny>
          <ul className="mt-1 text-small">
            {result.value.urzadzenia.map((u, i) => (
              <li key={i}>{t("UI-M12-MA-WIERSZ", { nazwa: u.nazwa, moc: u.mocW, czas: r1(u.czasH), prad: r1(u.pradA) })}</li>
            ))}
          </ul>
          {result.value.urzadzenia.length > 1 && (
            <p className="mt-1 text-small font-medium">
              {t("UI-M12-MA-RAZEM", { czas: r1(result.value.czasRazemH), prad: r1(result.value.pradRazemA) })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
