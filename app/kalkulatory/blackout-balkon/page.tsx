"use client"

import { useMemo } from "react"
import { calculateBlackoutBalkon } from "@/lib/core/modules/kalkulator-mobilny/blackout-balkon/calculator"
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

type PolaLiczbowe =
  | "czasBlackoutuH"
  | "pojemnoscWh"
  | "uzytecznaPct"
  | "sprawnoscFalownikaPct"
  | "dlugoscBalustradyM"
  | "szerokoscPaneluM"
  | "mocPaneluW"
  | "godzinSlonca"
  | "sprawnoscToruPct"

type FormularzStan = Record<PolaLiczbowe, string> & { odbiorniki: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = {
  odbiorniki: [],
  czasBlackoutuH: "",
  pojemnoscWh: "",
  uzytecznaPct: "",
  sprawnoscFalownikaPct: "",
  dlugoscBalustradyM: "",
  szerokoscPaneluM: "",
  mocPaneluW: "",
  godzinSlonca: "",
  sprawnoscToruPct: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function BlackoutBalkonPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("blackout-balkon", STAN_POCZATKOWY)
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
      calculateBlackoutBalkon({
        odbiorniki: stan.odbiorniki.map((o) => ({ nazwa: o.nazwa, mocW: liczba(o.mocW), godzinNaDobe: liczba(o.godzinNaDobe) })),
        czasBlackoutuH: liczba(stan.czasBlackoutuH),
        pojemnoscWh: liczba(stan.pojemnoscWh),
        uzytecznaPct: liczba(stan.uzytecznaPct),
        sprawnoscFalownikaPct: liczba(stan.sprawnoscFalownikaPct),
        dlugoscBalustradyM: liczba(stan.dlugoscBalustradyM),
        szerokoscPaneluM: liczba(stan.szerokoscPaneluM),
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
      <NawigacjaEkranu href="/kalkulatory/blackout-balkon" />
      <NaglowekEkranu tytul={t("UI-M12-BB-TYTUL")} ekran="blackout-balkon" wynik={result}>
        {t("UI-M12-BB-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-BM-ODBIORNIKI")}</legend>
        <ul className="flex flex-col gap-4">
          {stan.odbiorniki.map((o, i) => (
            <li key={o.id} className="flex flex-col gap-3 rounded-md border p-3">
              <Pole label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })} value={o.nazwa} onChange={(e) => aktualizuj(o.id, { nazwa: e.target.value })} pomoc={<PomocPola ekran="blackout-balkon" pole="nazwa" />} />
              <div className="grid grid-cols-2 gap-3">
                <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={o.mocW} onChange={(e) => aktualizuj(o.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="blackout-balkon" pole="moc" />} />
                <Pole label={t("UI-M12-WK-GODZINY")} unit={t("UI-M12-J-H-DOBE")} type="number" inputMode="decimal" min={0} max={24} value={o.godzinNaDobe} onChange={(e) => aktualizuj(o.id, { godzinNaDobe: e.target.value })} pomoc={<PomocPola ekran="blackout-balkon" pole="godziny" />} />
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
          onClick={() => setStan((prev) => ({ ...prev, odbiorniki: [...prev.odbiorniki, { id: crypto.randomUUID(), nazwa: "", mocW: "", godzinNaDobe: "" }] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-M12-MA-DODAJ")}
        </button>
      </fieldset>

      <Pole label={t("UI-M12-BM-CZAS")} unit="h" {...pole("czasBlackoutuH")} pomoc={<PomocPola ekran="blackout-balkon" pole="czas" />} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-BB-MAGAZYN")}</legend>
        <Pole label={t("UI-M12-BB-POJEMNOSC")} unit="Wh" {...pole("pojemnoscWh")} pomoc={<PomocPola ekran="blackout-balkon" pole="pojemnosc" />} />
        <Pole label={t("UI-M12-MA-DOD")} unit="%" max={100} {...pole("uzytecznaPct")} pomoc={<PomocPola ekran="blackout-balkon" pole="uzyteczna" />} />
        <Pole label={t("UI-M12-BM-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscFalownikaPct")} pomoc={<PomocPola ekran="blackout-balkon" pole="sprawnoscFalownika" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-BB-BALKON")}</legend>
        <Pole label={t("UI-M12-BB-BALUSTRADA")} unit="m" {...pole("dlugoscBalustradyM")} pomoc={<PomocPola ekran="blackout-balkon" pole="balustrada" />} />
        <Pole label={t("UI-M12-BB-SZEROKOSC-PANELU")} unit="m" {...pole("szerokoscPaneluM")} pomoc={<PomocPola ekran="blackout-balkon" pole="szerokoscPanelu" />} />
        <Pole label={t("UI-M12-WK-MOC-PANELU")} unit="W" {...pole("mocPaneluW")} pomoc={<PomocPola ekran="blackout-balkon" pole="mocPanelu" />} />
        <Pole label={t("UI-M12-WK-GODZIN-SLONCA")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinSlonca")} pomoc={<PomocPola ekran="blackout-balkon" pole="godzinSlonca" />} />
        <Pole label={t("UI-M12-WK-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscToruPct")} pomoc={<PomocPola ekran="blackout-balkon" pole="sprawnosc" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-BB-W-UWAGA" : "UI-M12-BB-W-OK")}>
          <WynikGlowny>{t("UI-M12-BB-WYNIK", { h: r1(v.magazynStarczyH) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M12-BB-SZCZEGOLY", { doba: Math.round(v.zuzycieDobaWh), wh: Math.round(v.energiaBlackoutWh), mag: Math.round(v.energiaMagazynuWh) })}</p>
          {v.liczbaPaneli > 0 && <p className="mt-1 text-small">{t("UI-M12-BB-PANELE", { n: v.liczbaPaneli, w: v.mocPaneliW, wh: Math.round(v.energiaPaneliDobaWh) })}</p>}
          <p className="mt-1 text-small">{t("UI-M12-BB-BILANS", { wh: Math.round(v.bilansWh) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
