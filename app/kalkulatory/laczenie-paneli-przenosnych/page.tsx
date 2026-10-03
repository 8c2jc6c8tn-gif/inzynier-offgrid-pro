"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateLaczeniePaneliPrzenosnych } from "@/lib/core/modules/kalkulator-mobilny/laczenie-paneli-przenosnych/calculator"
import type {
  TypPaneluPrzenosnego,
  ZlaczePaneli,
} from "@/lib/core/modules/kalkulator-mobilny/laczenie-paneli-przenosnych/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type TakNie = "" | "tak" | "nie"

type FormularzStan = {
  typ: TypPaneluPrzenosnego | ""
  liczbaPaneli: string
  takieSame: TakNie
  zlaczePaneli: ZlaczePaneli | ""
  zlaczeWejscia: ZlaczePaneli | ""
  maAdapter: TakNie
}

const STAN_POCZATKOWY: FormularzStan = {
  typ: "",
  liczbaPaneli: "",
  takieSame: "",
  zlaczePaneli: "",
  zlaczeWejscia: "",
  maAdapter: "",
}

const TYPY: { id: TypPaneluPrzenosnego; label: string }[] = [
  { id: "skladany", label: "UI-M12-LPP-TYP-SKLADANY" },
  { id: "mata", label: "UI-M12-LPP-TYP-MATA" },
  { id: "powerbank-solarny", label: "UI-M12-LPP-TYP-POWERBANK" },
]

const ZLACZA: { id: ZlaczePaneli; label: string }[] = [
  { id: "mc4", label: "UI-M12-LPP-Z-MC4" },
  { id: "xt60", label: "UI-M12-LPP-Z-XT60" },
  { id: "anderson", label: "UI-M12-LPP-Z-ANDERSON" },
  { id: "dc5521", label: "UI-M12-LPP-Z-DC5521" },
  { id: "usb", label: "UI-M12-LPP-Z-USB" },
  { id: "inne", label: "UI-M12-LPP-Z-INNE" },
]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const takNie = (s: TakNie) => (s === "" ? null : s === "tak")

export default function LaczeniePaneliPrzenosnychPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("laczenie-paneli-przenosnych", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateLaczeniePaneliPrzenosnych({
        typ: stan.typ === "" ? null : stan.typ,
        liczbaPaneli: liczba(stan.liczbaPaneli),
        takieSame: takNie(stan.takieSame),
        zlaczePaneli: stan.zlaczePaneli === "" ? null : stan.zlaczePaneli,
        zlaczeWejscia: stan.zlaczeWejscia === "" ? null : stan.zlaczeWejscia,
        maAdapter: stan.maAdapter === "tak",
      }),
    [stan],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const wiele = liczba(stan.liczbaPaneli) > 1
  const rozneZlacza = stan.zlaczePaneli !== "" && stan.zlaczeWejscia !== "" && stan.zlaczePaneli !== stan.zlaczeWejscia

  const opcjeTakNie = (
    <>
      <option value="">{t("UI-WYBIERZ")}</option>
      <option value="tak">{t("UI-TAK")}</option>
      <option value="nie">{t("UI-NIE")}</option>
    </>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/laczenie-paneli-przenosnych" />
      <NaglowekEkranu tytul={t("UI-M12-LPP-TYTUL")} ekran="laczenie-paneli-przenosnych" wynik={result}>
        {t("UI-M12-LPP-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect label={t("UI-M12-LPP-TYP")} value={stan.typ} onChange={ustaw("typ")} pomoc={<PomocPola ekran="laczenie-paneli-przenosnych" pole="typ" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {TYPY.map((o) => (
            <option key={o.id} value={o.id}>
              {t(o.label)}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label={t("UI-M12-LPP-LICZBA")}
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={stan.liczbaPaneli}
          onChange={ustaw("liczbaPaneli")}
          pomoc={<PomocPola ekran="laczenie-paneli-przenosnych" pole="liczba" />}
        />
        {wiele && (
          <PoleSelect label={t("UI-M12-LPP-TAKIE-SAME")} value={stan.takieSame} onChange={ustaw("takieSame")} pomoc={<PomocPola ekran="laczenie-paneli-przenosnych" pole="takieSame" />}>
            {opcjeTakNie}
          </PoleSelect>
        )}
        <PoleSelect label={t("UI-M12-LPP-ZLACZE-PANELI")} value={stan.zlaczePaneli} onChange={ustaw("zlaczePaneli")} pomoc={<PomocPola ekran="laczenie-paneli-przenosnych" pole="zlaczePaneli" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {ZLACZA.map((o) => (
            <option key={o.id} value={o.id}>
              {t(o.label)}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect label={t("UI-M12-LPP-ZLACZE-WEJSCIA")} value={stan.zlaczeWejscia} onChange={ustaw("zlaczeWejscia")} pomoc={<PomocPola ekran="laczenie-paneli-przenosnych" pole="zlaczeWejscia" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {ZLACZA.map((o) => (
            <option key={o.id} value={o.id}>
              {t(o.label)}
            </option>
          ))}
        </PoleSelect>
        {rozneZlacza && (
          <PoleSelect label={t("UI-M12-LPP-ADAPTER")} value={stan.maAdapter} onChange={ustaw("maAdapter")} pomoc={<PomocPola ekran="laczenie-paneli-przenosnych" pole="adapter" />}>
            {opcjeTakNie}
          </PoleSelect>
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={t(hasCritical ? "UI-M12-LPP-W-STOP" : hasWarning ? "UI-M12-LPP-W-UWAGA" : "UI-M12-LPP-W-OK")}
        >
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          <p className="mt-2 text-small">
            <Link className="underline" href="/kalkulatory/panel-do-stacji-zasilania">
              {t("UI-M12-LPP-LINK-E39")}
            </Link>
          </p>
        </WerdyktPanel>
      )}
    </main>
  )
}
