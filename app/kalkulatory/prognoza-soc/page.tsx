"use client"

import { useMemo } from "react"
import { calculatePrognozaSoc, type TypSegmentu } from "@/lib/core/modules/ai/prognoza-soc/calculator"
import { DLUGOSC_OKNA_H, LICZBA_OKIEN } from "@/lib/core/modules/ai/prognoza-soc/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { WykresSoc } from "@/components/prognozy/wykres-soc"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscKwh: string
  socStartPct: string
  socMinPct: string
  socMaksPct: string
  sprawnoscLadowaniaPct: string
  sprawnoscRozladowaniaPct: string
  maksMocLadowaniaKw: string
  maksMocRozladowaniaKw: string
  godzinaStartu: string
  horyzontH: string
  produkcja: string[]
  zuzycie: string[]
  dniPct: string[]
}

const PUSTE_OKNA = Array.from({ length: LICZBA_OKIEN }, () => "")
const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscKwh: "",
  socStartPct: "",
  socMinPct: "",
  socMaksPct: "",
  sprawnoscLadowaniaPct: "",
  sprawnoscRozladowaniaPct: "",
  maksMocLadowaniaKw: "",
  maksMocRozladowaniaKw: "",
  godzinaStartu: "",
  horyzontH: "",
  produkcja: PUSTE_OKNA,
  zuzycie: PUSTE_OKNA,
  dniPct: ["", "", ""],
}

const KLUCZE_DNI = ["UI-PROGSOC-DZIEN-0", "UI-PROGSOC-DZIEN-1", "UI-PROGSOC-DZIEN-2", "UI-PROGSOC-DZIEN-3"]
const KLUCZ_SEGMENTU: Record<TypSegmentu, string> = {
  ladowanie: "UI-PROGSOC-SEG-LADOWANIE",
  nadwyzka: "UI-PROGSOC-SEG-NADWYZKA",
  rozladowanie: "UI-PROGSOC-SEG-ROZLADOWANIE",
  brak: "UI-PROGSOC-SEG-BRAK",
}

// Empty field = no data (never a default): the engine treats `null` as "not entered".
const liczba = (s: string | undefined): number | null => (s === undefined || s.trim() === "" ? null : Number(s))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const hh = (h: number) => String(h % 24).padStart(2, "0")

export default function PrognozaSocPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("prognoza-soc", STAN_POCZATKOWY)
  const ustaw = (pole: keyof Omit<FormularzStan, "produkcja" | "zuzycie" | "dniPct">) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))
  const ustawTablice = (pole: "produkcja" | "zuzycie" | "dniPct", n: number, dlugosc: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: Array.from({ length: dlugosc }, (_, i) => (i === n ? e.target.value : (prev[pole][i] ?? ""))) }))

  const godzinaStartu = liczba(stan.godzinaStartu)
  const horyzont = liczba(stan.horyzontH)
  const liczbaDni = horyzont === null ? 1 : Math.max(1, Math.min(3, Math.ceil(horyzont / 24)))

  const result = useMemo(
    () =>
      calculatePrognozaSoc({
        pojemnoscUzytecznaKwh: liczba(stan.pojemnoscKwh),
        socStartPct: liczba(stan.socStartPct),
        socMinPct: liczba(stan.socMinPct),
        socMaksPct: liczba(stan.socMaksPct),
        sprawnoscLadowaniaPct: liczba(stan.sprawnoscLadowaniaPct),
        sprawnoscRozladowaniaPct: liczba(stan.sprawnoscRozladowaniaPct),
        maksMocLadowaniaKw: liczba(stan.maksMocLadowaniaKw),
        maksMocRozladowaniaKw: liczba(stan.maksMocRozladowaniaKw),
        godzinaStartu: liczba(stan.godzinaStartu),
        horyzontH: liczba(stan.horyzontH),
        produkcjaKw: Array.from({ length: LICZBA_OKIEN }, (_, i) => liczba(stan.produkcja[i])),
        zuzycieKw: Array.from({ length: LICZBA_OKIEN }, (_, i) => liczba(stan.zuzycie[i])),
        wspolczynnikDniPct: Array.from({ length: 3 }, (_, i) => liczba(stan.dniPct[i])),
      }),
    [stan],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical") ? "blad" : result.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"
  const etykieta = { blad: t("UI-PROGSOC-BLAD"), uwaga: t("UI-PROGSOC-W-UWAGA"), ok: t("UI-PROGSOC-W-OK") }[poziom]
  const v = result.value
  // clock label of "t hours from the start": day word + hour
  const czas = (tt: number) => t("UI-PROGSOC-CZAS", { dzien: t(KLUCZE_DNI[Math.min(3, Math.floor(((godzinaStartu ?? 0) + tt) / 24))]!), godz: hh((godzinaStartu ?? 0) + tt) })
  const zakresSegmentu = (od: number, doT: number) => t("UI-PROGSOC-ZAKRES", { od: czas(od), do: czas(doT) })

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/prognoza-soc" />
      <NaglowekEkranu tytul={t("UI-PROGSOC-TYTUL")} ekran="prognoza-soc" wynik={result} ilustracja="pogoda">
        {t("UI-PROGSOC-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium text-muted-foreground">{t("UI-PROGSOC-BATERIA")}</p>
        <Pole label={t("UI-PROGSOC-POJEMNOSC")} unit="kWh" type="number" inputMode="decimal" min={0} value={stan.pojemnoscKwh} onChange={ustaw("pojemnoscKwh")} pomoc={<PomocPola ekran="prognoza-soc" pole="pojemnosc" />} />
        <Pole label={t("UI-PROGSOC-SOC-START")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.socStartPct} onChange={ustaw("socStartPct")} pomoc={<PomocPola ekran="prognoza-soc" pole="socStart" />} />
        <Pole label={t("UI-PROGSOC-SOC-MIN")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.socMinPct} onChange={ustaw("socMinPct")} pomoc={<PomocPola ekran="prognoza-soc" pole="socMin" />} />
        <Pole label={t("UI-PROGSOC-SOC-MAKS")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.socMaksPct} onChange={ustaw("socMaksPct")} pomoc={<PomocPola ekran="prognoza-soc" pole="socMaks" />} />
        <Pole label={t("UI-PROGSOC-SPRAWNOSC-LAD")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.sprawnoscLadowaniaPct} onChange={ustaw("sprawnoscLadowaniaPct")} pomoc={<PomocPola ekran="prognoza-soc" pole="sprawnoscLadowania" />} />
        <Pole label={t("UI-PROGSOC-SPRAWNOSC-ROZL")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.sprawnoscRozladowaniaPct} onChange={ustaw("sprawnoscRozladowaniaPct")} pomoc={<PomocPola ekran="prognoza-soc" pole="sprawnoscRozladowania" />} />
        <Pole label={t("UI-PROGSOC-MOC-LAD")} unit="kW" type="number" inputMode="decimal" min={0} value={stan.maksMocLadowaniaKw} onChange={ustaw("maksMocLadowaniaKw")} pomoc={<PomocPola ekran="prognoza-soc" pole="mocLadowania" />} />
        <Pole label={t("UI-PROGSOC-MOC-ROZL")} unit="kW" type="number" inputMode="decimal" min={0} value={stan.maksMocRozladowaniaKw} onChange={ustaw("maksMocRozladowaniaKw")} pomoc={<PomocPola ekran="prognoza-soc" pole="mocRozladowania" />} />

        <p className="text-small font-medium text-muted-foreground">{t("UI-PROGSOC-ZAKRES-PROGNOZY")}</p>
        <Pole label={t("UI-PROGSOC-GODZINA-START")} unit="h" type="number" inputMode="numeric" min={0} max={23} step={1} value={stan.godzinaStartu} onChange={ustaw("godzinaStartu")} pomoc={<PomocPola ekran="prognoza-soc" pole="godzinaStartu" />} />
        <PoleSelect label={t("UI-PROGSOC-HORYZONT")} value={stan.horyzontH} onChange={ustaw("horyzontH")} pomoc={<PomocPola ekran="prognoza-soc" pole="horyzont" />}>
          <option value="">{t("UI-PROGSOC-WYBIERZ")}</option>
          <option value="24">24 h</option>
          <option value="48">48 h</option>
          <option value="72">72 h</option>
        </PoleSelect>

        <p className="text-small font-medium text-muted-foreground">{t("UI-PROGSOC-PROFIL")}</p>
        <p className="text-small text-muted-foreground">{t("UI-PROGSOC-PROFIL-INFO")}</p>
        {Array.from({ length: LICZBA_OKIEN }, (_, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-PROGSOC-PROD-OKNO", { od: hh(i * DLUGOSC_OKNA_H), do: String((i + 1) * DLUGOSC_OKNA_H).padStart(2, "0") })} unit="kW" type="number" inputMode="decimal" min={0} value={stan.produkcja[i] ?? ""} onChange={ustawTablice("produkcja", i, LICZBA_OKIEN)} pomoc={<PomocPola ekran="prognoza-soc" pole="produkcjaOkna" />} />
            <Pole label={t("UI-PROGSOC-ZUZ-OKNO", { od: hh(i * DLUGOSC_OKNA_H), do: String((i + 1) * DLUGOSC_OKNA_H).padStart(2, "0") })} unit="kW" type="number" inputMode="decimal" min={0} value={stan.zuzycie[i] ?? ""} onChange={ustawTablice("zuzycie", i, LICZBA_OKIEN)} pomoc={<PomocPola ekran="prognoza-soc" pole="zuzycieOkna" />} />
          </div>
        ))}

        {liczbaDni > 1 && (
          <>
            <p className="text-small font-medium text-muted-foreground">{t("UI-PROGSOC-DNI")}</p>
            <p className="text-small text-muted-foreground">{t("UI-PROGSOC-DNI-INFO")}</p>
            {Array.from({ length: liczbaDni }, (_, i) => (
              <Pole key={i} label={t("UI-PROGSOC-DZIEN-PROGNOZY", { n: String(i + 1) })} unit="%" type="number" inputMode="decimal" min={0} value={stan.dniPct[i] ?? ""} onChange={ustawTablice("dniPct", i, 3)} pomoc={<PomocPola ekran="prognoza-soc" pole="udzialDnia" />} />
            ))}
          </>
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PROGSOC-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-PROGSOC-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>{f0(v.socKoncowePct)} %</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-PROGSOC-KONIEC", { czas: czas(v.socSeriaPct.length - 1) })}</p>
          <p className="text-small">{t("UI-PROGSOC-MIN-MAKS", { min: f0(v.minSocPct), minCzas: czas(v.minSocT), maks: f0(v.maksSocPct), maksCzas: czas(v.maksSocT) })}</p>
          {v.pierwszeMinimumT !== null ? (
            <p className="text-small font-medium">{t("UI-PROGSOC-MINIMUM-O", { czas: czas(v.pierwszeMinimumT), min: stan.socMinPct })}</p>
          ) : (
            <p className="text-small">{t("UI-PROGSOC-BEZ-MINIMUM")}</p>
          )}
          {v.niedoborKwh > 0 && <p className="text-small">{t("UI-PROGSOC-NIEDOBOR", { kwh: f1(v.niedoborKwh), godz: String(v.godzinyBezZasilania) })}</p>}
          <WykresSoc wynik={v} socMinPct={liczba(stan.socMinPct) ?? 0} godzinaStartu={godzinaStartu ?? 0} />
          <p className="mt-2 text-small font-medium">{t("UI-PROGSOC-OS-CZASU")}</p>
          <ul className="flex flex-col gap-1 text-small">
            {v.segmenty.map((s, i) => (
              <li key={i}>
                <span className="font-medium">{zakresSegmentu(s.odT, s.doT)}</span> — {t(KLUCZ_SEGMENTU[s.typ])}
              </li>
            ))}
            <li>{t("UI-PROGSOC-SZCZYT-PRODUKCJI", { czas: czas(v.szczytProdukcjiT) })}</li>
            <li>{t("UI-PROGSOC-SZCZYT-ZUZYCIA", { czas: czas(v.szczytZuzyciaT) })}</li>
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
