"use client"

import { useMemo } from "react"
import { calculateMocUmowna } from "@/lib/core/modules/siec/moc-umowna/calculator"
import type { WariantPomiaru } from "@/lib/core/modules/siec/moc-umowna/input"
import type { Grupa, OsdId } from "@/lib/core/dane/rozliczenia-pl-2026"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { GRUPY_FIRMA, PoleOsd, liczba, nadpisanie, poziomWerdyktu } from "@/components/siec/wspolne"
import { useZl } from "@/lib/waluta/use-waluta"
import { useTranslate } from "@/lib/i18n/language-context"

const MIESIACE = ["UI-MIES-01", "UI-MIES-02", "UI-MIES-03", "UI-MIES-04", "UI-MIES-05", "UI-MIES-06", "UI-MIES-07", "UI-MIES-08", "UI-MIES-09", "UI-MIES-10", "UI-MIES-11", "UI-MIES-12"]

type Stan = {
  osd: OsdId
  grupa: Grupa
  moc: string
  stala: string
  wariant: WariantPomiaru
  maksy: string[]
}

export default function MocUmownaPage() {
  const t = useTranslate(true)
  const zl = useZl()
  const [stan, setStan] = usePersistedDraft<Stan>("siec-moc-umowna", {
    osd: "tauron",
    grupa: "C21",
    moc: "",
    stala: "",
    wariant: "suma10",
    maksy: Array(12).fill(""),
  })
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateMocUmowna({
        osd: stan.osd,
        grupa: stan.grupa,
        dataRozliczenia: "2026-12-31",
        mocUmownaKw: liczba(stan.moc),
        stalaZlKwMiesWlasna: nadpisanie(stan.stala),
        wariantPomiaru: stan.wariant,
        // 🔎 TD22: no fields for the 10 largest values yet — variant "suma10" gives an upper estimate.
        miesiace: stan.maksy.map((m) => ({ maksKw: m === "" ? null : Number(m), dziesiecNajwiekszychKw: null })),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/moc-umowna" />
      <NaglowekEkranu tytul={t("UI-MOCUMO-MOC-UMOWNA-PRZEKROCZENIA")} ekran="moc-umowna" wynik={result}>
        {t("UI-MOCUMO-ILE-KOSZTUJA-PRZEKROCZENIA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleOsd value={stan.osd} onChange={(osd) => ustaw("osd", osd)} />
        <PoleSelect
          label={t("UI-MOCUMO-GRUPA-TARYFOWA")}
          value={stan.grupa}
          onChange={(e) => ustaw("grupa", e.target.value as Grupa)}
          pomoc={<PomocPola ekran="moc-umowna" pole="grupa" />}
        >
          {GRUPY_FIRMA.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label={t("UI-MOCUMO-OBECNA-MOC-UMOWNA")}
          unit="kW"
          type="number"
          inputMode="decimal"
          value={stan.moc}
          onChange={(e) => ustaw("moc", e.target.value)}
          pomoc={<PomocPola ekran="moc-umowna" pole="moc" />}
        />
        <Pole
          label={t("UI-MOCUMO-SKLADNIK-STALY-STAWKI")}
          unit={t("UI-MOCUMO-MIES")}
          type="number"
          inputMode="decimal"
          value={stan.stala}
          onChange={(e) => ustaw("stala", e.target.value)}
          pomoc={<PomocPola ekran="moc-umowna" pole="skladnikStaly" />}
        />
        <PoleSelect
          label={t("UI-MOCUMO-LICZNIK-MIERZY-PRZEKROCZENIA")}
          value={stan.wariant}
          onChange={(e) => ustaw("wariant", e.target.value as WariantPomiaru)}
          pomoc={<PomocPola ekran="moc-umowna" pole="pomiar" />}
        >
          <option value="suma10">{t("UI-MOCUMO-SUMA-NAJWIEKSZYCH-NADWYZEK")}</option>
          <option value="10xmax">{t("UI-MOCUMO-NAJWIEKSZA-NADWYZKA")}</option>
        </PoleSelect>
        <fieldset className="grid grid-cols-3 gap-3 rounded-md border p-3">
          <legend className="px-1 text-small font-medium">{t("UI-MOCUMO-MAKSYMALNA-MOC-MIESIACU")}</legend>
          {MIESIACE.map((m, i) => (
            <Pole
              key={m}
              label={t(m)}
              type="number"
              inputMode="decimal"
              value={stan.maksy[i] ?? ""}
              onChange={(e) => ustaw("maksy", stan.maksy.map((x, j) => (j === i ? e.target.value : x)))}
              pomoc={<PomocPola ekran="moc-umowna" pole="maksMiesiac" />}
            />
          ))}
        </fieldset>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-MOCUMO-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        result.warnings.length > 0 ? (
          <WerdyktPanel poziom="uwaga" etykieta={t("UI-MOCUMO-BRAKUJE-DANYCH")}>
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : (
          <p className="text-small text-muted-foreground">{t("UI-MOCUMO-WPISZ-MOC-UMOWNA")}</p>
        )
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta={t("UI-MOCUMO-KOSZT-MOCY-UMOWNEJ")}>
          <WynikGlowny>{t("UI-MOCUMO-NETTO-ROK", { kosztRazemRokZl: zl(v.kosztRazemRokZl) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-MOCUMO-OPLATA-STALA-PRZEKROCZENIA", { kosztStalyRokZl: zl(v.kosztStalyRokZl), oplataPrzekroczenRokZl: zl(v.oplataPrzekroczenRokZl) })}
          </p>
          <p className="mt-1 text-small font-medium">
            {t("UI-MOCUMO-NAJNIZSZY-KOSZT-ROK", { optymalnaMocKw: v.optymalnaMocKw, kosztOptymalnyRokZl: zl(v.kosztOptymalnyRokZl) })}
            {v.kosztOptymalnyRokZl < v.kosztRazemRokZl && <> {t("UI-MOCUMO-MNIEJ", { p: zl(v.kosztRazemRokZl - v.kosztOptymalnyRokZl) })}</>}.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
