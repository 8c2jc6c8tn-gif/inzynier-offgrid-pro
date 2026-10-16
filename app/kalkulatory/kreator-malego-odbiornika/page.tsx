"use client"

import { useMemo } from "react"
import { calculateKreatorMalegoOdbiornika } from "@/lib/core/modules/kalkulator-mobilny/kreator-malego-odbiornika/calculator"
import { SCENARIUSZE, type ScenariuszOdbiornika } from "@/lib/core/modules/kalkulator-mobilny/kreator-malego-odbiornika/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"

type Wiersz = { id: string; nazwa: string; mocW: string; godzinNaDobe: string; krotnoscRozruchu: string }

type PolaLiczbowe =
  | "czasPodtrzymaniaH"
  | "napiecieV"
  | "uzytecznaPct"
  | "sprawnoscFalownikaPct"
  | "posiadanyAh"
  | "mocPaneluW"
  | "godzinSlonca"
  | "sprawnoscToruPct"

type FormularzStan = Record<PolaLiczbowe, string> & {
  scenariusz: ScenariuszOdbiornika | ""
  przezFalownik: "" | "tak" | "nie"
  skladniki: Wiersz[]
}

const STAN_POCZATKOWY: FormularzStan = {
  scenariusz: "",
  przezFalownik: "",
  skladniki: [],
  czasPodtrzymaniaH: "",
  napiecieV: "",
  uzytecznaPct: "",
  sprawnoscFalownikaPct: "",
  posiadanyAh: "",
  mocPaneluW: "",
  godzinSlonca: "",
  sprawnoscToruPct: "",
}

const nowyWiersz = (nazwa: string): Wiersz => ({ id: crypto.randomUUID(), nazwa, mocW: "", godzinNaDobe: "", krotnoscRozruchu: "" })
const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function KreatorMalegoOdbiornikaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("kreator-malego-odbiornika", STAN_POCZATKOWY)
  const ustaw = (klucz: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [klucz]: e.target.value }))
  const pole = (klucz: PolaLiczbowe) => ({ type: "number", inputMode: "decimal" as const, min: 0, value: stan[klucz], onChange: ustaw(klucz) })
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, skladniki: prev.skladniki.map((o) => (o.id === id ? { ...o, ...zmiana } : o)) }))
  const wczytajSkladniki = () => {
    const s = SCENARIUSZE.find((x) => x.id === stan.scenariusz)
    if (s) setStan((prev) => ({ ...prev, skladniki: s.skladniki.map((k) => nowyWiersz(t(k))) }))
  }

  const result = useMemo(
    () =>
      calculateKreatorMalegoOdbiornika({
        scenariusz: stan.scenariusz === "" ? null : stan.scenariusz,
        skladniki: stan.skladniki.map((o) => ({
          nazwa: o.nazwa,
          mocW: liczba(o.mocW),
          godzinNaDobe: liczba(o.godzinNaDobe),
          krotnoscRozruchu: liczba(o.krotnoscRozruchu),
        })),
        czasPodtrzymaniaH: liczba(stan.czasPodtrzymaniaH),
        napiecieV: liczba(stan.napiecieV),
        uzytecznaPct: liczba(stan.uzytecznaPct),
        przezFalownik: stan.przezFalownik === "" ? null : stan.przezFalownik === "tak",
        sprawnoscFalownikaPct: liczba(stan.sprawnoscFalownikaPct),
        posiadanyAh: liczba(stan.posiadanyAh),
        mocPaneluW: liczba(stan.mocPaneluW),
        godzinSlonca: liczba(stan.godzinSlonca),
        sprawnoscToruPct: liczba(stan.sprawnoscToruPct),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kreator-malego-odbiornika" />
      <NaglowekEkranu tytul={t("UI-M12-KZ-TYTUL")} ekran="kreator-malego-odbiornika" wynik={result}>
        {t("UI-M12-KZ-OPIS")}
      </NaglowekEkranu>

      <PoleSelect label={t("UI-M12-KZ-SCENARIUSZ")} value={stan.scenariusz} onChange={ustaw("scenariusz")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="scenariusz" />}>
        <option value="">{t("UI-WYBIERZ")}</option>
        {SCENARIUSZE.map((s) => (
          <option key={s.id} value={s.id}>
            {t(`UI-M12-KZ-SC-${s.id.toUpperCase()}`)}
          </option>
        ))}
      </PoleSelect>
      {stan.scenariusz !== "" && (
        <button type="button" onClick={wczytajSkladniki} className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted">
          {t("UI-M12-KZ-WCZYTAJ")}
        </button>
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-KZ-SKLADNIKI")}</legend>
        <ul className="flex flex-col gap-4">
          {stan.skladniki.map((o, i) => (
            <li key={o.id} className="flex flex-col gap-3 rounded-md border p-3">
              <Pole label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })} value={o.nazwa} onChange={(e) => aktualizuj(o.id, { nazwa: e.target.value })} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="nazwa" />} />
              <div className="grid grid-cols-3 gap-3">
                <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={o.mocW} onChange={(e) => aktualizuj(o.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="moc" />} />
                <Pole label={t("UI-M12-WK-GODZINY")} unit={t("UI-M12-J-H-DOBE")} type="number" inputMode="decimal" min={0} max={24} value={o.godzinNaDobe} onChange={(e) => aktualizuj(o.id, { godzinNaDobe: e.target.value })} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="godziny" />} />
                <Pole label={t("UI-M12-PRZ-KROTNOSC")} unit="×" type="number" inputMode="decimal" min={0} value={o.krotnoscRozruchu} onChange={(e) => aktualizuj(o.id, { krotnoscRozruchu: e.target.value })} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="krotnosc" />} />
              </div>
              <button
                type="button"
                onClick={() => setStan((prev) => ({ ...prev, skladniki: prev.skladniki.filter((x) => x.id !== o.id) }))}
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
          onClick={() => setStan((prev) => ({ ...prev, skladniki: [...prev.skladniki, nowyWiersz("")] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-M12-MA-DODAJ")}
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-KZ-ZESTAW")}</legend>
        <Pole label={t("UI-M12-KZ-CZAS")} unit="h" {...pole("czasPodtrzymaniaH")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="czas" />} />
        <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" {...pole("napiecieV")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="napiecie" />} />
        <NapiecieZProfilu aktualne={stan.napiecieV} onUzyj={(v) => setStan((prev) => ({ ...prev, napiecieV: v }))} />
        <Pole label={t("UI-M12-MA-DOD")} unit="%" max={100} {...pole("uzytecznaPct")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="uzyteczna" />} />
        <PoleSelect label={t("UI-M12-KZ-FALOWNIK")} value={stan.przezFalownik} onChange={ustaw("przezFalownik")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="falownik" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="tak">{t("UI-TAK")}</option>
          <option value="nie">{t("UI-NIE")}</option>
        </PoleSelect>
        {stan.przezFalownik === "tak" && (
          <Pole label={t("UI-M12-BM-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscFalownikaPct")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="sprawnoscFalownika" />} />
        )}
        <Pole label={t("UI-M12-BM-POSIADANY")} unit="Ah" {...pole("posiadanyAh")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="posiadany" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-KZ-PANEL")}</legend>
        <Pole label={t("UI-M12-WK-MOC-PANELU")} unit="W" {...pole("mocPaneluW")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="mocPanelu" />} />
        <Pole label={t("UI-M12-WK-GODZIN-SLONCA")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinSlonca")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="godzinSlonca" />} />
        <Pole label={t("UI-M12-WK-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscToruPct")} pomoc={<PomocPola ekran="kreator-malego-odbiornika" pole="sprawnosc" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-KZ-W-UWAGA" : "UI-M12-KZ-W-OK")}>
          <WynikGlowny>{t("UI-M12-KZ-WYNIK", { ah: Math.ceil(v.minimalnyAh), h: r1(liczba(stan.czasPodtrzymaniaH)) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M12-KZ-SZCZEGOLY", { doba: Math.round(v.zuzycieDobaWh), suma: Math.round(v.sumaMocyW), wh: Math.round(v.energiaPodtrzymaniaWh) })}</p>
          {stan.przezFalownik === "tak" && <p className="mt-1 text-small">{t("UI-M12-KZ-FALOWNIK-WYNIK", { w: Math.ceil(v.sumaMocyW), szczyt: Math.ceil(v.szczytW) })}</p>}
          {v.posiadanyStarczyH > 0 && <p className="mt-1 text-small">{t("UI-M12-BM-POSIADANY-WYNIK", { h: r1(v.posiadanyStarczyH) })}</p>}
          {v.energiaPaneluWh > 0 && <p className="mt-1 text-small">{t("UI-M12-KZ-PANEL-WYNIK", { wh: Math.round(v.energiaPaneluWh) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
