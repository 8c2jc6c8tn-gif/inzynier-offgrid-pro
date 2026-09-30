"use client"

import { useMemo } from "react"
import { calculateBlackoutMinimum } from "@/lib/core/modules/kalkulator-mobilny/blackout-minimum/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; mocW: string; godzinNaDobe: string }

type PolaLiczbowe = "czasBlackoutuH" | "napiecieV" | "uzytecznaPct" | "sprawnoscPrzetwornicyPct" | "posiadanyAh"

type FormularzStan = Record<PolaLiczbowe, string> & { odbiorniki: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = {
  czasBlackoutuH: "",
  napiecieV: "",
  uzytecznaPct: "",
  sprawnoscPrzetwornicyPct: "",
  posiadanyAh: "",
  odbiorniki: [],
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function BlackoutMinimumPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("blackout-minimum", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, odbiorniki: prev.odbiorniki.map((o) => (o.id === id ? { ...o, ...zmiana } : o)) }))

  const result = useMemo(
    () =>
      calculateBlackoutMinimum({
        czasBlackoutuH: liczba(stan.czasBlackoutuH),
        napiecieV: liczba(stan.napiecieV),
        uzytecznaPct: liczba(stan.uzytecznaPct),
        sprawnoscPrzetwornicyPct: liczba(stan.sprawnoscPrzetwornicyPct),
        posiadanyAh: liczba(stan.posiadanyAh),
        odbiorniki: stan.odbiorniki.map((o) => ({ nazwa: o.nazwa, mocW: liczba(o.mocW), godzinNaDobe: liczba(o.godzinNaDobe) })),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value
  const [e12, e24, e48] = v.energiaReferencyjnaWh.map(Math.round)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/blackout-minimum" />
      <NaglowekEkranu tytul={t("UI-M12-BM-TYTUL")} ekran="blackout-minimum" wynik={result}>
        {t("UI-M12-BM-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-BM-ODBIORNIKI")}</legend>
        <ul className="flex flex-col gap-4">
          {stan.odbiorniki.map((o, i) => (
            <li key={o.id} className="flex flex-col gap-3 rounded-md border p-3">
              <Pole
                label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })}
                placeholder={t("UI-M12-BM-NAZWA-PRZYKLAD")}
                value={o.nazwa}
                onChange={(e) => aktualizuj(o.id, { nazwa: e.target.value })}
                pomoc={<PomocPola ekran="blackout-minimum" pole="nazwa" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={o.mocW} onChange={(e) => aktualizuj(o.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="blackout-minimum" pole="moc" />} />
                <Pole label={t("UI-M12-WK-GODZINY")} unit={t("UI-M12-J-H-DOBE")} type="number" inputMode="decimal" min={0} max={24} value={o.godzinNaDobe} onChange={(e) => aktualizuj(o.id, { godzinNaDobe: e.target.value })} pomoc={<PomocPola ekran="blackout-minimum" pole="godziny" />} />
              </div>
              <button
                type="button"
                onClick={() => setStan((prev) => ({ ...prev, odbiorniki: prev.odbiorniki.filter((x) => x.id !== o.id) }))}
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
          onClick={() =>
            setStan((prev) => ({
              ...prev,
              odbiorniki: [...prev.odbiorniki, { id: crypto.randomUUID(), nazwa: "", mocW: "", godzinNaDobe: "" }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-M12-MA-DODAJ")}
        </button>
      </fieldset>

      <Pole label={t("UI-M12-BM-CZAS")} unit="h" {...pole("czasBlackoutuH")} pomoc={<PomocPola ekran="blackout-minimum" pole="czas" />} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-BM-ZESTAW")}</legend>
        <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" {...pole("napiecieV")} pomoc={<PomocPola ekran="blackout-minimum" pole="napiecie" />} />
        <Pole label={t("UI-M12-MA-DOD")} unit="%" max={100} {...pole("uzytecznaPct")} pomoc={<PomocPola ekran="blackout-minimum" pole="uzyteczna" />} />
        <Pole label={t("UI-M12-BM-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscPrzetwornicyPct")} pomoc={<PomocPola ekran="blackout-minimum" pole="sprawnosc" />} />
        <Pole label={t("UI-M12-BM-POSIADANY")} unit="Ah" {...pole("posiadanyAh")} pomoc={<PomocPola ekran="blackout-minimum" pole="posiadany" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-BM-W-UWAGA" : "UI-M12-BM-W-OK")}>
          <WynikGlowny>{t("UI-M12-BM-WYNIK", { ah: Math.ceil(v.minimalnyAh), w: Math.ceil(v.minimalnaPrzetwornicaW) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M12-BM-SZCZEGOLY", { doba: Math.round(v.zuzycieDobaWh), wh: Math.round(v.energiaBlackoutWh) })}</p>
          <p className="mt-1 text-small">{t("UI-M12-BM-REFERENCYJNE", { a: e12, b: e24, c: e48 })}</p>
          {v.posiadanyStarczyH > 0 && <p className="mt-1 text-small">{t("UI-M12-BM-POSIADANY-WYNIK", { h: r1(v.posiadanyStarczyH) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
