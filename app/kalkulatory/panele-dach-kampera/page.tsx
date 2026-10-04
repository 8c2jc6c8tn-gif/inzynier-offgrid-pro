"use client"

import { useMemo } from "react"
import { calculatePaneleDachKampera } from "@/lib/core/modules/kalkulator-mobilny/panele-dach-kampera/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; dlugoscM: string }

type PolaLiczbowe = "szerokoscDachuM" | "marginesM" | "odstepM" | "panelDlugoscM" | "panelSzerokoscM" | "panelMocW"

type FormularzStan = Record<PolaLiczbowe, string> & { odcinki: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = {
  szerokoscDachuM: "",
  marginesM: "",
  odstepM: "",
  panelDlugoscM: "",
  panelSzerokoscM: "",
  panelMocW: "",
  odcinki: [],
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))

export default function PaneleDachKamperaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("panele-dach-kampera", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, odcinki: prev.odcinki.map((o) => (o.id === id ? { ...o, ...zmiana } : o)) }))

  const result = useMemo(
    () =>
      calculatePaneleDachKampera({
        szerokoscDachuM: liczba(stan.szerokoscDachuM),
        marginesM: liczba(stan.marginesM),
        odstepM: liczba(stan.odstepM),
        panelDlugoscM: liczba(stan.panelDlugoscM),
        panelSzerokoscM: liczba(stan.panelSzerokoscM),
        panelMocW: liczba(stan.panelMocW),
        odcinki: stan.odcinki.map((o) => ({ nazwa: o.nazwa, dlugoscM: liczba(o.dlugoscM) })),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/panele-dach-kampera" />
      <NaglowekEkranu tytul={t("UI-M12-DK-TYTUL")} ekran="panele-dach-kampera" wynik={result}>
        {t("UI-M12-DK-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-DK-DACH")}</legend>
        <Pole label={t("UI-M12-DK-SZEROKOSC-DACHU")} unit="m" {...pole("szerokoscDachuM")} pomoc={<PomocPola ekran="panele-dach-kampera" pole="szerokosc" />} />
        <Pole label={t("UI-M12-DK-MARGINES")} unit="m" {...pole("marginesM")} pomoc={<PomocPola ekran="panele-dach-kampera" pole="margines" />} />
        <Pole label={t("UI-M12-DK-ODSTEP")} unit="m" {...pole("odstepM")} pomoc={<PomocPola ekran="panele-dach-kampera" pole="odstep" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-DK-ODCINKI")}</legend>
        <ul className="flex flex-col gap-4">
          {stan.odcinki.map((o, i) => (
            <li key={o.id} className="flex flex-col gap-3 rounded-md border p-3">
              <Pole
                label={t("UI-M12-DK-ODCINEK", { n: i + 1 })}
                placeholder={t("UI-M12-DK-ODCINEK-PRZYKLAD")}
                value={o.nazwa}
                onChange={(e) => aktualizuj(o.id, { nazwa: e.target.value })}
                pomoc={<PomocPola ekran="panele-dach-kampera" pole="odcinekNazwa" />}
              />
              <Pole label={t("UI-M12-DK-DLUGOSC")} unit="m" type="number" inputMode="decimal" min={0} value={o.dlugoscM} onChange={(e) => aktualizuj(o.id, { dlugoscM: e.target.value })} pomoc={<PomocPola ekran="panele-dach-kampera" pole="odcinekDl" />} />
              <button
                type="button"
                onClick={() => setStan((prev) => ({ ...prev, odcinki: prev.odcinki.filter((x) => x.id !== o.id) }))}
                className="self-start text-caption text-muted-foreground underline"
                aria-label={t("UI-M12-DK-USUN-ETYKIETA", { n: i + 1 })}
              >
                {t("UI-M12-MA-USUN")}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setStan((prev) => ({ ...prev, odcinki: [...prev.odcinki, { id: crypto.randomUUID(), nazwa: "", dlugoscM: "" }] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-M12-DK-DODAJ")}
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-DK-PANEL")}</legend>
        <Pole label={t("UI-M12-DK-PANEL-DL")} unit="m" {...pole("panelDlugoscM")} pomoc={<PomocPola ekran="panele-dach-kampera" pole="panelDl" />} />
        <Pole label={t("UI-M12-DK-PANEL-SZ")} unit="m" {...pole("panelSzerokoscM")} pomoc={<PomocPola ekran="panele-dach-kampera" pole="panelSz" />} />
        <Pole label={t("UI-M12-DK-PANEL-MOC")} unit="W" {...pole("panelMocW")} pomoc={<PomocPola ekran="panele-dach-kampera" pole="panelMoc" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-DK-W-UWAGA" : "UI-M12-DK-W-OK")}>
          <WynikGlowny>{t("UI-M12-DK-WYNIK", { n: v.liczbaPaneli, w: v.mocW })}</WynikGlowny>
          {v.odcinki.map((o, i) => (
            <p key={i} className="mt-1 text-small">
              {t(o.panelWzdluz ? "UI-M12-DK-WIERSZ-WZDLUZ" : "UI-M12-DK-WIERSZ-POPRZEK", { n: i + 1, wzdluz: o.wzdluz, poprzek: o.wPoprzek, paneli: o.paneli })}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
