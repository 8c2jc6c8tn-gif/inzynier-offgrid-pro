"use client"

import { isComputed } from "@/lib/core/calc-result"
import { useEffect, useMemo, useState } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { ProbkaLuku, WykresEnergiiGodzinowej, WykresToruSlonca } from "@/components/lokalizacja/wykres-toru-slonca"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { wysokoscHoryzontuDeg } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/profil"
import { KLUCZ_HORYZONTU, profilZDraftu } from "@/lib/lokalizacja/horyzont-zmierzony"
import { pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import { calculateTorSlonca, pozycjaLokalna, type IdLuku } from "@/lib/core/modules/pv/tor-slonca/calculator"
import { DZIEN_WYBRANEGO_MIESIACA, GODZIN_W_DOBIE, MIESIECY, MIN_W_GODZINIE } from "@/lib/core/modules/pv/tor-slonca/constants"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"
import { liczba, powierzchnieZModelu } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"

/** Hour 12.633 → "12:38" (rounded to the minute, carried into the hour). */
function godz(h: number): string {
  const minuty = Math.round(h * MIN_W_GODZINIE) % (GODZIN_W_DOBIE * MIN_W_GODZINIE)
  return `${Math.floor(minuty / MIN_W_GODZINIE)}:${String(minuty % MIN_W_GODZINIE).padStart(2, "0")}`
}

type Stan = {
  powierzchniaId: string
  nachylenie: string
  azymut: string
  moc: string
  pr: string
  miesiac: string
}

/** December first: the hardest month for off-grid, so the first picture shows the case that matters most. */
const STAN_POCZATKOWY: Stan = { powierzchniaId: "", nachylenie: "", azymut: "180", moc: "", pr: "", miesiac: "12" }

const KROK_SUWAKA_H = 0.25
const OPOZNIENIE_ANIMACJI_MS = 80
const KROK_ANIMACJI_H = 0.1
const ODSWIEZENIE_TERAZ_MS = 60_000
const GODZINA_POCZATKOWA_H = 12

const KOLEJNOSC_TABELI: IdLuku[] = ["lato", "rownonoc", "zima", "wybrany"]

export default function TorSloncaPage() {
  const t = useTranslate()
  const { f0, f1, f2 } = useFormaty()
  const { skaner, lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<Stan>("tor-slonca", STAN_POCZATKOWY)
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))
  const powierzchnie = useMemo(() => powierzchnieZModelu(skaner.value), [skaner.value])
  const [godzina, setGodzina] = useState(GODZINA_POCZATKOWA_H)
  // Measured horizon (screen "Horyzont ze zdjęcia"), if the user made one: drawn on the chart and used for the "behind an obstacle" note.
  const horyzontDraft = useOdczytDraftu<{ profil?: unknown }>(KLUCZ_HORYZONTU)
  const horyzont = useMemo(() => profilZDraftu(horyzontDraft.dane), [horyzontDraft.dane])
  const [gra, setGra] = useState(false)
  const [teraz, setTeraz] = useState<{ azymutDeg: number; wysokoscDeg: number } | null>(null)

  // The animation advances the slider only; the draft is not touched, so it never writes to storage while playing.
  useEffect(() => {
    if (!gra) return
    const id = setInterval(() => setGodzina((h) => (h + KROK_ANIMACJI_H >= GODZIN_W_DOBIE ? 0 : h + KROK_ANIMACJI_H)), OPOZNIENIE_ANIMACJI_MS)
    return () => clearInterval(id)
  }, [gra])

  // "Now" comes from the device clock, so it is computed after mount (no server/client mismatch).
  const lat = lokalizacja?.szerokosc
  const lon = lokalizacja?.dlugosc
  useEffect(() => {
    if (lat === undefined || lon === undefined) return
    const licz = () => {
      const p = pozycjaSlonca(lat, lon, Date.now())
      setTeraz(p.wysokoscDeg > 0 ? { azymutDeg: p.azymutDeg, wysokoscDeg: p.wysokoscDeg } : null)
    }
    licz()
    const id = setInterval(licz, ODSWIEZENIE_TERAZ_MS)
    return () => clearInterval(id)
  }, [lat, lon])

  const miesiac = liczba(stan.miesiac) ?? null
  const result = useMemo(
    () =>
      calculateTorSlonca({
        szerokoscGeograficzna: lat ?? null,
        dlugoscGeograficzna: lon ?? null,
        miesiac,
        nachylenieDeg: liczba(stan.nachylenie) ?? null,
        azymutDeg: liczba(stan.azymut) ?? null,
        mocKwp: liczba(stan.moc) ?? null,
        pr: liczba(stan.pr) ?? null,
        ...(dane ? { daneGodzinowe: dane.dane.rekordy } : {}),
      }),
    [lat, lon, miesiac, stan.nachylenie, stan.azymut, stan.moc, stan.pr, dane],
  )

  if (!wczytano) return <StanLadowania linie={6} />

  const v = result.value
  const wynikGotowy = isComputed(result.status)
  const nazwaMiesiaca = miesiac !== null && miesiac >= 1 && miesiac <= MIESIECY ? t(`UI-MIESIAC-${miesiac}`) : ""
  const etykietyLukow: Record<IdLuku, string> = {
    lato: t("UI-TORS-LUK-LATO"),
    rownonoc: t("UI-TORS-LUK-ROWNONOC"),
    zima: t("UI-TORS-LUK-ZIMA"),
    wybrany: t("UI-TORS-LUK-WYBRANY", { miesiac: nazwaMiesiaca }),
  }
  const wybrany = v?.luki.find((l) => l.id === "wybrany") ?? null
  const polozenie = v && lat !== undefined && lon !== undefined && miesiac !== null ? pozycjaLokalna(lat, lon, miesiac, DZIEN_WYBRANEGO_MIESIACA, godzina) : null
  const godzinaEnergii = v?.energia?.godziny[Math.min(GODZIN_W_DOBIE - 1, Math.floor(godzina))] ?? null
  const mamTypowa = v?.energia?.typowaDobaKwh !== null && v?.energia?.typowaDobaKwh !== undefined

  function wybierzPowierzchnie(id: string) {
    const p = powierzchnie.find((x) => x.id === id)
    setStan((prev) => ({ ...prev, powierzchniaId: id, ...(p ? { nachylenie: String(p.nachylenieDeg), azymut: String(p.azymutDeg) } : {}) }))
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tor-slonca" />
      <NaglowekEkranu tytul={t("UI-TORS-TYTUL")} ekran="tor-slonca" wynik={wynikGotowy ? result : null}>
        {t("UI-TORS-OPIS")}
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />
      {lokalizacja === null && (
        <p role="status" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small text-werdykt-uwaga-foreground">
          {t("UI-TORS-BRAK-LOKALIZACJI")}
        </p>
      )}
      {lokalizacja !== null && dane === null && (
        <p role="status" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small text-werdykt-uwaga-foreground">
          {t("UI-TORS-BRAK-DANYCH-POGODOWYCH")}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-TORS-KROK-PANELE")}</h2>
        {powierzchnie.length > 0 && (
          <PoleSelect
            label={t("UI-TORS-POWIERZCHNIA")}
            value={stan.powierzchniaId}
            onChange={(e) => wybierzPowierzchnie(e.target.value)}
            pomoc={<PomocPola ekran="tor-slonca" pole="powierzchnia" />}
          >
            <option value="">{t("UI-TORS-POWIERZCHNIA-WLASNA")}</option>
            {powierzchnie.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.nazwa} (${p.nachylenieDeg}°, ${p.azymutDeg}°)`}
              </option>
            ))}
          </PoleSelect>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-TORS-NACHYLENIE")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={90}
            step="any"
            value={stan.nachylenie}
            onChange={(e) => ustaw("nachylenie", e.target.value)}
            pomoc={<PomocPola ekran="tor-slonca" pole="nachylenie" />}
          />
          <Pole
            label={t("UI-TORS-AZYMUT")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={360}
            step="any"
            value={stan.azymut}
            onChange={(e) => ustaw("azymut", e.target.value)}
            pomoc={<PomocPola ekran="tor-slonca" pole="azymut" />}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-TORS-MOC")}
            unit="kWp"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={stan.moc}
            onChange={(e) => ustaw("moc", e.target.value)}
            pomoc={<PomocPola ekran="tor-slonca" pole="moc" />}
          />
          <Pole
            label={t("UI-TORS-PR")}
            type="number"
            inputMode="decimal"
            min={0}
            max={1}
            step="any"
            value={stan.pr}
            onChange={(e) => ustaw("pr", e.target.value)}
            pomoc={<PomocPola ekran="tor-slonca" pole="pr" />}
          />
        </div>
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-TORS-PR-PODPIS")}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-TORS-KROK-DZIEN")}</h2>
        <PoleSelect
          label={t("UI-TORS-MIESIAC")}
          value={stan.miesiac}
          onChange={(e) => ustaw("miesiac", e.target.value)}
          pomoc={<PomocPola ekran="tor-slonca" pole="miesiac" />}
        >
          {Array.from({ length: MIESIECY }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              {t(`UI-MIESIAC-${i + 1}`)}
            </option>
          ))}
        </PoleSelect>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-TORS-KROK-WYNIK")}</h2>
        {result.status === "INVALID_INPUT" ? (
          <WerdyktPanel poziom="blad" etykieta={t("UI-TORS-BLAD")}>
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : result.status === "INCOMPLETE" || v === null || wybrany === null ? (
          <div className="flex flex-col gap-2">
            <p className="text-small text-muted-foreground">{t("UI-TORS-UZUPELNIJ")}</p>
            {result.warnings.length > 0 && <WynikSzczegoly assumptions={[]} warnings={result.warnings} />}
          </div>
        ) : (
          <>
            <WerdyktPanel poziom={result.status === "VALID" ? "ok" : "uwaga"} etykieta={t("UI-TORS-WERDYKT")}>
              <WynikGlowny>
                {wybrany.dlugoscDniaH > 0
                  ? t("UI-TORS-GC-GLOWNY", { dlugosc: f1(wybrany.dlugoscDniaH) })
                  : t("UI-TORS-GC-DZIEN-BEZ-WSCHODU", { miesiac: nazwaMiesiaca })}
              </WynikGlowny>
              {wybrany.dlugoscDniaH > 0 && (
                <p className="mt-1 text-small">
                  {t("UI-TORS-GC-DZIEN", {
                    miesiac: nazwaMiesiaca,
                    wschod: wybrany.wschodH === null ? "—" : godz(wybrany.wschodH),
                    gorowanie: godz(wybrany.gorowanieH ?? 0),
                    wys: f1(wybrany.maksWysokoscDeg),
                    zachod: wybrany.zachodH === null ? "—" : godz(wybrany.zachodH),
                  })}
                </p>
              )}
              {v.energia ? (
                <>
                  {v.energia.typowaDobaKwh !== null && (
                    <p className="mt-1 text-small">
                      {t("UI-TORS-GC-ENERGIA-TYPOWA", {
                        suma: f1(v.energia.typowaDobaKwh),
                        szczyt: v.energia.szczytTypowyH === null ? "—" : `${v.energia.szczytTypowyH}:00–${v.energia.szczytTypowyH + 1}:00`,
                      })}
                    </p>
                  )}
                  <p className="mt-1 text-small">{t("UI-TORS-GC-ENERGIA-CZYSTA", { suma: f1(v.energia.czysteNiebo) })}</p>
                </>
              ) : (
                <p className="mt-1 text-small">{t("UI-TORS-GC-BEZ-ENERGII")}</p>
              )}
              <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
            </WerdyktPanel>

            <h3 className="font-medium">{t("UI-TORS-WYKRES-TYTUL")}</h3>
            <WykresToruSlonca
              luki={v.luki}
              zakresAzymutuDeg={v.zakresAzymutuDeg}
              polozenie={polozenie}
              teraz={teraz}
              etykietyLukow={etykietyLukow}
              horyzontDeg={horyzont}
            />

            <div className="flex flex-col gap-3 rounded-md border p-3">
              <Pole
                label={t("UI-TORS-GODZINA")}
                type="range"
                min={0}
                max={GODZIN_W_DOBIE - KROK_SUWAKA_H}
                step={KROK_SUWAKA_H}
                value={godzina}
                onChange={(e) => setGodzina(Number(e.target.value))}
                pomoc={<PomocPola ekran="tor-slonca" pole="godzina" />}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="min-h-11" aria-pressed={gra} onClick={() => setGra((g) => !g)}>
                  {gra ? t("UI-TORS-PAUZA") : t("UI-TORS-ODTWORZ")}
                </Button>
                <p role="status" className="text-small tabular-nums">
                  {polozenie && polozenie.wysokoscDeg > 0
                    ? t("UI-TORS-ODCZYT-SLONCE", { czas: godz(godzina), wys: f1(polozenie.wysokoscDeg), az: f0(polozenie.azymutDeg) })
                    : t("UI-TORS-ODCZYT-POD-HORYZONTEM", { czas: godz(godzina) })}
                  {polozenie && horyzont && polozenie.wysokoscDeg > 0 && (wysokoscHoryzontuDeg(horyzont, polozenie.azymutDeg) ?? 0) > polozenie.wysokoscDeg
                    ? ` ${t("UI-TORS-ZA-HORYZONTEM", { wys: f1(wysokoscHoryzontuDeg(horyzont, polozenie.azymutDeg)!) })}`
                    : ""}
                </p>
              </div>
              {godzinaEnergii && (
                <p className="text-small">
                  {godzinaEnergii.typowaKwh !== null
                    ? t("UI-TORS-ODCZYT-ENERGIA", { typowa: f2(godzinaEnergii.typowaKwh), czyste: f2(godzinaEnergii.czysteNiebo) })
                    : t("UI-TORS-ODCZYT-ENERGIA-CZYSTE", { czyste: f2(godzinaEnergii.czysteNiebo) })}
                </p>
              )}
            </div>

            {v.energia && (
              <>
                <h3 className="font-medium">{t("UI-TORS-ENERGIA-TYTUL", { miesiac: nazwaMiesiaca })}</h3>
                <WykresEnergiiGodzinowej godziny={v.energia.godziny} godzinaZSuwaka={Math.floor(godzina)} mamTypowa={mamTypowa} />
              </>
            )}

            <h3 className="font-medium">{t("UI-TORS-TABELA-LUKOW")}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-small">
                <thead>
                  <tr className="text-left">
                    <th className="p-1 font-medium">{t("UI-TORS-COL-LUK")}</th>
                    <th className="p-1 font-medium">{t("UI-TORS-COL-WSCHOD")}</th>
                    <th className="p-1 font-medium">{t("UI-TORS-COL-GOROWANIE")}</th>
                    <th className="p-1 font-medium">{t("UI-TORS-COL-WYSOKOSC")}</th>
                    <th className="p-1 font-medium">{t("UI-TORS-COL-ZACHOD")}</th>
                    <th className="p-1 font-medium">{t("UI-TORS-COL-DLUGOSC")}</th>
                  </tr>
                </thead>
                <tbody>
                  {KOLEJNOSC_TABELI.map((id) => {
                    const l = v.luki.find((k) => k.id === id)!
                    return (
                      <tr key={id} className={`border-t align-top ${id === "wybrany" ? "font-semibold" : ""}`}>
                        <td className="p-1">
                          <span className="flex items-center gap-2">
                            <ProbkaLuku id={id} />
                            {etykietyLukow[id]}
                          </span>
                        </td>
                        <td className="p-1 tabular-nums">{l.wschodH === null ? "—" : godz(l.wschodH)}</td>
                        <td className="p-1 tabular-nums">{l.gorowanieH === null ? "—" : godz(l.gorowanieH)}</td>
                        <td className="p-1 tabular-nums">{f1(l.maksWysokoscDeg)}</td>
                        <td className="p-1 tabular-nums">{l.zachodH === null ? "—" : godz(l.zachodH)}</td>
                        <td className="p-1 tabular-nums">{f1(l.dlugoscDniaH)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {v.energia?.miesiacamiKwhNaDobe && (
              <>
                <h3 className="font-medium">{t("UI-TORS-MIESIACE-TYTUL")}</h3>
                <p className="text-caption text-muted-foreground">{t("UI-TORS-MIESIACE-OPIS")}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="text-left">
                        <th className="p-1 font-medium">{t("UI-TORS-COL-MIESIAC")}</th>
                        <th className="p-1 font-medium">{t("UI-TORS-COL-KWH-DOBE")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.energia.miesiacamiKwhNaDobe.map((kwh, i) => (
                        <tr key={i} className={`border-t ${i + 1 === miesiac ? "bg-werdykt-ok-bg font-semibold" : ""}`}>
                          <td className="p-1">{t(`UI-MIESIAC-${i + 1}`)}</td>
                          <td className="p-1 tabular-nums">{f2(kwh)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <h3 className="font-medium">{t("UI-TORS-ZALOZENIA")}</h3>
            <WynikSzczegoly assumptions={result.assumptions} warnings={[]} />
          </>
        )}
      </section>
    </main>
  )
}
